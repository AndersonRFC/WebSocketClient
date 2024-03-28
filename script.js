var button = document.getElementById("btn");
var buttonFile = document.getElementById("btn-file");

var input = document.getElementById("input-text");
var inputFile = document.getElementById("input-file");

var listaMensagens = document.getElementById("lista-mensagens");

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

    var message = JSON.parse(event.data);

    console.log("mensagem recebida: " + event);

    if(message.Type === "text")
    {
        var itemLista = document.createElement("li");
        itemLista.textContent = message.Name + ": " + message.Data;
        listaMensagens.appendChild(itemLista);
    }
    else if (message.Type === "file")
    {
        var linkDownload = document.createElement("a");
        linkDownload.textContent = "Baixar arquivo: " + message.Data.split("/")[1] + "  -  ";
        linkDownload.href = message.Data;
        linkDownload.download = message.Name;
        listaMensagens.appendChild(linkDownload);

        var linkVisualizacao = document.createElement("a");
        linkVisualizacao.textContent = "Ver arquivo: " + message.Data.split("/")[1];
        linkVisualizacao.href = message.Data;
        linkVisualizacao.target = "_blank";
        listaMensagens.appendChild(linkVisualizacao);
    }

};


// --

function iniciarConexão() {
    const socket = new WebSocket("ws://localhost:5072/ws");

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
