import { inicializarValidacao } from "./validation.js";

// 1. Mapeamento das páginas secundárias (o início "/" deixamos vazio pois ele já está no index)
const rotas = {
    "/projetos": "/html/projetos.html",
    "/cadastro": "/html/cadastro.html"
};

// Guardamos o conteúdo original do seu início na memória assim que o site abre
const conteudoInicialDoIndex = document.getElementById("app") ? document.getElementById("app").innerHTML : "";

export async function processarRoteamento() {
    let caminho = window.location.hash.replace("#", "") || "/";
    const container = document.getElementById("app");

    if (!container) return;

    // SE FOR O INÍCIO: Devolvemos o seu HTML original que estava guardado na memória!
    if (caminho === "/") {
        container.innerHTML = conteudoInicialDoIndex;
        return;
    }

    // Para as outras páginas (projetos e cadastro), busca o arquivo correspondente
    const destinoHtml = rotas[caminho];
    if (!destinoHtml) {
        container.innerHTML = "<h1>Página não encontrada</h1>";
        return;
    }

    try {
        const resposta = await fetch(destinoHtml);
        if (!resposta.ok) throw new Error();
        const htmlTexto = await resposta.text();
        
        container.innerHTML = htmlTexto;

        // SE A PÁGINA FOR O CADASTRO: Ativa as rotinas de verificação e escutadores!
        if (caminho === "/cadastro") {
            inicializarValidacao();
        }

    } catch {
        container.innerHTML = "<h1>Página não encontrada</h1>";
    }
}

window.addEventListener("hashchange", processarRoteamento);
