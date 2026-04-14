exports.register = async (req, res) => {
    res.status(200).json({
        message:"Okay",
    })
//   try {
//     const { email, password, terms } = req.body;
//     if (!terms) {
//       return res.status(400).json({
//         code: "TERMS_REQUIRED",
//         message: "Please accept terms & policy"
//       });
//     }
//     if (!email || !password || !validator.isEmail(email)) {
//       return res.status(400).json({
//         code: "INVALID_INPUT",
//         message: "Invalid email or password"
//       });
//     }
//     const passwordRegex =
//   /^(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         code: "WEAK_PASSWORD",
//         message:
//           "Password must contain at least 8 characters, including one uppercase letter and one special character"
//       });
//     }
//     const normalizedEmail = email.toLowerCase();
//     const existingUser = await User.findOne({ email: normalizedEmail });

//     if (existingUser && existingUser.isEmailVerified) {
//       return res.status(409).json({
//         code: "ACCOUNT_EXISTS",
//         message: "Account already exists"
//       });
//     }
//     const otp = generateOtp();
//     const otpHash = hashOtp(otp);
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = await User.findOneAndUpdate(
//       { email: normalizedEmail },
//       {
//         email: normalizedEmail,
//         password: hashedPassword,
//         emailOtpHash: otpHash,
//         emailOtpExpires: Date.now() + 5 * 60 * 1000, // 5 mins
//         isEmailVerified: false
//       },
//       { upsert: true, new: true }
//     );

//     // 5️⃣ Send OTP email
//     await sendEmail({
//       to: normalizedEmail,
//       subject: "Verify your email",
//       html: `
//     <h2>Email Verification</h2>
//     <p>Your verification code:</p>
//     <h1>${otp}</h1>
//     <p>This code expires in 5 minutes.</p>
//   `
//     });

//     const verifyToken = jwt.sign(
//       {
//         sub: user._id.toString(),
//         purpose: "EMAIL_VERIFY"
//       },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "10m" }
//     );

//     res.cookie("verify_token", verifyToken, getCookieOptions());
//     return res.status(201).json({
//       code: "EMAIL_OTP_SENT",
//       message: "OTP sent to your email"
//     });

//   } catch (error) {
//     console.error("Register error:", error.message);
//     return res.status(500).json({
//       code: "REGISTER_FAILED",
//       message: "Registration failed"
//     });
//   }

};

