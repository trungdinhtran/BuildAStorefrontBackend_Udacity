# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

### You can use `SampleTestAPIWithPostman.json` file include in repo to import to Postman App. I build a folder contains all API I develop in this file.

## API Endpoints
#### Products
- Get all product (GET `/products` )
- Show (GET `/product/:id`)
- Create [token required] (POST `/product/create`)
- Update [token required] (PUT `/product/:id`)
- Delete [token required] (DELETE `/product/:id`)

#### Users
- Get all user [token required] (GET `/users`)
- Show [token required] (GET `/user/:id`)
- Create (POST `/user`)
- Update [token required] (PUT `/user/:id`)
- Delete [token required] (DELETE `/user/:id`)

#### Order
- Index [token required] (GET `/orders`)
- Show [token required] (GET `/order/:id`)
- Create (POST `/order`)
- Update [token required] (PUT `/order/:id`)
- Delete [token required] (DELETE `/order/:id`)
- Current Order by user [token required] (GET `/order/current-orders/:user_id`)

## Data Shapes
#### Product
The table includes the following fields: 
- id
- name
- price
The SQL schema for this table is as follows: 
```sql
CREATE TABLE products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(150) NOT NULL,
  price INTEGER      NOT NULL
);
```

#### User
The table includes the following fields:
- id
- username
- firstname
- lastname
- password
The SQL schema for this table is as follows:
```sql
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(150) NOT NULL,
  firstname       VARCHAR(150) NOT NULL,
  lastname        VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL
);
```

#### Orders
The table includes the following fields:
- id
- user_id
- status of order (active or complete)
The SQL schema for this table is as follows:
```sql
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id),
  status  BOOLEAN NOT NULL
);
```

#### order_details
The table includes the following fields:
- id
- product_id
- quantity
  The SQL schema for this table is as follows:
```sql
CREATE TABLE order_details (
  id   INTEGER NOT NULL REFERENCES orders (id),
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity   INTEGER NOT NULL
);
```