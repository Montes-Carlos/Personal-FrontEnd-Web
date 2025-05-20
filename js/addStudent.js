const etapa1 = document.getElementById('formEtapa1');
const etapa2 = document.getElementById('formEtapa2');
const btnContinuar = document.getElementById('btnContinuar');
const btnVoltar = document.getElementById('btnVoltar');

btnContinuar.addEventListener('click', () => {
  if (etapa1.checkValidity()) {
    etapa1.classList.remove('active');
    etapa2.classList.add('active');
  } else {
    alert("Por favor, preencha todos os campos obrigatórios!");
  }
});

btnVoltar.addEventListener('click', () => {
  etapa2.classList.remove('active');
  etapa1.classList.add('active');
});

etapa2.addEventListener('submit', (e) => {
  e.preventDefault();

  if (etapa2.checkValidity()) {
    const dados1 = new FormData(etapa1);
    const dados2 = new FormData(etapa2);

    const aluno = {};
    for (let [key, value] of dados1.entries()) {
      aluno[key] = value;
    }
    for (let [key, value] of dados2.entries()) {
      aluno[key] = value;
    }

    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    alunos.push(aluno);
    localStorage.setItem('alunos', JSON.stringify(alunos));

    alert("Aluno cadastrado com sucesso!");
    window.location.href = "studentManager.html";
  } else {
    alert("Por favor, preencha todos os campos obrigatórios!");
  }
});

// Máscara para CPF
document.querySelector('input[name="cpf"]').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});

// Mostrar primeira etapa ao carregar
etapa1.classList.add('active');