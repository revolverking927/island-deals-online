# island-deals-online

Absolutely! I can help you create **full GitHub documentation** for your project, including:

* **Project Overview**
* **Features**
* **Installation**
* **Running Locally**
* **Folder Structure**
* **Frontend / Backend Overview**
* **Database Schema** (PostgreSQL)
* **API Endpoints**
* **Mock Data for Vercel Deployment**
* **Contribution Guidelines**
* **License Section**

Here’s a **full README.md draft** for your Island Deals Online project:

---

# Island Deals Online

**Find and list local discounts from verified manufacturers in Jamaica.**

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technologies](#technologies)
* [Installation](#installation)
* [Running Locally](#running-locally)
* [Frontend Overview](#frontend-overview)
* [Backend Overview](#backend-overview)
* [Database Schema](#database-schema)
* [API Endpoints](#api-endpoints)
* [Mock Data](#mock-data)
* [Contribution](#contribution)
* [License](#license)

---

## Overview

Island Deals Online is a platform that connects **manufacturers** and **consumers**.
Manufacturers can post products with discounts. Consumers can search and view discounts by product. The system also supports **interactive parish maps** in Jamaica.

---

## Features

* Manufacturer dashboard for posting and managing discounts
* Consumer dashboard for browsing discounts
* Search functionality for products
* Interactive map highlighting parishes
* Registration and login for consumers and manufacturers
* Fully responsive design

---

## Technologies

* **Frontend:** HTML, CSS, JavaScript, Leaflet.js
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Templating:** Handlebars.js

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/revolverking927/island-deals-online.git
```

2. Install dependencies:

```bash
cd island-deals-online
npm install
```

3. Setup PostgreSQL database locally or use mock data for Vercel deployment.

---

## Running Locally

1. Start the PostgreSQL database:

```bash
psql -U postgres -d islanddeals
```

2. Run the server:

```bash
npm start
```

3. Open in browser: `http://localhost:3000`

---

## Frontend Overview

* **Consumer dashboard**: `consumer_dashboard.html` + `js/consumer_dashboard.js`

  * Search bar to find discounts
  * List of discounts rendered dynamically

* **Manufacturer dashboard**: `manufacturer_dashboard.html` + `js/manufacturer_dashboard.js`

  * Add, delete, and view discounts
  * Interactive map of Jamaica

* **Login/Register page**: `login_register.html` + `js/login_register.js`

  * Tab switching between login and registration
  * Conditional fields for consumer/manufacturer

---

## Backend Overview

* Node.js + Express.js
* API endpoints for:

  * `/api/discounts` → Get all discounts (with optional search)
  * `/api/manufacturer/discounts` → Get manufacturer-specific discounts
  * `/api/add-discount` → Add new discount
  * `/api/discount/:id` → Delete a discount
  * `/login` → User login
  * `/register` → User registration

---

## Database Schema

**Consumers Table**

```sql
CREATE TABLE consumers (
  consumer_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  parish VARCHAR(255),
  name VARCHAR(255)
);
```

**Manufacturers Table**

```sql
CREATE TABLE manufacturers (
  manufacturer_id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

**Discounts Table**

```sql
CREATE TABLE discounts (
  discount_id SERIAL PRIMARY KEY,
  parish VARCHAR(255),
  title VARCHAR(255),
  reason TEXT,
  valid_until DATE,
  original_price NUMERIC,
  discounted_price NUMERIC,
  product VARCHAR(255),
  manufacturer_id INT REFERENCES manufacturers(manufacturer_id)
);
```

---

## API Endpoints

| Endpoint                      | Method | Description                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/discounts`              | GET    | List all discounts (search optional) |
| `/api/manufacturer/discounts` | GET    | List discounts for manufacturer      |
| `/api/add-discount`           | POST   | Add new discount                     |
| `/api/discount/:id`           | DELETE | Delete discount by ID                |
| `/login`                      | POST   | Login user                           |
| `/register`                   | POST   | Register user                        |

---

## Mock Data for Vercel Deployment

Since PostgreSQL doesn’t run on Vercel, you can use **JSON placeholders**:

```javascript
// Mock database
let users = [
    { id: 1, email: "john@company.com", password: "123456", role: "manufacturer", company_name: "John's Co." },
    { id: 2, email: "sarah@consumer.com", password: "abcdef", role: "consumer", name: "Sarah L.", parish: "Kingston" }
];

const mockDiscounts = [
  {
    discount_id: 1,
    parish: "Kingston",
    title: "Fresh Mango Sale",
    reason: "Seasonal Discount",
    valid_until: "2025-12-31",
    original_price: 500,
    discounted_price: 350,
    product: "Mango",
    manufacturer_id: 1
  },
  {
    discount_id: 2,
    parish: "St. Andrew",
    title: "Yam Discount",
    reason: "Monthly Promotion",
    valid_until: "2025-11-15",
    original_price: 200,
    discounted_price: 150,
    product: "Yam",
    manufacturer_id: 2
  }
];
```

You can **replace all fetch calls** to the backend with this mock data while on Vercel.

---

## Contribution

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## License

MIT License © 2025 Island Deals Online

---

I can also **write a `VERCEL.md` guide** showing **exact steps to deploy this project with mock data and no database** so the whole site works live.

Do you want me to do that next?

