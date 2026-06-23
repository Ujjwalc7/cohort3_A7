const formDiv = document.querySelector(".form");
const addBtn = document.querySelector("#addBtn");
const closeBtn = document.querySelector(".closeBtn");
const taskList = document.querySelector("#taskList");
const filterBtn = document.querySelectorAll(".filter-btn");
const form = document.querySelector("form");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const ui = (obj) => {
  taskList.innerHTML = "";
  if(tasks.length === 0){
  taskList.innerHTML = "<h1>No task to show!</h1>";
  return;
  }
  tasks.forEach((element) => {
    taskList.innerHTML += `<div class="task-card">
  <div class="task-content">
    <h3 class="task-title">${element.title}</h3>

    <span class="task-category">${element.category}</span>
  </div>

  <div class="task-actions">
    <button class="status-btn" onclick = "completeTask('${element.id}')">
      ${element.status === "Active" ? "Mark as complete" : "Completed"}
    </button>

    <button class="delete-btn" onclick = "deleteTask('${element.id}')" >
      Delete
    </button>
  </div>
</div>`;
  });
};

filterBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtn.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
    if (btn.dataset.id === "All") {
      tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      ui();
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter((task) => task.status === btn.dataset.id);
      ui();
    }
  });
});
addBtn.addEventListener("click", () => {
  formDiv.style.display = "flex";
});
closeBtn.addEventListener("click", () => {
  formDiv.style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target[0].value.trim();
  const category = e.target[1].value.trim();
  if (title.trim() === "" || category.trim() === "") {
    alert("all fields are required");
    return;
  }
  const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const status = "Active";
  const obj = {
    id,
    title,
    category,
    status,
  };
  tasks.push(obj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  ui();
  form.reset();
  formDiv.style.display = "none";
});

const completeTask = (id) => {
  tasks.forEach((ele) => {
    if (ele.id === id) {
      ele.status = "Completed";
      return;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  ui();
};
const deleteTask = (id) => {
  tasks = tasks.filter((ele) => ele.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  ui();
};


const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
});

ui();
