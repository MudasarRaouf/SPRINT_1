# Sprint 1: System Architecture & Scope

## Course: E-Commerce

### Project Title
**FashionHub – Online Clothing Store**

---

# 1. Target Audience & Market Focus

## 1.1 Primary Persona

The primary users of FashionHub are **retail consumers, especially young adults and working individuals**, who want to purchase clothing products online conveniently.

The platform is designed for customers who prefer browsing clothing collections, comparing prices, selecting sizes and colors, adding products to a cart, and placing orders online.

### Target Users

- Young adults and students
- Working professionals
- Online shoppers
- Customers looking for affordable and trendy clothing
- Customers who prefer shopping from home

## 1.2 Core Pain Point

Traditional clothing shopping can be time-consuming because customers have to physically visit multiple stores to compare products, prices, sizes, and styles.

FashionHub addresses this problem by providing an **online platform where customers can browse clothing products, search and filter products, manage their shopping cart, and place orders from a single platform**.

## 1.3 Domain Scope

The project focuses on the **Fashion and Apparel E-Commerce** domain.

The platform will primarily sell:

- Men's clothing
- Women's clothing
- T-Shirts
- Shirts
- Jeans
- Trousers
- Dresses
- Jackets
- Hoodies
- Other fashion and apparel products

---

# 2. Minimum Viable Product (MVP) Feature Scope

| Category | Feature Name | Description | Priority |
|---|---|---|---|
| Authentication | User Registration & Authentication | Customers can create accounts and securely log in using email and password. Passwords will be hashed and JWT-based authentication will be used. | High (MVP) |
| Catalog | Product List & Search | Users can browse clothing products and search for products by name and category. | High (MVP) |
| Product | Product Details | Users can view product name, description, price, available sizes, colors, and stock quantity. | High (MVP) |
| Cart | Cart Management | Users can add products to their cart, change quantities, and remove products from the cart. | High (MVP) |
| Checkout | Order Processing | Users can confirm their cart and place an order using a mock payment gateway. | High (MVP) |
| Admin | Inventory Control | Administrators can add, update, and delete clothing products and manage inventory. | Medium |

---

# 3. Tech Stack Selection & Justification

## 3.1 Frontend Framework

### React.js

**Justification:**

React.js will be used to develop the frontend of FashionHub because it provides a component-based architecture that makes it easier to build reusable UI components such as product cards, navigation bars, shopping carts, and checkout forms.

React has a large ecosystem and strong community support, making it suitable for developing a modern e-commerce interface.

---

## 3.2 Backend Infrastructure

### Node.js with Express.js

**Justification:**

Node.js with Express.js will be used to implement the backend REST APIs for user authentication, products, carts, orders, and administrative operations.

Node.js provides good performance for web applications, while Express.js provides a lightweight and flexible framework for building APIs.

---

## 3.3 Database Management System

### PostgreSQL

**Justification:**

PostgreSQL will be used as the primary database because the application contains strongly related entities such as users, products, categories, orders, and order items.

A relational database is suitable for this project because PostgreSQL provides strong data integrity, foreign-key constraints, and transaction support.

---

## 3.4 Caching & Asynchronous Processing

### Redis

**Justification:**

Redis will be used as an optional caching layer for frequently accessed data and session-related operations.

Redis can improve application performance by reducing repeated database queries and storing temporary data.

---

# 4. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram

    USERS ||--o{ ORDERS : places
    USERS ||--o| CARTS : owns
    CATEGORIES ||--o{ PRODUCTS : contains
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    CARTS ||--|{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : added_to

    USERS {
        INTEGER id PK
        VARCHAR email
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR phone
        TIMESTAMP created_at
    }

    CATEGORIES {
        INTEGER id PK
        VARCHAR name
        VARCHAR description
        TIMESTAMP created_at
    }

    PRODUCTS {
        INTEGER id PK
        INTEGER category_id FK
        VARCHAR name
        TEXT description
        DECIMAL price
        INTEGER stock_quantity
        VARCHAR size
        VARCHAR color
        VARCHAR image_url
        TIMESTAMP created_at
    }

    ORDERS {
        INTEGER id PK
        INTEGER user_id FK
        DECIMAL total_amount
        VARCHAR status
        TIMESTAMP created_at
    }

    ORDER_ITEMS {
        INTEGER id PK
        INTEGER order_id FK
        INTEGER product_id FK
        INTEGER quantity
        DECIMAL unit_price
    }

    CARTS {
        INTEGER id PK
        INTEGER user_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CART_ITEMS {
        INTEGER id PK
        INTEGER cart_id FK
        INTEGER product_id FK
        INTEGER quantity
    }