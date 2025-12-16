const API_URL = "https://pokeapi.co/api/v2/pokemon"; //URL API к которому буду обращаться
const LIMIT = 9; //Максимальное кол-во покемонов на странице
let currentPage = 1; //Стартовая страница

//API
async function fetchPokemons(page) { //Функция получающая страницу и загружающая на них покемонов
  const offset = (page - 1) * LIMIT; //Проверяю, с какого покемона надо начинать загрузку
  const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`); //GET запрос на сервер, ждем ответ, использует limit и offset для плагинации
  const data = await response.json(); //Жду ответа от сервера
  return data;
}

async function fetchPokemonDetails(url) { //Функция принимающая URl покемона
  const response = await fetch(url); //Отправляем запрос по конкретному URL
  const data = await response.json(); //Жду ответа сервера
  return data; //Возвращается обхект с полной информацией о покемоне(id, type и т.д)
}

//UI
function createPokemonCard(details) { //Функция создает HTML карточку покемона
  const template = document.getElementById("pokemon-card-template"); //Шаблон для карточки
  const clone = template.content.cloneNode(true); //Клонируем шаблон, чтобы создать новый элемент

  clone.querySelector(".pokemon-name").textContent = details.name; //Заполняем данные(из API вставляем в HTML)
  clone.querySelector(".pokemon-image").src = details.sprites.front_default || "";
  clone.querySelector(".pokemon-image").alt = details.name;
  clone.querySelector(".pokemon-type").textContent =
    "Тип: " + (details.types[0]?.type.name || "Неизвестно"); //1 тип покемона, если нет: Неизвестно
  clone.querySelector(".pokemon-ability").textContent =
    "Способность: " + (details.abilities[0]?.ability.name || "Неизвестно"); //Показываем 1 способность, если нет: Неизвестно

  return clone; //Возвращаем готовую карточку
}

async function renderPokemonCards(pokemons) { //Список покемонов на странице
  clearPokemonList(); //Функция очищающая предыдущие карточки
  for (const p of pokemons) { //Проходим по каждому покемону из массива
    const details = await fetchPokemonDetails(p.url); //Асинх. запрашиваем данные из API
    const card = createPokemonCard(details); //HTML карточка с полученными данными
    document.getElementById("pokemon-list").appendChild(card); //Добавляем карточку в div контейнер на странице
  }
}

function clearPokemonList() { //Очищаем список покемонов
  document.getElementById("pokemon-list").innerHTML = "";
}

//Плагинация
function showError(message) { //Показывает сообщение о ошибке
  clearPokemonList(); //Очищаем покемонов
  const div = document.createElement("p"); //Новым <p> элемент для соо. 
  div.style.color = "red"; //Текст в красный
  div.textContent = `Ошибка: ${message}`; //Текст ошибки
  document.getElementById("pokemon-list").appendChild(div); //Добавляю в контейнер div
}

function updatePagination(page, hasPrev, hasNext) { //Функция, обновляющая номер страницы и состояние кнопок
  document.getElementById("page").textContent = `Страница ${page}`; //Текущая страница
  document.getElementById("prev-btn").disabled = !hasPrev; //Если нет предыдущей страницы - кнопки назад нет.
  document.getElementById("next-btn").disabled = !hasNext; //Если следующей страницы нет - кнопки вперед нет.
}

async function loadPage(page) { //Загрузка страницы
  try {
    const data = await fetchPokemons(page); //Получаем список покемонов с API для текущей страницы
    await renderPokemonCards(data.results); //Создаем карточку и вставляем результат
    updatePagination(page, !!data.previous, !!data.next); //Обновляем кнопки и страницу
  } catch (err) {
    showError(err.message);
  }
}

//Поиск
async function handleSearch(query) { //Асинх функция для поиска покемонов
  try {
    const response = await fetch(`${API_URL}?limit=100`); //Запрашиваем первых 100 покемонов с API
    const data = await response.json(); //Ждем ответ
    const filtered = data.results.filter(p => p.name.includes(query.toLowerCase())); //Фильтруем покемонов по введенному запросу

    if (!filtered.length) { //Если ничего не найдено - показываем соо
      clearPokemonList();
      document.getElementById("pokemon-list").innerHTML = "<p>Ничего не найдено!</p>";
      return;
    }

    await renderPokemonCards(filtered.slice(0, 9)); //Показываем первые 9 карточек с результатом поиска
  } catch (err) {
    showError(err.message);
  }
}

//События
function setupEventListeners() {
  document.getElementById("prev-btn").addEventListener("click", () => { //Уменьшаем страницу и перезагружаем
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage);
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => { //Увеличиваем страницу и перезагружаем
    currentPage++;
    loadPage(currentPage);
  });

  document.getElementById("search-form").addEventListener("submit", e => { //При Сабмите формы поиска отменяем перезагрузку страницы, получаем запрос, вызываем поиск
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    if (!query) return loadPage(currentPage);
    handleSearch(query);
  });

  document.getElementById("reset-btn").addEventListener("click", () => { //Кнопка сброса, очищаем поле ввода, загружаем страницу
    document.getElementById("search-input").value = "";
    loadPage(currentPage);
  });
}

setupEventListeners();
loadPage(currentPage);
