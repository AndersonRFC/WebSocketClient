var button = document.getElementById("btn");
var buttonFile = document.getElementById("btn-file");

var input = document.getElementById("input-text");
var inputFile = document.getElementById("input-file");

console.log("ola!");

console.log("tentando estabelecer conexão...");

button.addEventListener("click", () => {
    enviarTexto(input.value);
});

input.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        enviarTexto(input.value);
    }
});

buttonFile.addEventListener("click", () => {
    const file = inputFile.files[0];
    if (file) {
        enviarArquivo(file);
    } else {
        console.log("Nenhum arquivo selecionado.");
    }
});

// --

const socket = iniciarConexão();

// --

socket.onmessage = function (event) {
    console.log("Mensagem do servidor:", event.data);
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
    const message = {
        type: "text",
        name: "Você",
        data: value,
    };

    const mensagemAEnviar = JSON.stringify(message);

    socket.send(mensagemAEnviar);
    console.log("mensagem enviada: ", mensagemAEnviar);
    input.value = "";
}

function enviarArquivo(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = event.target.result.split(",")[1];

        const message = {
            type: "file",
            name: file.name,
            data: data,
        };

        const mensagemAEnviar = JSON.stringify(message);

        socket.send(mensagemAEnviar);

        console.log("Arquivo enviado: ", file.name);
    };

    reader.readAsDataURL(file);
}

/*

*/
