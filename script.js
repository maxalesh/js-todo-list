const form = document.querySelector('.todo__form');
const input = document.querySelector('.todo__input');
const tasksListActive = document.querySelector('.tasks__list--active');
const tasksListDone = document.querySelector('.tasks__list--done');
const activeTasksCounter = document.getElementById('tasks__active-count');
const doneTasksCounter = document.getElementById('tasks__done-count');
const emptyMessage = document.querySelector('.todo__empty-message');

function createTaskElement(text, isActiveTask = true) {
    const li = document.createElement('li');
    li.className = 'tasks__item';

    const span = document.createElement('span');
    span.className = 'tasks__text';
    span.textContent = text;

    const controls = document.createElement('div');
    controls.className = 'tasks__controls';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'tasks__btn tasks__btn--delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '/icons/delete.svg';
    deleteIcon.alt = 'Delete task';
    deleteIcon.classList.add('tasks__icon');
    deleteBtn.appendChild(deleteIcon);

    const doneBtn = document.createElement('button');
    doneBtn.className = 'tasks__btn tasks__btn--done';
    doneBtn.setAttribute('aria-label', 'Mark as done');
    const doneIcon = document.createElement('img');
    doneIcon.src = '/icons/done.svg';
    doneIcon.alt = 'Mark as done';
    doneIcon.classList.add('tasks__icon');
    doneBtn.appendChild(doneIcon);



    if (isActiveTask) {
        controls.append(doneBtn, deleteBtn);
        li.append(span, controls);
    } else {
        li.appendChild(span);
    }

    return li;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText === '') return;
    input.value = '';
    const taskElement = createTaskElement(taskText);
    tasksListActive.appendChild(taskElement);
    saveTasks();
    updateCounters();
    hiddenMessage();
});

tasksListActive.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.tasks__btn--delete')) {
        const taskItem = target.closest('.tasks__item');
        taskItem.remove();
    }

    if (target.closest('.tasks__btn--done')) {
        const taskItem = target.closest('.tasks__item');
        const controls = taskItem.querySelector('.tasks__controls');

        taskItem.classList.add('tasks__item--done');
        tasksListDone.appendChild(taskItem);
        controls.remove();
    }
    saveTasks();
    updateCounters();
});

function saveTasks() {
    const activeTasks = Array.from(tasksListActive.querySelectorAll('.tasks__item'))
        .map(task => ({
            text: task.querySelector('.tasks__text').textContent
        }));

    const doneTasks = Array.from(tasksListDone.querySelectorAll('.tasks__item'))
        .map(task => ({
            text: task.querySelector('.tasks__text').textContent
        }));

    localStorage.setItem('tasks', JSON.stringify({
        active: activeTasks,
        done: doneTasks
    }));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) {
        localStorage.setItem('tasks', JSON.stringify({
            active: [],
            done: []
        }));
        return
    }

    tasks.active.forEach(task => {
        const taskElement = createTaskElement(task.text);
        tasksListActive.appendChild(taskElement);
    });

    tasks.done.forEach(task => {
        const taskElement = createTaskElement(task.text, false);
        taskElement.classList.add('tasks__item--done');
        tasksListDone.appendChild(taskElement);
    });
}

function updateCounters() {
    const activeTasksCount = tasksListActive.querySelectorAll('.tasks__item').length;
    const doneTasksCount = tasksListDone.querySelectorAll('.tasks__item').length;

    activeTasksCounter.textContent = activeTasksCount.toString();
    doneTasksCounter.textContent = doneTasksCount.toString();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCounters();
    hiddenMessage();
});

function hiddenMessage() {
    const activeTasksCount = tasksListActive.querySelectorAll('.tasks__item').length;
    const doneTasksCount = tasksListDone.querySelectorAll('.tasks__item').length;
    if (activeTasksCount !== 0 || doneTasksCount !== 0) {
        emptyMessage.classList.add('hidden');
    }
}