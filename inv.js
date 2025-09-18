// Carrega os dados do inventário (formato array de objetos)
let dadosInv = [];

fetch('inv.json')
  .then(res => {
    if (!res.ok) throw new Error('Não foi possível carregar inv.json');
    return res.json();
  })
  .then(json => {
    dadosInv = Array.isArray(json) ? json : Object.values(json || {});
  })
  .catch(err => console.error(err));

function buscarLoja() {
  const input = document.getElementById('inputLoja').value.trim();
  const info = document.getElementById('infoLoja');
  const filtro = document.getElementById('filtroCategoria');
  const select = document.getElementById('selectCategoria');
  const resultado = document.getElementById('resultadoSortimento');

  // Limpa saída
  info.innerHTML = '';
  resultado.innerHTML = '';
  filtro.style.display = 'none';

  if (!input) {
    info.innerHTML = "<p>Digite o código da loja.</p>";
    return;
  }

  // Filtra por código de loja (mantém comparação por string para evitar problemas)
  const dadosLoja = dadosInv.filter(it => String(it['COD LOJA']) === input);

  if (dadosLoja.length === 0) {
    info.innerHTML = "<p>Loja não encontrada.</p>";
    return;
  }

  // Cabeçalho (mesmo do seu exemplo)
  const { LOJA, PROMOTOR } = dadosLoja[0] || {};
  info.innerHTML = `
    <p><strong>Loja:</strong> ${LOJA || '-'}</p>
    <p><strong>Promotor:</strong> ${PROMOTOR || '-'}</p>
  `;

  // Monta categorias únicas (igual ao exemplo)
  const categorias = [...new Set(dadosLoja.map(it => String(it['Categoria'] || '').trim()))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  select.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  filtro.style.display = categorias.length ? 'block' : 'none';

  // Renderiza primeira categoria por padrão
  filtrarCategoria();
}

function formatarPct(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return '-';
  return (v * 100).toFixed(2) + '%';
}

function filtrarCategoria() {
  const codLoja = document.getElementById('inputLoja').value.trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  // Seleciona os itens da loja + categoria
  const dados = dadosInv.filter(
    it => String(it['COD LOJA']) === codLoja && String(it['Categoria']) === categoria
  );

  // Monta tabela (layout idêntico ao exemplo; colunas adaptadas ao inv.json)
  let html = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Descrição SKU</th>
            <th>Perda (%)</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (!dados.length) {
    html += `
      <tr><td colspan="3">Nenhum item encontrado para a categoria selecionada.</td></tr>
    `;
  } else {
    dados.forEach(item => {
      const perda = Number(item['Perda (%)']);
      const perdaClass = perda >= 1 ? 'valor-positivo' : 'valor-negativo';
      html += `
        <tr>
          <td>${item['Categoria'] ?? '-'}</td>
          <td>${item['Descrição SKU'] ?? '-'}</td>
          <td class="${perdaClass}">${formatarPct(perda)}</td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>
    </div>
  `;

  resultado.innerHTML = html;
}