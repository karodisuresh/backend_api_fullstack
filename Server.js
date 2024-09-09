// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authRouter = require("./routes/auth");
const tasksRouter = require("./routes/task");

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// server.js or app.js (Your main server file)

app.post("/api/auth/google-login", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        559898516999 -
        hcria2b5ossivgmq1454laak1bnlvnhn.apps.googleusercontent.com,
    });

    const payload = ticket.getPayload();
    const userId = payload.sub; // Google user ID

    // Find or create the user in your database and generate a JWT token
    const user = await User.findOne({ googleId: userId });
    if (!user) {
      // Create a new user if not found
      // ... user creation logic
    }

    // Generate a JWT token and send it to the frontend
    const token = generateToken(user._id); // Your JWT generation function

    res.json({ token });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Google login failed", error: error.message });
  }
});

// Add your other endpoints and server initialization logic

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
