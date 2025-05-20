document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alunoIndex = params.get('aluno');
  const aluno = JSON.parse(localStorage.getItem('alunos'))[alunoIndex];

  document.getElementById('nome').textContent = aluno.nome;
  document.getElementById('sobrenome').textContent = aluno.sobrenome;
  document.getElementById('dataInicio').textContent = aluno.dataInicio || '-';

  document.getElementById('weekSelect').addEventListener('change', (e) => {
    loadWeekData(parseInt(e.target.value));
  });

  loadWeekData(1);
});

function loadWeekData(weekNumber) {
  const container = document.getElementById('workoutsContainer');
  container.innerHTML = '';

  if (weekNumber > 4) {
    container.innerHTML = `
      <div class="future-week">
        <p>Ainda não chegamos na Semana ${weekNumber}</p>
        <p>Este conteúdo estará disponível quando alcançarmos esta semana do programa</p>
      </div>
    `;
    return;
  }

  const workoutTypes = ['A', 'B', 'C', 'D'];
  const startIndex = (weekNumber - 1) % 4;
  
  // Sequência de treinos para a semana: A, B, C, D, A (para semana 1)
  // Semana 2: B, C, D, A, B
  // Semana 3: C, D, A, B, C
  // Semana 4: D, A, B, C, D
  const weekWorkouts = [
    workoutTypes[startIndex % 4],
    workoutTypes[(startIndex + 1) % 4],
    workoutTypes[(startIndex + 2) % 4],
    workoutTypes[(startIndex + 3) % 4],
    workoutTypes[startIndex % 4] // Repete o primeiro da semana
  ];

  const sampleWorkouts = getSampleWorkouts(weekWorkouts, weekNumber);
  
  sampleWorkouts.forEach(workout => {
    const workoutCard = document.createElement('div');
    workoutCard.className = 'workout-card';
    
    let statusClass, statusText;
    if (workout.status === 'completed') {
      statusClass = 'status-completed';
      statusText = 'Concluído';
    } else if (workout.status === 'not-completed') {
      statusClass = 'status-not-completed';
      statusText = 'Não concluído';
    } else {
      statusClass = 'status-pending';
      statusText = 'Pendente';
    }
    
    workoutCard.innerHTML = `
      <div class="workout-header">
        <h3 class="workout-title">${workout.name}</h3>
        <div>
          <span class="workout-date">${workout.date || '--/--/----'}</span>
          <span class="workout-status ${statusClass}">${statusText}</span>
        </div>
      </div>
      <div class="exercise-list"></div>
    `;
    
    const exerciseList = workoutCard.querySelector('.exercise-list');
    
    workout.exercises.forEach(exercise => {
      const exerciseItem = document.createElement('div');
      exerciseItem.className = 'exercise-item';
      
      exerciseItem.innerHTML = `
        <div class="exercise-header">
          <h4 class="exercise-name">${exercise.name}</h4>
          <span class="exercise-toggle">▼</span>
        </div>
        <div class="exercise-details"></div>
      `;
      
      const exerciseDetails = exerciseItem.querySelector('.exercise-details');
      const exerciseToggle = exerciseItem.querySelector('.exercise-toggle');
      
      if (workout.status === 'completed' && exercise.series) {
        exercise.series.forEach((serie, index) => {
          const serieItem = document.createElement('div');
          serieItem.className = 'serie-item';
          serieItem.innerHTML = `
            <span class="serie-number">Série ${index + 1}</span>
            <span class="serie-reps">${serie.reps} reps</span>
            <span class="serie-weight">${serie.weight} kg</span>
          `;
          exerciseDetails.appendChild(serieItem);
        });
      } else if (workout.status === 'not-completed') {
        exerciseDetails.innerHTML = '<div class="not-completed">Exercício não realizado</div>';
      } else {
        exerciseDetails.innerHTML = '<div class="not-completed">Aguardando realização</div>';
      }
      
      exerciseToggle.addEventListener('click', () => {
        exerciseDetails.classList.toggle('show');
        exerciseToggle.classList.toggle('open');
      });
      
      exerciseList.appendChild(exerciseItem);
    });
    
    container.appendChild(workoutCard);
  });
}

function getSampleWorkouts(workoutTypes, weekNumber) {
  const workoutTemplates = {
    'A': {
      name: `Treino A - Peito/Tríceps`,
      exercises: [
        { name: "Supino Reto" },
        { name: "Supino Inclinado" },
        { name: "Crucifixo" },
        { name: "Tríceps Corda" }
      ]
    },
    'B': {
      name: `Treino B - Costas/Bíceps`,
      exercises: [
        { name: "Puxada Alta" },
        { name: "Remada Curvada" },
        { name: "Rosca Direta" },
        { name: "Rosca Martelo" }
      ]
    },
    'C': {
      name: `Treino C - Perna/Ombro`,
      exercises: [
        { name: "Agachamento Livre" },
        { name: "Leg Press" },
        { name: "Cadeira Extensora" },
        { name: "Elevação Lateral" }
      ]
    },
    'D': {
      name: `Treino D - Posterior/Abdômen`,
      exercises: [
        { name: "Stiff" },
        { name: "Mesa Flexora" },
        { name: "Gêmeos Sentado" },
        { name: "Abdominal Supra" }
      ]
    }
  };

  const workouts = [];
  const daysInWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  
  workoutTypes.forEach((type, index) => {
    const dayOffset = index;
    let status, date;
    
    if (weekNumber === 1 && index < 2) {
      // Primeira semana, dois primeiros treinos concluídos
      status = 'completed';
      date = getRandomDate(weekNumber, dayOffset);
    } else if (weekNumber === 2 && index < 3) {
      // Segunda semana, três primeiros treinos concluídos
      status = 'completed';
      date = getRandomDate(weekNumber, dayOffset);
    } else if (weekNumber > 2 && index < 4) {
      // Demais semanas, quatro primeiros treinos concluídos
      status = 'completed';
      date = getRandomDate(weekNumber, dayOffset);
    } else {
      // Último treino da semana não concluído
      status = 'not-completed';
      date = null;
    }
    
    workouts.push({
      ...workoutTemplates[type],
      status: status,
      date: date,
      exercises: workoutTemplates[type].exercises.map(exercise => ({
        ...exercise,
        series: status === 'completed' ? Array(4).fill().map(() => ({
          reps: Math.floor(Math.random() * 3) + 8, // 8-10 reps
          weight: Math.floor(Math.random() * 20) + 30 // 30-50kg
        })) : null
      }))
    });
  });

  return workouts;
}

function getRandomDate(weekNumber, dayOffset) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + (weekNumber - 1) * 7 + dayOffset);
  
  const day = String(baseDate.getDate()).padStart(2, '0');
  const month = String(baseDate.getMonth() + 1).padStart(2, '0');
  const year = baseDate.getFullYear();
  
  return `${day}/${month}/${year}`;
}