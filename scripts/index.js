var _a;
let tasks = [];
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}
const priority = {
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
const titlefield = document.querySelector("#titleInput");
const datefield = document.querySelector("#dateInput");
const textAreaField = document.querySelector("#description");
const priorityField = document.querySelector("#priority-select");
// LIVE CHARACTER COUNT
const textAreaCount = document.querySelector("#charCount");
textAreaField === null || textAreaField === void 0 ? void 0 : textAreaField.addEventListener("input", () => {
    textAreaCount.innerHTML = `${textAreaField.value.length}/500`;
});
const submitButton = document.querySelector("#submit-button");
const editButton = document.querySelector("#edit-button");
const titleError = document.querySelector("#titleError");
const dateError = document.querySelector("#dateError");
(_a = document.querySelector("#add-task")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
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
submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener("click", () => {
    const titleValid = validateTitle();
    const dateValid = validateDate();
    // STORE DATA
    if (titleValid && dateValid) {
        storeData();
        closeTaskModal();
    }
});
function closeTaskModal() {
    const modalEl = document.getElementById("addTask");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
}
// VALIDATE TITLE
function validateTitle() {
    const titleInput = titlefield.value;
    let titleValid = true;
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
    const dateInput = datefield.value;
    let dateValid = true;
    // DATE VALIDATION
    if (dateInput) {
        const inputdate = new Date(dateInput).setHours(0, 0, 0, 0);
        const todaydate = new Date().setHours(0, 0, 0, 0);
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
    let todoBlackbox = ``;
    let inprogressBlackBox = ``;
    let completedBlackBox = ``;
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const { todoCount, inProgressCount, completedCount } = getTaskCounts();
    document.getElementById("complete-count").innerHTML = `${completedCount}`;
    document.getElementById("progress-count").innerHTML = `${inProgressCount}`;
    document.getElementById("todo-count").innerHTML = `${todoCount}`;
    tasks.forEach((task, i) => {
        var _a, _b, _c, _d, _e, _f;
        const taskDate = new Date(task.date);
        const taskCreatedAt = new Date(task.createdAt);
        const daydiff = dateDiff(taskDate);
        const diffFromAdded = getTimeFromAdded(taskCreatedAt);
        if (task.status === "todo") {
            todoBlackbox += `
        <div data-index=${i} class="taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="status-id d-flex align-items-center gap-2">
                    <div class="status todo-icon rounded-circle"></div>
                    <p class="m-0 fw-medium">#${(i + 1).toString().padStart(3, "0")}</p>
                </div>
                <div class="d-flex gap-2">
                    <div data-bs-toggle="modal" data-bs-target="#addTask" class="edit-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-pen fa-xs"></i>
                    </div>
                    <div class="delete-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-trash-can fa-xs"></i>
                    </div>
                </div>
            </div>
            <p class="task-title mb-2 h6 fw-semibold">${task.title}</p>
            ${task.description ? `<p class="task-description mb-3">${task.description}</p>` : ""}
            <div class="d-flex align-items-center gap-2 mb-3">
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${(_a = priority[task.priority]) === null || _a === void 0 ? void 0 : _a.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${(_b = priority[task.priority]) === null || _b === void 0 ? void 0 : _b.text}</p>
                </div>
                ${daydiff === "overdue"
                ? `
                    <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p class="m-0 fw-semibold">Overdue</p>
                    </div>
                    `
                : daydiff === "soon"
                    ? `
                        <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon">
                            <p class="m-0 fw-semibold">DUE SOON</p>
                        </div>
                        `
                    : ""}
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${task.date
                ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                : ""}
                <div class="added-time time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-clock"></i>
                    <span>${diffFromAdded} ago</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="button start d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-play fa-sm d-flex"></i>
                    <span class="fw-semibold">Start</span>
                </div>
                <div class="button complete d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-check fa-sm d-flex"></i>
                    <span class="fw-semibold">Complete</span>
                </div>
            </div>
        </div>
      `;
        }
        else if (task.status === "inprogress") {
            inprogressBlackBox += `
        <div data-index=${i} class="taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="status-id d-flex align-items-center gap-2">
                    <div class="status start-icon rounded-circle"></div>
                    <p class="m-0 fw-medium">#${(i + 1).toString().padStart(3, "0")}</p>
                </div>
                <div class="d-flex gap-2">
                    <div data-bs-toggle="modal" data-bs-target="#addTask" class="edit-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-pen fa-xs"></i>
                    </div>
                    <div class="delete-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-trash-can fa-xs"></i>
                    </div>
                </div>
            </div>
            <p class="task-title mb-2 h6 fw-semibold">${task.title}</p>
            ${task.description ? `<p class="task-description mb-3">${task.description}</p>` : ""}
            <div class="d-flex align-items-center gap-2 mb-3">
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${(_c = priority[task.priority]) === null || _c === void 0 ? void 0 : _c.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${(_d = priority[task.priority]) === null || _d === void 0 ? void 0 : _d.text}</p>
                </div>
                ${daydiff === "overdue"
                ? `
                    <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p class="m-0 fw-semibold">Overdue</p>
                    </div>
                    `
                : daydiff === "soon"
                    ? `
                        <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon">
                            <p class="m-0 fw-semibold">DUE SOON</p>
                        </div>
                        `
                    : ""}
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${task.date
                ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                : ""}
                <div class="added-time time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-clock"></i>
                    <span>${diffFromAdded} ago</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="button todo d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-arrow-rotate-left fa-sm d-flex"></i>
                    <span class="fw-semibold">To Do</span>
                </div>
                <div class="button complete d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-check fa-sm d-flex"></i>
                    <span class="fw-semibold">Complete</span>
                </div>
            </div>
        </div>
      `;
        }
        else if (task.status === "completed") {
            completedBlackBox += `
        <div data-index=${i} class="taskCard p-3 rounded-4 border border-1 border-dark border-opacity-10">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="status-id d-flex align-items-center gap-2">
                    <div class="status complete-icon rounded-circle"></div>
                    <p class="m-0 fw-medium">#${(i + 1).toString().padStart(3, "0")}</p>
                </div>
                <div class="d-flex gap-2">
                    <div data-bs-toggle="modal" data-bs-target="#addTask" class="edit-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-pen fa-xs"></i>
                    </div>
                    <div class="delete-button action-button rounded-3 d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-trash-can fa-xs"></i>
                    </div>
                </div>
            </div>
            <p class="task-title mb-2 h6 fw-semibold text-decoration-line-through">${task.title}</p>
            ${task.description ? `<p class="task-description mb-3">${task.description}</p>` : ""}
            <div class="d-flex align-items-center gap-2 mb-3">
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${(_e = priority[task.priority]) === null || _e === void 0 ? void 0 : _e.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${(_f = priority[task.priority]) === null || _f === void 0 ? void 0 : _f.text}</p>
                </div>
                ${daydiff === "overdue"
                ? `
                    <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill overdue">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p class="m-0 fw-semibold">Overdue</p>
                    </div>
                    `
                : daydiff === "soon"
                    ? `
                        <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill due-soon">
                            <p class="m-0 fw-semibold">DUE SOON</p>
                        </div>
                        `
                    : ""}
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${task.date
                ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                : ""}
                <div class="added-time time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-clock"></i>
                    <span>${diffFromAdded} ago</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="button todo d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-arrow-rotate-left fa-sm d-flex"></i>
                    <span class="fw-semibold">To Do</span>
                </div>
                <div class="button start d-flex align-items-center gap-1 py-2 px-3 rounded-3">
                    <i class="fa-solid fa-play fa-sm d-flex"></i>
                    <span class="fw-semibold">Start</span>
                </div>
            </div>
        </div>
      `;
        }
    });
    todoCount === 0
        ? (document.getElementById("todo").innerHTML =
            `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
        : (document.getElementById("todo").innerHTML = todoBlackbox);
    inProgressCount === 0
        ? (document.getElementById("in-progress").innerHTML =
            `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
        : (document.getElementById("in-progress").innerHTML = inprogressBlackBox);
    completedCount === 0
        ? (document.getElementById("completed").innerHTML =
            `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
        : (document.getElementById("completed").innerHTML = completedBlackBox);
    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", () => {
            var _a, _b, _c;
            const deleteidx = Number((_c = (_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.index);
            deletTask(deleteidx);
        });
    });
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", () => {
            var _a, _b, _c;
            const editidx = Number((_c = (_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.index);
            const task = tasks[editidx];
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
    document.querySelectorAll(".button.start").forEach((button) => {
        button.addEventListener("click", () => {
            var _a, _b;
            const taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "inprogress";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = ``;
            inprogressBlackBox = ``;
            completedBlackBox = ``;
            displayData();
        });
    });
    document.querySelectorAll(".button.complete").forEach((button) => {
        button.addEventListener("click", () => {
            var _a, _b;
            const taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "completed";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = ``;
            inprogressBlackBox = ``;
            completedBlackBox = ``;
            displayData();
        });
    });
    document.querySelectorAll(".button.todo").forEach((button) => {
        button.addEventListener("click", () => {
            var _a, _b;
            const taskidx = Number((_b = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.index);
            tasks[taskidx].status = "todo";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            todoBlackbox = ``;
            inprogressBlackBox = ``;
            completedBlackBox = ``;
            displayData();
        });
    });
}
displayData();
// GET LENGTH OF DATA
function getTaskCounts() {
    const todoCount = tasks.filter((t) => t.status === "todo").length;
    const inProgressCount = tasks.filter((t) => t.status === "inprogress").length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    return {
        todoCount,
        inProgressCount,
        completedCount,
    };
}
// CALCULATE DATE DIFF
function dateDiff(date) {
    const todayDate = new Date();
    const diff = date.getTime() - todayDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
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
    const todayDate = new Date();
    const diff = todayDate.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
        return `${hours}h`;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d`;
}
// DELETE TASK
function deletTask(deleteidx) {
    tasks.splice(deleteidx, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData();
}
// EDIT TASK
function editTask(editidx) {
    editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener("click", () => {
        tasks[editidx].title = titlefield.value;
        tasks[editidx].date = datefield.value;
        tasks[editidx].description = textAreaField.value;
        tasks[editidx].priority = priorityField.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayData();
        closeTaskModal();
    });
}
