const treinos = [
  { 
    id: 1, 
    nome: "Treino Adaptativo",
    estrutura: "ABC",
    dias: {
      A: [{nome: "Supino Reto", metodo: "Top Set", sets: 3, reps: [10,10,10], rest: 60}],
      B: [{nome: "Agachamento Livre", metodo: "Top Set", sets: 3, reps: [8,8,8], rest: 90}],
      C: [{nome: "Barra Fixa", metodo: "Drop Set", sets: 3, reps: [8,6,4], rest: 60}]
    }
  },
  { 
    id: 2, 
    nome: "Treino para Hipertrofia",
    estrutura: "AB",
    dias: {
      A: [{nome: "Supino Inclinado", metodo: "Bi-Set", sets: 4, reps: [12,10,8,8], rest: 60}],
      B: [{nome: "Puxada Alta", metodo: "Top Set", sets: 4, reps: [10,10,8,8], rest: 60}]
    }
  }
];

const treinosSalvos = JSON.parse(localStorage.getItem('treinosPersonalizados')) || [];
const todosTreinos = [...treinos, ...treinosSalvos];

const container = document.getElementById('workoutsList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const createWorkoutButton = document.getElementById('createWorkoutButton');
const paginationContainer = document.getElementById('pagination');

const treinosPorPagina = 6;
let paginaAtual = 1;

function renderTreinos(filtro = "") {
  container.innerHTML = "";

  const treinosFiltrados = todosTreinos.filter(treino => 
    treino && treino.nome && treino.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const inicio = (paginaAtual - 1) * treinosPorPagina;
  const fim = inicio + treinosPorPagina;
  const treinosPaginados = treinosFiltrados.slice(inicio, fim);

  treinosPaginados.forEach(treino => {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
      <div class="workout-button" data-id="${treino.id}">
        <span>${treino.nome}</span>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.workout-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const treinoSelecionado = todosTreinos.find(t => t.id == id);
      localStorage.setItem('treinoEditavel', JSON.stringify(treinoSelecionado));
      window.location.href = `createWorkout.html?edit=${id}`;
    });
  });

  renderPaginacao(treinosFiltrados.length);
}

function renderPaginacao(totalTreinos) {
  paginationContainer.innerHTML = "";
  const totalPaginas = Math.ceil(totalTreinos / treinosPorPagina);
  
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = i === paginaAtual ? 'active' : '';
    btn.onclick = () => {
      paginaAtual = i;
      renderTreinos(searchInput.value);
    };
    paginationContainer.appendChild(btn);
  }
}

searchInput.addEventListener('input', () => {
  paginaAtual = 1;
  renderTreinos(searchInput.value);
});

searchButton.addEventListener('click', () => {
  paginaAtual = 1;
  renderTreinos(searchInput.value);
});

createWorkoutButton.addEventListener('click', () => {
  localStorage.removeItem('treinoEditavel');
  window.location.href = 'createWorkout.html';
});

renderTreinos();