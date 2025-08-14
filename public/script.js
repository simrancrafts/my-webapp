// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to calculate duration
function calculateDuration(start, end) {
    const diffInMilliseconds = new Date(end) - new Date(start);
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    if (minutes > 0) return `${minutes} minutes`;
    if (seconds > 0) return `${seconds} seconds`;
    return 'just now';
}

async function fetchTodos() {
    const res = await fetch("/api/todos");
    const todos = await res.json();
    const list = document.getElementById("todo-list");
    list.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        
        const content = document.createElement("div");
        content.style.flex = "1";
        content.style.textAlign = "left";

        const textSpan = document.createElement("span");
        textSpan.textContent = todo.text;
        
        const detailsSpan = document.createElement("p");
        detailsSpan.style.fontSize = "0.8em";
        detailsSpan.style.color = "#555";
        detailsSpan.style.margin = "0";
        
        let detailsText = `Created: ${formatDate(todo.createdAt)}`;
        
        if (todo.completed) {
            textSpan.classList.add("completed");
            detailsText += `<br>Completed: ${formatDate(todo.completedAt)}`;
            const duration = calculateDuration(todo.createdAt, todo.completedAt);
            detailsText += `<br>Time to complete: ${duration}`;
        }
        
        detailsSpan.innerHTML = detailsText;

        const actionsDiv = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleCompleted(todo.id, checkbox.checked);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTodo(todo.id);

        content.appendChild(textSpan);
        content.appendChild(detailsSpan);

        actionsDiv.appendChild(checkbox);
        actionsDiv.appendChild(delBtn);

        li.appendChild(content);
        li.appendChild(actionsDiv);
        list.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value;
    if (!text) return;
    await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    input.value = "";
    fetchTodos();
}

async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
}

async function toggleCompleted(id, isCompleted) {
    await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isCompleted })
    });
    fetchTodos();
}

fetchTodos();