#  Installation Guide

Complete step-by-step guide to set up the Expense Tracker application.

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **MongoDB Atlas Account** (or local MongoDB)
   - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (free tier available)

4. **Code Editor**
   - VS Code, WebStorm, or any preferred editor

---

## Step 1: Clone Repository

```bash
# Clone the project
git clone https://github.com/yourusername/expense-tracker.git

# Navigate to project directory
cd expense-tracker
```

---

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- express-validator
- nodemon (dev dependency)

### 2.2 Configure Environment Variables

**Create/Edit `.env` file in `server/` directory**:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### For MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user:
   - Click "Database Access"
   - Create a new user with username and password
4. Whitelist your IP:
   - Click "Network Access"
   - Add your current IP (or 0.0.0.0 for development only)
5. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

#### For Local MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### 2.3 Verify Backend Setup

```bash
# In server directory
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Stop the server** with `Ctrl+C`

---

## Step 3: Frontend Setup

### 3.1 Install Frontend Dependencies

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- recharts
- react-scripts

### 3.2 Verify Frontend Setup

```bash
# In client directory
npm start
```

This will:
- Start development server on http://localhost:3000
- Automatically open browser
- Show "Welcome to Expense Tracker"

**Stop the application** with `Ctrl+C`

---

## Step 4: Running Both Servers

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd expense-tracker/server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd expense-tracker/client
npm start
```

### Option 2: Single Command (Optional)

You can use a tool like `concurrently` to run both servers from root directory:

```bash
# From project root
npm install -g concurrently

# Create root package.json with:
concurrently "cd server && npm start" "cd client && npm start"
```

---

## Step 5: Testing the Application

1. **Open Browser**: Navigate to http://localhost:3000

2. **Register New Account**:
   - Click "Register"
   - Enter name, email, password
   - Click "Register"

3. **Login**:
   - Use the email and password from registration
   - Click "Login"

4. **Add Transaction**:
   - Click "Transactions"
   - Fill in the form (amount, type, category, etc.)
   - Click "Add"

5. **View Dashboard**:
   - Click "Dashboard"
   - See balance, income, and expense totals

6. **View Analytics**:
   - Click "Analytics"
   - See charts for monthly and category-wise data

---

##  Troubleshooting

### Issue: "Cannot find module" errors

**Solution**:
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Issue: MongoDB connection fails

**Check**:
1. Correct MONGO_URI in `.env`
2. IP whitelisted in MongoDB Atlas
3. Database user has correct password
4. Network connectivity

### Issue: Port 5000 already in use

**Find and kill process**:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Port 3000 already in use

**Solution**: Change port in client
```bash
# macOS/Linux
PORT=3001 npm start

# Windows
set PORT=3001 && npm start
```

### Issue: CORS errors

**Solution**: 
1. Ensure backend is running on port 5000
2. Check frontend proxy setting in `client/package.json`
3. Verify backend CORS configuration

### Issue: Blank page in browser

1. Check browser console for errors (F12)
2. Check network tab to see API calls
3. Verify backend is running

---

##  Verification Checklist

After installation, verify:

- [ ] Node.js and npm installed
- [ ] MongoDB connection working
- [ ] Backend server starts without errors
- [ ] Frontend compiles without errors
- [ ] Can register a new user
- [ ] Can login with registered account
- [ ] Can add a transaction
- [ ] Can view dashboard
- [ ] Can see analytics charts
- [ ] Logout works correctly

---

##  Environment Variables Reference

### Server `.env` Variables

| Variable | Example | Description |
|----------|---------|-------------|
| MONGO_URI | mongodb+srv://... | MongoDB connection string |
| JWT_SECRET | secret_key_here | Secret for JWT signing |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment (development/production) |

### Client Configuration

The frontend uses a proxy in `package.json`:
```json
"proxy": "http://localhost:5000"
```

This means API calls to `/api/...` are forwarded to backend.

---

##  Next Steps

1. **Local Development**:
   - Make changes to code
   - Server auto-reloads with nodemon
   - Browser auto-refreshes with React

2. **Production Build**:
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)

3. **Additional Configuration**:
   - See [DEVELOPMENT.md](./DEVELOPMENT.md)

---

##  Backup and Version Control

### Initialize Git (if not cloned)

```bash
git init
git add .
git commit -m "Initial commit"
```

### Create `.gitignore`

Already included in repository.

---

##  Getting Help

If you encounter issues:

1. Check [README.md](./README.md) for overview
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) section in this file
3. Check browser console (F12) for errors
4. Check backend logs in terminal
5. Open an issue in the repository

---

**Installation complete! Happy expense tracking! **

