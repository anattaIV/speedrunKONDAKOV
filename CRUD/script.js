const TODOS_URL = "http://localhost:3000/todos";

const buttons = {
  btnGet: document.querySelector(".btn-get"),
  btnPost: document.querySelector(".btn-post"),
  btnPut: document.querySelector(".btn-put"),
  btnDelete: document.querySelector(".btn-delete"),
};

async function getAllTodos() {
  try {
    const res = await fetch(TODOS_URL);
    console.log("Статус:", res.status);
    const data = await res.json();
    console.table(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getCompletedTodos() {
  try {
    const res = await fetch(`${TODOS_URL}?completed=true`);
    const data = await res.json();
    console.table(data);
  } catch (err) {
    console.error(err);
  }
}

async function createTodo(todo) {
  try {
    const res = await fetch(TODOS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    const data = await res.json();
    console.log("Создано:", data.id, data);
  } catch (err) {
    console.error(err);
  }
}

async function updateTodo() {
  try {
    const todos = await getAllTodos();
    if (!todos || todos.length === 0) {
      console.warn("Нет задач для обновления!");
      return;
    }
    const todoToUpdate = todos[todos.length - 1];
    const updated = { ...todoToUpdate, completed: !todoToUpdate.completed, title: todoToUpdate.title + " (обновлено)" };

    const res = await fetch(`${TODOS_URL}/${todoToUpdate.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    console.log("Обновлено:");
    console.table(data);
  } catch (err) {
    console.error(err);
  }
}

async function deleteLastTodo() {
  try {
    const todos = await getAllTodos();
    if (!todos || todos.length === 0) {
      console.warn("Нет задач для удаления!");
      return;
    }
    const lastTodo = todos[todos.length - 1];

    const res = await fetch(`${TODOS_URL}/${lastTodo.id}`, { method: "DELETE" });
    console.log(`Удалена задача ID=${lastTodo.id}, статус:`, res.status);
  } catch (err) {
    console.error(err);
  }
}

buttons.btnGet.addEventListener("click", getAllTodos);
buttons.btnPost.addEventListener("click", () => createTodo({ title: "Новая задача", completed: false }));
buttons.btnPut.addEventListener("click", updateTodo);
buttons.btnDelete.addEventListener("click", deleteLastTodo);
