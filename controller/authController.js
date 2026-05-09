const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: { name: req.body.name },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    console.log("req body", req.body);
    const user = await User.findOne({
      where: { name: req.body.name },
    });

    console.log("USER FOUND:", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Account not approved by the admin yet",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
    );
    // res.json({message:"Login successful",token});
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { register, login };
