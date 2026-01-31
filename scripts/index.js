var _a, _b;
var tasks = JSON.parse((_a = localStorage.getItem("tasks")) !== null && _a !== void 0 ? _a : "[]");
var priority = {
    low: {
        text: "Low",
        className: "low-priority",
    },
    medium: {
        text: "Medium",
        className: "medium-priority",
    },
    high: {
        text: "High Priority",
        className: "high-priority",
    },
};
//? Form Inputs
var titlefield = document.querySelector("#titleInput");
var datefield = document.querySelector("#dateInput");
var textAreaField = document.querySelector("#description");
var priorityField = document.querySelector("#priority-select");
// LIVE CHARACTER COUNT
var textAreaCount = document.querySelector("#charCount");
textAreaField === null || textAreaField === void 0 ? void 0 : textAreaField.addEventListener("input", function () {
    textAreaCount.innerHTML = "".concat(textAreaField.value.length, "/500");
});
var submitButton = document.querySelector("#submit-button");
var editButton = document.querySelector("#edit-button");
var titleError = document.querySelector("#titleError");
var dateError = document.querySelector("#dateError");
(_b = document.querySelector("#add-task")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.classList.remove("d-none");
    editButton === null || editButton === void 0 ? void 0 : editButton.classList.add("d-none");
    titlefield.value = "";
    datefield.value = "";
    textAreaField.value = "";
    priorityField.value = "medium";
    titleError === null || titleError === void 0 ? void 0 : titleError.classList.add("d-none");
    titlefield.style.borderColor = "#cad5e2";
    dateError === null || dateError === void 0 ? void 0 : dateError.classList.add("d-none");
    datefield.style.borderColor = "#cad5e2";
});
// CREATE
submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener("click", function () {
    var titleValid = validateTitle();
    var dateValid = validateDate();
    // STORE DATA
    if (titleValid && dateValid) {
        storeData();
        closeTaskModal();
        showNotification("Task added successfully!", "#00bc7d");
    }
});
function closeTaskModal() {
    var modalEl = document.getElementById("addTask");
    var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
}
// VALIDATE TITLE
function validateTitle() {
    var titleInput = titlefield.value;
    var titleValid = true;
    // TITLE VALIDATION
    if (!titleInput) {
        titleError.classList.remove("d-none");
        titleError.innerHTML = "Task title is required";
        titlefield.style.borderColor = "#fb2c36";
        titleValid = false;
    }
    else if (titleInput.length < 3) {
        titleError.classList.remove("d-none");
        titleError.innerHTML = "Title must be at least 3 characters";
        titlefield.style.borderColor = "#fb2c36";
        titleValid = false;
    }
    else {
        titleError === null || titleError === void 0 ? void 0 : titleError.classList.add("d-none");
        titlefield.style.borderColor = "#cad5e2";
        titleValid = true;
    }
    return titleValid;
}
// VALIDATE DATE
function validateDate() {
    var dateInput = datefield.value;
    var dateValid = true;
    // DATE VALIDATION
    if (dateInput) {
        var inputdate = new Date(dateInput).setHours(0, 0, 0, 0);
        var todaydate = new Date().setHours(0, 0, 0, 0);
        if (inputdate < todaydate) {
            dateError === null || dateError === void 0 ? void 0 : dateError.classList.remove("d-none");
            datefield.style.borderColor = "#fb2c36";
            dateValid = false;
        }
        else {
            dateError === null || dateError === void 0 ? void 0 : dateError.classList.add("d-none");
            datefield.style.borderColor = "#cad5e2";
            dateValid = true;
        }
    }
    else {
        dateError === null || dateError === void 0 ? void 0 : dateError.classList.add("d-none");
        datefield.style.borderColor = "#cad5e2";
        dateValid = true;
    }
    return dateValid;
}
// STORE DATA FUNCTION
function storeData() {
    tasks.push({
        title: titlefield.value,
        date: datefield.value === "" ? "" : datefield.value,
        description: textAreaField.value,
        priority: priorityField.value,
        status: "todo",
        createdAt: new Date().toISOString(),
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData();
    titlefield.value = "";
    datefield.value = "";
    textAreaField.value = "";
    priorityField.value = "medium";
}
// DISPLAY FUNCTION
function displayData() {
    var _a;
    var todoBlackbox = "";
    var inprogressBlackBox = "";
    var completedBlackBox = "";
    tasks = JSON.parse((_a = localStorage.getItem("tasks")) !== null && _a !== void 0 ? _a : "[]");
    var _b = getTaskCounts(), todoCount = _b.todoCount, inProgressCount = _b.inProgressCount, completedCount = _b.completedCount;
    document.getElementById("complete-count").innerHTML = "".concat(completedCount);
    document.getElementById("progress-count").innerHTML = "".concat(inProgressCount);
    document.getElementById("todo-count").innerHTML = "".concat(todoCount);
    tasks.forEach(function (task, i) {
        var _a, _b, _c, _d, _e, _f;
        var taskDate = new Date(task.date);
        var taskCreatedAt = new Date(task.createdAt);
        var daydiff = dateDiff(taskDate);
        var diffFromAdded = getTimeFromAdded(taskCreatedAt);
        if (task.status === "todo") {
            todoBlackbox += "\n        <div data-index=".concat(i, " class=\"taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10\">\n            <div class=\"d-flex align-items-center justify-content-between mb-3\">\n                <div class=\"status-id d-flex align-items-center gap-2\">\n                    <div class=\"status todo-icon rounded-circle\"></div>\n                    <p class=\"m-0 fw-medium\">#").concat((i + 1).toString().padStart(3, "0"), "</p>\n                </div>\n                <div class=\"d-flex gap-2\">\n                    <div data-bs-toggle=\"modal\" data-bs-target=\"#addTask\" class=\"edit-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-pen fa-xs\"></i>\n                    </div>\n                    <div class=\"delete-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-trash-can fa-xs\"></i>\n                    </div>\n                </div>\n            </div>\n            <p class=\"task-title mb-2 h6 fw-semibold\">").concat(task.title, "</p>\n            ").concat(task.description ? "<p class=\"task-description mb-3\">".concat(task.description, "</p>") : "", "\n            <div class=\"d-flex align-items-center gap-2 mb-3\">\n                <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ").concat((_a = priority[task.priority]) === null || _a === void 0 ? void 0 : _a.className, "\">\n                    <div class=\"rounded-circle\"></div>\n                    <p class=\"m-0 fw-semibold\">").concat((_b = priority[task.priority]) === null || _b === void 0 ? void 0 : _b.text, "</p>\n                </div>\n                ").concat(daydiff === "overdue"
                ? "\n                    <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue\">\n                        <i class=\"fa-solid fa-triangle-exclamation\"></i>\n                        <p class=\"m-0 fw-semibold\">Overdue</p>\n                    </div>\n                    "
                : daydiff === "soon"
                    ? "\n                        <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon\">\n                            <p class=\"m-0 fw-semibold\">DUE SOON</p>\n                        </div>\n                        "
                    : "", "\n            </div>\n            <div class=\"d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10\">\n                ").concat(task.date
                ? "<div class=\"deadline ".concat(daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : "", " time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-calendar\"></i>\n                    <span>").concat(taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" }), "</span>\n                </div>")
                : "", "\n                <div class=\"added-time time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-clock\"></i>\n                    <span>").concat(diffFromAdded, " ago</span>\n                </div>\n            </div>\n            <div class=\"d-flex align-items-center gap-3\">\n                <div class=\"button start d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-play fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">Start</span>\n                </div>\n                <div class=\"button complete d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-check fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">Complete</span>\n                </div>\n            </div>\n        </div>\n      ");
        }
        else if (task.status === "inprogress") {
            inprogressBlackBox += "\n        <div data-index=".concat(i, " class=\"taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10\">\n            <div class=\"d-flex align-items-center justify-content-between mb-3\">\n                <div class=\"status-id d-flex align-items-center gap-2\">\n                    <div class=\"status start-icon rounded-circle\"></div>\n                    <p class=\"m-0 fw-medium\">#").concat((i + 1).toString().padStart(3, "0"), "</p>\n                </div>\n                <div class=\"d-flex gap-2\">\n                    <div data-bs-toggle=\"modal\" data-bs-target=\"#addTask\" class=\"edit-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-pen fa-xs\"></i>\n                    </div>\n                    <div class=\"delete-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-trash-can fa-xs\"></i>\n                    </div>\n                </div>\n            </div>\n            <p class=\"task-title mb-2 h6 fw-semibold\">").concat(task.title, "</p>\n            ").concat(task.description ? "<p class=\"task-description mb-3\">".concat(task.description, "</p>") : "", "\n            <div class=\"d-flex align-items-center gap-2 mb-3\">\n                <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ").concat((_c = priority[task.priority]) === null || _c === void 0 ? void 0 : _c.className, "\">\n                    <div class=\"rounded-circle\"></div>\n                    <p class=\"m-0 fw-semibold\">").concat((_d = priority[task.priority]) === null || _d === void 0 ? void 0 : _d.text, "</p>\n                </div>\n                ").concat(daydiff === "overdue"
                ? "\n                    <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue\">\n                        <i class=\"fa-solid fa-triangle-exclamation\"></i>\n                        <p class=\"m-0 fw-semibold\">Overdue</p>\n                    </div>\n                    "
                : daydiff === "soon"
                    ? "\n                        <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon\">\n                            <p class=\"m-0 fw-semibold\">DUE SOON</p>\n                        </div>\n                        "
                    : "", "\n            </div>\n            <div class=\"d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10\">\n                ").concat(task.date
                ? "<div class=\"deadline ".concat(daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : "", " time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-calendar\"></i>\n                    <span>").concat(taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" }), "</span>\n                </div>")
                : "", "\n                <div class=\"added-time time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-clock\"></i>\n                    <span>").concat(diffFromAdded, " ago</span>\n                </div>\n            </div>\n            <div class=\"d-flex align-items-center gap-3\">\n                <div class=\"button todo d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-arrow-rotate-left fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">To Do</span>\n                </div>\n                <div class=\"button complete d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-check fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">Complete</span>\n                </div>\n            </div>\n        </div>\n      ");
        }
        else if (task.status === "completed") {
            completedBlackBox += "\n        <div data-index=".concat(i, " class=\"taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10\">\n            <div class=\"d-flex align-items-center justify-content-between mb-3\">\n                <div class=\"status-id d-flex align-items-center gap-2\">\n                    <div class=\"status complete-icon rounded-circle\"></div>\n                    <p class=\"m-0 fw-medium\">#").concat((i + 1).toString().padStart(3, "0"), "</p>\n                </div>\n                <div class=\"d-flex gap-2\">\n                    <div data-bs-toggle=\"modal\" data-bs-target=\"#addTask\" class=\"edit-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-pen fa-xs\"></i>\n                    </div>\n                    <div class=\"delete-button action-button rounded-3 d-flex align-items-center justify-content-center\">\n                        <i class=\"fa-solid fa-trash-can fa-xs\"></i>\n                    </div>\n                </div>\n            </div>\n            <p class=\"task-title mb-2 h6 fw-semibold text-decoration-line-through\">").concat(task.title, "</p>\n            ").concat(task.description ? "<p class=\"task-description mb-3\">".concat(task.description, "</p>") : "", "\n            <div class=\"d-flex align-items-center gap-2 mb-3\">\n                <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ").concat((_e = priority[task.priority]) === null || _e === void 0 ? void 0 : _e.className, "\">\n                    <div class=\"rounded-circle\"></div>\n                    <p class=\"m-0 fw-semibold\">").concat((_f = priority[task.priority]) === null || _f === void 0 ? void 0 : _f.text, "</p>\n                </div>\n                ").concat(daydiff === "overdue"
                ? "\n                    <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue\">\n                        <i class=\"fa-solid fa-triangle-exclamation\"></i>\n                        <p class=\"m-0 fw-semibold\">Overdue</p>\n                    </div>\n                    "
                : daydiff === "soon"
                    ? "\n                        <div class=\"details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon\">\n                            <p class=\"m-0 fw-semibold\">DUE SOON</p>\n                        </div>\n                        "
                    : "", "\n            </div>\n            <div class=\"d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10\">\n                ").concat(task.date
                ? "<div class=\"deadline ".concat(daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : "", " time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-calendar\"></i>\n                    <span>").concat(taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" }), "</span>\n                </div>")
                : "", "\n                <div class=\"added-time time-details d-flex align-items-center gap-2\">\n                    <i class=\"fa-regular fa-clock\"></i>\n                    <span>").concat(diffFromAdded, " ago</span>\n                </div>\n            </div>\n            <div class=\"d-flex align-items-center gap-3\">\n                <div class=\"button todo d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-arrow-rotate-left fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">To Do</span>\n                </div>\n                <div class=\"button start d-flex align-items-center gap-1 py-2 px-3 rounded-3\">\n                    <i class=\"fa-solid fa-play fa-sm d-flex\"></i>\n                    <span class=\"fw-semibold\">Start</span>\n                </div>\n            </div>\n        </div>\n      ");
        }
    });
    todoCount === 0
        ? (document.getElementById("todo").innerHTML =
            "<div class=\"no-content d-flex flex-column align-items-center justify-content-center py-5\">\n      <i class=\"fa-solid fa-folder-open mb-3\"></i>\n      <p class=\"m-0\">No tasks yet</p>\n      <p class=\"mb-0 mt-1\">Click + to add one</p>\n  </div>")
        : (document.getElementById("todo").innerHTML = todoBlackbox);
    inProgressCount === 0
        ? (document.getElementById("in-progress").innerHTML =
            "<div class=\"no-content d-flex flex-column align-items-center justify-content-center py-5\">\n      <i class=\"fa-solid fa-folder-open mb-3\"></i>\n      <p class=\"m-0\">No tasks yet</p>\n      <p class=\"mb-0 mt-1\">Click + to add one</p>\n  </div>")
        : (document.getElementById("in-progress").innerHTML = inprogressBlackBox);
    completedCount === 0
        ? (document.getElementById("completed").innerHTML =
            "<div class=\"no-content d-flex flex-column align-items-center justify-content-center py-5\">\n      <i class=\"fa-solid fa-folder-open mb-3\"></i>\n      <p class=\"m-0\">No tasks yet</p>\n      <p class=\"mb-0 mt-1\">Click + to add one</p>\n  </div>")
        : (document.getElementById("completed").innerHTML = completedBlackBox);
    document.querySelectorAll(".delete-button").forEach(function (button) {
        button.addEventListener("click", function () {
            var _a, _b, _c;
            var deleteidx = Number((_c = (_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.index);
            deletTask(deleteidx);
        });
    });
    document.querySelectorAll(".edit-button").forEach(function (button) {
        button.addEventListener("click", function () {
            var _a, _b, _c;
            var editidx = Number((_c = (_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.index);
            var task = tasks[editidx];
            titlefield.value = task.title;
            datefield.value = task.date;
            textAreaField.value = task.description;
            priorityField.value = task.priority;
            titleError === null || titleError === void 0 ? void 0 : titleError.classList.add("d-none");
            titlefield.style.borderColor = "#cad5e2";
            dateError === null || dateError === void 0 ? void 0 : dateError.classList.add("d-none");
            datefield.style.borderColor = "#cad5e2";
            submitButton === null || submitButton === void 0 ? void 0 : submitButton.classList.add("d-none");
            editButton === null || editButton === void 0 ? void 0 : editButton.classList.remove("d-none");
            editTask(editidx);
        });
    });
    document.querySelectorAll(".button.start").forEach(function (button) {
        button.addEventListener("click", function () {
            var _a, _b;
            var taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "inprogress";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = "";
            inprogressBlackBox = "";
            completedBlackBox = "";
            displayData();
        });
    });
    document.querySelectorAll(".button.complete").forEach(function (button) {
        button.addEventListener("click", function () {
            var _a, _b;
            var taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "completed";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = "";
            inprogressBlackBox = "";
            completedBlackBox = "";
            displayData();
        });
    });
    document.querySelectorAll(".button.todo").forEach(function (button) {
        button.addEventListener("click", function () {
            var _a, _b;
            var taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "todo";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = "";
            inprogressBlackBox = "";
            completedBlackBox = "";
            displayData();
        });
    });
}
displayData();
// GET LENGTH OF DATA
function getTaskCounts() {
    var todoCount = tasks.filter(function (t) { return t.status === "todo"; }).length;
    var inProgressCount = tasks.filter(function (t) { return t.status === "inprogress"; }).length;
    var completedCount = tasks.filter(function (t) { return t.status === "completed"; }).length;
    return {
        todoCount: todoCount,
        inProgressCount: inProgressCount,
        completedCount: completedCount,
    };
}
// CALCULATE DATE DIFF
function dateDiff(date) {
    var todayDate = new Date();
    var diff = date.getTime() - todayDate.getTime();
    var diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
        return "overdue";
    }
    else if (diffDays <= 2) {
        return "soon";
    }
    return "";
}
// GET TIME FROM CREATED
function getTimeFromAdded(date) {
    var todayDate = new Date();
    var diff = todayDate.getTime() - date.getTime();
    var minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) {
        return "".concat(minutes, "m");
    }
    var hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
        return "".concat(hours, "h");
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return "".concat(days, "d");
}
// DELETE TASK
function deletTask(deleteidx) {
    tasks.splice(deleteidx, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData();
    showNotification("Task deleted successfully!", "#fb2c36");
}
// EDIT TASK
function editTask(editidx) {
    editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener("click", function () {
        tasks[editidx].title = titlefield.value;
        tasks[editidx].date = datefield.value;
        tasks[editidx].description = textAreaField.value;
        tasks[editidx].priority = priorityField.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayData();
        closeTaskModal();
        showNotification("Task updated successfully!", "#00bc7d");
    });
}
function showNotification(msg, color) {
    var div = document.createElement("div");
    div.className = "position-fixed notification text-white px-4 py-3 rounded-4";
    div.style.backgroundColor = color;
    div.innerHTML = msg;
    document.body.appendChild(div);
    setTimeout(function () {
        document.body.removeChild(div);
    }, 3000);
}
