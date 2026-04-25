#  Development Guidelines

Best practices and development workflow for the Expense Tracker project.

## Project Structure

```
expense-tracker/
+-- client/                 # React Frontend
¦   +-- public/            # Static files
¦   +-- src/
¦   ¦   +-- components/    # Reusable React components
¦   ¦   +-- pages/         # Page components
¦   ¦   +-- context/       # Global state (AuthContext, TransactionContext)
¦   ¦   +-- styles/        # CSS modules
¦   ¦   +-- App.js         # Main app component
¦   ¦   +-- index.js       # Entry point
¦   +-- package.json
¦
+-- server/                 # Express Backend
¦   +-- config/            # Configuration files
¦   +-- models/            # Mongoose schemas
¦   +-- controllers/       # Business logic
¦   +-- routes/            # API endpoints
¦   +-- middleware/        # Express middleware
¦   +-- server.js          # Main server file
¦   +-- package.json
¦
+-- Documentation files
```

##  Code Style Guidelines

### JavaScript/React

1. **Use ES6+ Features**:
   - Arrow functions
   - Destructuring
   - Template literals
   - Async/await

2. **Component Structure**:
```javascript
// Import statements at top
import React, { useState } from 'react';
import './Component.css';

// Component definition
const MyComponent = ({ props }) => {
  // Hooks
  const [state, setState] = useState(null);

  // Functions
  const handleClick = () => {};

  // Render
  return (
    <div>Content</div>
  );
};

// Export
export default MyComponent;
```

3. **Naming Conventions**:
   - Components: PascalCase (`UserProfile.js`)
   - Functions: camelCase (`handleSubmit`, `fetchData`)
   - Constants: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
   - CSS Classes: kebab-case (`.user-profile-card`)

4. **Comments**:
```javascript
// Use comments for complex logic
// Keep comments up-to-date
// Document public functions with JSDoc

/**
 * Fetches user transactions
 * @param {String} userId - The user ID
 * @returns {Promise<Array>} - Array of transactions
 */
const fetchTransactions = async (userId) => {};
```

### CSS

1. **Organization**:
```css
/* Reset and Defaults */
* { box-sizing: border-box; }

/* Colors and Variables */
:root { --primary-color: #4ECDC4; }

/* Base Styles */
body { font-family: Arial, sans-serif; }

/* Components */
.button { /* ... */ }

/* Utilities */
.text-center { text-align: center; }
```

2. **Naming**:
   - Use meaningful class names
   - Follow BEM (Block Element Modifier) for complex components
   - Avoid inline styles

3. **Responsive Design**:
```css
/* Mobile first approach */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 960px; }
}
```

---

##  Backend Development

### Adding New Route

**1. Create Controller** (`server/controllers/newController.js`):
```javascript
exports.handleRequest = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**2. Create Route** (`server/routes/newRoutes.js`):
```javascript
const express = require('express');
const controller = require('../controllers/newController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, controller.handleRequest);

module.exports = router;
```

**3. Register Route** (in `server.js`):
```javascript
const newRoutes = require('./routes/newRoutes');
app.use('/api/new', newRoutes);
```

### Database Queries

```javascript
// Create
const doc = new Model({ field: value });
await doc.save();

// Read
const doc = await Model.findById(id);
const docs = await Model.find({ condition });

// Update
await Model.findByIdAndUpdate(id, { field: newValue });

// Delete
await Model.findByIdAndDelete(id);

// Aggregate
const result = await Model.aggregate([
  { $match: { condition } },
  { $group: { _id: '$field', count: { $sum: 1 } } }
]);
```

### Error Handling

```javascript
// Avoid
router.post('/', (req, res) => {
  const data = JSON.parse(req.body);  // Can crash
  res.json(data);
});

// Better
router.post('/', async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Invalid data' });
  }
});
```

---

##  Frontend Development

### Adding New Component

**1. Create Component File** (`src/components/NewComponent.js`):
```javascript
import React from 'react';
import '../styles/NewComponent.css';

const NewComponent = ({ prop }) => {
  return <div className="new-component">{prop}</div>;
};

export default NewComponent;
```

**2. Create Styles** (`src/styles/NewComponent.css`):
```css
.new-component {
  padding: 1rem;
  background: white;
}
```

**3. Use in App**:
```javascript
import NewComponent from './components/NewComponent';

function App() {
  return <NewComponent prop="value" />;
}
```

### Using Context

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user && <p>Hello, {user.name}</p>}
    </div>
  );
};
```

### API Calls

```javascript
// Using axios with context
import axios from 'axios';

const fetchData = async () => {
  try {
    const res = await axios.get('/api/endpoint');
    setData(res.data);
  } catch (error) {
    setError(error.response?.data?.message);
  }
};
```

---

##  Testing Guidelines

### Backend Testing (Manual)

Use cURL or Postman:

```bash
# Test endpoint
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing (Manual)

1. Check console for errors (F12)
2. Verify API calls in Network tab
3. Test all user flows:
   - Register ? Login ? Add transaction ? View dashboard ? Logout
   - Test form validation
   - Test error handling

### Common Test Cases

**Authentication**:
- [ ] Register with valid data
- [ ] Register with duplicate email
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Access protected route without token

**Transactions**:
- [ ] Add valid transaction
- [ ] Add transaction with invalid amount
- [ ] Edit existing transaction
- [ ] Delete transaction
- [ ] View analytics after adding transactions

---

##  Debugging

### Backend Debugging

```javascript
// Add console.log for debugging
console.log('Data:', data);

// Use try-catch to catch errors
try {
  // code
} catch (error) {
  console.error('Error details:', error);
}

// View logs in PM2
pm2 logs
```

### Frontend Debugging

**Browser DevTools (F12)**:
- Console tab: Check for errors
- Network tab: Verify API calls
- Application tab: Check localStorage/cookies
- Elements tab: Inspect HTML structure

**React DevTools Extension**:
- Install from Chrome/Firefox store
- Inspect component props
- Check state changes

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Check backend CORS config, verify URL |
| 401 error | Token expired, need to login again |
| MongoDB connection | Verify IP whitelist, connection string |
| API 404 | Check endpoint path, verify routes registered |

---

##  Git Workflow

### Commit Messages

```
Format: [TYPE] Short description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code reorganization
- docs: Documentation
- style: Formatting changes
- chore: Dependency updates

Examples:
[feat] Add category filtering for transactions
[fix] Fix authentication token expiration issue
[docs] Update API documentation
```

### Branch Naming

```
feature/feature-name      # New features
bugfix/issue-description  # Bug fixes
docs/documentation-name   # Documentation
refactor/code-area        # Code refactoring
```

### Workflow Example

```bash
# Create feature branch
git checkout -b feature/add-export-csv

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "[feat] Add CSV export functionality"

# Push to remote
git push origin feature/add-export-csv

# Create Pull Request on GitHub
```

---

##  Performance Optimization

### Frontend

1. **Code Splitting**: Load components on demand
2. **Image Optimization**: Compress and resize images
3. **Memoization**: Use `React.memo()` for expensive components
4. **Lazy Loading**: Use `React.lazy()` and `Suspense`

```javascript
// Example
const Analytics = React.lazy(() => import('./Analytics'));

<Suspense fallback={<Loading />}>
  <Analytics />
</Suspense>
```

### Backend

1. **Database Indexes**: Add indexes on frequently queried fields
2. **Query Optimization**: Select only needed fields
3. **Caching**: Cache frequently accessed data
4. **Pagination**: Limit results for large datasets

```javascript
// Optimized query
const transactions = await Transaction.find({ userId })
  .select('amount type category date')
  .sort({ date: -1 })
  .limit(50);
```

---

##  Adding Dependencies

### Frontend

```bash
cd client
npm install package-name

# Uninstall
npm uninstall package-name

# Update
npm update package-name
```

### Backend

```bash
cd server
npm install package-name

# Production dependency
npm install package-name --save

# Dev dependency
npm install package-name --save-dev
```

### Checking Vulnerabilities

```bash
npm audit
npm audit fix
```

---

##  Security Best Practices

1. **Never commit `.env`**: Use `.env.example` instead
2. **Validate all inputs**: Server-side validation is mandatory
3. **Hash passwords**: Always use bcrypt
4. **Validate JWT tokens**: Check expiration and signature
5. **Use HTTPS**: In production only
6. **Sanitize output**: Prevent XSS attacks
7. **CORS correctly**: Only allow trusted origins

---

##  Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

---

## Common Development Tasks

### Resetting Database

```bash
# Delete all data (MongoDB)
# Go to MongoDB Atlas ? Collections ? Delete collection
```

### Clearing Frontend Cache

```bash
# Clear localStorage
localStorage.clear();

# Clear browser cache
# Dev Tools ? Application ? Clear storage
```

### Restarting Servers

```bash
# Backend
pm2 restart expense-tracker-api

# Frontend
npm start (restart process)
```

---

##  Learning Resources

- Learn React: [React Tutorial](https://react.dev/learn)
- Learn Express: [Express Guide](https://expressjs.com/en/starter/basic-routing.html)
- Learn MongoDB: [MongoDB University](https://university.mongodb.com/)

---

**Happy coding! **

