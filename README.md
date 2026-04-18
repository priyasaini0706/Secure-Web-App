# Secure Web App - E-Commerce Security Demo

## Project Overview

This project is a full-stack e-commerce web application developed as part of the Secure Web Development module at National College of Ireland.

The application demonstrates common web security vulnerabilities and their mitigation strategies aligned with the OWASP Top 10.

Two backend versions are implemented:

- 🔴 Vulnerable Version: Intentionally insecure implementation
- 🟢 Secure Version: Hardened implementation using security best practices

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (TypeScript) |
| Backend | Node.js + Express.js |
| Database | SQLite |
| Authentication | JWT + bcryptjs |
| Deployment | Netlify (Frontend) + Railway (Backend) |

---

## Security Features Implemented

| Vulnerability | Vulnerable Version | Secure Version |
|--------------|-------------------|----------------|
| SQL Injection | Raw string queries | Parameterized queries |
| Broken Authentication | Plain text + backdoor | bcrypt + OTP + lockout |
| Broken Access Control | No role checks | Role-based middleware |
| XSS | Unescaped output | XSS library sanitization |
| Session Management | Weak session config | HttpOnly + Secure + SameSite |
| Brute Force | No protection | Account lockout after 5 attempts |
| Security Misconfiguration | Generic errors | Safe error handling |

---

## Project Structure

```
Secure-Web-App/
│
├── backend/
│   ├── api/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Routes/
│   ├── db.js
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── context/
```

---

## Setup Instructions

### Backend Setup

```bash
git clone https://github.com/YOUR_USERNAME/Secure-Web-App.git
cd Secure-Web-App/backend
npm install
```

Create `.env` file:

```
PORT=8080
JWT_SECRET=securewebapp_super_secret_key_2024
```

Start server:

```bash
node server.js
```

Expected output:

```
SQLite connected successfully
Server running on 8080
```

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

### Test 1 - SQL Injection

**Vulnerable Login**

```
Email: ' OR 1=1 --
Password: anything
Result: Login success
```

**Secure Login**

```
Email: ' OR 1=1 --
Password: anything
Result: Invalid credentials
```

---

### Test 2 - Broken Authentication (Backdoor)

**Vulnerable Login**

```
Email: admin@hack.com
Password: anything
Result: Backdoor login success
```

**Secure Login**

```
Same credentials
Result: Invalid credentials
```

---

### Test 3 - Broken Access Control

Login as normal user:

**Use Vulnerable Login**
```
Email: vulnuser@test.com
Pass: 123456
```
Now access the below url:
```
http://localhost:8080/api/auth/vulnerable/admin/orders
```

Result: Orders visible (Vulnerable)

Login as normal user and access:

```
/admin
```

Result: Admin access required (Secure)

---

### Test 4 - Brute Force Protection

Secure login:
Enter wrong password 5 times.

Result: Account temporarily locked.

---

### Test 5 - Session Management

1. Login securely
2. Delete JWT cookie manually (F12 → Application → Cookies)
3. Refresh dashboard

Result: Access denied.

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

## Testing Tools Used

- Browser DevTools
- Postman
- SQLite DB Browser
- Manual security testing

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
