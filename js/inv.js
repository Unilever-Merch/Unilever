let dadosInv = [];

// ==========================================
// CARREGAMENTO DO JSON
// ==========================================
fetch('inv.json')
  .then(res => {
    if (!res.ok) throw new Error('Não foi possível carregar inv.json');
    return res.json();
  })
  .then(json => {
    // Garante array
    dadosInv = Array.isArray(json) ? json : Object.values(json || {});
    console.log('INV carregado:', dadosInv.length, 'registros');
  })
  .catch(err => console.error('Erro ao carregar inv.json:', err));


// ==========================================
// BUSCAR LOJA PELO CÓDIGO
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
    info.innerHTML = '<p>Digite o código da loja.</p>';
    return;
  }

  // 🔥 CORREÇÃO PRINCIPAL: COD LOJA
  const dadosLoja = dadosInv.filter(
    it => String(it['COD LOJA']).trim() === input
  );

  if (!dadosLoja.length) {
    info.innerHTML = '<p>Loja não encontrada.</p>';
    return;
  }

  const lojaNome = dadosLoja[0]['LOJA'] ?? '-';

  info.innerHTML = `
    <p><strong>Loja:</strong> ${lojaNome}</p>
  `;

  // CATEGORIAS
  const categorias = [...new Set(
    dadosLoja.map(it => String(it['Categoria'] || '').trim())
  )].filter(Boolean).sort();

  if (!categorias.length) {
    resultado.innerHTML = '<p>Nenhuma categoria encontrada.</p>';
    return;
  }

  select.innerHTML = categorias
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');

  filtro.style.display = 'block';
  filtrarCategoria();
}


// ==========================================
// FORMATA PERDA (%)
// ==========================================
function formatarPerda(valor) {
  const num = Number(valor);
  if (Number.isNaN(num)) return '-';
  return (num * 100).toFixed(1) + '%';
}


// ==========================================
// FILTRAR POR CATEGORIA E MONTAR TABELA
// ==========================================
function filtrarCategoria() {
  const codLoja = document.getElementById('inputLoja').value.trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  const dados = dadosInv.filter(
    it =>
      String(it['COD LOJA']).trim() === codLoja &&
      String(it['Categoria']).trim() === categoria
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
    html += `
      <tr>
        <td colspan="4">Nenhum item encontrado para esta categoria.</td>
      </tr>
    `;
  } else {
    dados.forEach(item => {
      const perda = Number(item['Perda (%)']);
      const classe = perda >= 0.1 ? 'valor-positivo' : 'valor-negativo';

      html += `
        <tr>
          <td>${item['Categoria'] ?? '-'}</td>
          <td>${item['Descrição SKU'] ?? '-'}</td>
          <td>${item['Ean'] ?? '-'}</td>
          <td class="${classe}">${formatarPerda(perda)}</td>
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
