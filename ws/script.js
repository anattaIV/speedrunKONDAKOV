class Chat {
  constructor(url = "ws://localhost:8080") {
    this.url = url;
    this.socket = null;
    this.messagesList = document.getElementById("messages");
    this.form = document.querySelector("form");
    this.userInput = document.getElementById("userInput");
    this.messageInput = document.getElementById("messageInput");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => this.addMessage("✅ Подключено к чату");

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.addMessage(`${data.user}: ${data.message}`);
      } catch {
        console.error("Ошибка парсинга");
      }
    };

    this.socket.onclose = () => this.addMessage("🔒 Соединение закрыто");
    this.socket.onerror = () => this.addMessage("❌ Ошибка соединения");
  }

  sendMessage() {
    const user = this.userInput.value.trim() || "Гость";
    const message = this.messageInput.value.trim();
    if (!message) return;

    const data = { user, message };
    this.socket.send(JSON.stringify(data));
    this.messageInput.value = "";
  }

  addMessage(text) {
    const li = document.createElement("li");
    li.textContent = text;
    this.messagesList.appendChild(li);
  }
}

new Chat();
