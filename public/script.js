async function fetchTodos() {
    const res = await fetch("/api/todos");
    const todos = await res.json();
    const list = document.getElementById("todo-list");
    list.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        
        const span = document.createElement("span");
        span.textContent = todo.text;
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleCompleted(todo.id, checkbox.checked);

        if (todo.completed) {
            span.classList.add("completed");
        }

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTodo(todo.id);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
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