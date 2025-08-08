// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder
app.use(express.static("public"));

// Default route
app.get("/", (req, res) => {
  res.send("Hello from my web app!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
