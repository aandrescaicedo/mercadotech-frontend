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

    %% Update Product Flow
    rect rgb(255, 240, 220)
    Note over C,DB: Update Product Flow
    C->>+API: PUT /api/v1/products/:id<br/>{price: 120, stock: 30}<br/>Header: Authorization: Bearer token
    API->>+Auth: verifyToken(req)
    Auth-->>-PC: req.user = {id, role}
    PC->>+PS: updateProduct(productId, updateData, userId)
    PS->>+PR: findById(productId)
    PR->>+DB: db.products.findOne({_id})
    DB-->>PR: product
    PR-->>-PS: product
    
    alt Product not found
        PS-->>PC: throw Error("Product not found")
        PC-->>API: 404 Not Found
        API-->>C: 404 Not Found
    else Product found
        PS->>PS: Check product.store === userId
        alt Not owner
            PS-->>PC: throw Error("Forbidden")
            PC-->>API: 403 Forbidden
            API-->>C: 403 Forbidden
        else Is owner
            PS->>+PR: update(productId, updateData)
            PR->>+DB: db.products.updateOne({_id}, {$set: {...}})
            DB-->>-PR: {modifiedCount: 1}
            PR->>DB: db.products.findOne({_id})
            DB-->>PR: updatedProduct
            PR-->>-PS: updatedProduct
            PS-->>-PC: updatedProduct
            PC-->>API: 200 OK {product}
            API-->>-C: 200 OK {product}
        end
    end
    end

    %% Update Order Status Flow
    rect rgb(220, 240, 255)
    Note over C,DB: Update Order Status Flow (Admin Only)
    C->>+API: PATCH /api/v1/orders/:id/status<br/>{status: "CONFIRMED"}<br/>Header: Authorization: Bearer token
    API->>+Auth: verifyToken(req)
    Auth->>Auth: Check role === "ADMIN"
    alt Not Admin
        Auth-->>API: 403 Forbidden
        API-->>C: 403 Forbidden
    else Is Admin
        Auth-->>-OC: req.user = {id, role}
        OC->>+OS: updateOrderStatus(orderId, newStatus)
        OS->>+OR: findById(orderId)
        OR->>+DB: db.orders.findOne({_id})
        DB-->>-OR: order
        OR-->>-OS: order
        alt Order not found
            OS-->>OC: throw Error("Order not found")
            OC-->>API: 404 Not Found
            API-->>C: 404 Not Found
        else Order found
            OS->>OS: Validate status transition
            OS->>+OR: update(orderId, {status: newStatus})
            OR->>+DB: db.orders.updateOne({_id}, {$set: {status}})
            DB-->>-OR: {modifiedCount: 1}
            OR-->>-OS: updatedOrder
            OS-->>-OC: updatedOrder
            OC-->>API: 200 OK {order}
            API-->>-C: 200 OK {order}
        end
    end
    end

    %% Delete Product Flow
    rect rgb(255, 220, 220)
    Note over C,DB: Delete Product Flow
    C->>+API: DELETE /api/v1/products/:id<br/>Header: Authorization: Bearer token
    API->>+Auth: verifyToken(req)
    Auth-->>-PC: req.user = {id}
    PC->>+PS: deleteProduct(productId, userId)
    PS->>+PR: findById(productId)
    PR->>+DB: db.products.findOne({_id})
    DB-->>-PR: product
    PR-->>-PS: product
    
    alt Product not found
        PS-->>PC: throw Error("Product not found")
        PC-->>API: 404 Not Found
        API-->>C: 404 Not Found
    else Product found
        PS->>PS: Check product.store === userId
        alt Not owner
            PS-->>PC: throw Error("Forbidden")
            PC-->>API: 403 Forbidden
            API-->>C: 403 Forbidden
        else Is owner
            PS->>+PR: delete(productId)
            PR->>+DB: db.products.deleteOne({_id})
            DB-->>-PR: {deletedCount: 1}
            PR-->>-PS: {deleted: true}
            PS-->>-PC: {message: "Product deleted"}
            PC-->>API: 200 OK {message}
            API-->>-C: 200 OK {message}
            Note over C,DB: Cascade: OrderItems con este<br/>producto quedan con referencia inválida
        end
    end
    end
```

# Diagrama de Secuencia: UPDATE y DELETE Operaciones

## Descripción
Este diagrama muestra los flujos de:
1. **Update Product:** Actualización por propietario de la tienda
2. **Update Order Status:** Actualización por administrador
3. **Delete Product:** Eliminación con verificación de permisos

## Update Product

### Flujo
1. Client envía PUT con datos a actualizar
2. Auth Middleware verifica usuario autenticado
3. ProductService busca producto en DB
4. Verifica que user.id === product.store (es el dueño)
5. Si es dueño: actualiza y retorna producto actualizado
6. Si no es dueño: 403 Forbidden

### Validaciones
- Producto existe
- Usuario es propietario de la tienda
- Datos de actualización válidos

## Update Order Status

### Flujo
1. Client (Admin) envía PATCH con nuevo status
2. Auth Middleware verifica rol ADMIN
3. OrderService busca orden en DB
4. Valida transición de estado válida:
   - PENDING → CONFIRMED → DELIVERED
   - Cualquier estado → CANCELLED
5. Actualiza status en DB

### Validaciones
- Usuario es ADMIN
- Orden existe
- Transición de estado válida

### Estados Permitidos
- PENDING
- CONFIRMED
- DELIVERED
- CANCELLED

## Delete Product

### Flujo
1. Client envía DELETE
2. Auth Middleware verifica usuario autenticado
3. ProductService verifica:
   - Producto existe
   - Usuario es dueño
4. Si cumple condiciones: elimina producto

### Consideraciones
- **Cascada:** OrderItems que referencian este producto mantienen referencia
- En producción se debería:
  - Soft delete (marcar como inactivo)
  - O impedir eliminación si hay pedidos asociados
  - O usar referencias pobladas con productos archivados

### Validaciones
- Producto existe
- Usuario es propietario
- (Opcional) No hay pedidos activos con este producto
