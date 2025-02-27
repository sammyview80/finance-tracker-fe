# Finance Tracker API Documentation

## Authentication Endpoints

### POST /api/auth/login
Login with email and password
```json
{
  "email": "string",
  "password": "string"
}
```
Response: JWT token

### POST /api/auth/register
Register new user
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

## Dashboard Endpoints

### GET /api/dashboard/summary
Get user's financial summary
```json
{
  "totalBalance": "number",
  "monthlyIncome": "number",
  "monthlyExpenses": "number",
  "savingsGoal": "number",
  "savingsProgress": "number"
}
```

### GET /api/dashboard/recent-transactions
Get recent transactions
```json
{
  "transactions": [
    {
      "id": "string",
      "date": "string",
      "amount": "number",
      "category": "string",
      "description": "string",
      "type": "income | expense"
    }
  ]
}
```

### GET /api/dashboard/spending-by-category
Get spending breakdown by category
```json
{
  "categories": [
    {
      "name": "string",
      "amount": "number",
      "percentage": "number"
    }
  ]
}
```

## Dummy Data

### Dashboard Summary
```json
{
  "totalBalance": 5000.00,
  "monthlyIncome": 3000.00,
  "monthlyExpenses": 2000.00,
  "savingsGoal": 10000.00,
  "savingsProgress": 5000.00
}
```

### Recent Transactions
```json
{
  "transactions": [
    {
      "id": "t1",
      "date": "2024-01-20",
      "amount": 50.00,
      "category": "Food",
      "description": "Grocery shopping",
      "type": "expense"
    },
    {
      "id": "t2",
      "date": "2024-01-19",
      "amount": 3000.00,
      "category": "Salary",
      "description": "Monthly salary",
      "type": "income"
    },
    {
      "id": "t3",
      "date": "2024-01-18",
      "amount": 100.00,
      "category": "Transportation",
      "description": "Fuel",
      "type": "expense"
    }
  ]
}
```

### Spending by Category
```json
{
  "categories": [
    {
      "name": "Food",
      "amount": 500.00,
      "percentage": 25
    },
    {
      "name": "Transportation",
      "amount": 300.00,
      "percentage": 15
    },
    {
      "name": "Utilities",
      "amount": 400.00,
      "percentage": 20
    },
    {
      "name": "Entertainment",
      "amount": 200.00,
      "percentage": 10
    },
    {
      "name": "Others",
      "amount": 600.00,
      "percentage": 30
    }
  ]
}
```