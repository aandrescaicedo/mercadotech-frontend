```mermaid
erDiagram
    %% Diagrama ER completo de MercadoTech
    %% Todas las entidades, relaciones, atributos, Primary Keys y Foreign Keys
    
    USER ||--o{ STORE : "owns"
    USER ||--o{ ORDER : "places"
    STORE ||--o{ PRODUCT : "contains"
    CATEGORY ||--o{ PRODUCT : "categorizes"
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "includes"
    
    USER {
        ObjectId _id PK "Primary Key"
        String email UK "Unique"
        String password
        String role "ENUM: CLIENT, STORE, ADMIN"
        String googleId "Optional"
        Date createdAt
        Date updatedAt
    }
    
    STORE {
        ObjectId _id PK "Primary Key"
        String name
        String description
        ObjectId owner FK "→ User._id"
        String status "ENUM: PENDING, APPROVED"
        Date createdAt
        Date updatedAt
    }
    
    CATEGORY {
        ObjectId _id PK "Primary Key"
        String name UK "Unique"
        String description
        Date createdAt
    }
    
    PRODUCT {
        ObjectId _id PK "Primary Key"
        String name
        String description
        Number price
        Number stock
        ObjectId category FK "→ Category._id"
        ObjectId store FK "→ Store._id"
        Array images "Image URLs"
        Date createdAt
        Date updatedAt
    }
    
    ORDER {
        ObjectId _id PK "Primary Key"
        ObjectId user FK "→ User._id"
        Array items "Embedded OrderItems"
        Number total
        String status "ENUM: PENDING, CONFIRMED, DELIVERED, CANCELLED"
        Date createdAt
        Date updatedAt
    }
    
    ORDER_ITEM {
        ObjectId product FK "→ Product._id (Embedded)"
        Number quantity
        Number price "Price at purchase time"
    }
```

# MercadoTech - Entity Relationship Diagram

## Entidades

### User
**Primary Key:** `_id` (ObjectId)  
**Atributos:**
- `email` (String, Unique) - Correo electrónico del usuario
- `password` (String) - Contraseña hasheada
- `role` (Enum) - Rol: CLIENT, STORE, ADMIN
- `googleId` (String) - ID de Google si usa OAuth
- `createdAt`, `updatedAt` (Date)

### Store
**Primary Key:** `_id` (ObjectId)  
**Foreign Keys:** `owner` → User._id  
**Atributos:**
- `name` (String) - Nombre de la tienda
- `description` (String) - Descripción
- `status` (Enum) - Estado: PENDING, APPROVED
- `createdAt`, `updatedAt` (Date)

### Category
**Primary Key:** `_id` (ObjectId)  
**Atributos:**
- `name` (String, Unique) - Nombre de la categoría
- `description` (String)
- `createdAt` (Date)

### Product
**Primary Key:** `_id` (ObjectId)  
**Foreign Keys:** `category` → Category._id, `store` → Store._id  
**Atributos:**
- `name` (String) - Nombre del producto
- `description` (String)
- `price` (Number)
- `stock` (Number)
- `images` (Array<String>) - URLs de imágenes
- `createdAt`, `updatedAt` (Date)

### Order
**Primary Key:** `_id` (ObjectId)  
**Foreign Keys:** `user` → User._id  
**Atributos:**
- `items` (Array<OrderItem>) - Items del pedido (embedded)
- `total` (Number) - Total calculado
- `status` (Enum) - PENDING, CONFIRMED, DELIVERED, CANCELLED
- `createdAt`, `updatedAt` (Date)

### OrderItem (Embedded in Order)
**Foreign Keys:** `product` → Product._id  
**Atributos:**
- `quantity` (Number)
- `price` (Number) - Precio al momento de la compra

## Relaciones

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| User → Store | 1:N | Un usuario puede tener varias tiendas |
| User → Order | 1:N | Un usuario puede tener varios pedidos |
| Store → Product | 1:N | Una tienda puede tener varios productos |
| Category → Product | 1:N | Una categoría puede tener varios productos |
| Order → OrderItem | 1:N | Un pedido puede tener varios items (embedded) |
| Product → OrderItem | 1:N | Un producto puede estar en varios pedidos |
