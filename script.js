var button = document.getElementById("btn");
var input = document.getElementById("input-text");

console.log("ola!");

console.log("tentando estabelecer conexão...");

button.addEventListener("click", () => {
  enviarTexto(input.value);
});

// --

const socket = iniciarConexão();

// --

socket.onmessage = function(event) {
    console.log('Mensagem do servidor:', event.data);
};

// --

function iniciarConexão() {
  const socket = new WebSocket("ws://localhost:5200/ws");

  socket.onopen = (event) => {
    console.log("Conexão estabelecida");
  };

  return socket;
}

function enviarTexto(value) {
  socket.send(value);
  console.log("mensagem enviada: ", value);
}
