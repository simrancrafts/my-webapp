// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const dataFile = path.join(__dirname, "data.json");
let todos = [];

// Load data from file on startup
if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, "utf8");
    todos = JSON.parse(data);
}

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// API to get all todos
app.get("/api/todos", (req, res) => {
    res.json(todos);
});

// API to add a todo
app.post("/api/todos", (req, res) => {
    const { text } = req.body;
    if (text && text.trim() !== "") {
        const newTodo = { 
            id: Date.now(), 
            text, 
            completed: false, 
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        todos.push(newTodo);
        fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
        res.json(newTodo);
    } else {
        res.status(400).json({ error: "Text is required" });
    }
});

// API to update a todo (for marking as completed)
app.put("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { completed } = req.body;

    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = completed;
        if (completed) {
            todo.completedAt = new Date().toISOString();
        } else {
            todo.completedAt = null;
        }
        fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
        res.json(todo);
    } else {
        res.status(404).json({ error: "Todo not found" });
    }
});

// API to delete a todo
app.delete("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
    res.json({ success: true });
});

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});