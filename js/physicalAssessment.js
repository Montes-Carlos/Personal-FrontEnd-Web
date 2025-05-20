document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alunoIndex = params.get('aluno');
  const aluno = JSON.parse(localStorage.getItem('alunos'))[alunoIndex];

  document.getElementById('nome').textContent = aluno.nome;
  document.getElementById('sobrenome').textContent = aluno.sobrenome;
  document.getElementById('sexo').textContent = aluno.sexo || '-';
  document.getElementById('altura').textContent = aluno.altura || '-';
  document.getElementById('pesoInicial').textContent = aluno.peso || '-';

  document.querySelectorAll('.dobra').forEach(input => {
    input.addEventListener('input', calcularSomaDobras);
  });

  document.getElementById('gorduraPercentual').addEventListener('input', calcularResultados);
  document.getElementById('pesoAtual').addEventListener('input', calcularResultados);

  document.getElementById('btnSalvar').addEventListener('click', () => {
    if (!document.getElementById('dataAvaliacao').value) {
      alert("Por favor, insira a data da avaliação!");
      return;
    }
    salvarAvaliacao(alunoIndex);
  });

  document.getElementById('btnComparar').addEventListener('click', compararAvaliacoes);
  document.getElementById('btnExcluir').addEventListener('click', excluirAvaliacao);
  document.getElementById('filterType').addEventListener('change', filtrarHistorico);

  if (aluno.avaliacoes) {
    atualizarHistorico(aluno.avaliacoes);
    popularSelects(aluno.avaliacoes);
    popularSelectExclusao(aluno.avaliacoes);
  }
});

function calcularSomaDobras() {
  let soma = 0;
  document.querySelectorAll('.dobra').forEach(input => {
    if (input.value) soma += parseFloat(input.value) || 0;
  });
  document.getElementById('somaDobras').value = soma.toFixed(1);
}

function calcularResultados() {
  const pesoAtual = parseFloat(document.getElementById('pesoAtual').value) || 0;
  const gorduraPercentual = parseFloat(document.getElementById('gorduraPercentual').value) || 0;
  
  if (pesoAtual && gorduraPercentual) {
    const pesoGordura = (pesoAtual * gorduraPercentual) / 100;
    const pesoLivreGordura = pesoAtual - pesoGordura;
    
    document.getElementById('pesoCorporal').value = pesoAtual.toFixed(1);
    document.getElementById('pesoGordura').value = pesoGordura.toFixed(1);
    document.getElementById('pesoLivreGordura').value = pesoLivreGordura.toFixed(1);
  }
}

function salvarAvaliacao(alunoIndex) {
  const alunos = JSON.parse(localStorage.getItem('alunos'));
  const aluno = alunos[alunoIndex];
  const dataAvaliacao = document.getElementById('dataAvaliacao').value;

  const novaAvaliacao = {
    data: dataAvaliacao,
    pesoAtual: document.getElementById('pesoAtual').value,
    medidas: {
      peitoral: document.getElementById('peitoral').value,
      cintura: document.getElementById('cintura').value,
      abdomen: document.getElementById('abdomen').value,
      quadril: document.getElementById('quadril').value,
      coxaDireita: document.getElementById('coxaDireita').value,
      coxaEsquerda: document.getElementById('coxaEsquerda').value,
      panturrilhaDireita: document.getElementById('panturrilhaDireita').value,
      panturrilhaEsquerda: document.getElementById('panturrilhaEsquerda').value,
      antebracoDireito: document.getElementById('antebracoDireito').value,
      antebracoEsquerdo: document.getElementById('antebracoEsquerdo').value,
      bracoDireito: document.getElementById('bracoDireito').value,
      bracoDireitoContraido: document.getElementById('bracoDireitoContraido').value,
      bracoEsquerdo: document.getElementById('bracoEsquerdo').value,
      bracoEsquerdoContraido: document.getElementById('bracoEsquerdoContraido').value
    },
    dobras: {
      peitoral: document.getElementById('dobraPeitoral').value,
      axilar: document.getElementById('dobraAxilar').value,
      abdomen: document.getElementById('dobraAbdomen').value,
      coxa: document.getElementById('dobraCoxa').value,
      subescapular: document.getElementById('dobraSubescapular').value,
      triceps: document.getElementById('dobraTriceps').value,
      supraIliaca: document.getElementById('dobraSupraIliaca').value,
      supraIliacaP: document.getElementById('dobraSupraIliacaP').value,
      somatoria: document.getElementById('somaDobras').value
    },
    resultados: {
      pesoCorporal: document.getElementById('pesoCorporal').value,
      densidadeCorporal: document.getElementById('densidadeCorporal').value,
      gorduraPercentual: document.getElementById('gorduraPercentual').value,
      pesoGordura: document.getElementById('pesoGordura').value,
      pesoLivreGordura: document.getElementById('pesoLivreGordura').value
    }
  };

  if (!aluno.avaliacoes) aluno.avaliacoes = [];
  aluno.avaliacoes.push(novaAvaliacao);

  localStorage.setItem('alunos', JSON.stringify(alunos));
  alert("Avaliação salva com sucesso!");
  atualizarHistorico(aluno.avaliacoes);
  popularSelects(aluno.avaliacoes);
  popularSelectExclusao(aluno.avaliacoes);
  limparCampos();
}

function atualizarHistorico(avaliacoes) {
  const container = document.getElementById('historicoColunas');
  container.innerHTML = '';

  avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(avaliacao => {
    const coluna = document.createElement('div');
    coluna.className = 'history-column';
    coluna.innerHTML = `<h3>${formatarData(avaliacao.data)}</h3>`;
    
    coluna.innerHTML += '<h4>Medidas (cm)</h4>';
    for (const [chave, valor] of Object.entries(avaliacao.medidas)) {
      if (valor) coluna.innerHTML += `<p>${formatarLabel(chave)}: ${valor}</p>`;
    }
    
    coluna.innerHTML += '<h4>Dobras (mm)</h4>';
    for (const [chave, valor] of Object.entries(avaliacao.dobras)) {
      if (valor) coluna.innerHTML += `<p>${formatarLabel(chave)}: ${valor}</p>`;
    }
    
    coluna.innerHTML += '<h4>Resultados</h4>';
    for (const [chave, valor] of Object.entries(avaliacao.resultados)) {
      if (valor) coluna.innerHTML += `<p>${formatarLabel(chave)}: ${valor}</p>`;
    }
    
    container.appendChild(coluna);
  });

  filtrarHistorico();
}

function popularSelects(avaliacoes) {
  const select1 = document.getElementById('selectAvaliacao1');
  const select2 = document.getElementById('selectAvaliacao2');
  select1.innerHTML = '';
  select2.innerHTML = '';

  avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach((avaliacao, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = formatarData(avaliacao.data);
    select1.appendChild(option.cloneNode(true));
    select2.appendChild(option);
  });

  if (avaliacoes.length > 1) {
    select2.selectedIndex = 1;
  }
}

function popularSelectExclusao(avaliacoes) {
  const select = document.getElementById('selectDelete');
  select.innerHTML = '';

  avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach((avaliacao, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = formatarData(avaliacao.data);
    select.appendChild(option);
  });
}

function compararAvaliacoes() {
  const avaliacoes = JSON.parse(localStorage.getItem('alunos'))[new URLSearchParams(window.location.search).get('aluno')].avaliacoes;
  const index1 = document.getElementById('selectAvaliacao1').value;
  const index2 = document.getElementById('selectAvaliacao2').value;

  if (index1 === index2) {
    alert("Selecione avaliações diferentes para comparar!");
    return;
  }

  const avaliacao1 = avaliacoes[index1];
  const avaliacao2 = avaliacoes[index2];
  const container = document.getElementById('evolucaoColuna');
  container.innerHTML = `<h3>Comparação: ${formatarData(avaliacao1.data)} vs ${formatarData(avaliacao2.data)}</h3>`;

  container.innerHTML += '<h4>Medidas (cm)</h4>';
  for (const [chave, valor1] of Object.entries(avaliacao1.medidas)) {
    const valor2 = avaliacao2.medidas[chave];
    if (valor1 && valor2) {
      const diferenca = parseFloat(valor2) - parseFloat(valor1);
      const classe = getClasseEvolucao(diferenca);
      container.innerHTML += `
        <div class="evolution-item ${classe}">
          ${formatarLabel(chave)}: ${diferenca > 0 ? '+' : ''}${diferenca.toFixed(1)}
        </div>
      `;
    }
  }

  container.innerHTML += '<h4>Dobras (mm)</h4>';
  for (const [chave, valor1] of Object.entries(avaliacao1.dobras)) {
    const valor2 = avaliacao2.dobras[chave];
    if (valor1 && valor2) {
      const diferenca = parseFloat(valor2) - parseFloat(valor1);
      const classe = getClasseEvolucao(diferenca);
      container.innerHTML += `
        <div class="evolution-item ${classe}">
          ${formatarLabel(chave)}: ${diferenca > 0 ? '+' : ''}${diferenca.toFixed(1)}
        </div>
      `;
    }
  }

  container.innerHTML += '<h4>Resultados</h4>';
  for (const [chave, valor1] of Object.entries(avaliacao1.resultados)) {
    const valor2 = avaliacao2.resultados[chave];
    if (valor1 && valor2) {
      const diferenca = parseFloat(valor2) - parseFloat(valor1);
      const classe = getClasseEvolucao(diferenca);
      container.innerHTML += `
        <div class="evolution-item ${classe}">
          ${formatarLabel(chave)}: ${diferenca > 0 ? '+' : ''}${diferenca.toFixed(1)}
        </div>
      `;
    }
  }
}

function excluirAvaliacao() {
  const params = new URLSearchParams(window.location.search);
  const alunoIndex = params.get('aluno');
  const alunos = JSON.parse(localStorage.getItem('alunos'));
  const aluno = alunos[alunoIndex];
  const index = document.getElementById('selectDelete').value;

  if (confirm(`Tem certeza que deseja excluir a avaliação de ${formatarData(aluno.avaliacoes[index].data)}?`)) {
    aluno.avaliacoes.splice(index, 1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    alert("Avaliação excluída com sucesso!");
    atualizarHistorico(aluno.avaliacoes);
    popularSelects(aluno.avaliacoes);
    popularSelectExclusao(aluno.avaliacoes);
  }
}

function filtrarHistorico() {
  const filterType = document.getElementById('filterType').value;
  const colunas = document.querySelectorAll('.history-column');

  colunas.forEach(coluna => {
    const sections = coluna.querySelectorAll('h4');
    sections.forEach(section => {
      const sectionType = section.textContent.toLowerCase();
      const shouldShow = 
        filterType === 'todas' || 
        (filterType === 'medidas' && sectionType.includes('medidas')) ||
        (filterType === 'dobras' && sectionType.includes('dobras')) ||
        (filterType === 'resultados' && sectionType.includes('resultados'));
      
      section.style.display = shouldShow ? 'block' : 'none';
      let next = section.nextElementSibling;
      while (next && next.tagName !== 'H4') {
        next.style.display = shouldShow ? 'block' : 'none';
        next = next.nextElementSibling;
      }
    });
  });
}

function limparCampos() {
  document.getElementById('dataAvaliacao').value = '';
  document.getElementById('pesoAtual').value = '';
  document.querySelectorAll('.medida, .dobra').forEach(input => {
    input.value = '';
  });
  document.getElementById('somaDobras').value = '';
  document.getElementById('densidadeCorporal').value = '';
  document.getElementById('gorduraPercentual').value = '';
  document.getElementById('pesoCorporal').value = '';
  document.getElementById('pesoGordura').value = '';
  document.getElementById('pesoLivreGordura').value = '';
}

function formatarData(dataString) {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarLabel(chave) {
  return chave.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function getClasseEvolucao(diferenca) {
  if (diferenca > 0) return 'evolution-positive';
  if (diferenca < 0) return 'evolution-negative';
  return 'evolution-neutral';
}