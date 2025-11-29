require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const transporter = require("../config/nodemailer");
const { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } = require("../config/emailTemplates");
const saltRounds = 10;


const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }

    try {
      const exsitingUser = await User.findOne({ email });
      if (exsitingUser) {
        return res.json({
          success: false,
          message: "User already Exist",
        });
      }
      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        name,
        email,
        password: hash,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // sending welcome email
      const mailOtpion = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Quantumania",
        text: `Welcome to Quantumania Website. Your account has been created with email id: ${email}`,
      };
      await transporter.sendMail(mailOtpion)

      return res.json({
        success: true,
      });
    } catch (error) {
        res.json({
          success: false,
          message: error.message
        });
    }

}

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.json({
            success: false,
            message: "Email and Passwor are required"
        })
    }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.json({
              success: false,
              message: "Invalid Email"
            });
        }
        const isMetch = await bcrypt.compare(password,user.password,);

        if(!isMetch){
            return res.json({
              success: false,
              message: "Invalid Password",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            success: true
        })

    } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({
            success: true,
            message: "Logout"
        })
    } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
    }
}

const sendVerifyOtp = async (req, res) => {
  try {
    const userID = req.userID;
    const user = await User.findById(userID)

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.verifyOtp = otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const mailOtpion = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your OTP is ${otp}. Verify your account using this OTP`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };
    await transporter.sendMail(mailOtpion)

    res.json({
      success: true,
      message: `Verification OTP Send on Email`,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

const verifyEmail = async (req, res) => {
  const userID = req.userID;
  const { otp } = req.body;

  if(!userID || !otp){
    return res.json({
      success: false,
      message: `Missing Details`,
    });
  }
  try {
    const user = await User.findById(userID)
    if(!user){
      res.json({
        success: false,
        message: `User not found`,
      });
    }

    if(user?.verifyOtp === "" || user.verifyOtp !== otp){
      return res.json({
        success: false,
        message: `Invalid OTP`,
      });
    }
    if(user.verifyOtpExpireAt < Date.now()){
      return res.json({
        success: false,
        message: `OTP Expired`,
      });
    }
    user.isAccountVerified = true;
    user.verifyOtp = ""
    user.verifyOtpExpireAt = 0
    await user?.save()

    return res.json({
      success: true,
      message: `Email Varification successfully`,
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }

}

const isAuthenticated = async (req, res) => {
  try {
    return res.json({success: true})
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

// ----------- send password reset otp
const sendResetOtp = async (req, res) => {
  const {email} = req.body

  if(!email){
    return res.json({success: false, message: "Email is required"})
  }
  try {
    const user = await User.findOne({email})

    if(!user){
      return res.json({
        success: false,
        message: "User not found"
      })
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOtpion = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOtpion)

    return res.json({
      success: true,
      message: `OTP send to your email`
    })

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// ------------ reset user password 
const resetPassword = async(req, res) => {
  const {email, otp, newPassword} = req.body

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: `Email, OTP, and new Password are required `,
    });
  }
  try {
    const user = await User.findOne({email})
    if(!user){
      return res.json({
        success: false,
        message: `User not found`,
      });
    }
    if(user.resetOtp === "" || user.resetOtp !== otp){
      return res.json({
        success: false,
        message: `Invalid OTP`,
      }); 
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.json({
        success: false,
        message: `OTP Expired`,
      }); 
    }

    const hash = await bcrypt.hash(newPassword, saltRounds);
    user.password = hash
    user.resetOtp = ""
    user.resetOtpExpireAt = 0
    await user.save()

    return res.json({
      success: true,
      message: `Password has been reset successfully`,
    });     

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

module.exports = {
  registerUser,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword
};