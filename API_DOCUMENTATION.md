# 🔌 API Documentation

Complete reference for all backend API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules**:
- `name`: Required, max 50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Success Response** (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (400):
```json
{
  "message": "User already exists with that email"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Login User

Authenticate and get JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules**:
- `email`: Required, valid email
- `password`: Required

**Success Response** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (401):
```json
{
  "message": "Invalid email or password"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 3. Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /auth/me` (Protected)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (401):
```json
{
  "message": "Token is not valid"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💳 Transaction Endpoints

### 1. Get All Transactions

Fetch all transactions for authenticated user.

**Endpoint**: `GET /transactions` (Protected)

**Query Parameters** (Optional):
```
?type=expense              # Filter by type: "income" or "expense"
?category=Food             # Filter by category
?startDate=2024-01-01      # Filter from date (ISO format)
?endDate=2024-04-30        # Filter to date (ISO format)
```

**Success Response** (200):
```json
{
  "count": 15,
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "amount": 5000,
      "type": "expense",
      "category": "Food",
      "description": "Grocery shopping",
      "date": "2024-04-22T10:30:00.000Z",
      "createdAt": "2024-04-22T10:30:00.000Z",
      "updatedAt": "2024-04-22T10:30:00.000Z"
    }
  ]
}
```

**cURL Examples**:
```bash
# Get all transactions
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get only expenses
curl -X GET "http://localhost:5000/api/transactions?type=expense" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get transactions for specific month
curl -X GET "http://localhost:5000/api/transactions?startDate=2024-04-01&endDate=2024-04-30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 2. Create Transaction

Add a new income or expense transaction.

**Endpoint**: `POST /transactions` (Protected)

**Request Body**:
```json
{
  "amount": 5000,
  "type": "expense",
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-04-22"
}
```

**Validation Rules**:
- `amount`: Required, must be > 0
- `type`: Required, must be "income" or "expense"
- `category`: Required, string
- `description`: Optional
- `date`: Optional, defaults to current date

**Expense Categories**:
```
Food, Transport, Entertainment, Utilities, Shopping, Healthcare, Other
```

**Income Categories**:
```
Salary, Freelance, Investment, Gift, Other Income
```

**Success Response** (201):
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "amount": 5000,
    "type": "expense",
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2024-04-22T00:00:00.000Z",
    "createdAt": "2024-04-22T10:35:00.000Z",
    "updatedAt": "2024-04-22T10:35:00.000Z"
  }
}
```

**Error Response** (400):
```json
{
  "message": "Please provide amount, type, and category"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "expense",
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2024-04-22"
  }'
```

---

### 3. Update Transaction

Modify an existing transaction.

**Endpoint**: `PUT /transactions/:id` (Protected)

**URL Parameters**:
```
:id = Transaction ID (MongoDB ObjectId)
```

**Request Body** (All fields optional):
```json
{
  "amount": 6000,
  "type": "expense",
  "category": "Entertainment",
  "description": "Movie and dinner",
  "date": "2024-04-23"
}
```

**Success Response** (200):
```json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439011",
    "amount": 6000,
    "type": "expense",
    "category": "Entertainment",
    "description": "Movie and dinner",
    "date": "2024-04-23T00:00:00.000Z"
  }
}
```

**Error Responses**:
```json
{
  "message": "Transaction not found"
}
```

```json
{
  "message": "Not authorized to update this transaction"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/transactions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 6000,
    "category": "Entertainment"
  }'
```

---

### 4. Delete Transaction

Remove a transaction.

**Endpoint**: `DELETE /transactions/:id` (Protected)

**URL Parameters**:
```
:id = Transaction ID
```

**Success Response** (200):
```json
{
  "message": "Transaction deleted successfully"
}
```

**Error Response** (404):
```json
{
  "message": "Transaction not found"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/transactions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get Analytics

Fetch summary analytics and data for charts.

**Endpoint**: `GET /transactions/analytics/summary` (Protected)

**Success Response** (200):
```json
{
  "summary": {
    "balance": 45000,
    "totalIncome": 100000,
    "totalExpense": 55000
  },
  "categoryWise": {
    "Food": { "income": 0, "expense": 15000 },
    "Transport": { "income": 0, "expense": 8000 },
    "Entertainment": { "income": 0, "expense": 10000 },
    "Salary": { "income": 100000, "expense": 0 }
  },
  "monthlyData": {
    "2024-03": { "income": 50000, "expense": 28000 },
    "2024-04": { "income": 50000, "expense": 27000 }
  }
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/transactions/analytics/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

or

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

---

## Rate Limiting

Currently no rate limiting. For production, consider:
- Implementing rate limiting middleware
- Use packages like `express-rate-limit`

---

## Pagination

Currently no pagination. For future enhancement:
- Add `limit` and `offset` query parameters
- Implement cursor-based pagination

---

## Testing Endpoints

### Using Postman

1. Open Postman
2. Create new request
3. Select method (GET, POST, PUT, DELETE)
4. Enter URL: `http://localhost:5000/api/...`
5. Add headers if needed
6. Add body (if applicable)
7. Send request

### Using cURL (Command Line)

See examples above for each endpoint.

### Using Axios (JavaScript)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Set token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Make request
api.get('/transactions')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

---

## Common Issues

### Token Expired
- **Error**: `message: "Token is not valid"`
- **Solution**: Login again to get new token

### Invalid Email Format
- **Error**: `message: "Valid email is required"`
- **Solution**: Use valid email format (user@example.com)

### Duplicate Email
- **Error**: `message: "User already exists with that email"`
- **Solution**: Use different email or login with existing account

### Missing Authorization Header
- **Error**: `message: "No token, authorization denied"`
- **Solution**: Add `Authorization: Bearer <TOKEN>` header

---

## API Response Times

Typical response times:
- Login/Register: 200-500ms
- Get Transactions: 100-300ms
- Create Transaction: 150-400ms
- Analytics: 200-600ms

---

**For questions or issues, refer to the main README.md or INSTALLATION.md**
