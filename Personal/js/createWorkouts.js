document.addEventListener('DOMContentLoaded', function() {
  const workoutName = document.getElementById('workoutName');
  const exerciseSelect = document.getElementById('exercise');
  const methodSelect = document.getElementById('method');
  const setsSelect = document.getElementById('sets');
  const repsContainer = document.getElementById('reps-container');
  const restInput = document.getElementById('rest');
  const addExerciseBtn = document.getElementById('addExercise');
  const saveWorkoutBtn = document.getElementById('saveWorkout');
  const dayTabs = document.getElementById('dayTabs');
  const workoutPreview = document.getElementById('workoutPreview');
  
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  const alunoId = urlParams.get('aluno');

  let currentWorkout = {
    id: null,
    name: '',
    structure: 'AB',
    days: {}
  };

  if (editId) {
    const treinoEditavel = JSON.parse(localStorage.getItem('treinoEditavel'));
    if (treinoEditavel) {
      currentWorkout = {
        id: treinoEditavel.id,
        name: treinoEditavel.nome,
        structure: treinoEditavel.estrutura,
        days: treinoEditavel.dias
      };
      workoutName.value = currentWorkout.name;
      document.querySelector(`input[name="structure"][value="${currentWorkout.structure}"]`).checked = true;
      saveWorkoutBtn.textContent = 'Salvar Alterações';
      saveWorkoutBtn.classList.add('update');
    }
  }

  function initWorkoutDays() {
    const structure = document.querySelector('input[name="structure"]:checked').value;
    currentWorkout.structure = structure;
    currentWorkout.days = {};
    
    dayTabs.innerHTML = '';
    workoutPreview.innerHTML = '';
    
    for (let i = 0; i < structure.length; i++) {
      const day = structure[i];
      currentWorkout.days[day] = editId ? [...(currentWorkout.days[day] || [])] : [];
      
      const dayTab = document.createElement('div');
      dayTab.className = 'day-tab';
      dayTab.textContent = `Dia ${day}`;
      dayTab.dataset.day = day;
      
      dayTab.addEventListener('click', () => {
        document.querySelectorAll('.day-tab').forEach(tab => tab.classList.remove('active'));
        dayTab.classList.add('active');
        renderWorkoutPreview(day);
      });
      
      dayTabs.appendChild(dayTab);
    }
    
    document.querySelector('.day-tab').click();
  }

  function updateRepsInputs() {
    const sets = parseInt(setsSelect.value);
    let html = '';
    
    for (let i = 0; i < sets; i++) {
      html += `<input type="number" class="rep-input" placeholder="Série ${i+1}" min="1" max="50" required>`;
    }
    
    repsContainer.querySelector('.reps-inputs').innerHTML = html;
  }

  function renderWorkoutPreview(day) {
    const exercises = currentWorkout.days[day] || [];
    
    if (exercises.length === 0) {
      workoutPreview.innerHTML = '<p>Nenhum exercício adicionado ainda.</p>';
      return;
    }
    
    let html = '';
    
    exercises.forEach((exercise, index) => {
      html += `
        <div class="exercise-item" data-index="${index}">
          <h3>${exercise.name}</h3>
          <p><strong>Método:</strong> ${exercise.method}</p>
          <p><strong>Séries:</strong> ${exercise.sets}</p>
          <p><strong>Repetições:</strong> ${exercise.reps.join(', ')}</p>
          <p><strong>Intervalo:</strong> ${exercise.rest}s</p>
          <div class="exercise-actions">
            <button class="edit-exercise">✏️</button>
            <button class="delete-exercise">🗑️</button>
          </div>
        </div>
      `;
    });
    
    workoutPreview.innerHTML = html;
    
    document.querySelectorAll('.delete-exercise').forEach((btn) => {
      btn.addEventListener('click', function(e) {
        const exerciseItem = this.closest('.exercise-item');
        const index = parseInt(exerciseItem.dataset.index);
        currentWorkout.days[day].splice(index, 1);
        renderWorkoutPreview(day);
      });
    });
    
    document.querySelectorAll('.edit-exercise').forEach((btn) => {
      btn.addEventListener('click', function(e) {
        const exerciseItem = this.closest('.exercise-item');
        const index = parseInt(exerciseItem.dataset.index);
        const exercise = currentWorkout.days[day][index];
        editExercise(exercise, day, index);
      });
    });
  }

  function editExercise(exercise, day, index) {
    exerciseSelect.value = exercise.name;
    methodSelect.value = exercise.method;
    setsSelect.value = exercise.sets;
    updateRepsInputs();
    
    const repInputs = document.querySelectorAll('.rep-input');
    exercise.reps.forEach((rep, i) => {
      if (repInputs[i]) {
        repInputs[i].value = rep;
      }
    });
    
    restInput.value = exercise.rest;
    
    addExerciseBtn.textContent = 'Atualizar Exercício';
    addExerciseBtn.onclick = function() {
      updateExercise(day, index);
    };
  }

  function updateExercise(day, index) {
    const repInputs = document.querySelectorAll('.rep-input');
    const reps = [];
    
    repInputs.forEach(input => {
      reps.push(parseInt(input.value));
    });
    
    currentWorkout.days[day][index] = {
      name: exerciseSelect.value,
      method: methodSelect.value,
      sets: parseInt(setsSelect.value),
      reps: reps,
      rest: parseInt(restInput.value)
    };
    
    renderWorkoutPreview(day);
    resetForm();
  }

  function resetForm() {
    exerciseSelect.value = '';
    methodSelect.value = 'Top Set';
    setsSelect.value = '3';
    updateRepsInputs();
    restInput.value = '60';
    addExerciseBtn.textContent = 'Adicionar Exercício';
    addExerciseBtn.onclick = addExercise;
  }

  function addExercise() {
    if (!exerciseSelect.value) {
      exerciseSelect.style.borderColor = 'red';
      return;
    }
    exerciseSelect.style.borderColor = '';

    const repInputs = document.querySelectorAll('.rep-input');
    const reps = [];
    let isValid = true;
    
    repInputs.forEach(input => {
      if (!input.value || isNaN(input.value)) {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        reps.push(parseInt(input.value));
        input.style.borderColor = '';
      }
    });
    
    if (!isValid) return;

    const activeDay = document.querySelector('.day-tab.active').dataset.day;
    const exercise = {
      name: exerciseSelect.value,
      method: methodSelect.value,
      sets: parseInt(setsSelect.value),
      reps: reps,
      rest: parseInt(restInput.value)
    };
    
    currentWorkout.days[activeDay].push(exercise);
    renderWorkoutPreview(activeDay);
    resetForm();
  }

  function saveWorkout() {
    currentWorkout.name = workoutName.value.trim();
    
    if (!currentWorkout.name) {
      workoutName.style.borderColor = 'red';
      return;
    }
    workoutName.style.borderColor = '';
    
    const hasExercises = Object.values(currentWorkout.days).some(day => day.length > 0);
    
    if (!hasExercises) {
      alert('Adicione pelo menos um exercício');
      return;
    }
    
    const savedWorkouts = JSON.parse(localStorage.getItem('treinosPersonalizados')) || [];
    
    if (editId) {
      const index = savedWorkouts.findIndex(t => t.id == editId);
      if (index !== -1) {
        savedWorkouts[index] = {
          id: currentWorkout.id,
          nome: currentWorkout.name,
          estrutura: currentWorkout.structure,
          dias: currentWorkout.days
        };
      }
    } else {
      currentWorkout.id = Date.now();
      savedWorkouts.push({
        id: currentWorkout.id,
        nome: currentWorkout.name,
        estrutura: currentWorkout.structure,
        dias: currentWorkout.days
      });
    }
    
    localStorage.setItem('treinosPersonalizados', JSON.stringify(savedWorkouts));
    
    if (alunoId) {
      const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
      const alunoIndex = alunos.findIndex(a => a.id == alunoId);
      if (alunoIndex !== -1) {
        alunos[alunoIndex].treinoId = currentWorkout.id;
        localStorage.setItem('alunos', JSON.stringify(alunos));
      }
    }
    
    window.location.href = 'predefinedWorkouts.html';
  }
  
  document.querySelectorAll('input[name="structure"]').forEach(radio => {
    radio.addEventListener('change', initWorkoutDays);
  });
  
  setsSelect.addEventListener('change', updateRepsInputs);
  addExerciseBtn.addEventListener('click', addExercise);
  saveWorkoutBtn.addEventListener('click', saveWorkout);
  
  updateRepsInputs();
  initWorkoutDays();
});