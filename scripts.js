const taskInput = document.getElementById("taskInput");
const reminderSelect = document.getElementById("reminderSelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const terminateBtn = document.getElementById("terminateBtn");
const taskList = document.getElementById("taskList");
const reminderMusicSelect = document.getElementById("reminderMusicSelect");
let reminderTimeout; // Store the reminder timeout reference
let audio;

// Function to create a new task item
function createTaskItem(taskText, reminder, taskId) {
  const li = document.createElement("li");

  const taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  taskTextSpan.textContent = taskText;

  const reminderSpan = document.createElement("span");
  reminderSpan.classList.add("reminder");
  reminderSpan.textContent = reminder ? `Reminder: ${reminder} minutes` : "";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    clearReminder();
    saveTasks();
  });

  li.appendChild(taskTextSpan);
  li.appendChild(reminderSpan);
  li.appendChild(deleteBtn);
  li.dataset.id = taskId;

  // Schedule alarm if a reminder time is set
  if (reminder) {
    const reminderTime = parseInt(reminder, 10) * 60000; // Convert minutes to milliseconds
    reminderTimeout = setTimeout(() => {
      playAudio();
    }, reminderTime);
  }

  return li;
}

// Function to add a new task
function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;
  if (taskText.trim() !== "") {
    const reminder = reminderSelect.value;
    const taskId = Date.now(); // Generate a unique task ID
    const li = createTaskItem(taskText, reminder, taskId);
    taskList.appendChild(li);
    taskInput.value = "";
    reminderSelect.value = "none";
    saveTasks();
  }
}

// Function to save tasks to local storage
function saveTasks() {
  const tasks = [];
  const taskItems = taskList.querySelectorAll("li");

  taskItems.forEach((taskItem) => {
    const taskId = taskItem.dataset.id;
    const taskText = taskItem.querySelector(".task-text").textContent;
    const reminder = taskItem.querySelector(".reminder").textContent;

    tasks.push({ id: taskId, text: taskText, reminder: reminder });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to retrieve tasks from local storage
function retrieveTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    return JSON.parse(storedTasks);
  }
  return [];
}

// Function to render tasks
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const li = createTaskItem(task.text, task.reminder, task.id);
    taskList.appendChild(li);
  });
}

// Retrieve tasks from local storage and render them
const tasks = retrieveTasks();
renderTasks(tasks);

// Add event listeners
addTaskBtn.addEventListener("click", addTask);

// Function to play audio
function playAudio() {
  const selectedAudio = reminderMusicSelect.value;
  
  if (selectedAudio) {
    audio = new Audio(selectedAudio);
    audio.addEventListener("ended", () => {
      // Perform any additional actions here
    });
    audio.play();
  }
}

// Function to clear the reminder
function clearReminder() {
  clearTimeout(reminderTimeout);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Add event listener to terminate button
terminateBtn.addEventListener("click", () => {
  clearReminder();
});
