# ⚡ Quick Start Guide

Get the Expense Tracker app running in 10 minutes!

---

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB Atlas account
- Terminal/Command Prompt

---

## 🚀 3-Step Setup

### Step 1: Install Dependencies (2 minutes)

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Step 2: Configure Backend (2 minutes)

**Edit `server/.env`:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_12345
PORT=5000
NODE_ENV=development
```

Get MONGO_URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 3: Start Both Servers (2 minutes)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

---

## ✅ Test It Out

1. Open http://localhost:3000
2. Click **Register**
3. Enter: name, email, password
4. Click **Login**
5. Add a transaction
6. View dashboard and analytics

---

## 📁 Project Structure

```
expense-tracker/
├── client/          (React - port 3000)
├── server/          (Express - port 5000)
├── README.md        (Overview)
├── INSTALLATION.md  (Detailed setup)
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md    (AWS)
└── DEVELOPMENT.md   (Dev guidelines)
```

---

## 🔐 Features Included

✅ User authentication with JWT
✅ Add/edit/delete transactions
✅ Dashboard with balance & stats
✅ Interactive charts (Recharts)
✅ Category-wise analytics
✅ Monthly spending trends
✅ Responsive design
✅ Production-ready code

---

## 🐛 Common Issues & Solutions

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection failed"
- Check MONGO_URI in `.env`
- Whitelist your IP in MongoDB Atlas
- Verify username/password

### "Port 5000 already in use"
```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
```

### "Port 3000 already in use"
```bash
PORT=3001 npm start
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview |
| [INSTALLATION.md](./INSTALLATION.md) | Detailed installation |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | All API endpoints |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy on AWS |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development guidelines |

---

## 🎯 Next Steps

1. **Add more transactions** to see analytics in action
2. **Deploy frontend** to AWS S3 (see DEPLOYMENT.md)
3. **Deploy backend** to AWS EC2 (see DEPLOYMENT.md)
4. **Add custom domain** (optional)
5. **Customize styling** (modify CSS files)

---

## 🔑 API Key Routes

```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Get JWT token
POST   /api/transactions      - Add transaction
GET    /api/transactions      - Get all transactions
PUT    /api/transactions/:id  - Edit transaction
DELETE /api/transactions/:id  - Delete transaction
GET    /api/transactions/analytics/summary - Get charts data
```

---

## 📊 Sample Test Data

```json
{
  "amount": 5000,
  "type": "expense",
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-04-22"
}
```

---

## 💡 Pro Tips

1. Use Postman to test API endpoints
2. Check browser console (F12) for errors
3. Check backend logs in terminal
4. Use MongoDB Atlas to manage database
5. Commit code to Git regularly

---

## 🆘 Need Help?

1. Check the detailed documentation files
2. Look at console errors (F12)
3. Verify `.env` configuration
4. Check if both servers are running
5. Ensure MongoDB cluster is active

---

## 🎉 You're All Set!

Your full-stack Expense Tracker is ready to use. Start tracking your finances!

**Happy expense tracking! 💰**
