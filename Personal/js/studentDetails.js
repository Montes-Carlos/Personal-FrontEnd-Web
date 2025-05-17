const formAluno = document.getElementById('formAluno');
const btnSalvar = document.getElementById('btnSalvar');

// Obter índice do aluno da URL
const params = new URLSearchParams(window.location.search);
const alunoIndex = parseInt(params.get('aluno'));

window.addEventListener('DOMContentLoaded', () => {
  const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  const aluno = alunos[alunoIndex];

  if (aluno) {
    for (let key in aluno) {
      const input = formAluno.elements.namedItem(key);
      if (input) input.value = aluno[key];
    }
  }
});

formAluno.addEventListener('submit', (e) => {
  e.preventDefault();

  const dados = new FormData(formAluno);
  const alunoAtualizado = {};
  for (let [key, value] of dados.entries()) {
    alunoAtualizado[key] = value;
  }

  let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  alunos[alunoIndex] = alunoAtualizado;

  localStorage.setItem('alunos', JSON.stringify(alunos));
  alert("Dados atualizados com sucesso!");
});
