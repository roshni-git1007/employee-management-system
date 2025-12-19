const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const EMPLOYEE_FILE = "./data/employees.json";
const authMiddleware = require("./middleware/authMiddleware")

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

app.get("/dashboard", authMiddleware, (req, res) => {
    const employees = readEmployees();

    res.render("dashboard", {
        email: req.userEmail,
        employees
    });
});

// Show add employee page
app.get("/addEmp", authMiddleware, (req, res) => {
    res.render("addEmp");
});

// Handle add employee form
app.post("/addEmp", authMiddleware, (req, res) => {
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

// Show edit employee page
app.get("/edit-employee/:id", authMiddleware, (req, res) => {
    const employees = readEmployees();
    const employee = employees.find(
        emp => emp.id == req.params.id
    );

    if (!employee) {
        return res.redirect("/dashboard");
    }

    res.render("editEmp", { employee });
});

// Handle employee update
app.post("/edit-employee/:id", authMiddleware, (req, res) => {
    const { name, department } = req.body;
    const employees = readEmployees();

    const updatedEmployees = employees.map(emp => {
        if (emp.id == req.params.id) {
            return { ...emp, name, department };
        }
        return emp;
    });

    writeEmployees(updatedEmployees);
    res.redirect("/dashboard");
});

app.post("/delete-employee/:id", authMiddleware, (req, res) => {

    const employees = readEmployees();

    const filteredEmployees = employees.filter(
        emp => emp.id != req.params.id
    );

    writeEmployees(filteredEmployees);
    res.redirect("/dashboard");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});