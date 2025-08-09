async function fetchTodos() {
    const res = await fetch("/api/todos");
    const todos = await res.json();
    const list = document.getElementById("todo-list");
    list.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTodo(todo.id);
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

fetchTodos();
