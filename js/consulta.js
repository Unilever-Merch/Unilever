let dados = [];

fetch('dados.json')
  .then(response => response.json())
  .then(json => {
    dados = json;
    console.log("JSON carregado:", dados.length, "registros");
  })
  .catch(err => console.error("Erro ao carregar JSON:", err));

function buscarRE() {
  const re = document.getElementById('reInput').value.trim();
  const container = document.getElementById('resultado');
  container.innerHTML = '';

  if (!dados || dados.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--dark-blue); font-family: var(--poppins); font-size: 1.6rem; margin: 2rem;">Aguarde... carregando os dados.</p>';
    return;
  }

  const entradas = dados.filter(item => String(item.RE).trim() === re);

  if (entradas.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--dark-blue); font-family: var(--poppins); font-size: 1.6rem; margin: 2rem;">Nenhum colaborador encontrado para o RE informado.</p>';
    return;
  }

  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  let html = `<h2 style="text-align:center; margin-bottom: 1rem;">RE: ${re}</h2>`;
  html += `<div class="table-container"><table>`;

  // Cabeçalho
  html += `
    <tr>
      <th rowspan="2">PDV</th>
      <th rowspan="2">NEGOCIAÇÕES LOJA</th>
      <th colspan="${meses.length}">VPL</th>
    </tr>
  `;

  html += `<tr>`;
  meses.forEach(m => html += `<th>${m}</th>`);
  html += `</tr>`;

  // Linhas
  entradas.forEach(entry => {
    html += `<tr>`;
    html += `<td>${entry.LOJA}</td>`;

    // Valor da coluna “NEGOCIAÇÕES LOJA”
    let negociacao = entry['NEGOCIAÇÕES LOJA'] || '-';
    if (typeof negociacao === 'string' && negociacao.toLowerCase().includes('negociação tester')) {
      negociacao = 'LOJA NEGOCIADA TESTER OLEO CORPORAL';
    }

    // Aplica a classe centralizado se for “-”
    const classeNegociacao = negociacao === '-' 
      ? 'negociacao-bold centralizado' 
      : 'negociacao-bold';
    html += `<td class="${classeNegociacao}">${negociacao}</td>`;

    meses.forEach(m => {
      const val = entry[m];
      if (val === undefined || val === null || val === '') {
        html += `<td class="centralizado">-</td>`;
      } else if (typeof val === 'number') {
        html += `<td>${val.toFixed(1)}</td>`;
      } else {
        const num = parseFloat(val);
        html += `<td>${isNaN(num) ? '<span class="centralizado">-</span>' : num.toFixed(1)}</td>`;
      }
    });

    html += `</tr>`;
  });

  html += `</table></div>`;
  html += `<div style="text-align:center; margin-top: 1rem;"><button onclick="voltar()">← Consultar outro RE</button></div>`;

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