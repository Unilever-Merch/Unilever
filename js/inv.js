let dadosInv = [];

fetch('inv.json')
  .then(res => {
    if (!res.ok) throw new Error('Não foi possível carregar inv.json');
    return res.json();
  })
  .then(json => {
    dadosInv = Array.isArray(json) ? json : Object.values(json || {});
  })
  .catch(err => console.error('Erro ao carregar o arquivo inv.json:', err));

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

  const dadosLoja = dadosInv.filter(it => String(it['COD LOJA']) === input);

  if (dadosLoja.length === 0) {
    info.innerHTML = "<p>Loja não encontrada.</p>";
    return;
  }

  const lojaNome = dadosLoja[0]['LOJA'] || '-';
  const promotor = dadosLoja[0]['GESTOR'] || '-';

  info.innerHTML = `
    <p><strong>Loja:</strong> ${lojaNome}</p>
    <p><strong>Promotor:</strong> ${promotor}</p>
  `;

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

// ============================
// Formata número decimal com símbolo %
// ============================
function formatarDecimalComPorcentagem(valor) {
  const num = Number(valor);
  if (Number.isNaN(num)) return '-';
  return num.toFixed(3) + '%'; // Exemplo: 0.075%
}

// ============================
// Filtra por categoria e monta a tabela
// ============================
function filtrarCategoria() {
  const codLoja = document.getElementById('inputLoja').value.trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  const dados = dadosInv.filter(
    it => String(it['COD LOJA']) === codLoja && String(it['CATEGORIA']) === categoria
  );

  let html = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Descrição SKU</th>
            <th>Perda %</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (!dados.length) {
    html += `<tr><td colspan="3">Nenhum item encontrado para a categoria selecionada.</td></tr>`;
  } else {
    dados.forEach(item => {
      const perda = Number(item['PERDA (%)']);
      const perdaClass = perda >= 0.1 ? 'valor-positivo' : 'valor-negativo';
      html += `
        <tr>
          <td>${item['CATEGORIA'] ?? '-'}</td>
          <td>${item['DESCRIÇÃO SKU'] ?? '-'}</td>
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