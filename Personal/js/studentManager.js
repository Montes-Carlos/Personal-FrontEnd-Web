const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
const container = document.querySelector('.students-list');
const searchInput = document.querySelector('.search-box input');
const paginationContainer = document.querySelector('.pagination');

const alunosPorPagina = 6;
let paginaAtual = 1;

function renderAlunos(filtro = "") {
  container.innerHTML = "";

  const alunosFiltrados = alunos.filter(aluno =>
    (`${aluno.nome} ${aluno.sobrenome}`).toLowerCase().includes(filtro.toLowerCase())
  );

  const inicio = (paginaAtual - 1) * alunosPorPagina;
  const fim = inicio + alunosPorPagina;
  const alunosPaginados = alunosFiltrados.slice(inicio, fim);

  alunosPaginados.forEach((aluno, index) => {
    const globalIndex = alunos.indexOf(aluno);

    const card = document.createElement('div');
    card.className = 'student-card';

    card.innerHTML = `
      <div class="student-button">
        <span>${aluno.nome} ${aluno.sobrenome}</span>
        <div style="position:relative">
          <button class="menu-toggle">⋮</button>
          <div class="dropdown">
            <div class="editar-info" data-index="${globalIndex}">Editar Informações</div>
            <div class="editar-treino" data-index="${globalIndex}">Editar Treino</div>
            <div class="avaliacao-fisica" data-index="${globalIndex}">Avaliação Física</div>
            <div class="avaliacao-postural" data-index="${globalIndex}">Avaliação Postural</div>
            <div class="historico-carga" data-index="${globalIndex}">Histórico de Carga</div>
            <div class="desabilitar-aluno" data-index="${globalIndex}">Desabilitar Aluno</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  aplicarEventosDropdown();
  renderPaginacao(alunosFiltrados.length);
}

function aplicarEventosDropdown() {
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = toggle.nextElementSibling;
      document.querySelectorAll('.dropdown').forEach(menu => {
        if (menu !== dropdown) menu.style.display = 'none';
      });
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
  });

  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(menu => menu.style.display = 'none');
  });

  document.querySelectorAll('.editar-info').forEach(botao => {
    botao.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      window.location.href = `studentDetails.html?aluno=${index}`;
    });
  });

  document.querySelectorAll('.desabilitar-aluno').forEach(botao => {
    botao.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      if (confirm("Tem certeza que deseja desabilitar este aluno?")) {
        alunos.splice(index, 1);
        localStorage.setItem('alunos', JSON.stringify(alunos));
        renderAlunos(searchInput.value);
      }
    });
  });

  document.querySelectorAll('.editar-treino').forEach(el => {
    el.onclick = e => location.href = `predefinedWorkouts.html?aluno=${e.target.dataset.index}`;
  });
  document.querySelectorAll('.avaliacao-fisica').forEach(el => {
    el.onclick = e => location.href = `physicalAssessment.html?aluno=${e.target.dataset.index}`;
  });
  document.querySelectorAll('.avaliacao-postural').forEach(el => {
    el.onclick = e => location.href = `posturalAssessment.html?aluno=${e.target.dataset.index}`;
  });
  document.querySelectorAll('.historico-carga').forEach(el => {
    el.onclick = e => location.href = `studentHistory.html?aluno=${e.target.dataset.index}`;
  });
}

function renderPaginacao(totalAlunos) {
  paginationContainer.innerHTML = "";

  const totalPaginas = Math.ceil(totalAlunos / alunosPorPagina);
  
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = i === paginaAtual ? 'active' : '';
    btn.onclick = () => {
      paginaAtual = i;
      renderAlunos(searchInput.value);
    };
    paginationContainer.appendChild(btn);
  }
}

searchInput.addEventListener('input', () => {
  paginaAtual = 1;
  renderAlunos(searchInput.value);
});

renderAlunos();