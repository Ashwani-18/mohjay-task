require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});