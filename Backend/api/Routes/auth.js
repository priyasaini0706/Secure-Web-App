const express = require("express");
const router = express.Router();

const secure = require("../../Controller/secureController");
const vulnerable = require("../../Controller/vulnerableController");

// Secure routes
router.post("/secure/login", secure.login);
router.post("/secure/register", secure.register);

// Vulnerable routes
router.post("/vulnerable/login", vulnerable.login);
router.post("/vulnerable/register", vulnerable.register);

module.exports = router;

// force rebuild