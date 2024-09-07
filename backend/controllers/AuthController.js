import User from "../models/User";
import admin from "firebase-admin";
export const Register = async (req, res) => {
  try {
    const { name, username, email, password, gender, dob } = req.body;
    if (!name || !username || !email || !password || !dob) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const label = gender === "male" ? "boy" : "girl";
    const profilePic = `https://avatar.iran.liara.run/public/${label}?username=${name.replace(
      /\s+/g,
      ""
    )}`;
    const formattedGender =
      gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

    const user = new User({
      name,
      username,
      email,
      password,
      gender: formattedGender,
      dob,
      profilePic,
      provider: "local",
    });
    const savedUser = await user.save();
    res.status(201).json({
      message: "User created successfully.",
      user: { ...savedUser._doc, password: undefined },
    });
  } catch (err) {
    console.error("Register Auth Controller Error", err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // check either username or email
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or email." });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }
    const token = await user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Secure flag based on environment
    });
    res.header("Authorization", `Bearer ${token}`);
    res.json({
      message: "Login successful.",
      token,
      user: user.getProfile(),
    });
  } catch (err) {
    console.error("Login Auth Controller Error", err);
    return res.status(500).json({ message: err.message });
  }
};

export const Google = async (req, res) => {
  try {
    const { id } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(id);
    const { uid, name, email, picture } = decodedToken;
    const user = await User.findOne({ $or: [{ email }, { uid }] });

    if (user) {
      const token = await user.generateToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Secure flag based on environment
      });
      res.header("Authorization", `Bearer ${token}`);
      res.json({
        message: "Google Login successful.",
        token,
        user: user.getProfile(),
      });
    }
    const token = user.generateToken();

    const newUser = new User({
      name,
      email,
      uid,
      profilePic: picture,
      provider: "google",
      password: token,
    });
    await newUser.save();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Secure flag based on environment
    });
    res.header("Authorization", `Bearer ${token}`);
    res.json({
      message: "Google Login successful.",
      token,
      user: newUser.getProfile(),
    });
  } catch (err) {
    console.error("Google Auth Controller Error", err);
    return res.status(500).json({ message: err.message });
  }
};
export const Github = async (req, res) => {
    try {
      const { id } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(id);
      const { uid, name, email, picture } = decodedToken;
      const user = await User.findOne({ $or: [{ email }, { uid }] });
  
      if (user) {
        const token = await user.generateToken();
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production", // Secure flag based on environment
        });
        res.header("Authorization", `Bearer ${token}`);
        res.json({
          message: "Github Login successful.",
          token,
          user: user.getProfile(),
        });
      }
      const token = user.generateToken();
  
      const newUser = new User({
        name,
        email,
        uid,
        profilePic: picture,
        provider: "github",
        password: token,
      });
      await newUser.save();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Secure flag based on environment
      });
      res.header("Authorization", `Bearer ${token}`);
      res.json({
        message: "Github Login successful.",
        token,
        user: newUser.getProfile(),
      });
    } catch (err) {
      console.error("Github Auth Controller Error", err);
      return res.status(500).json({ message: err.message });
    }
  };
  
