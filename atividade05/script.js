document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const editId = document.getElementById('edit-id');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const tasksList = document.getElementById('tasks-list');
    const noTasksMsg = document.getElementById('no-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Renderizar tarefas ao carregar
    renderTasks();

    // Evento do formulário
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        
        if (!title) {
            alert('Por favor, insira um título para a tarefa');
            return;
        }

        if (editId.value) {
            // Editar tarefa existente
            const taskId = parseInt(editId.value);
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description
                };
                
                alert('Tarefa atualizada com sucesso!');
            }
        } else {
            // Adicionar nova tarefa
            const newTask = {
                id: Date.now(),
                title,
                description,
                completed: false,
                createdAt: new Date()
            };
            
            tasks.push(newTask);
            alert('Tarefa adicionada com sucesso!');
        }

        saveTasks();
        resetForm();
        renderTasks();
    });

    // Botão limpar
    clearBtn.addEventListener('click', resetForm);

    // Função para renderizar tarefas
    function renderTasks() {
        if (tasks.length === 0) {
            noTasksMsg.style.display = 'block';
            tasksList.innerHTML = '';
            return;
        }

        noTasksMsg.style.display = 'none';
        tasksList.innerHTML = '';

        tasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.completed ? 1 : -1;
        }).forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = `task-card mb-3 p-3 border rounded ${task.completed ? 'completed bg-light' : ''}`;
            taskElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-1">${task.title}</h5>
                        <p class="mb-1 text-muted">${task.description || 'Sem descrição'}</p>
                        <small class="text-muted">${new Date(task.createdAt).toLocaleString()}</small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm ${task.completed ? 'btn-outline-success' : 'btn-success'}" 
                                onclick="toggleTask(${task.id})">
                            ${task.completed ? '✓' : 'Concluir'}
                        </button>
                        <button class="btn btn-sm btn-warning" 
                                onclick="editTask(${task.id})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="deleteTask(${task.id})">
                            Excluir
                        </button>
                    </div>
                </div>
            `;
            tasksList.appendChild(taskElement);
        });
    }

    // Função para resetar o formulário
    function resetForm() {
        taskForm.reset();
        editId.value = '';
        submitBtn.textContent = 'Adicionar';
    }

    // Função para salvar no localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Funções globais para os botões
    window.toggleTask = function(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    };

    window.editTask = function(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            taskTitle.value = task.title;
            taskDescription.value = task.description || '';
            editId.value = task.id;
            submitBtn.textContent = 'Atualizar';
            taskTitle.focus();
        }
    };

    window.deleteTask = function(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    };
});