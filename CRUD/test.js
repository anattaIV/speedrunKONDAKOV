const TODOS_URL = "http://localhost:3000/todos"; //Константа для работы с API. В будущем все запросы будут брать отсюда URL

const buttons = {
  btnGet: document.querySelector(".btn-get"), //Ссылки на кнопки в HTML
  btnPost: document.querySelector(".btn-post"),
  btnPut: document.querySelector(".btn-put"),
  btnDelete: document.querySelector(".btn-delete"),
};

// ===== GET: все задачи =====
async function getAllTodos() { //Асинх функция
  try { //Ловля ошибки
    const res = await fetch(TODOS_URL); //Запрос на сервер по URL выше
    console.log("Статус:", res.status); //Статус подключения
    const data = await res.json(); //Ждем ответ от сервера, парсим в json
    console.table(data); //Вывод в консоль массив задач
    return data; // возвращаем(уже выведенный массив), чтобы его можно было потом использовать
  } catch (err) {
    console.error(err);
  }
}

// ===== GET: только выполненные =====
async function getCompletedTodos() {
  try {
    const res = await fetch(`${TODOS_URL}?completed=true`); //Отправляем запрос на сервер с параметром completed=true. Т.е возвращает только выполненные задачи
    const data = await res.json(); //Ждем ответ от сервера, парсим в json
    console.table(data); //Вывод в консоль
  } catch (err) {
    console.error(err);
  }
}

// ===== POST: создать новую задачу =====
async function createTodo(todo) {
  try {
    const res = await fetch(TODOS_URL, { //Запрос на сервер
      method: "POST", //Метод пост
      headers: { "Content-Type": "application/json" }, //Тип данных json
      body: JSON.stringify(todo), //превращаем объект задачи в JSON
    });
    const data = await res.json(); //Получаем ответ, парсим в JSON
    console.log("Создано:", data.id, data); //Вывод в консоль ID созданной задачи и весь объект
  } catch (err) {
    console.error(err);
  }
}

// ===== PUT: обновление задачи =====
async function updateTodo() {
  try {
    const todos = await getAllTodos(); //Получаем все задачи
    if (!todos || todos.length === 0) { //Проверяем есть ли задачи
      console.warn("Нет задач для обновления!"); //Если нет
      return;
    }
    const todoToUpdate = todos[todos.length - 1]; //Берем последнюю задачу из списка
    const updated = { ...todoToUpdate, completed: !todoToUpdate.completed, title: todoToUpdate.title + " (обновлено)" }; //Берем поля из старой задачи, меняем статус completed на противоположный, добавляем к title (обновлено)

    const res = await fetch(`${TODOS_URL}/${todoToUpdate.id}`, { //PUT запрос на добавление
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated), //Отправляю обновку в JSON
    });
    const data = await res.json(); //Ждем ответа, парсим в JSON
    console.log("Обновлено:");
    console.table(data); //Вывод обновленной задачи в виде таблицы
  } catch (err) {
    console.error(err);
  }
}

// ===== DELETE: удалить последнюю задачу =====
async function deleteLastTodo() {
  try {
    const todos = await getAllTodos(); //Получаю все задачи
    if (!todos || todos.length === 0) { //Проверяю есть ли задачи
      console.warn("Нет задач для удаления!"); //Если нет
      return;
    }
    const lastTodo = todos[todos.length - 1]; //Берем последнюю задачу

    const res = await fetch(`${TODOS_URL}/${lastTodo.id}`, { method: "DELETE" }); //DEL запрос к серверу
    console.log(`Удалена задача ID=${lastTodo.id}, статус:`, res.status); //Вывод ID удал. соо 
  } catch (err) {
    console.error(err);
  }
}

// ===== Обработчики кнопок =====
buttons.btnGet.addEventListener("click", getAllTodos); //Слушатель на кнопки
buttons.btnPost.addEventListener("click", () => createTodo({ title: "Новая задача", completed: false })); //Стрелочная функция, чтобы передать title и completed в createTodo
buttons.btnPut.addEventListener("click", updateTodo);
buttons.btnDelete.addEventListener("click", deleteLastTodo);
