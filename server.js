const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let todos = []; // store tasks in memory

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
        const newTodo = { id: Date.now(), text };
        todos.push(newTodo);
        res.json(newTodo);
    } else {
        res.status(400).json({ error: "Text is required" });
    }
});

// API to delete a todo
app.delete("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.json({ success: true });
});

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
