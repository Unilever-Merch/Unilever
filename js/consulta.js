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

  // Caso queira que os meses acompanhem o tamanho do VPL dinamicamente:
  // const meses = (entradas[0]?.vpl ?? []).slice(0, 6).map((_, i) => ['JAN','FEV','MAR','ABR','MAI','JUN'][i] ?? `M${i+1}`);
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN'];

  let html = `<h2>RE: ${re}</h2>`;
  html += `<div class="table-container"><table>`;

  // Cabeçalho (linha 1): Nome do PDV | Vs YTD'24 | VPL (agrupado por meses)
  html += `<tr>
            <th rowspan="2">Nome do PDV</th>
            <th rowspan="2">Vs YTD'24</th>
            <th colspan="${meses.length}">VPL</th>
          </tr>`;

  // Cabeçalho (linha 2): meses apenas para VPL
  html += `<tr>`;
  meses.forEach(m => html += `<th>${m}</th>`);
  html += `</tr>`;

  // Linhas de dados
  entradas.forEach(entry => {
    html += `<tr>`;

    // Nome do PDV
    html += `<td>${entry.pdv}</td>`;

    // Vs YTD'24 (comparativo_percentual)
    html += `<td style="color:${corComparativo(entry.comparativo_percentual)}">${entry.comparativo_percentual}</td>`;

    // VPL (primeiros 6 meses)
    entry.vpl.slice(0, 6).forEach(val => {
      html += `<td>${val}</td>`;
    });

    html += `</tr>`;
  });

  html += `</table></div>`;
  html += `<div style="text-align:center;"><button onclick="voltar()">← Consultar outro RE</button></div>`;

  container.innerHTML = html;
}

function corComparativo(valor) {
  if (!valor || valor === "—" || valor === "0%") return "var(--dark-blue)";
  if (valor.startsWith("-")) return "#FF4B4B";
  return "#00C853";
}

document.getElementById("reInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") buscarRE();
});

function voltar() {
  document.getElementById('resultado').innerHTML = '';
  document.getElementById('reInput').value = '';
  document.getElementById('reInput').focus();
}
