const express = require("express");
const authRoutes = require("./routes/authRoutes")
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");


connectDB();
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello world")
});

app.use("/api/v1/auth",authRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port 3000");
})