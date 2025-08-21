
let dadosInovacao = [];

// Carrega o JSON de inovação (nome do arquivo tem acento)
fetch(encodeURI('dados_inovação.json'))
  .then(res => res.json())
  .then(data => { dadosInovacao = data; })
  .catch(err => console.error('Erro ao carregar dados_inovação.json:', err));

function formatarNumero(n) {
  const num = Number(String(n).replace(',', '.'));
  if (Number.isNaN(num)) return '0.00';
  return num.toFixed(2);
}

function preencherInfoLoja(registros) {
  const info = document.getElementById('infoLoja');
  if (!registros || registros.length === 0) {
    info.innerHTML = "";
    return;
  }
  const { LOJA, GESTOR } = registros[0];
  info.innerHTML = `
    <p><strong>Loja:</strong> ${LOJA || '-'}</p>
    <p><strong>Gestor:</strong> ${GESTOR || '-'}</p>
  `;
}

function buscarLoja() {
  const input = document.getElementById('inputLoja').value.trim();
  const info = document.getElementById('infoLoja');
  const filtroContainer = document.getElementById('filtroCategoria');
  const select = document.getElementById('selectCategoria');
  const resultado = document.getElementById('resultadoSortimento');

  const dadosLoja = dadosInovacao.filter(item => String(item["COD LOJA"]).trim() === input);

  if (dadosLoja.length === 0) {
    info.innerHTML = "<p>Loja não encontrada.</p>";
    if (filtroContainer) filtroContainer.style.display = "none";
    resultado.innerHTML = "";
    return;
  }

  // Mostra box da loja e ativa filtro
  preencherInfoLoja(dadosLoja);
  if (filtroContainer) filtroContainer.style.display = "block";

  // Popula categorias desta loja
  const categorias = [...new Set(dadosLoja.map(i => i.Categoria).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  select.innerHTML = '<option value="">Selecione uma categoria</option>' + categorias.map(c => `<option value="${c}">${c}</option>`).join('');

  // Se houver ao menos uma categoria, já filtra a primeira (igual sortimento faz)
  if (categorias.length > 0) {
    select.value = categorias[0];
    filtrarCategoria();
  } else {
    resultado.innerHTML = "<p>Não há categorias para esta loja.</p>";
  }
}

function filtrarCategoria() {
  const codLoja = (document.getElementById('inputLoja').value || '').trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  const dados = dadosInovacao.filter(item =>
    String(item["COD LOJA"]).trim() === codLoja && item.Categoria === categoria
  );

  if (dados.length === 0) {
    resultado.innerHTML = "<p>Nenhum registro encontrado para a categoria selecionada.</p>";
    return;
  }

  let html = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Produto</th>
            <th>EAN</th>
            <th>% Atingido</th>
            <th>% Target Categoria</th>
            <th>Ating. Mês</th>
          </tr>
        </thead>
        <tbody>`;

  dados.forEach(item => {
    const atingido = formatarNumero(item['% Atingido']);
    const target = formatarNumero(item['% Target Categoria']);
    const atingidoVal = Number(String(item['% Atingido']).replace(',', '.'));
    const targetVal = Number(String(item['% Target Categoria']).replace(',', '.'));
    const atingidoClass = (isFinite(atingidoVal) && isFinite(targetVal) && (atingidoVal >= targetVal)) ? 'atingido' : 'nao-atingido';

    html += `
      <tr>
        <td>${item.Mes ?? '-'}</td>
        <td>${item.Produto ?? '-'}</td>
        <td>${item.EAN ?? '-'}</td>
        <td class="${atingidoClass}">${atingido}%</td>
        <td>${target}%</td>
        <td>${item['Ating. Mês'] ?? '-'}</td>
      </tr>`;
  });

  html += `</tbody></table></div>`;
  resultado.innerHTML = html;
}
