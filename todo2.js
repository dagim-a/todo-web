const todolist = [];
const completedList = [];

function renderTodos() {              
    const upcomingList = document.getElementById('upcoming-list');// Render upcoming todos
    let html = "";
    todolist.forEach((todo, index) => {
        html += `
            <div>
                <input type="checkbox" class="todo-checkbox" data-index="${index}">
                <span>${todo}</span>
            </div>
        `;
    });
    upcomingList.innerHTML = html;

    const completedDiv = document.getElementById('completed-list'); // Render completed todos
    let completedHtml = "";
    completedList.forEach(todo => {
        completedHtml += `<div><span>${todo}</span></div>`;
    });
    completedDiv.innerHTML = completedHtml;
}

function deleteSelectedTodos() {
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    const indexesToDelete = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            indexesToDelete.push(Number(cb.getAttribute('data-index')));
        }
    });
    indexesToDelete.sort((a, b) => b - a); // shift array
    indexesToDelete.forEach(idx => {
        todolist.splice(idx, 1); // splice() deletes one item at specific index.
    });
    renderTodos(); // refresh the display
    saveTodosToServer();
}

function finishSelectedTodos() {
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    const indexesToFinish = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            indexesToFinish.push(Number(cb.getAttribute('data-index')));
        }
    });
    indexesToFinish.sort((a, b) => b - a);
    indexesToFinish.forEach(idx => {
        completedList.push(todolist[idx]); // push it to completedList
        todolist.splice(idx, 1); // remove from the upcoming list
    });
    renderTodos();
    saveTodosToServer();
}

function openModal() {
    document.getElementById('todo-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('todo-modal').style.display = 'none';
}

function addTodoFromModal() {
    const input = document.querySelector('.todoInputModal');
    const dateInput = document.querySelector('.tododateModal');
    const todoText = input.value.trim();
    const dueDate = dateInput.value;
    if (todoText === "" || dueDate === "") {
        alert("Please enter a todo name and due date.");
        return;
    }
    todolist.push(`${todoText} <br> (Due: ${dueDate}) <br> <hr>`);
    input.value = "";
    dateInput.value = "";
    closeModal();
    renderTodos();
    saveTodosToServer();
}

function saveTodosToServer() {
    fetch('save_todos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({   // Send both lists to the server
            todolist: todolist,
            completedList: completedList  
        })
    })
    .then(response => response.json()) // converts it into JSON format.
    .then(data => {
        // Optionally handle response
        console.log('Saved:', data); // Logs the saved data to the console for debugging purposes.
    })
    .catch(error => {
        console.error('Error saving todos:', error);
    });
}

// Load todos from server on page load
window.onload = function() {
    fetch('load_todos.php') // retrieve previously saved to-do list
        .then(response => response.json())
        .then(data => {
            todolist.length = 0;          // old data is removed before adding the new data
            completedList.length = 0;
            if (Array.isArray(data.todolist)) { // check if todolist is an array
                todolist.push(...data.todolist);
            }
            if (Array.isArray(data.completedList)) {
                completedList.push(...data.completedList);
            }
            renderTodos();
        })
        .catch(error => {
            console.error('Error loading todos:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() { // wait for the HTML document to fully load before executing the function
    renderTodos(); // Ensures the to-do list is rendered right away when the page loads

    // Make functions global for inline onclick
    window.addtodo = addtodo;
    window.deleteSelectedTodos = deleteSelectedTodos;
    window.finishSelectedTodos = finishSelectedTodos;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.addTodoFromModal = addTodoFromModal;
});