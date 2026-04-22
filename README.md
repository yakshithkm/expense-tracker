# 💰 Expense Tracker - Complete MERN Stack Application

A full-stack expense tracking web application built with **MongoDB, Express, React, and Node.js (MERN)**. Track your income, expenses, and visualize your financial data with interactive charts.

## 🎯 Features

- ✅ **User Authentication**: Secure registration and login with JWT
- ✅ **Transaction Management**: Add, edit, delete income and expense transactions
- ✅ **Dashboard**: View balance, total income, and total expenses at a glance
- ✅ **Analytics**: Interactive charts showing category-wise and monthly analytics
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-time Updates**: Instant feedback on all operations
- ✅ **AWS Deployment Ready**: Optimized for AWS Free Tier deployment

---

## 🏗️ Project Structure

```
expense-tracker/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionList.js
│   │   │   ├── Analytics.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   └── Transactions.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── TransactionContext.js
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── TransactionForm.css
│   │   │   ├── TransactionList.css
│   │   │   ├── TransactionsPage.css
│   │   │   └── Analytics.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Transaction.js           # Transaction schema
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   └── transactionController.js # Transaction logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── transactionRoutes.js     # Transaction endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── server.js                    # Main server file
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+) and **npm**
- **MongoDB Atlas** account (free tier available)
- **Git**

### 1. Backend Setup

```bash
cd server
npm install
```

**Configure Environment Variables** (`.env`):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Start Backend Server**:
```bash
npm start        # Production
# OR
npm run dev      # Development with nodemon
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
```

**Start React App**:
```bash
npm start
```

App opens on `http://localhost:3000`

---

## 🔐 Authentication Flow

1. **Register**: User creates account with name, email, password
2. **Login**: User logs in with email and password
3. **JWT Token**: Backend issues JWT token valid for 7 days
4. **Token Storage**: Token stored in browser localStorage
5. **Protected Routes**: All transaction routes require valid JWT token
6. **Auto-logout**: Invalid/expired tokens trigger re-login

---

## 🗄️ Database Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  amount: Number,
  type: "income" | "expense",
  category: String,
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions (protected) |
| POST | `/api/transactions` | Create transaction (protected) |
| PUT | `/api/transactions/:id` | Update transaction (protected) |
| DELETE | `/api/transactions/:id` | Delete transaction (protected) |
| GET | `/api/transactions/analytics/summary` | Get analytics data (protected) |

---

## 📊 Features Overview

### Dashboard
- **Balance Card**: Shows total balance (income - expenses)
- **Income Card**: Shows total income
- **Expense Card**: Shows total expenses

### Transactions Page
- **Transaction Form**: Add new income/expense transactions
- **Transaction List**: View all transactions with filters
- **Quick Actions**: Edit or delete existing transactions
- **Filters**: Filter by type (income/expense)

### Analytics Page
- **Pie Chart**: Category-wise expense distribution
- **Bar Charts**: Monthly income vs expenses comparison
- **Category Summary**: Income and expense breakdown by category

---

## 🛠️ Tech Stack Details

### Frontend
- **React 18**: UI library with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Recharts**: Data visualization library
- **CSS3**: Custom styling (no frameworks)

### Backend
- **Express.js**: Web framework
- **Node.js**: JavaScript runtime
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin requests

---

## 💾 Local Development

### With Local MongoDB

If using local MongoDB instead of MongoDB Atlas:

```env
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_key
PORT=5000
```

### With MongoDB Atlas

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier)
3. Create database user with password
4. Whitelist your IP address
5. Get connection string and update `.env`

---

## 🧪 Sample API Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Transaction

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

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Multi-column layouts with full charts
- **Tablet**: Optimized grid layouts
- **Mobile**: Single-column layout with stacked components

---

## ⚙️ Configuration

### Backend Configuration

#### Ports
- Development: `5000`
- Can be changed via `PORT` env variable

#### CORS
- Configured to accept requests from `http://localhost:3000` in development
- Update in production with your domain

#### JWT
- Token expiration: **7 days**
- Secret key: Must be strong and kept secure

### Frontend Configuration

#### API Base URL
- Development: `http://localhost:5000` (via proxy in package.json)
- Update for production deployment

---

## 🚨 Error Handling

### Frontend
- User-friendly error messages
- Form validation before submission
- Loading states for async operations
- Auto-logout on token expiration

### Backend
- Try-catch blocks in all controllers
- Input validation with express-validator
- Proper HTTP status codes
- Error message responses

---

## 🔒 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: Secure authentication
3. **Protected Routes**: Middleware-based route protection
4. **Input Validation**: Server-side validation
5. **CORS**: Restricted cross-origin access
6. **Environment Variables**: Sensitive data in .env files

---

## 📈 Performance Optimizations

1. **Database Indexes**: On userId and category for faster queries
2. **Lazy Loading**: Components load on demand
3. **Caching**: Context API prevents unnecessary re-renders
4. **Pagination Ready**: Architecture supports pagination
5. **Bundle Size**: Minimal dependencies, ~2MB build size

---

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
# In both server and client directories
rm -rf node_modules
npm install
```

### MongoDB connection failed
- Check `.env` MONGO_URI
- Verify IP whitelist in MongoDB Atlas
- Ensure network is stable

### Port already in use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS errors
- Check frontend URL in server CORS config
- Update proxy in client package.json

---

## 📚 Additional Documentation

See separate documentation files:
- [INSTALLATION.md](./INSTALLATION.md) - Detailed installation guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - AWS deployment instructions
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guidelines

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Happy Expense Tracking! 💰**
