const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Temporary route (to test EJS)
app.get("/", (req, res) => {
  res.render("home", {
    title: "Employee Management System",
    username: "Admin"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});