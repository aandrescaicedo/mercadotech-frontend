# API Documentation

Base URL: `/api/v1`

## Authentication

### Register
*   **POST** `/auth/register`
*   **Body:** `{ email, password, role }`
*   **Response:** `{ token, user }`

### Login
*   **POST** `/auth/login`
*   **Body:** `{ email, password }`
*   **Response:** `{ token, user }`

## Stores

### Create Store
*   **POST** `/stores`
*   **Headers:** `Authorization: Bearer <token>`
*   **Body:** `{ name, description }`

### Get My Stores
*   **GET** `/stores/me`
*   **Headers:** `Authorization: Bearer <token>`

## Products

### List Products
*   **GET** `/products?search=...&category=...`

### Create Product
*   **POST** `/products`
*   **Headers:** `Authorization: Bearer <token>` (Store Owner only)
*   **Body:** `{ name, price, stock, description, images }`

## Orders

### Create Order
*   **POST** `/orders`
*   **Headers:** `Authorization: Bearer <token>`
*   **Body:** `{ items: [{ productId, quantity }] }`
