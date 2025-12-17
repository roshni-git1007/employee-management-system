const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const EMPLOYEE_FILE = "./data/employees.json";

const app = express();
const PORT = 3000;

function readEmployees() {
    const data = fs.readFileSync(EMPLOYEE_FILE, "utf-8");
    return JSON.parse(data);
}

function writeEmployees(employees) {
    fs.writeFileSync(
        EMPLOYEE_FILE,
        JSON.stringify(employees, null, 2)
    );
}

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

// Show login page (SSR)
app.get("/login", (req, res) => {
    res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Simple check (we’ll improve later)
    if (email && password) {
        // Set cookie
        res.cookie("userEmail", email, {
            httpOnly: true
        });
        return res.redirect("/dashboard");
    }
    res.redirect("/login");
});

app.get("/dashboard", (req, res) => {
    const userEmail = req.cookies.userEmail;

    if (!userEmail) {
        return res.redirect("/login");
    }

    const employees = readEmployees();

    res.render("dashboard", {
        email: userEmail,
        employees
    });
});

// Show add employee page
app.get("/addEmp", (req, res) => {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) return res.redirect("/login");

    res.render("addEmployee");
});

// Handle add employee form
app.post("/addEmp", (req, res) => {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) return res.redirect("/login");

    const { name, department } = req.body;
    const employees = readEmployees();

    employees.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        department
    });
    writeEmployees(employees);

    res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
    res.clearCookie("userEmail");
    res.redirect("/login");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});