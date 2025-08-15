
let dadosRE = [];
let dadosSortimento = [];

fetch('dados.json').then(res => res.json()).then(data => dadosRE = data);
fetch('dados_sortimento_julho.json').then(res => res.json()).then(data => dadosSortimento = data);

function buscarRE() {
  const input = document.getElementById('inputRE').value.trim();
  const resultado = document.getElementById('resultadoRE');
  const encontrados = dadosRE.filter(item => item.RE == input);

  if (encontrados.length === 0) {
    resultado.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  let html = "";
  encontrados.forEach(item => {
    html += `<div class="card">
      <p><strong>PDV:</strong> ${item.PDV}</p>
      <p><strong>VSYTD24:</strong> ${item.VSYTD24}</p>
      <p><strong>SELL OUT:</strong> JAN ${item.SELLOUT_JAN} | FEV ${item.SELLOUT_FEV} | MAR ${item.SELLOUT_MAR} | ABR ${item.SELLOUT_ABR}</p>
      <p><strong>VPL:</strong> JAN ${item.VPL_JAN} | FEV ${item.VPL_FEV} | MAR ${item.VPL_MAR} | ABR ${item.VPL_ABR}</p>
    </div>`;
  });

  resultado.innerHTML = html;
}

function buscarLoja() {
  const input = document.getElementById('inputLoja').value.trim();
  const info = document.getElementById('infoLoja');
  const select = document.getElementById('selectCategoria');
  const filtro = document.getElementById('filtroCategoria');
  const resultado = document.getElementById('resultadoSortimento');

  const dadosLoja = dadosSortimento.filter(item => item["COD LOJA"] == input);

  if (dadosLoja.length === 0) {
    info.innerHTML = "<p>Loja não encontrada.</p>";
    filtro.style.display = "none";
    resultado.innerHTML = "";
    return;
  }

  const { LOJA, GESTOR, PROMOTOR } = dadosLoja[0];
  info.innerHTML = `<p><strong>Loja:</strong> ${LOJA}</p><p><strong>Gestor:</strong> ${GESTOR}</p><p><strong>Promotor:</strong> ${PROMOTOR}</p>`;

  const categorias = [...new Set(dadosLoja.map(item => item.Categoria))];
  select.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  filtro.style.display = "block";

  filtrarCategoria();
}

function formatarNumero(numero) {
  // Converte para número caso seja string e garante 2 casas decimais
  return Number(numero).toFixed(2);
}

function filtrarCategoria() {
  const codLoja = document.getElementById('inputLoja').value.trim();
  const categoria = document.getElementById('selectCategoria').value;
  const resultado = document.getElementById('resultadoSortimento');

  const dados = dadosSortimento.filter(
    item => item["COD LOJA"] == codLoja && item.Categoria === categoria
  );

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
    const atingido = formatarNumero(item["% Atingido"]);
    const target = formatarNumero(item["% Target Categoria"]);
    
    // Adiciona classe para valores positivos/negativos
    const atingidoClass = Number(atingido) >= 100 ? 'valor-positivo' : 'valor-negativo';
    
    html += `
      <tr>
        <td>${item.Mes}</td>
        <td>${item.Produto}</td>
        <td>${item.EAN}</td>
        <td class="${atingidoClass}">${atingido}%</td>
        <td>${target}%</td>
        <td>${item["Ating. Mês"]}</td>
      </tr>`;
  });
  html += "</tbody></table></div>";

  resultado.innerHTML = html;
}