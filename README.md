# Secure Web App - E-Commerce Security Demo

## Project Overview

This project is a full-stack e-commerce web application developed as part of the 
Secure Web Development module at National College of Ireland. 

The application demonstrates common web security vulnerabilities and their fixes, 
aligned with the OWASP Top 10. It includes two versions of the backend:

- 🔴 **Vulnerable Version:** Intentionally insecure implementation
- 🟢 **Secure Version:** Hardened implementation with security best practices

---

## 🔗 Links

- **Frontend (Netlify):** https://securewebapp.netlify.app
- **Backend (Railway):** https://your-railway-url.up.railway.app

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (TypeScript) |
| Backend | Node.js + Express.js |
| Database | SQLite |
| Auth | JWT + bcryptjs |
| Deployment | Netlify + Railway |

---

## Security Features Implemented

| Vulnerability | Vulnerable Version | Secure Version |
|--------------|-------------------|----------------|
| SQL Injection | Raw string queries | Parameterized queries |
| Broken Authentication | Plain text + backdoor | bcrypt + OTP + lockout |
| Broken Access Control | No role checks | Role-based middleware |
| XSS | Unescaped output | xss library sanitization |
| Session Management | Weak session config | HttpOnly + Secure + SameSite |
| Brute Force | No protection | Account lockout after 5 attempts |
| Security Misconfiguration | Generic error handling | Safe error messages + secure config |

---

## Project Structure

```
Secure-Web-App/
│
├── backend/
│ ├── api/
│ │ ├── Controllers/
│ │ │ ├── secureController.js
│ │ │ ├── vulnerableController.js
│ │ │ ├── product/
│ │ │ │ ├── secureProductController.js
│ │ │ │ └── vulnerableProductController.js
│ │ │ └── user/
│ │ │ ├── secureUserController.js
│ │ │ └── vulnerableUserController.js
│ │ ├── Middleware/
│ │ │ ├── authMiddleware.js
│ │ │ └── roleMiddleware.js
│ │ └── Routes/
│ │ ├── auth.js
│ │ ├── product.js
│ │ ├── user.js
│ │ └── order.js
│ ├── db.js
│ ├── app.js
│ ├── server.js
│ └── .env
│
└── frontend/
├── src/
│ ├── pages/
│ │ ├── Login.tsx
│ │ ├── SignUp.tsx
│ │ ├── Dashboard.tsx
│ │ ├── AdminDashboard.tsx
│ │ ├── Product.tsx
│ │ ├── ProductDetail.tsx
│ │ ├── Cart.tsx
│ │ └── Orders.tsx
│ ├── components/
│ │ ├── Hero.tsx
│ │ ├── SelectedProduct.tsx
│ │ └── CallToAction.tsx
│ └── context/
│ └── CartContext.tsx
└── public/
```

---

## Setup and Installation

### Prerequisites

Make sure you have installed:

- Node.js (v18 or above)
- npm
- Git

---

### Backend Setup

```bash
git clone https://github.com/YOUR_USERNAME/Secure-Web-App.git
cd Secure-Web-App/backend
npm install
```
#### Create .env file
```
PORT=8080
JWT_SECRET=securewebapp_super_secret_key_2024
```

#### Start Server
```bash
node server.js
```

Expected Output:

- SQLite connected successfully
- Server running on 8080

---

### Frontend Setup

```bash
cd Secure-Web-App/frontend
npm install
npm start
```

Open browser:

```
http://localhost:3000
```
Expected Output:

- Compiled successfully!
- Local: http://localhost:3000

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | 123456 |
| User | user@test.com | 123456 |

Register both accounts using **Secure Register** before testing.

---
## Application Features

### User Features
- User registration and login
- Product browsing
- Product details page
- Add to cart
- Place orders
- View order history

### Admin Features
- Admin dashboard
- View all orders
- Product management (CRUD)
- Role-based access control

---

## Security Testing Guide

### Test 1. SQL Injection (OWASP A03)

| | Vulnerable | Secure |
|-|-----------|--------|
| Implementation | Raw string concatenation | Parameterized queries |
| Risk | Authentication bypass | Input treated as data only |

**Test:**
```
Email: ' OR 1=1 --
Password: anything
```
- 🔴 Vulnerable result: `Login success`
- 🟢 Secure result: `Invalid credentials`

**Conclusion:** Parameterized queries completely prevent SQL injection by separating user input from query logic.

---

### Test 2. Broken Authentication (OWASP A07)

| | Vulnerable | Secure |
|-|-----------|--------|
| Passwords | Plain text storage | bcrypt hashing (salt: 10) |
| Backdoor | Hardcoded `admin@hack.com` | Removed entirely |
| MFA | None | OTP verification step |

**Test - Backdoor:**
```
Email: admin@hack.com
Password: anything
```
- 🔴 Vulnerable result: `Backdoor login success`
- 🟢 Secure result: `Invalid credentials`

**Conclusion:** Removing hardcoded credentials and implementing bcrypt hashing eliminates credential-based authentication bypass.

---

### Test 3. Broken Access Control (OWASP A01)

| | Vulnerable | Secure |
|-|-----------|--------|
| Role check | None | JWT + role middleware |
| Admin route | Open to all users | Admin only |

**Test:**
- Login as `user@test.com`
- Visit: `http://localhost:8080/api/auth/vulnerable/admin/orders`

- 🔴 Vulnerable result: All orders returned with no role verification
- 🟢 Secure result: `403 Admin access required`

**Conclusion:** Centralized middleware enforces role-based authorization consistently across all protected routes without duplicating logic.

---

### Test 4. Brute Force Protection (OWASP A07)

| | Vulnerable | Secure |
|-|-----------|--------|
| Login attempts | Unlimited | Max 5 attempts |
| Lockout | None | 15-minute lockout |

**Test:**
- Enter wrong password 5 times on Secure login

- 🔴 Vulnerable result: No lockout enforced
- 🟢 Secure result: `Account temporarily locked`

**Conclusion:** Account lockout after repeated failures significantly reduces the risk of brute force credential attacks.

---

### Test 5. XSS — Cross-Site Scripting (OWASP A03)

| | Vulnerable | Secure |
|-|-----------|--------|
| Input handling | Rendered without sanitization | Sanitized using `xss` library |
| Output | Raw HTML executed | Escaped before display |

**Test:**
```
Product name: <script>alert('XSS')</script>
```
- 🔴 Vulnerable result: Script executes in browser
- 🟢 Secure result: Input treated as plain text

**Conclusion:** Input sanitization using the `xss` library prevents malicious scripts from being stored or executed in the browser.

---

### Test 6. Session Management (OWASP A02)

| | Vulnerable | Secure |
|-|-----------|--------|
| Cookie flags | No HttpOnly, No Secure | HttpOnly + Secure + SameSite |
| Session expiry | None | 1-hour expiration |
| Logout | No cookie clearance | Server-side cookie clearance |

**Test:**
- Login securely
- Open DevTools → Application → Cookies
- Check `token` cookie properties

- 🔴 Vulnerable result: Cookie accessible via JavaScript, no expiry
- 🟢 Secure result: HttpOnly flag prevents JS access, expires in 1 hour

**Conclusion:** Secure cookie configuration prevents session hijacking and ensures proper session lifecycle management.

---

### Test 7. Security Misconfiguration (OWASP A05)

| | Vulnerable | Secure |
|-|-----------|--------|
| Error messages | Raw database errors exposed | Generic safe messages |
| Secrets | Hardcoded in code | Stored in `.env` |
| CORS | Open to all | Restricted to allowed origins |

**Test:**
- Trigger an error in vulnerable version

- 🔴 Vulnerable result: `SQLITE_CONSTRAINT: UNIQUE constraint failed`
- 🟢 Secure result: `Something went wrong`

**Conclusion:** Proper error handling and environment variable usage prevent sensitive internal information from being exposed to attackers.

---

## Security Improvements Summary

1. Parameterized queries prevent SQL Injection
2. bcrypt hashing secures passwords
3. OTP & account lockout prevent brute force attacks
4. JWT authentication enforces session security
5. Role-based middleware prevents privilege escalation
6. Input sanitization prevents XSS
7. Proper error handling prevents information leakage

---

## Testing Tools

- Browser DevTools (cookie inspection, network analysis)
- Postman (API endpoint testing)
- Manual penetration testing
- Static code review (SAST)

---

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
- XSS: https://www.npmjs.com/package/xss

---

## Author

**Priya Saini** 
MSc in Cybersecurity  
National College of Ireland  
Module: Secure Web Development  
Academic Year: 2026/2027

---

## License

This project is for academic purposes only.
