let dadosInv = [];

// ==========================================
// Carrega o JSON de INV
// ==========================================
fetch('inv.json')
  .then(res => {
    if (!res.ok) throw new Error('Não foi possível carregar inv.json');
    return res.json();
  })
  .then(json => {
    dadosInv = Array.isArray(json) ? json : Object.values(json || {});
    console.log("INV carregado:", dadosInv.length, "registros");
  })
  .catch(err => console.error('Erro ao carregar inv.json:', err));


// ==========================================
// Busca a loja pelo código
// ==========================================
function buscarLoja() {
  const input = document.getElementById('inputLoja').value.trim();
  const info = document.getElementById('infoLoja');
  const filtro = document.getElementById('filtroCategoria');
  const select = document.getElementById('selectCategoria');
  const resultado = document.getElementById('resultadoSortimento');

  info.innerHTML = '';
  resultado.innerHTML = '';
  filtro.style.display = 'none';

  if (!input) {
    info.innerHTML = "<p>Digite o código da loja.</p>";
    return;
  }

  // Campo correto → "COD"
  const dadosLoja = dadosInv.filter(it => String(it['COD']).trim() === input);

  if (dadosLoja.length === 0) {
    info.innerHTML = "<p>Loja não encontrada.</p>";
    return;
  }

  const lojaNome = dadosLoja[0]['LOJA'] || '-';
  const promotor = dadosLoja[0]['PROMOTOR'] || '-';

  info.innerHTML = `
    <p><strong>Loja:</strong> ${lojaNome}</p>
    <p><strong>Promotor:</strong> ${promotor}</p>
  `;

  // Categorias corretas → "CATEGORIA"
  const categorias = [...new Set(dadosLoja.map(it => String(it['CATEGORIA'] || '').trim()))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  if (categorias.length > 0) {
    select.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    filtro.style.display = 'block';
    filtrarCategoria();
  } else {
    resultado.innerHTML = "<p>Nenhuma categoria encontrada para esta loja.</p>";
  }
}


// ==========================================
// Formata Perda (%) igual ao modelo do print
// Exemplo: 0.147 → 14.7%
// ==========================================
function formatarDecimalComPorcentagem(valor) {
  const num = Number(valor);
  if (Number.isNaN(num)) return '-';
  return (num * 100).toFixed(1) + '%';  
}


// ==========================================
// Filtra por categoria e monta a tabela
// ==========================================
function filtrarCategoria() {
  const codLoja = document.getElementById('inputLoja').value.trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  const dados = dadosInv.filter(
    it => String(it['COD']).trim() === codLoja &&
          String(it['CATEGORIA']).trim() === categoria
  );

  let html = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Descrição SKU</th>
            <th>EAN</th>
            <th>Perda (%)</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (!dados.length) {
    html += `<tr><td colspan="4">Nenhum item encontrado para a categoria selecionada.</td></tr>`;
  } else {
    dados.forEach(item => {
      const perda = Number(item['Perda (%)']);
      const perdaClass = perda >= 0.1 ? 'valor-positivo' : 'valor-negativo';

      html += `
        <tr>
          <td>${item['CATEGORIA'] ?? '-'}</td>
          <td>${item['DESC SKU'] ?? '-'}</td>
          <td>${item['EAN'] ?? '-'}</td>
          <td class="${perdaClass}">${formatarDecimalComPorcentagem(perda)}</td>
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
