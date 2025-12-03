```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant Auth as Auth Middleware
    participant PC as ProductController
    participant PS as ProductService
    participant PR as ProductRepository
    participant OC as OrderController
    participant OS as OrderService
    participant OR as OrderRepository
    participant DB as MongoDB

    %% Create Product Flow
    rect rgb(255, 220, 220)
    Note over C,DB: Create Product Flow
    C->>+API: POST /api/v1/products<br/>{name, price, stock, category, store}<br/>Header: Authorization: Bearer token
    API->>+Auth: verifyToken(req)
    Auth->>Auth: jwt.verify(token)
    Auth->>Auth: Check role === "STORE"
    alt Invalid token or role
        Auth-->>API: 401/403 Unauthorized
        API-->>C: 403 Forbidden
    else Valid STORE user
        Auth-->>-PC: req.user = {id, role}
        PC->>+PS: createProduct(productData, userId)
        PS->>PS: Validate required fields
        PS->>PS: Validate price > 0, stock >= 0
        PS->>+PR: create({...productData, store: userId})
        PR->>+DB: db.products.insertOne({...})
        DB-->>-PR: {_id, name, price, ...}
        PR-->>-PS: newProduct
        PS-->>-PC: newProduct
        PC-->>API: 201 Created {product}
        API-->>-C: 201 Created {product}
    end
    end

    %% Create Order Flow
    rect rgb(220, 255, 220)
    Note over C,DB: Create Order Flow (with Stock Update)
    C->>+API: POST /api/v1/orders<br/>{items: [{product, quantity}]}<br/>Header: Authorization: Bearer token
    API->>+Auth: verifyToken(req)
    Auth->>Auth: Check user is authenticated
    Auth-->>-OC: req.user = {id}
    OC->>+OS: createOrder(orderData, userId)
    
    loop For each item
        OS->>+PR: findById(item.product)
        PR->>+DB: db.products.findOne({_id})
        DB-->>-PR: product
        PR-->>-OS: product
        OS->>OS: Check stock >= quantity
        alt Insufficient stock
            OS-->>OC: throw Error("Insufficient stock")
            OC-->>API: 400 Bad Request
            API-->>C: 400 Bad Request
        end
    end
    
    OS->>OS: Calculate total = Σ(item.price * item.quantity)
    OS->>+OR: create({user: userId, items, total, status: "PENDING"})
    OR->>+DB: db.orders.insertOne({...})
    DB-->>-OR: {_id, user, items, total, status}
    OR-->>-OS: newOrder
    
    loop For each item (Update stock)
        OS->>+PR: update(item.product, {stock: stock - quantity})        
        PR->>+DB: db.products.updateOne({_id}, {$inc: {stock: -quantity}})
        DB-->>-PR: {modifiedCount: 1}
        PR-->>-OS: updated
    end
    
    OS-->>-OC: newOrder
    OC-->>API: 201 Created {order}
    API-->>-C: 201 Created {order}
    C->>C: Redirect to /my-orders
    end
```

# Diagrama de Secuencia: CREATE Operaciones

## Descripción
Este diagrama muestra los flujos de creación de:
1. **Producto:** Creación por vendedor autenticado
2. **Pedido:** Creación por cliente con validación de stock y descuento automático

## Create Product

### Flujo
1. Client envía POST con datos del producto y token JWT
2. Auth Middleware verifica:
   - Token válido
   - Usuario tiene rol STORE
3. ProductController delega a ProductService
4. ProductService valida datos (precio > 0, stock >= 0)
5. ProductRepository persiste en MongoDB
6. Se retorna producto creado con status 201

### Validaciones
- Token JWT válido
- Rol de usuario = STORE
- Campos requeridos: name, price, stock, category
- Precio > 0
- Stock >= 0

## Create Order

### Flujo
1. Client envía POST con items del pedido
2. Auth Middleware verifica usuario autenticado
3. OrderService valida cada item:
   - Busca producto en DB
   - Verifica stock suficiente
4. Si hay stock:
   - Calcula total del pedido
   - Crea orden en estado PENDING
   - **Descuenta stock** de cada producto
5. Retorna orden creada

### Validaciones
- Usuario autenticado
- Productos existen en DB
- Stock suficiente para cada item
- Cantidades > 0

### Transacciones
- La creación de orden y actualización de stock deben ser atómicas
- Si falla actualización de stock, se revierte creación de orden
