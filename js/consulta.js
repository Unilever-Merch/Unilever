let dados;

fetch('dados.json')
  .then(response => response.json())
  .then(json => {
    dados = json;
  });

function buscarRE() {
  const re = document.getElementById('reInput').value.trim();
  const container = document.getElementById('resultado');
  container.innerHTML = '';

  if (!dados || !re || !dados[re]) {
    container.innerHTML = '<p style="text-align:center; color: var(--dark-blue); font-family: var(--poppins); font-size: 1.6rem; margin: 2rem;">Nenhum colaborador encontrado para o RE informado.</p>';
    return;
  }

  const entradas = dados[re];

  // Se quiser que o número de colunas acompanhe o tamanho do VPL:
  // const meses = (entradas[0]?.vpl ?? []).map((_, i) => ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][i] ?? `M${i+1}`);
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN']; // fixo nos 6 primeiros

  let html = `<h2>RE: ${re}</h2>`;
  html += `<div class="table-container"><table>`;

  // Cabeçalho (linha 1): Nome do PDV | VPL (agrupado)
  html += `<tr>
            <th rowspan="2">Nome do PDV</th>
            <th colspan="${meses.length}">VPL</th>
          </tr>`;

  // Cabeçalho (linha 2): meses do VPL
  html += `<tr>`;
  meses.forEach(m => (html += `<th>${m}</th>`));
  html += `</tr>`;

  // Linhas de dados
  entradas.forEach(entry => {
    html += `<tr>`;

    // Nome do PDV
    html += `<td>${entry.pdv}</td>`;

    // VPL (primeiros 6 valores)
    entry.vpl.slice(0, meses.length).forEach(val => {
      html += `<td>${val}</td>`;
    });

    html += `</tr>`;
  });

  html += `</table></div>`;
  html += `<div style="text-align:center;"><button onclick="voltar()">← Consultar outro RE</button></div>`;

  container.innerHTML = html;
}

// Enter para buscar
document.getElementById("reInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") buscarRE();
});

function voltar() {
  document.getElementById('resultado').innerHTML = '';
  document.getElementById('reInput').value = '';
  document.getElementById('reInput').focus();
}