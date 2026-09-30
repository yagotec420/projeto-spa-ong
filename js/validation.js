// Função matemática para validar se o CPF é real
function validarCPFReal(cpf) {
    // Remove qualquer ponto ou traço, deixando apenas números
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos ou se são números todos repetidos (ex: 111.111.111-11)
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador do CPF
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador do CPF
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;

    return true; // Se passar em todas as contas, o CPF é válido!
}

// NOVA FUNÇÃO: Faz o GET no localStorage, aplica o JSON.parse e joga nos inputs do formulário
function carregarDadosSalvos() {
    const dadosSalvosTexto = localStorage.getItem("apoiadorONG");

    // Se o navegador encontrar dados salvos no histórico desse computador, preenche as caixas
    if (dadosSalvosTexto) {
        const dadosDoador = JSON.parse(dadosSalvosTexto);

        const campoNome = document.getElementById("nome");
        const campoEmail = document.getElementById("email");
        const campoCpf = document.getElementById("cpf");

        if (campoNome) campoNome.value = dadosDoador.nome;
        if (campoEmail) campoEmail.value = dadosDoador.email;
        if (campoCpf) campoCpf.value = dadosDoador.cpf;
    }
}

// Função principal que gerencia o formulário
export function inicializarValidacao() {
    const formulario = document.getElementById("cadastro-form");
    if (!formulario) return;

    // CHAMADA DA NOVA FUNÇÃO: Tenta puxar o histórico assim que a tela abre!
    carregarDadosSalvos();

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Impede a página de recarregar no envio

        // Captura os elementos de input do seu HTML
        const campoNome = document.getElementById("nome");
        const campoEmail = document.getElementById("email");
        const campoCpf = document.getElementById("cpf");

        // Captura os elementos onde exibiremos as mensagens vermelhas
        const erroNome = document.getElementById("erro-nome");
        const erroEmail = document.getElementById("erro-email");
        const erroCpf = document.getElementById("erro-cpf");

        // Limpa todas as mensagens de erro antigas antes de validar novamente
        if (erroNome) erroNome.textContent = "";
        if (erroEmail) erroEmail.textContent = "";
        if (erroCpf) erroCpf.textContent = "";

        let formularioValido = true;
        let primeiroCampoComErro = null;

        // 1. Validação do Nome Completo (evita campos só com espaços vazios usando .trim())
        if (campoNome && campoNome.value.trim().length < 3) {
            if (erroNome) erroNome.textContent = "O campo nome precisa ser preenchido (mínimo 3 letras).";
            formularioValido = false;
            if (!primeiroCampoComErro) primeiroCampoComErro = campoNome;
        }

        // 2. Validação simples do formato do E-mail
        if (campoEmail && (!campoEmail.value.includes("@") || campoEmail.value.trim().length < 5)) {
            if (erroEmail) erroEmail.textContent = "O campo e-mail precisa ser preenchido corretamente.";
            formularioValido = false;
            if (!primeiroCampoComErro) primeiroCampoComErro = campoEmail;
        }

        // 3. Validação rigorosa do CPF Real
        if (campoCpf && !validarCPFReal(campoCpf.value)) {
            if (erroCpf) erroCpf.textContent = "O campo CPF digitado não é válido.";
            formularioValido = false;
            if (!primeiroCampoComErro) primeiroCampoComErro = campoCpf;
        }

        // Caso ocorra alguma falha, faz a página focar e subir para o primeiro erro
        if (!formularioValido) {
            if (primeiroCampoComErro) primeiroCampoComErro.focus();
            return; // Interrompe o envio aqui
        }

        // 4. Se tudo estiver correto, faz a persistência de dados no localStorage
        const dadosDoador = {
            nome: campoNome.value.trim(),
            email: campoEmail.value.trim(),
            cpf: campoCpf.value.replace(/\D/g, ''), // Salva apenas os números purificados
            dataInscricao: new Date().toLocaleDateString("pt-BR")
        };

        // Salva as informações de forma persistente no navegador
        localStorage.setItem("apoiadorONG", JSON.stringify(dadosDoador));

        // Alerta de sucesso para o utilizador
        alert("Cadastro realizado com sucesso! Seus dados foram guardados no localStorage.");
        
        // Removemos o formulario.reset() para manter os dados preenchidos na tela como histórico ativo!
    });
}
