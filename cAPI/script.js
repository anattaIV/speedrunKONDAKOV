const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 9;
let currentPage = 1;

async function fetchPokemons(page) {
  const offset = (page - 1) * LIMIT;
  const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
  const data = await response.json();
  return data;
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function createPokemonCard(details) {
  const template = document.getElementById("pokemon-card-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".pokemon-name").textContent = details.name;
  clone.querySelector(".pokemon-image").src = details.sprites.front_default || "";
  clone.querySelector(".pokemon-image").alt = details.name;
  clone.querySelector(".pokemon-type").textContent =
    "Тип: " + (details.types[0]?.type.name || "Неизвестно");
  clone.querySelector(".pokemon-ability").textContent =
    "Способность: " + (details.abilities[0]?.ability.name || "Неизвестно");

  return clone;
}

async function renderPokemonCards(pokemons) {
  clearPokemonList();
  for (const p of pokemons) {
    const details = await fetchPokemonDetails(p.url);
    const card = createPokemonCard(details);
    document.getElementById("pokemon-list").appendChild(card);
  }
}

function clearPokemonList() {
  document.getElementById("pokemon-list").innerHTML = "";
}

function showError(message) {
  clearPokemonList();
  const div = document.createElement("p");
  div.style.color = "red";
  div.textContent = `Ошибка: ${message}`;
  document.getElementById("pokemon-list").appendChild(div);
}

function updatePagination(page, hasPrev, hasNext) {
  document.getElementById("page").textContent = `Страница ${page}`;
  document.getElementById("prev-btn").disabled = !hasPrev;
  document.getElementById("next-btn").disabled = !hasNext;
}

async function loadPage(page) {
  try {
    const data = await fetchPokemons(page);
    await renderPokemonCards(data.results);
    updatePagination(page, !!data.previous, !!data.next);
  } catch (err) {
    showError(err.message);
  }
}

async function handleSearch(query) {
  try {
    const response = await fetch(`${API_URL}?limit=100`);
    const data = await response.json();
    const filtered = data.results.filter(p => p.name.includes(query.toLowerCase()));

    if (!filtered.length) {
      clearPokemonList();
      document.getElementById("pokemon-list").innerHTML = "<p>Ничего не найдено!</p>";
      return;
    }

    await renderPokemonCards(filtered.slice(0, 9));
  } catch (err) {
    showError(err.message);
  }
}

function setupEventListeners() {
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage);
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentPage++;
    loadPage(currentPage);
  });

  document.getElementById("search-form").addEventListener("submit", e => {
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    if (!query) return loadPage(currentPage);
    handleSearch(query);
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    loadPage(currentPage);
  });
}

setupEventListeners();
loadPage(currentPage);
