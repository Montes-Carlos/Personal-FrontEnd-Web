document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alunoIndex = params.get('aluno');
  const aluno = JSON.parse(localStorage.getItem('alunos'))[alunoIndex];

  document.getElementById('nome').textContent = aluno.nome;
  document.getElementById('sobrenome').textContent = aluno.sobrenome;
  document.getElementById('sexo').textContent = aluno.sexo || '-';
  document.getElementById('altura').textContent = aluno.altura || '-';

  document.getElementById('btnSalvar').addEventListener('click', () => {
    if (!document.getElementById('dataAvaliacao').value) {
      alert("Por favor, insira a data da avaliação!");
      return;
    }
    salvarAvaliacao(alunoIndex);
  });

  document.getElementById('btnExcluir').addEventListener('click', excluirAvaliacao);

  document.querySelectorAll('.add-image-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      document.getElementById(`imageInput${index+1}`).click();
    });
  });

  document.querySelectorAll('.image-input').forEach((input, index) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const preview = document.getElementById(`imagePreview${index+1}`);
          preview.innerHTML = '';
          const img = document.createElement('img');
          img.src = event.target.result;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  if (aluno.avaliacoesPosturais) {
    atualizarHistorico(aluno.avaliacoesPosturais);
    popularSelectExclusao(aluno.avaliacoesPosturais);
  }
});

function salvarAvaliacao(alunoIndex) {
  const alunos = JSON.parse(localStorage.getItem('alunos'));
  const aluno = alunos[alunoIndex];
  const dataAvaliacao = document.getElementById('dataAvaliacao').value;

  const novaAvaliacao = {
    data: dataAvaliacao,
    analises: {
      pesFormato: document.getElementById('pesFormato').value,
      joelhosAlinhamento: document.getElementById('joelhosAlinhamento').value,
      patelasPosicao: document.getElementById('patelasPosicao').value,
      quadrilAlinhamento: document.getElementById('quadrilAlinhamento').value,
      ombrosAlinhamento: document.getElementById('ombrosAlinhamento').value,
      cabecaAlinhamento: document.getElementById('cabecaAlinhamento').value,
      toracicaAlinhamento: document.getElementById('toracicaAlinhamento').value,
      cervicalAlinhamento: document.getElementById('cervicalAlinhamento').value,
      lombarAlinhamento: document.getElementById('lombarAlinhamento').value,
      hiperextensaoArticular: document.getElementById('hiperextensaoArticular').value,
      bancoWells: document.getElementById('bancoWells').value,
      tornozeloMobilidade: document.getElementById('tornozeloMobilidade').value,
      tibialAnterior: document.getElementById('tibialAnterior').value,
      retoAbdomen: document.getElementById('retoAbdomen').value,
      iliopsoas: document.getElementById('iliopsoas').value,
      isquiotibiais: document.getElementById('isquiotibiais').value,
      adutores: document.getElementById('adutores').value,
      peitoralMaior: document.getElementById('peitoralMaior').value,
      grandeDorsal: document.getElementById('grandeDorsal').value,
      pesComprimento: document.getElementById('pesComprimento').value,
      gluteoMaximo: document.getElementById('gluteoMaximo').value,
      gluteoMinimo: document.getElementById('gluteoMinimo').value,
      fasciaLata: document.getElementById('fasciaLata').value,
      gluteoMedio: document.getElementById('gluteoMedio').value,
      piriforme: document.getElementById('piriforme').value,
      quadradoLombar: document.getElementById('quadradoLombar').value,
      serratilAnterior: document.getElementById('serratilAnterior').value,
      sindromeImpacto: document.getElementById('sindromeImpacto').value,
      trapezioSuperior: document.getElementById('trapezioSuperior').value
    },
    imagens: []
  };

  for (let i = 1; i <= 8; i++) {
    const input = document.getElementById(`imageInput${i}`);
    const description = document.querySelector(`#imagePreview${i}`).nextElementSibling.nextElementSibling.value;
    if (input.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        novaAvaliacao.imagens.push({
          src: event.target.result,
          description: description
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  if (!aluno.avaliacoesPosturais) aluno.avaliacoesPosturais = [];
  aluno.avaliacoesPosturais.push(novaAvaliacao);

  localStorage.setItem('alunos', JSON.stringify(alunos));
  alert("Avaliação postural salva com sucesso!");
  atualizarHistorico(aluno.avaliacoesPosturais);
  popularSelectExclusao(aluno.avaliacoesPosturais);
  limparCampos();
}

function atualizarHistorico(avaliacoes) {
  const container = document.getElementById('teste1Content');
  const dates = document.querySelectorAll('.result-date');
  const contents = document.querySelectorAll('.result-content');

  avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach((avaliacao, index) => {
    if (index < 4) {
      dates[index].textContent = formatarData(avaliacao.data);
      let contentHTML = '';
      for (const [chave, valor] of Object.entries(avaliacao.analises)) {
        if (valor) contentHTML += `<p><strong>${formatarLabel(chave)}:</strong> ${valor}</p>`;
      }
      contents[index].innerHTML = contentHTML;
    }
  });
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

function excluirAvaliacao() {
  const params = new URLSearchParams(window.location.search);
  const alunoIndex = params.get('aluno');
  const alunos = JSON.parse(localStorage.getItem('alunos'));
  const aluno = alunos[alunoIndex];
  const index = document.getElementById('selectDelete').value;

  if (confirm(`Tem certeza que deseja excluir a avaliação de ${formatarData(aluno.avaliacoesPosturais[index].data)}?`)) {
    aluno.avaliacoesPosturais.splice(index, 1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    alert("Avaliação excluída com sucesso!");
    atualizarHistorico(aluno.avaliacoesPosturais);
    popularSelectExclusao(aluno.avaliacoesPosturais);
  }
}

function limparCampos() {
  document.getElementById('dataAvaliacao').value = '';
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.value = '';
  });
  document.querySelectorAll('.image-preview').forEach(preview => {
    preview.innerHTML = '';
  });
  document.querySelectorAll('.image-input').forEach(input => {
    input.value = '';
  });
  document.querySelectorAll('.image-description').forEach(desc => {
    desc.value = '';
  });
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