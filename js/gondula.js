let gondulas = [];

// Carrega o JSON assim que a página abre
fetch("gondula.json")
  .then((response) => response.json())
  .then((json) => {
    // Suporta tanto array direto quanto objeto com propriedade (caso você mude depois)
    if (Array.isArray(json)) {
      gondulas = json;
    } else if (json && Array.isArray(json.gondulaFuturo)) {
      gondulas = json.gondulaFuturo;
    } else if (json && Array.isArray(json.gondolaFuturo)) {
      gondulas = json.gondolaFuturo;
    } else {
      gondulas = [];
    }

    console.log("JSON Gôndola carregado:", gondulas.length, "registros");
  })
  .catch((err) => {
    console.error("Erro ao carregar gondula.json:", err);
  });

function buscarCNPJ() {
  const input = document.getElementById("cnpjInput");
  const container = document.getElementById("resultadoGondula");

  const cnpj = (input.value || "").trim();
  container.innerHTML = "";

  // Se ainda não carregou (ou deu erro)
  if (!gondulas || gondulas.length === 0) {
    container.innerHTML = `<div class="gondula_msg">Aguarde... carregando os dados da Gôndola do Futuro.</div>`;
    return;
  }

  // Validação: exatamente 14 dígitos numéricos
  if (!/^\d{14}$/.test(cnpj)) {
    container.innerHTML = `<div class="gondula_msg">Digite o CNPJ.</div>`;
    return;
  }

  // Busca exata no JSON
  const achou = gondulas.find((item) => String(item.CNPJ).trim() === cnpj);

  if (!achou) {
    container.innerHTML = `<div class="gondula_msg">Nenhuma loja encontrada para o CNPJ informado.</div>`;
    return;
  }

  // Render
  container.innerHTML = `
    <div class="gondula_card">
      <div class="gondula_card_title">${achou.Loja ? achou.Loja : "Loja encontrada"}</div>
      <div class="gondula_card_cnpj"><strong>CNPJ:</strong> ${achou.CNPJ}</div>

      <div class="gondula_imagem">
        <img src="${achou.imagem}" alt="Imagem de Gôndola do Futuro" />
      </div>
    </div>
  `;
}

// Restrições do input: só números e até 14 dígitos + Enter para buscar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cnpjInput");
  if (!input) return;

  // Mantém o campo SOMENTE com números e no máximo 14 dígitos
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 14);
  });

  // Enter para buscar
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarCNPJ();
  });

  input.focus();
});