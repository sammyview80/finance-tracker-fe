# Finance Tracker API Documentation

This document provides comprehensive documentation for the Finance Tracker API. This RESTful API allows you to manage financial data including transactions, budget items, savings goals, categories, and income sources.

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. All endpoints except `/auth/*` require authentication.

### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Register

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Using Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {}, // Response data for successful requests
  "error": {  // Only present if success is false
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Additional error context if available
  },
  "meta": {   // Optional metadata
    "count": 0,    // Total count for list endpoints
    "page": 1,     // Current page number
    "pageSize": 20 // Items per page
  }
}
```

## API Versioning

The API uses URL versioning. The current version is v1:

```
http://localhost:5000/api/v1/
```

### Version Timeline
- v1 (Current): Initial release
- v2 (Planned): Will include multi-currency support and advanced analytics

### Version Support Policy
- Each version is supported for 12 months after a new version is released
- Security updates are provided for all supported versions
- Deprecation notices are sent 3 months before end-of-support

## Resources

### Transactions

Transactions represent income or expense activities in your financial account.

#### Transaction Object

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "date": "2023-06-20T15:24:00.000Z",
  "amount": 50.25,
  "category": "Groceries",
  "description": "Weekly shopping",
  "type": "expense", // or "income"
  "createdAt": "2023-06-20T15:24:00.000Z",
  "updatedAt": "2023-06-20T15:24:00.000Z"
}
```

#### List Transactions

```
GET /transactions
```

Returns a list of all transactions, sorted by date (newest first).

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "date": "2023-06-20T15:24:00.000Z",
      "amount": 50.25,
      "category": "Groceries",
      "description": "Weekly shopping",
      "type": "expense"
    },
    {
      "id": "60d21b4667d0d8992e610c86",
      "date": "2023-06-19T10:30:00.000Z",
      "amount": 1000,
      "category": "Salary",
      "description": "Monthly salary",
      "type": "income"
    }
  ]
}
```

#### Get Transaction

```
GET /transactions/:id
```

Returns a single transaction by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "date": "2023-06-20T15:24:00.000Z",
    "amount": 50.25,
    "category": "Groceries",
    "description": "Weekly shopping",
    "type": "expense"
  }
}
```

#### Create Transaction

```
POST /transactions
```

Creates a new transaction.

**Request Body:**

```json
{
  "date": "2023-06-20T15:24:00.000Z", // optional, defaults to current date
  "amount": 50.25,
  "category": "Groceries",
  "description": "Weekly shopping",
  "type": "expense" // or "income"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b46667d0d8992e610c85",
    "date": "2023-06-20T15:24:00.000Z",
    "amount": 50.25,
    "category": "Groceries",
    "description": "Weekly shopping",
    "type": "expense"
  }
}
```

#### Update Transaction

```
PUT /transactions/:id
```

Updates an existing transaction.

**Request Body:**

```json
{
  "amount": 45.75,
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "date": "2023-06-20T15:24:00.000Z",
    "amount": 45.75,
    "category": "Groceries",
    "description": "Updated description",
    "type": "expense"
  }
}
```

#### Delete Transaction

```
DELETE /transactions/:id
```

Deletes a transaction.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Budget Items

Budget items represent planned income or expenses as part of your budget.

#### Budget Item Object

```json
{
  "id": "60d21c5067d0d8992e610c87",
  "source": "Freelance", // for income items
  "category": "Groceries", // for expense items
  "budgeted": 200,
  "actual": 180,
  "difference": 20, // positive means under budget for expenses or over budget for income
  "type": "expense", // or "income"
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-20T15:30:00.000Z"
}
```

#### List Budget Items

```
GET /budget
```

Returns all budget items.

**Query Parameters:**

- `type` - Filter by type (`income` or `expense`)

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21c5067d0d8992e610c87",
      "category": "Groceries",
      "budgeted": 200,
      "actual": 180,
      "difference": 20,
      "type": "expense"
    },
    {
      "id": "60d21c5067d0d8992e610c88",
      "source": "Salary",
      "budgeted": 3000,
      "actual": 3000,
      "difference": 0,
      "type": "income"
    }
  ]
}
```

#### Get Budget Item

```
GET /budget/:id
```

Returns a single budget item.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21c5067d0d8992e610c87",
    "category": "Groceries",
    "budgeted": 200,
    "actual": 180,
    "difference": 20,
    "type": "expense"
  }
}
```

#### Create Budget Item

```
POST /budget
```

Creates a new budget item. The `difference` will be calculated automatically.

**Request Body:**

```json
{
  "category": "Groceries", // required for expense items
  "source": "Freelance", // required for income items
  "budgeted": 200,
  "actual": 180,
  "type": "expense" // or "income"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21c5067d0d8992e610c87",
    "category": "Groceries",
    "budgeted": 200,
    "actual": 180,
    "difference": 20,
    "type": "expense"
  }
}
```

#### Update Budget Item

```
PUT /budget/:id
```

Updates a budget item. The `difference` will be recalculated if `budgeted` or `actual` amounts are updated.

**Request Body:**

```json
{
  "budgeted": 250,
  "actual": 180
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21c5067d0d8992e610c87",
    "category": "Groceries",
    "budgeted": 250,
    "actual": 180,
    "difference": 70,
    "type": "expense"
  }
}
```

#### Delete Budget Item

```
DELETE /budget/:id
```

Deletes a budget item.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Savings Goals

Savings goals represent money being saved for specific purposes.

#### Savings Goal Object

```json
{
  "id": "60d21d2067d0d8992e610c89",
  "category": "Emergency Fund",
  "target": 5000,
  "saved": 1500,
  "remaining": 3500,
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-20T15:30:00.000Z"
}
```

#### List Savings Goals

```
GET /savings
```

Returns all savings goals.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21d2067d0d8992e610c89",
      "category": "Emergency Fund",
      "target": 5000,
      "saved": 1500,
      "remaining": 3500
    },
    {
      "id": "60d21d2067d0d8992e610c8a",
      "category": "Vacation Fund",
      "target": 2000,
      "saved": 800,
      "remaining": 1200
    }
  ]
}
```

#### Get Savings Goal

```
GET /savings/:id
```

Returns a single savings goal.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21d2067d0d8992e610c89",
    "category": "Emergency Fund",
    "target": 5000,
    "saved": 1500,
    "remaining": 3500
  }
}
```

#### Create Savings Goal

```
POST /savings
```

Creates a new savings goal. The `remaining` amount will be calculated automatically.

**Request Body:**

```json
{
  "category": "Emergency Fund",
  "target": 5000,
  "saved": 1500
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21d2067d0d8992e610c89",
    "category": "Emergency Fund",
    "target": 5000,
    "saved": 1500,
    "remaining": 3500
  }
}
```

#### Update Savings Goal

```
PUT /savings/:id
```

Updates a savings goal. The `remaining` amount will be recalculated if `target` or `saved` amounts are updated.

**Request Body:**

```json
{
  "saved": 2000
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21d2067d0d8992e610c89",
    "category": "Emergency Fund",
    "target": 5000,
    "saved": 2000,
    "remaining": 3000
  }
}
```

#### Delete Savings Goal

```
DELETE /savings/:id
```

Deletes a savings goal.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Categories

Categories are used to classify transactions, budget items and savings goals.

#### Category Object

```json
{
  "id": "60d21e1067d0d8992e610c91",
  "name": "Groceries",
  "description": "Food and household items",
  "isActive": true,
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-20T15:30:00.000Z"
}
```

#### List Categories

```
GET /categories
```

Returns all categories.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21e1067d0d8992e610c91",
      "name": "Groceries",
      "description": "Food and household items",
      "isActive": true,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-20T15:30:00.000Z"
    },
    {
      "id": "60d21e1067d0d8992e610c92",
      "name": "Entertainment",
      "description": "Movies, games, etc.",
      "isActive": true,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-20T15:30:00.000Z"
    }
  ]
}
```

#### Get Category

```
GET /categories/:id
```

Returns a single category by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c91",
    "name": "Groceries",
    "description": "Food and household items",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-20T15:30:00.000Z"
  }
}
```

#### Create Category

```
POST /categories
```

Creates a new category.

**Request Body:**

```json
{
  "name": "Groceries",
  "description": "Food and household items",
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c91",
    "name": "Groceries",
    "description": "Food and household items",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
}
```

#### Update Category

```
PUT /categories/:id
```

Updates an existing category.

**Request Body:**

```json
{
  "name": "Groceries and Supplies",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c91",
    "name": "Groceries and Supplies",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-20T15:30:00.000Z"
  }
}
```

#### Delete Category

```
DELETE /categories/:id
```

Deletes a category. Will return an error if the category is associated with any transactions, budget items, or savings goals.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Sources

Sources are used to track different income sources.

#### Source Object

```json
{
  "id": "60d21e1067d0d8992e610c93",
  "name": "Primary Job",
  "description": "Main employment income",
  "isActive": true,
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-20T15:30:00.000Z"
}
```

#### List Sources

```
GET /sources
```

Returns all sources.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21e1067d0d8992e610c93",
      "name": "Primary Job",
      "description": "Main employment income",
      "isActive": true,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-20T15:30:00.000Z"
    },
    {
      "id": "60d21e1067d0d8992e610c94",
      "name": "Freelance Work",
      "description": "Side gigs",
      "isActive": true,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-20T15:30:00.000Z"
    }
  ]
}
```

#### Get Source

```
GET /sources/:id
```

Returns a single source by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c93",
    "name": "Primary Job",
    "description": "Main employment income",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-20T15:30:00.000Z"
  }
}
```

#### Create Source

```
POST /sources
```

Creates a new source.

**Request Body:**

```json
{
  "name": "Primary Job",
  "description": "Main employment income",
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c93",
    "name": "Primary Job",
    "description": "Main employment income",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
}
```

#### Update Source

```
PUT /sources/:id
```

Updates an existing source.

**Request Body:**

```json
{
  "name": "Full-time Job",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21e1067d0d8992e610c93",
    "name": "Full-time Job",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-20T15:30:00.000Z"
  }
}
```

#### Delete Source

```
DELETE /sources/:id
```

Deletes a source. Will return an error if the source is associated with any transactions or budget items.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied per IP address:

- General Rate Limit: 100 requests per 15 minutes for all endpoints
- Write Operations (POST, PUT, DELETE): 30 requests per hour
- Analytics Endpoints: 10 requests per 5 minutes

Rate limit headers are included in all responses:
- `RateLimit-Limit`: Maximum requests allowed in the window
- `RateLimit-Remaining`: Remaining requests in the current window
- `RateLimit-Reset`: Time when the rate limit resets (in UTC seconds)

## Statistics Endpoints

### Get Financial Summary

```
GET /api/v1/statistics/summary
```

Get an overview of financial status including total income, expenses, and savings.

**Query Parameters:**
- `startDate` (optional): Start date for the period (YYYY-MM-DD)
- `endDate` (optional): End date for the period (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 3000,
    "balance": 2000,
    "savingsSummary": {
      "totalSavingsTarget": 10000,
      "totalSaved": 4000,
      "savingsProgress": 40.00,
      "remainingToSave": 6000
    },
    "period": {
      "startDate": "2023-01-01",
      "endDate": "2023-12-31"
    }
  }
}
```

### Get Budget Comparison

```
GET /api/v1/statistics/budget-comparison
```

Compare budgeted vs actual amounts for income and expenses.

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "income": {
        "budgeted": 5000,
        "actual": 4800,
        "difference": -200,
        "performance": 96.00
      },
      "expenses": {
        "budgeted": 3000,
        "actual": 2800,
        "difference": 200,
        "performance": 93.33
      },
      "net": {
        "budgeted": 2000,
        "actual": 2000
      }
    },
    "incomeByCategory": [
      {
        "categoryId": "123",
        "categoryName": "Salary",
        "budgeted": 4500,
        "actual": 4500,
        "difference": 0,
        "items": []
      }
    ],
    "expensesByCategory": [
      {
        "categoryId": "456",
        "categoryName": "Housing",
        "budgeted": 1500,
        "actual": 1500,
        "difference": 0,
        "items": []
      }
    ]
  }
}
```

### Get Spending by Category

```
GET /api/v1/statistics/spending-by-category
```

Get a breakdown of spending by category.

**Query Parameters:**
- `startDate` (optional): Start date for the period (YYYY-MM-DD)
- `endDate` (optional): End date for the period (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "123",
        "categoryName": "Housing",
        "amount": 1500,
        "count": 1,
        "percentage": 53.57
      },
      {
        "categoryId": "456",
        "categoryName": "Food",
        "amount": 800,
        "count": 15,
        "percentage": 28.57
      }
    ],
    "totalSpending": 2800,
    "period": {
      "startDate": "2023-01-01",
      "endDate": "2023-12-31"
    }
  }
}
```

### Get Monthly Trends

```
GET /api/v1/statistics/monthly-trends
```

Get income and expense trends by month.

**Query Parameters:**
- `months` (optional): Number of months to include (default: 12)

**Response:**

```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "month": "Jan 2023",
        "income": 5000,
        "expenses": 3000,
        "balance": 2000,
        "key": "2023-01"
      }
    ],
    "period": {
      "months": 12
    }
  }
}
```

### Get Savings Progress

```
GET /api/v1/statistics/savings-progress
```

Get detailed progress on savings goals.

**Response:**

```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "123",
        "categoryId": "789",
        "categoryName": "Emergency Fund",
        "target": 10000,
        "saved": 4000,
        "remaining": 6000,
        "progress": 40.00,
        "isComplete": false
      }
    ],
    "summary": {
      "totalGoals": 1,
      "completed": 0,
      "totalTarget": 10000,
      "totalSaved": 4000,
      "totalRemaining": 6000,
      "overallProgress": 40.00
    }
  }
}
```

### Get Total Balance

```
GET /api/v1/statistics/balance
```

Get a comprehensive financial balance including all transactions, savings, and budgets for the authenticated user.

**Authentication Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": {
    "totalBalance": {
      "available": 2000,
      "transaction": 5000,
      "savings": {
        "totalTarget": 10000,
        "totalSaved": 3000,
        "remaining": 7000
      },
      "budget": 4500
    },
    "details": {
      "transactionCount": 25,
      "activeGoals": 3,
      "activeBudgets": 8
    }
  }
}
```

The response includes:
- `available`: Total available balance (transaction balance minus saved amount)
- `transaction`: Net balance from all transactions (income minus expenses)
- `savings`: Current savings status including target amount, saved amount, and remaining amount
- `budget`: Net balance from all budget items
- `details`: Count of active transactions, savings goals, and budget items

## Error Handling

The API returns appropriate HTTP status codes and error messages in a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `400` - Bad Request (e.g., validation error)
- `404` - Resource Not Found
- `500` - Server Error

The API uses standard HTTP response codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Server Error

Error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common error scenarios:

1. Rate Limit Exceeded:
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again after 15 minutes"
}
```

2. Validation Error:
```json
{
  "success": false,
  "error": "Please provide a valid amount"
}
```

3. Resource Not Found:
```json
{
  "success": false,
  "error": "Transaction not found"
}
```

4. Relationship Constraint Error:
```json
{
  "success": false,
  "error": "Category is associated with transactions"
}
```

## Database Schema

The API uses PostgreSQL with the following entity relationships:

```
Transaction
- id (UUID)
- date (TIMESTAMP)
- amount (DECIMAL)
- description (VARCHAR)
- type (ENUM: 'income' | 'expense')
- category_id (UUID, FK)
- source_id (UUID, FK, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Category
- id (UUID)
- name (VARCHAR, unique)
- description (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Source
- id (UUID)
- name (VARCHAR, unique)
- description (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

BudgetItem
- id (UUID)
- category_id (UUID, FK)
- source_id (UUID, FK, nullable)
- budgeted (DECIMAL)
- actual (DECIMAL)
- difference (DECIMAL)
- type (ENUM: 'income' | 'expense')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

SavingsGoal
- id (UUID)
- category_id (UUID, FK)
- target (DECIMAL)
- saved (DECIMAL)
- remaining (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Running the API

1. Ensure PostgreSQL is running on your system
2. Create a database named `finance_tracker`:
   ```sql
   CREATE DATABASE finance_tracker;
   ```
3. Set environment variables in `.env` file:
   ```
   PORT=5000
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/finance_tracker
   NODE_ENV=development
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start` (must build first with `npm run build`)

## Real-time Updates

The API supports real-time updates via WebSocket connections using Socket.IO. This allows clients to receive instant updates when data changes.

### Connecting to WebSocket

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
```

### Subscribing to Events

Subscribe to specific entity updates:

```javascript
// Subscribe to transaction updates
socket.emit('subscribe', ['transactions']);

// Subscribe to multiple entities
socket.emit('subscribe', ['transactions', 'budget', 'savings']);

// Unsubscribe from updates
socket.emit('unsubscribe', ['transactions']);
```

### Available Events

#### Transaction Events

```javascript
// Listen for new transactions
socket.on('transaction:created', (transaction) => {
  console.log('New transaction:', transaction);
});

// Listen for transaction updates
socket.on('transaction:updated', (transaction) => {
  console.log('Updated transaction:', transaction);
});

// Listen for transaction deletions
socket.on('transaction:deleted', ({ id }) => {
  console.log('Deleted transaction:', id);
});
```

#### Budget Events

```javascript
socket.on('budget:updated', (data) => {
  const { action, data: budgetItem } = data;
  console.log(`Budget ${action}:`, budgetItem);
});
```

#### Savings Events

```javascript
socket.on('savings:updated', (data) => {
  const { action, data: savingsGoal } = data;
  console.log(`Savings goal ${action}:`, savingsGoal);
});
```

### Event Types

| Event Name | Description |
|------------|-------------|
| `transaction:created` | Emitted when a new transaction is created |
| `transaction:updated` | Emitted when a transaction is updated |
| `transaction:deleted` | Emitted when a transaction is deleted |
| `budget:updated` | Emitted when budget items are created, updated, or deleted |
| `savings:updated` | Emitted when savings goals are created, updated, or deleted |
| `category:updated` | Emitted when categories are modified |
| `source:updated` | Emitted when sources are modified |

### Example Implementation

```javascript
const setupWebSocket = () => {
  const socket = io('http://localhost:5000');
  
  // Connection events
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    // Subscribe to relevant entities
    socket.emit('subscribe', ['transactions', 'budget', 'savings']);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });
  
  // Transaction events
  socket.on('transaction:created', (transaction) => {
    // Add new transaction to local state
  });
  
  socket.on('transaction:updated', (transaction) => {
    // Update transaction in local state
  });
  
  socket.on('transaction:deleted', ({ id }) => {
    // Remove transaction from local state
  });
  
  // Budget events
  socket.on('budget:updated', ({ action, data }) => {
    switch (action) {
      case 'created':
        // Add new budget item
        break;
      case 'updated':
        // Update existing budget item
        break;
      case 'deleted':
        // Remove budget item
        break;
    }
  });
  
  // Savings events
  socket.on('savings:updated', ({ action, data }) => {
    switch (action) {
      case 'created':
        // Add new savings goal
        break;
      case 'updated':
        // Update existing savings goal
        break;
      case 'deleted':
        // Remove savings goal
        break;
    }
  });
  
  return socket;
};
```

### Error Handling

The WebSocket connection includes automatic reconnection handling. You can listen for specific error events:

```javascript
socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Best Practices

1. Always handle connection and disconnection events
2. Implement reconnection logic
3. Subscribe only to needed entities to minimize unnecessary updates
4. Unsubscribe from entities when they're no longer needed
5. Handle errors appropriately
6. Implement proper state management to handle real-time updates

## Feature Flags

The API implements a feature flag system for gradual rollout of features and A/B testing. Feature flags control access to various API functionalities.

### Available Features

- `realTimeUpdates`: Controls WebSocket-based real-time updates
- `advancedAnalytics`: Controls access to advanced reporting features
- `savingsGoals`: Controls savings goal tracking features
- `budgetCategories`: Controls budget categorization features
- `transactionCategories`: Controls transaction categorization
- `multiCurrency`: Controls multi-currency support (beta)

### Feature Flag Headers

All API responses include the following headers:
- `X-Available-Features`: Comma-separated list of enabled features

### Feature Management Endpoints

#### Get Feature Status

```
GET /api/v1/statistics/features
```

Returns the current status of all feature flags.

**Response:**
```json
{
  "success": true,
  "data": {
    "realTimeUpdates": {
      "enabled": true,
      "description": "Enable real-time updates via WebSocket"
    },
    "advancedAnalytics": {
      "enabled": true,
      "rolloutPercentage": 50,
      "description": "Advanced analytics and reporting features"
    }
  }
}
```

#### Enable Feature

```
POST /api/v1/statistics/features/:flag/enable
```

Enable a specific feature flag.

#### Disable Feature

```
POST /api/v1/statistics/features/:flag/disable
```

Disable a specific feature flag.

#### Set Rollout Percentage

```
POST /api/v1/statistics/features/:flag/rollout
```

Set the rollout percentage for a feature.

**Request Body:**
```json
{
  "percentage": 50
}
```

#### Manage Feature Whitelist

```
POST /api/v1/statistics/features/:flag/whitelist
```

Add or remove users from a feature's whitelist.

**Request Body:**
```json
{
  "userId": "user123",
  "action": "add"  // or "remove"
}
```

### Feature Analytics Endpoints

#### Get Feature Analytics

```
GET /api/v1/statistics/features/analytics
```

Get usage analytics for all enabled features.

**Response:**
```json
{
  "success": true,
  "data": {
    "featureStatus": {
      // Current feature flag status
    },
    "analytics": {
      "transactionCategories": {
        "categoriesUsed": 10,
        "totalTransactions": 150,
        "adoptionRate": 15
      },
      "budgetCategories": {
        "categoriesUsed": 8,
        "totalBudgets": 12,
        "adherenceRate": 85.5
      }
    }
  }
}
```

#### Get Feature Usage Trends

```
GET /api/v1/statistics/features/trends
```

Get historical usage trends for features.

**Query Parameters:**
- `startDate` (optional): Start date for trends (YYYY-MM-DD)
- `endDate` (optional): End date for trends (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": {
      "transactionCategories": [
        {
          "day": "2023-12-01",
          "count": 25,
          "categories": 5
        }
      ],
      "budgetCategories": [
        {
          "day": "2023-12-01",
          "count": 10,
          "adherenceRate": 92.5
        }
      ]
    },
    "period": {
      "start": "2023-12-01",
      "end": "2023-12-31"
    }
  }
}
```

### Best Practices

1. Always check feature availability using the `X-Available-Features` header
2. Implement graceful degradation when features are disabled
3. Use the analytics endpoints to monitor feature adoption
4. Consider user experience when adjusting rollout percentages
5. Use whitelists for beta testing new features

### WebSocket Feature Integration

When using WebSocket connections with feature flags:

1. Check the `realTimeUpdates` feature flag before attempting connection
2. Handle connection rejection when features are disabled
3. Subscribe only to enabled feature events
4. Implement reconnection logic with feature checking

Example WebSocket connection with feature checking:

```javascript
const socket = io('http://localhost:5000');

socket.on('connect_error', (error) => {
  if (error.message === 'Real-time updates are not available') {
    // Fall back to polling
    console.log('WebSocket updates not available, using polling');
    startPolling();
  }
});

// Subscribe to features
socket.on('connect', () => {
  // Get available features from REST API first
  fetch('/api/v1/statistics/features')
    .then(response => response.json())
    .then(({ data: features }) => {
      const enabledFeatures = [];
      
      if (features.transactionCategories?.enabled) {
        enabledFeatures.push('transactions');
      }
      if (features.budgetCategories?.enabled) {
        enabledFeatures.push('budget');
      }
      if (features.savingsGoals?.enabled) {
        enabledFeatures.push('savings');
      }
      
      if (enabledFeatures.length > 0) {
        socket.emit('subscribe', enabledFeatures);
      }
    });
});

// Handle feature-specific events
socket.on('error', (error) => {
  if (error.code === 'FEATURE_NOT_AVAILABLE') {
    console.log(`Feature ${error.feature} is not available`);
    // Implement fallback behavior
  }
});
```

## Security Best Practices

### Rate Limiting
Rate limits are enforced per API key and IP address:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 15 minutes",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2024-01-20T15:00:00Z"
    }
  }
}
```

### Input Validation
All endpoints perform strict input validation:

- String lengths are enforced
- Numbers are validated for range and precision
- Dates must be in ISO 8601 format
- Enums are strictly typed

### CORS Policy
CORS is enabled for specific origins only. Add allowed origins to your environment variables:

```
ALLOWED_ORIGINS=http://localhost:3000,https://yourapp.com
```

### API Keys
For service-to-service communication, use API keys instead of JWT tokens:

```
X-API-Key: your-api-key-here
```

## API Testing

### Postman Collection
A complete Postman collection is available for testing:
```
/docs/postman/finance-tracker-api.postman_collection.json
```

### Environment Variables
Development environment variables:
```
BASE_URL=http://localhost:5000/api/v1
API_KEY=dev-api-key
```

### Test Data
Sample data for testing is provided:
```sql
-- categories
INSERT INTO categories (name, description) VALUES 
('Groceries', 'Food and household items'),
('Utilities', 'Bills and services');

-- transactions
INSERT INTO transactions (amount, category_id, type) VALUES 
(50.25, 1, 'expense'),
(1000, 2, 'income');
```

## Mobile App Integration

### React Native Setup
```javascript
// api/config.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// api/client.js
import axios from 'axios';
import { API_CONFIG } from './config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
});

apiClient.interceptors.request.use(config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Offline Support
The API supports offline-first operations:

1. Data Syncing:
```javascript
// Store transactions locally
await AsyncStorage.setItem('pendingTransactions', JSON.stringify(transactions));

// Sync when online
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncPendingTransactions();
  }
});
```

2. Conflict Resolution:
```javascript
// Handle merge conflicts
const resolveConflict = async (localData, serverData) => {
  if (serverData.updatedAt > localData.updatedAt) {
    return serverData;
  }
  return localData;
};
```

## Performance Optimization

### Caching
The API implements various caching strategies:

1. Response Caching:
```
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

2. Query Parameters:
- Use `fields` to select specific fields
- Use `embed` to include related data
```
GET /transactions?fields=id,amount,date&embed=category
```

### Pagination
All list endpoints support pagination:
```
GET /transactions?page=2&pageSize=20
```

### Bulk Operations
For better performance, use bulk endpoints:
```
POST /transactions/bulk
Content-Type: application/json

{
  "transactions": [
    { "amount": 50.25, "category": "Groceries", "type": "expense" },
    { "amount": 30.00, "category": "Transport", "type": "expense" }
  ]
}
```

## Migration Guides

### v1 to v2 Migration
Key changes in v2:
1. Multi-currency support
2. New analytics endpoints
3. Breaking changes:
   - Transaction schema updates
   - New authentication flow

Migration steps:
1. Update API version
2. Update data models
3. Migrate existing data
4. Update client applications

## Troubleshooting

### Common Issues

1. Authentication Errors:
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "JWT token has expired"
  }
}
```
Solution: Refresh the token or re-authenticate

2. Rate Limiting:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```
Solution: Implement exponential backoff

### Debug Mode
Enable debug mode for detailed logs:
```
DEBUG=finance-api:* npm run dev
```

### Support
For API support:
- Email: api-support@financetracker.com
- Documentation: https://docs.financetracker.com
- Status Page: https://status.financetracker.com
