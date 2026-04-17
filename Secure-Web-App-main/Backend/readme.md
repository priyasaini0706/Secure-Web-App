# Secure vs Vulnerable E-commerce Controller

This project shows two versions of a backend controller:
1. Vulnerable version (contains security issues)
2. Secure version (fixed with best practices)

The purpose is to understand common security problems and how to fix them.

---
# Technology Used
* Nodejs 
* Express js
* MYSQL
* Railway


# Vulnerable Controller

This version contains multiple security issues.

## 1. SQL Injection

Example:
```js
const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
````

Problem:
User input is directly inserted into the SQL query.

Impact:
An attacker can manipulate the query and log in without valid credentials.

---

## 2. Broken Authentication

Issues:

* Passwords are stored in plain text
* No hashing
* No MFA
* Backdoor login present

Example:

```js
if (email === "admin@hack.com") {
    req.session.user = { id: 1, role: "admin", email };
}
```

Impact:
Anyone can log in as admin without password.

---

## 3. Broken Access Control

Example:

```js
exports.getAdminOrders = async (req, res) => {
    const orders = await db.query("SELECT * FROM orders");
};
```

Problem:
No role check.

Impact:
Any user can access admin data.

---

## 4. Cross-Site Scripting (XSS)

Example:

```js
html += `<h3>${p.name}</h3>`;
```

Problem:
User input is rendered without sanitization.

Impact:
Malicious scripts can execute in the browser.

---

## 5. Session Management Issues

Example:

```js
req.session.user = result[0];
```

Problems:

* No secure cookie settings
* No expiration
* No validation

---

## 6. Security Misconfiguration

Problems:

* No input validation
* No proper error handling
* No security headers

---

# Secure Controller

This version fixes the above issues.

## 1. SQL Injection Fix

```js
await db.query(
    "SELECT * FROM users WHERE email = ?",
    [safeEmail]
);
```

Fix:
Parameterized queries prevent injection.

---

## 2. Authentication Fix

* Password hashing using bcrypt
* MFA added
* Account lockout after multiple failed attempts

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 3. Access Control Fix

```js
if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
}
```

Fix:
Only admin users can access protected routes.

---

## 4. XSS Fix

```js
name = xss(name);
description = xss(description);
```

Fix:
User input is sanitized before use.

---

## 5. Session Security Fix

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000
});
```

Fix:

* HttpOnly cookies
* Secure flag
* Session expiry

---

## 6. CSRF Protection

CSRF tokens are used to protect against unauthorized requests.

---

## 7. Security Misconfiguration Fix

* Proper error handling
* No sensitive data exposure
* Input validation added

---

# Summary

The vulnerable version shows how security issues can occur due to poor practices.

The secure version uses:

* Parameterized queries
* Password hashing
* Input sanitization
* Proper authentication and authorization
* Secure session handling

These improvements make the application safer and more reliable.
