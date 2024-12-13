//^ Global

const inputValue = document.getElementById("inputValue");
const btnSubmit = document.getElementById("btnSubmit");
const form = document.querySelector("form");
const apiKey = "6759b39d60a208ee1fdded54";
const loading = document.querySelector(".loading");
let todolist;

//* Start Js
getAllTodosData();

//Events
btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (inputValue.value.trim().length > 0) {
    addTodo();
  } else {
    toastr.error(
      "Your task field is empty. Let's fill it with great ideas!",
      "Empty Field ⚠️"
    );
  }
});

//! Function

// Add Todo
async function addTodo() {
  showLoading();
  todoDate = {
    title: inputValue.value,
    apiKey: apiKey,
  };
  const obj = {
    method: "POST",
    body: JSON.stringify(todoDate),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(`https://todos.routemisr.com/api/v1/todos`, obj);
  if (response.ok) {
    const addData = await response.json();
    console.log(response);
    if (addData.message === "success") {
      toastr.success("Your task has been added successfully!", "Success 🎉");
      await getAllTodosData();
      form.reset();
    }
    hideLoading();
  } else {
    hideLoading();
  }
}

async function getAllTodosData() {
  showLoading();
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      todolist = data.todos;
      displayData();
    }
    hideLoading();
  } else {
    hideLoading();
  }
}

function displayData() {
  let content = "";
  todolist.forEach((element) => {
    content += `
      <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
          <span onclick="markCompleted('${element._id}' , ${
      element.completed
    })" 
          class="task-name ${
            element.completed ? "text-decoration-line-through" : ""
          }">
          ${element.title}
          </span>
          <div class="icons d-flex align-items-center gap-4">
          ${
            element.completed
              ? '<span><i class="fa-solid fa-circle-check" style="color: #63e6be"></i></span>'
              : ""
          }
          <span class="icon" onclick="deleteTodo('${element._id}')">
           <i class="fa-solid fa-trash-can"></i>
           </span>
          </div>
        </li>
    `;
  });
  document.getElementById("taskContainer").innerHTML = content;
  changeProgress();
}

async function deleteTodo(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This task will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const todoId = {
        todoId: id,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoId),
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos`,
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "The task has been successfully removed.",
            icon: "success",
          });
          await getAllTodosData();
        }
      }
    }
  });
}

async function markCompleted(id, Completed) {
  console.log(Completed);
  if (!isCompleted(Completed)) {
    Swal.fire({
      title: "Are you sure?",
      text: "This will mark the task as completed.!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const todoId = {
          todoId: id,
        };
        const obj = {
          method: "PUT",
          body: JSON.stringify(todoId),
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          `https://todos.routemisr.com/api/v1/todos`,
          obj
        );
        if (response.ok) {
          const data = await response.json();
          if (data.message === "success") {
            Swal.fire({
              title: "Task Completed!",
              text: "Great job! The task has been marked as completed successfully.",
              icon: "success",
            });
            getAllTodosData();
          }
        }
      }
    });
  } else {
    Swal.fire({
      title: "Task Already Completed!",
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}

function showLoading() {
  loading.classList.remove("d-none");
}

function hideLoading() {
  loading.classList.add("d-none");
}

function isCompleted(Completed) {
  if (Completed) {
    return true;
  }
}

function changeProgress() {
  const completedTaskNum = todolist.filter((task) => task.completed).length;
  console.log(completedTaskNum);
  const totalTask = todolist.length;
  document.getElementById("progress").style.width = `${(completedTaskNum / totalTask) * 100}%`;
  const statusNum = document.querySelectorAll(".status-number span");
  statusNum[0].innerHTML = completedTaskNum;
  statusNum[1].innerHTML = totalTask;
}

//^ Notes JS

//&  For In  بطريقه اخري مثلا ب  Array Of Object  ممكن اعمل لوب علي

/* let content = "";
for (const element in todolist) {
    content += `
      <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
          <span class="task-name">${element.title}</span>
          <div class="icons d-flex align-items-center gap-4">
            <span>
              <i class="fa-solid fa-circle-check" style="color: #63e6be"></i>
            </span>
            <span class="icon"> <i class="fa-solid fa-trash-can"></i></span>
          </div>
        </li>
    `;
  });
} */

//& Ternary Operator

//  (condition) ? (if true, do this) : (otherwise, do this)

//&
