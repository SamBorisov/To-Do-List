//getting the HTML elements
const todoInput = document.querySelector(".todo-input");
const dateSelector = document.getElementById("deadline");
const prioritySelector = document.getElementById("priority");

const todoButton = document.querySelector(".todo-button");
const todoList = document.getElementById("todo-list");

const sortBySelect = document.getElementById("sort-by");
sortBySelect.addEventListener("change", sortTasks);

const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", filterTasks);

//event listener
todoButton.addEventListener('click', addItem);

// Call renderTasks() on page load
document.addEventListener("DOMContentLoaded", renderTasks);

//helper function for short console.log
const cl = (e) => console.log(e)

//task object and array
let tasks = [];
const storedTasks = JSON.parse(localStorage.getItem("tasks"));
if (storedTasks) {
  tasks = storedTasks;
}

// Function to add a new task ------------------------------------------------------------------
function addItem(e) {
    e.preventDefault();
  
    // Check if todoInput value is empty
    if (todoInput.value === "") {
      return;
    }
  
    // Get task details from input fields
    const description = todoInput.value;
    const priority = prioritySelector.value;
    const deadlineValue = dateSelector.value;
  
    // Check if deadline is set and if it is in the future
    const deadline = deadlineValue ? new Date(dateSelector.value) : null;
    const validDate = new Date(Date.now() - (1 * 24 * 60 * 60 * 1000));
    if (deadline && deadline.getTime() < validDate.getTime()) {
      alert("Deadline must be in the future");
      return;
    }
  
    // Create new task object
    const newTask = {
      description: description,
      status: false,
      deadline: deadline,
      priority: priority
    };
  
    // Reset input fields, save the task into the array, and render it
    todoInput.value = "";
    tasks.push(newTask);
    cl(newTask);
  
    // Store the updated tasks array in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  




//render ----------------------------------------------------------------------
function renderTasks(filter) {
  // Clear the task list
  todoList.innerHTML = "";

  // Load tasks from local storage if available
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  //for filtered items
  let renderItems = [];
  filter && Array.isArray(filter) ? renderItems = filter : renderItems = tasks;

  // Loop through the tasks array and render each task as a list item
  renderItems.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("todo-item");

      // Create a paragraph element for the task description
      const taskDescription = document.createElement("p");
      taskDescription.classList.add("task-description");
      taskDescription.classList.toggle("completed", task.status);
      taskDescription.textContent = task.description;

      // Add an event listener to toggle the task completion status when the description is clicked
      taskDescription.onclick = () => toggleComplete(index);



      // Create a div element for the task details and add it to the task item
      const taskDetails = document.createElement("div");
      taskDetails.classList.add("task-details");

      // If the task has a deadline, create a paragraph element for it and add it to the task details div
      if (task.deadline) {
          const taskDeadline = document.createElement("p");
          taskDeadline.classList.add("task-deadline");
          const deadlineDate = new Date(task.deadline).toLocaleDateString('en-US', {day: 'numeric', month: 'short'});
          taskDeadline.textContent = deadlineDate;
          taskDetails.appendChild(taskDeadline);
      }

      // Create a paragraph element for the task priority and add it to the task details div
      const taskPriority = document.createElement("p");
      taskPriority.classList.add("task-priority");
      taskPriority.textContent = task.priority;
      taskDetails.appendChild(taskPriority);

      // Append the task details div to the task item
      taskItem.appendChild(taskDetails);
      taskItem.appendChild(taskDescription);

      // Create a button element to edit the task and add it to the task item
      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      editButton.dataset.index = index;
      editButton.onclick = () => editTask(index);
      
      const editIcon = document.createElement("i");
      editIcon.classList.add("fas", "fa-edit"); 
      editButton.appendChild(editIcon);
      taskItem.appendChild(editButton);

      // Create a button element to delete the task and add it to the task item
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.index = index;
      deleteButton.onclick = () => deleteTask(index);

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fas", "fa-trash");
      deleteButton.appendChild(deleteIcon);
      taskItem.appendChild(deleteButton);

      // Add the task item to the todoList unordered list element
      todoList.appendChild(taskItem);
  });
}

  

  

// Mark as complete on click ----------------------------------------------------
function toggleComplete(index) {
  tasks[index].status = !tasks[index].status;
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
  renderTasks();
}


  //delete task------------------------------------------------------------------
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    cl(`Task ${index} deleted`)
  }



//Edit task------------------------------------------------------------------------
function editTask(index) {
  const task = tasks[index];
  const form = document.createElement("form");
  
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description:";
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.name = "description";
  descriptionInput.required = true;
  descriptionInput.value = task.description;
  
  const deadlineLabel = document.createElement("label");
  deadlineLabel.textContent = "Deadline:";
  const deadlineInput = document.createElement("input");
  deadlineInput.type = "date";
  deadlineInput.name = "deadline";
  if (task.deadline) {
    const deadlineDate = new Date(task.deadline);
    const deadlineDateString = deadlineDate.toISOString().slice(0,16);
    deadlineInput.value = deadlineDateString;
  }
  
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority:";
  const prioritySelect = document.createElement("select");
  prioritySelect.name = "priority";
  prioritySelect.required = true;
  
  const highOption = document.createElement("option");
  highOption.value = "high";
  highOption.textContent = "high";
  if (task.priority === 'high') {
    highOption.selected = true;
  }
  prioritySelect.appendChild(highOption);
  
  const mediumOption = document.createElement("option");
  mediumOption.value = "normal";
  mediumOption.textContent = "normal";
  if (task.priority === 'normal') {
    mediumOption.selected = true;
  }
  prioritySelect.appendChild(mediumOption);
  
  const lowOption = document.createElement("option");
  lowOption.value = "low";
  lowOption.textContent = "low";
  if (task.priority === 'low') {
    lowOption.selected = true;
  }
  prioritySelect.appendChild(lowOption);
  
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save";
  
  // Add the form fields to the form element
  form.appendChild(descriptionLabel);
  form.appendChild(descriptionInput);
  form.appendChild(deadlineLabel);
  form.appendChild(deadlineInput);
  form.appendChild(priorityLabel);
  form.appendChild(prioritySelect);
  form.appendChild(saveButton);
  
  // Replace the task item with the form
  const taskItem = todoList.children[index];
  todoList.replaceChild(form, taskItem);
  
  // Save the previous state of status from local storage
  const previousStatus = task.status;
  
  // When the form is submitted, update the task and re-render the task list
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = form.querySelector('[name="description"]').value;
    const deadlineValue = form.querySelector('[name="deadline"]').value;
    const deadline = deadlineValue ? new Date(deadlineValue) : null;
    const priority = form.querySelector('[name="priority"]').value;
    const updatedTask = { description, deadline, priority, status: previousStatus };
    tasks[index] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    cl(`Task ${index} edited`)
    
    // Remove "completed" class if the status is false
    const taskItem = todoList.children[index];
    if (previousStatus === false) {
      taskItem.classList.remove('completed');
    }
  });
}

  


// Function to sort the tasks array based on the selected value----------------------------------------------------------
function sortTasks() {
    // Get the selected value
    const sortByValue = sortBySelect.value;
    
    // Split the value into sort field and sort order
    const [sortField, sortOrder] = sortByValue.split("-");
    
    // Sort the tasks array based on the selected field and order
    tasks.sort((task1, task2) => {
      if (sortField === "description") {
        const desc1 = task1.description.toLowerCase();
        const desc2 = task2.description.toLowerCase();
        if (sortOrder === "asc") {
          return desc1.localeCompare(desc2);
        } else {
          return desc2.localeCompare(desc1);
        }
      } else if (sortField === "deadline") {
        const deadline1 = task1.deadline;
        const deadline2 = task2.deadline;
        if (!deadline1) {
          return 1;
        } else if (!deadline2) {
          return -1;
        } else if (sortOrder === "asc") {
          return deadline1.getTime() - deadline2.getTime();
        } else {
          return deadline2.getTime() - deadline1.getTime();
        }
      } else if (sortField === "priority") {
        const priorityOrder = { low: 0, normal: 1, high: 2 };
        const priority1 = priorityOrder[task1.priority.toLowerCase()];
        const priority2 = priorityOrder[task2.priority.toLowerCase()];
        if (sortOrder === "asc") {
          return priority1 - priority2;
        } else {
          return priority2 - priority1;
        }    
      }
    });
  
    // Render the sorted tasks
    renderTasks();
  }
  
  
  
  //Filter elements--------------------------------------------------------------------------
  function filterTasks() {
    const filterSelect = document.getElementById("filter-select");
    const selectedFilter = filterSelect.value;
  
    let filteredTasks = tasks;
  
    if (selectedFilter === "low") {
      filteredTasks = filteredTasks.filter(task => task.priority === "low");
    } else if (selectedFilter === "normal") {
      filteredTasks = filteredTasks.filter(task => task.priority === "normal");
    } else if (selectedFilter === "high") {
      filteredTasks = filteredTasks.filter(task => task.priority === "high");
    } else if (selectedFilter === "completed") {
      filteredTasks = filteredTasks.filter(task => task.status === true);
    } else if (selectedFilter === "incomplete") {
      filteredTasks = filteredTasks.filter(task => task.status === false);
    }
  
    renderTasks(filteredTasks);
  }
  