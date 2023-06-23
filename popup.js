var reminderList = [];

document.addEventListener("DOMContentLoaded", function() {
  loadReminders();
});

function addReminder() {
  var reminderInput = document.getElementById("reminderInput");
  var prioritySelect = document.getElementById("prioritySelect");

  var reminderText = reminderInput.value;
  var priority = prioritySelect.value;

  if (reminderText.trim() === "") {
    alert("Please enter a reminder.");
    return;
  }

  if (priority === "") {
    alert("Please select a priority.");
    return;
  }

  var reminder = {
    text: reminderText,
    priority: priority
  };

  reminderList.push(reminder);

  saveReminders();
  renderReminders();

  reminderInput.value = "";
  prioritySelect.selectedIndex = 0;
}


function renderReminders() {
  var reminderListElement = document.getElementById("reminderList");
  reminderListElement.innerHTML = "";

  for (var i = 0; i < reminderList.length; i++) {
    var reminder = reminderList[i];

    var reminderItemElement = document.createElement("li");
    reminderItemElement.className = "reminder-item";

    var reminderBoxElement = document.createElement("div");
    reminderBoxElement.className = "reminder-box";

    var priorityIndicatorElement = document.createElement("div");
    priorityIndicatorElement.className = "priority-indicator " + reminder.priority.toLowerCase();
    priorityIndicatorElement.classList.add(reminder.priority.toLowerCase());

    var reminderTextElement = document.createElement("span");
    reminderTextElement.className = "reminder-text";
    reminderTextElement.textContent = reminder.text;
    reminderTextElement.setAttribute("data-reminder", reminder.text);

    var checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.className = "reminder-checkbox";
    checkboxElement.checked = reminder.completed;
    checkboxElement.setAttribute("data-reminder", reminder.text);
    checkboxElement.onchange = (function(reminder) {
      return function() {
        toggleCompletion(reminder);
        renderReminders(); // Re-render the reminders to apply changes
      };
    })(reminder);

    if (reminder.completed) {
      reminderTextElement.classList.add("completed");
      reminderTextElement.style.textDecoration = "line-through";
      reminderTextElement.style.color = "grey";
    } else {
      reminderTextElement.classList.remove("completed");
      reminderTextElement.style.textDecoration = "none";
      reminderTextElement.style.color = ""; // Reset the color
    }

    var deleteButtonElement = document.createElement("button");
    deleteButtonElement.className = "delete-button";
    deleteButtonElement.onclick = (function(reminder) {
      return function() {
        deleteReminder(reminder);
        renderReminders(); // Re-render the reminders after deletion
      };
    })(reminder);

    var deleteIconElement = document.createElement("img");
    deleteIconElement.src = "deleteicon.png";

    deleteButtonElement.appendChild(deleteIconElement);
    reminderBoxElement.appendChild(priorityIndicatorElement);
    reminderBoxElement.appendChild(reminderTextElement);
    reminderBoxElement.appendChild(checkboxElement);
    reminderBoxElement.appendChild(deleteButtonElement);
    reminderItemElement.appendChild(reminderBoxElement);
    reminderListElement.appendChild(reminderItemElement);
  }
}



function toggleCompletion(reminder) {
  reminder.completed = !reminder.completed;
}


function deleteReminder(reminder) {
  var index = reminderList.indexOf(reminder);
  if (index > -1) {
    reminderList.splice(index, 1);
    saveReminders();
    renderReminders();
  }
}

function saveReminders() {
  chrome.storage.local.set({ reminders: reminderList }, function() {
    console.log("Reminders saved to storage.");
  });
}

function loadReminders() {
  chrome.storage.local.get("reminders", function(data) {
    if (data.reminders) {
      reminderList = data.reminders;
      renderReminders();
    }
  });
}

document.getElementById("addButton").addEventListener("click", addReminder);
