//! Card Interface
interface Task {
  title: string;
  date: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") ?? "[]");
interface Priority {
  text: string;
  className: string;
}

const priority: Record<string, Priority> = {
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

const titlefield: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>("#titleInput");

const datefield: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>("#dateInput");

const textAreaField: HTMLTextAreaElement | null =
  document.querySelector("#description");

const priorityField: HTMLSelectElement | null =
  document.querySelector("#priority-select");

// LIVE CHARACTER COUNT

const textAreaCount: HTMLParagraphElement | null =
  document.querySelector("#charCount");

textAreaField?.addEventListener("input", () => {
  textAreaCount!.innerHTML = `${textAreaField.value.length}/500`;
});

const submitButton: HTMLButtonElement | null =
  document.querySelector("#submit-button");

const editButton: HTMLButtonElement | null =
  document.querySelector("#edit-button");

const titleError: HTMLParagraphElement | null =
  document.querySelector("#titleError");

const dateError: HTMLParagraphElement | null =
  document.querySelector("#dateError");

document.querySelector("#add-task")?.addEventListener("click", () => {
  submitButton?.classList.remove("d-none");
  editButton?.classList.add("d-none");
  titlefield!.value = "";
  datefield!.value = "";
  textAreaField!.value = "";
  priorityField!.value = "medium";
  titleError?.classList.add("d-none");
  titlefield!.style.borderColor = "#cad5e2";
  dateError?.classList.add("d-none");
  datefield!.style.borderColor = "#cad5e2";
});
// CREATE
submitButton?.addEventListener("click", () => {
  const titleValid: boolean = validateTitle();
  const dateValid: boolean = validateDate();
  // STORE DATA
  if (titleValid && dateValid) {
    storeData();
    closeTaskModal();
    showNotification("Task added successfully!", "#00bc7d");
  }
});

// CLOSE MODAL
declare var bootstrap: any;
function closeTaskModal() {
  const modalEl = document.getElementById("addTask");
  const modal =
    bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.hide();
}

// VALIDATE TITLE
function validateTitle(): boolean {
  const titleInput: string = titlefield!.value;
  let titleValid: boolean = true;
  // TITLE VALIDATION
  if (!titleInput) {
    titleError!.classList.remove("d-none");
    titleError!.innerHTML = "Task title is required";
    titlefield!.style.borderColor = "#fb2c36";
    titleValid = false;
  } else if (titleInput.length < 3) {
    titleError!.classList.remove("d-none");
    titleError!.innerHTML = "Title must be at least 3 characters";
    titlefield!.style.borderColor = "#fb2c36";
    titleValid = false;
  } else {
    titleError?.classList.add("d-none");
    titlefield!.style.borderColor = "#cad5e2";
    titleValid = true;
  }
  return titleValid;
}

// VALIDATE DATE
function validateDate(): boolean {
  const dateInput: string = datefield!.value;
  let dateValid: boolean = true;
  // DATE VALIDATION
  if (dateInput) {
    const inputdate: number = new Date(dateInput).setHours(0, 0, 0, 0);
    const todaydate: number = new Date().setHours(0, 0, 0, 0);
    if (inputdate < todaydate) {
      dateError?.classList.remove("d-none");
      datefield!.style.borderColor = "#fb2c36";
      dateValid = false;
    } else {
      dateError?.classList.add("d-none");
      datefield!.style.borderColor = "#cad5e2";
      dateValid = true;
    }
  } else {
    dateError?.classList.add("d-none");
    datefield!.style.borderColor = "#cad5e2";
    dateValid = true;
  }
  return dateValid;
}

// STORE DATA FUNCTION
function storeData(): void {
  tasks.push({
    title: titlefield!.value,
    date: datefield!.value === "" ? "" : datefield!.value,
    description: textAreaField!.value,
    priority: priorityField!.value,
    status: "todo",
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayData();
  titlefield!.value = "";
  datefield!.value = "";
  textAreaField!.value = "";
  priorityField!.value = "medium";
}

// DISPLAY FUNCTION
function displayData(): void {
  let todoBlackbox = ``;
  let inprogressBlackBox = ``;
  let completedBlackBox = ``;
  tasks = JSON.parse(localStorage.getItem("tasks") ?? "[]");

  const { todoCount, inProgressCount, completedCount } = getTaskCounts();
  document.getElementById("complete-count")!.innerHTML = `${completedCount}`;
  document.getElementById("progress-count")!.innerHTML = `${inProgressCount}`;
  document.getElementById("todo-count")!.innerHTML = `${todoCount}`;

  tasks.forEach((task: Task, i: number) => {
    const taskDate: Date = new Date(task.date);
    const taskCreatedAt: Date = new Date(task.createdAt);
    const daydiff: string = dateDiff(taskDate);
    const diffFromAdded: string = getTimeFromAdded(taskCreatedAt);
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
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${priority[task.priority]?.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${priority[task.priority]?.text}</p>
                </div>
                ${
                  daydiff === "overdue"
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
                      : ""
                }
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${
                  task.date
                    ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                    : ""
                }
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
    } else if (task.status === "inprogress") {
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
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${priority[task.priority]?.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${priority[task.priority]?.text}</p>
                </div>
                ${
                  daydiff === "overdue"
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
                      : ""
                }
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${
                  task.date
                    ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                    : ""
                }
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
    } else if (task.status === "completed") {
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
                <div class="details-card d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${priority[task.priority]?.className}">
                    <div class="rounded-circle"></div>
                    <p class="m-0 fw-semibold">${priority[task.priority]?.text}</p>
                </div>
                ${
                  daydiff === "overdue"
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
                      : ""
                }
            </div>
            <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-1 border-dark border-opacity-10">
                ${
                  task.date
                    ? `<div class="deadline ${daydiff === "overdue" ? "overdue" : daydiff === "soon" ? "due-soon" : ""} time-details d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${taskDate.toLocaleDateString("en-us", { month: "short", day: "2-digit" })}</span>
                </div>`
                    : ""
                }
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
    ? (document.getElementById("todo")!.innerHTML =
        `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
    : (document.getElementById("todo")!.innerHTML = todoBlackbox);

  inProgressCount === 0
    ? (document.getElementById("in-progress")!.innerHTML =
        `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
    : (document.getElementById("in-progress")!.innerHTML = inprogressBlackBox);

  completedCount === 0
    ? (document.getElementById("completed")!.innerHTML =
        `<div class="no-content d-flex flex-column align-items-center justify-content-center py-5">
      <i class="fa-solid fa-folder-open mb-3"></i>
      <p class="m-0">No tasks yet</p>
      <p class="mb-0 mt-1">Click + to add one</p>
  </div>`)
    : (document.getElementById("completed")!.innerHTML = completedBlackBox);

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
      const deleteidx: number = Number(
        button.parentElement?.parentElement?.parentElement?.dataset.index,
      );
      deletTask(deleteidx);
    });
  });
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => {
      const editidx: number = Number(
        button.parentElement?.parentElement?.parentElement?.dataset.index,
      );
      const task = tasks[editidx];
      titlefield!.value = task!.title;
      datefield!.value = task!.date;
      textAreaField!.value = task!.description;
      priorityField!.value = task!.priority;
      titleError?.classList.add("d-none");
      titlefield!.style.borderColor = "#cad5e2";
      dateError?.classList.add("d-none");
      datefield!.style.borderColor = "#cad5e2";
      submitButton?.classList.add("d-none");
      editButton?.classList.remove("d-none");
      editTask(editidx);
    });
  });
  document.querySelectorAll(".button.start").forEach((button) => {
    button.addEventListener("click", () => {
      const taskidx: number = Number(
        button.parentElement?.parentElement?.dataset.index,
      );
      tasks[taskidx]!.status = "inprogress";
      localStorage.setItem("tasks", JSON.stringify(tasks));
      todoBlackbox = ``;
      inprogressBlackBox = ``;
      completedBlackBox = ``;
      displayData();
    });
  });
  document.querySelectorAll(".button.complete").forEach((button) => {
    button.addEventListener("click", () => {
      const taskidx: number = Number(
        button.parentElement?.parentElement?.dataset.index,
      );
      tasks[taskidx]!.status = "completed";
      localStorage.setItem("tasks", JSON.stringify(tasks));
      todoBlackbox = ``;
      inprogressBlackBox = ``;
      completedBlackBox = ``;
      displayData();
    });
  });
  document.querySelectorAll(".button.todo").forEach((button) => {
    button.addEventListener("click", () => {
      const taskidx: number = Number(
        button.parentElement?.parentElement?.dataset.index,
      );
      tasks[taskidx]!.status = "todo";
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
function getTaskCounts(): {
  todoCount: number;
  inProgressCount: number;
  completedCount: number;
} {
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
function dateDiff(date: Date): string {
  const todayDate: Date = new Date();
  const diff: number = date.getTime() - todayDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays < 1) {
    return "overdue";
  } else if (diffDays <= 2) {
    return "soon";
  }
  return "";
}

// GET TIME FROM CREATED
function getTimeFromAdded(date: Date): string {
  const todayDate: Date = new Date();
  const diff: number = todayDate.getTime() - date.getTime();

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
function deletTask(deleteidx: number): void {
  tasks.splice(deleteidx, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayData();
  showNotification("Task deleted successfully!", "#fb2c36");
}

// EDIT TASK
function editTask(editidx: number): void {
  editButton?.addEventListener("click", () => {
    tasks[editidx]!.title = titlefield!.value;
    tasks[editidx]!.date = datefield!.value;
    tasks[editidx]!.description = textAreaField!.value;
    tasks[editidx]!.priority = priorityField!.value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData();
    closeTaskModal();
    showNotification("Task updated successfully!", "#00bc7d");
  });
}

function showNotification(msg: string, color: string) {
  const div: HTMLDivElement = document.createElement("div");
  div.className = "position-fixed notification text-white px-4 py-3 rounded-4";
  div.style.backgroundColor = color;
  div.innerHTML = msg;
  document.body.appendChild(div);
  setTimeout(() => {
    document.body.removeChild(div);
  }, 3000);
}
