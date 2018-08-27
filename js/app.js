/**
 * Task manager app using the module pattern
 */

//Storage controller
const StorageCtrl =(()=>{
    return {
        storeToLs:(task)=>{
            let tasks;
            if (localStorage.getItem('tasks')== null){
                tasks = [];

                //insert to array
                tasks.push(task)

                //insert to ls
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }else{
                //get what is already in local strorage
                tasks = JSON.parse(localStorage.getItem('tasks'));

                //insert to array
                tasks.push(task)

                //insert to ls
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        },
        getFromLs:()=>{
            let tasks;
            if (localStorage.getItem('tasks')===null){
                tasks = [];
            }else{
                tasks = JSON.parse(localStorage.getItem('tasks'))
            }
            return tasks;

        },
        updateTask:(updatedTask)=>{
          let tasks = JSON.parse(localStorage.getItem('tasks'));
          tasks.forEach((task, index)=>{
            if(updatedTask.id == task.id){
              tasks.splice(index, 1, updatedTask);
            }
          });

          localStorage.setItem('tasks', JSON.stringify(tasks))
        },
        deleteTask:(id)=>{
          let tasks = JSON.parse(localStorage.getItem('tasks'));
          tasks.forEach((task, index)=>{
            if(id == task.id){
              tasks.splice(index, 1);
            }
          });

          localStorage.setItem('tasks', JSON.stringify(tasks))
          
        },
        clearAll:()=>{
          localStorage.removeItem('tasks');
        }
    }
})()

//Task controller
const TaskCtrl = (() => {
  const Task = function(id, name, date, user, state) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.user = user;
    this.state = state;
  };

  const data = {
    tasks: StorageCtrl.getFromLs(),
    currentTask: null,
    totalTasks: 0
  };

  //public methods
  return {
    getTotalTasks: () => {
      return data.tasks.length;
    },
    getTaskById: id => {
      let found;
      data.tasks.forEach(task => {
        if (task.id == id) {
          found = task;
        }
      });
      return found;
    },
    setCurrentTask: task => {
      data.currentTask = task;
    },
    getCurrentTask: () => {
      return data.currentTask;
    },
    getTasks: () => {
      return data.tasks;
    },
    addTask: (name, date, user, state) => {
      let ID;
      //generate an autoincrement id
      if (data.tasks.length > 0) {
        ID = data.tasks[data.tasks.length - 1].id + 1;
      } else {
        ID = 0;
      }
      const newTask = new Task(ID, name, date, user, state);

      data.tasks.push(newTask);
      return newTask;
    },
    updateCurrentTask: (a_task, date, user, state) => {
      let found;

      data.tasks.forEach(task => {
        if (task.id == data.currentTask.id) {
          task.name = a_task;
          task.date = date;
          task.user = user;
          task.state = state;

          found = task;
        }
      });

      return found;
    },
    deleteTask: id => {
      const array_ids = data.tasks.map(item => {
        return item.id;
      });

      //get the index
      const index = array_ids.indexOf(id);

      //remove it from the data structure
      data.tasks.splice(index, 1);
    },
    clearAll: () => {
      data.tasks = [];
    },
    logData: () => {
      return data;
    }
  };
})();

//Ui controller
const UiCtrl = (() => {
  const UiSelectors = {
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearAll:".clear-btn",
    tasklist: "#task-list",
    taskListItems: "#task-list li",
    taskInput: "#add-task",
    dateInput: "#add-date",
    userSelect: "#add-user",
    taskState: "input[name=group1]:checked",
    totalTasks: ".total-tasks"
  };
  // public methods
  return {
    addCurrentToForm: () => {
      const currentTask = TaskCtrl.getCurrentTask();
      document.querySelector(UiSelectors.taskInput).value = currentTask.name;
      document.querySelector(UiSelectors.dateInput).value = currentTask.date;
      document.querySelector(UiSelectors.userSelect).value = currentTask.user;
      document.querySelector(UiSelectors.taskState).value = currentTask.state;

      document.querySelector(UiSelectors.updateBtn).style.display = "inline";
      document.querySelector(UiSelectors.deleteBtn).style.display = "inline";
      document.querySelector(UiSelectors.backBtn).style.display = "inline";
      document.querySelector(UiSelectors.addBtn).style.display = "none";
    },
    clearEditState: () => {
      UiCtrl.clearInputs();
      document.querySelector(UiSelectors.updateBtn).style.display = "none";
      document.querySelector(UiSelectors.deleteBtn).style.display = "none";
      document.querySelector(UiSelectors.backBtn).style.display = "none";
      document.querySelector(UiSelectors.addBtn).style.display = "inline";
    },
    updateTotal: amount => {
      //get the span class
      document.querySelector(UiSelectors.totalTasks).innerHTML = amount;
    },
    clearInputs: () => {
      document.querySelector(UiSelectors.taskInput).value = "";
      document.querySelector(UiSelectors.dateInput).value = "";
      document.querySelector(UiSelectors.userSelect).value = "Choose a user";
      document.querySelector(UiSelectors.taskState).value = "Not Started";
    },
    getSelectors: () => {
      return UiSelectors;
    },
    getUserInput: () => {
      return {
        task: document.querySelector(UiSelectors.taskInput).value,
        date: document.querySelector(UiSelectors.dateInput).value,
        user: document.querySelector(UiSelectors.userSelect).value,
        state: document.querySelector(UiSelectors.taskState).value
      };
    },
    populateTasks: (tasks) => {
      let html = "";

      tasks.forEach(function(task) {
        html += `<li class="collection-item" id="item-${task.id}">
            <strong>${task.name}: </strong>${task.user} <em>${task.date}</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`;
      });

      document.querySelector(UiSelectors.tasklist).innerHTML = html;
    },

    addTaskUi: (task) => {
      //create the li
      const li = document.createElement("li");

      //add the class
      li.className = "collection-item";

      //add the id
      li.id = `item-${task.id}`;

      //insert html

      li.innerHTML = `<strong>${task.name}: </strong>${task.user} <em>${
        task.date
      }</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `;
      //insert to the ui
      document
        .querySelector(UiSelectors.tasklist)
        .insertAdjacentElement("beforeend", li);
    },
    updateTaskUi: updatedTask => {
      let list_items = document.querySelectorAll(UiSelectors.taskListItems);

      list_items = Array.from(list_items);

      list_items.forEach(list_item => {
        const id = list_item.getAttribute("id");
        if (id == `item-${updatedTask.id}`) {
          document.querySelector(`#${id}`).innerHTML = `<strong>${
            updatedTask.name
          }: </strong>${updatedTask.user} 
                <em>${updatedTask.date}</em>
                        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteTaskUi: () => {
      const taskToDelete = TaskCtrl.getCurrentTask();

      //get the li from the list
      const task = document.querySelector(`#item-${taskToDelete.id}`);

      // remove it
      task.remove();
    },
    clearAll:()=>{
        let lists = document.querySelectorAll(UiSelectors.taskListItems)

        lists = Array.from(lists);

        lists.forEach((list)=>{
            list.remove();
        })

    }
  };
})();
//App controller

const App = ((TaskCtrl, UiCtrl, Storagectrl) => {
  // load event listeners
  const loadListeners = () => {
    const UiSelectors = UiCtrl.getSelectors();

    //add a listener when the user clicks add
    document
      .querySelector(UiSelectors.addBtn)
      .addEventListener("click", addTask);
    document
      .querySelector(UiSelectors.updateBtn)
      .addEventListener("click", updateTask);
    document
      .querySelector(UiSelectors.deleteBtn)
      .addEventListener("click", deleteTask);
    document
      .querySelector(UiSelectors.backBtn)
      .addEventListener("click", goBack);
    document
      .querySelector(UiSelectors.tasklist)
      .addEventListener("click", updateMode);
    document
      .querySelector(UiSelectors.clearAll)
      .addEventListener("click", clearAll);
  };

  const clearAll = e => {
    TaskCtrl.clearAll();
    UiCtrl.clearAll();

    StorageCtrl.clearAll();
    UiCtrl.clearEditState();
    e.preventDefault();
  };
  const goBack = e => {
    UiCtrl.clearInputs();
    UiCtrl.clearEditState();

    e.preventDefault();
  };
  const updateTask = e => {
    //    get user input
    const input = UiCtrl.getUserInput();

    //update the task
    const updatedTask = TaskCtrl.updateCurrentTask(
      input.task,
      input.date,
      input.user,
      input.state
    );

    UiCtrl.updateTaskUi(updatedTask);

    StorageCtrl.updateTask(updatedTask);

    showTotals();
    UiCtrl.clearEditState();

    e.preventDefault();
  };
  const deleteTask = e => {
    const taskToDelete = TaskCtrl.getCurrentTask();

    const deletedTask = TaskCtrl.deleteTask(taskToDelete.id);

    UiCtrl.deleteTaskUi();

    Storagectrl.deleteTask(taskToDelete.id);

    showTotals();
    UiCtrl.clearEditState();
    e.preventDefault();
  };

  const updateMode = e => {
    if (e.target.classList.contains("edit-item")) {
      // get the id of the list item
      const list_id = e.target.parentNode.parentNode.id;

      // spit the id to get the number only
      const arr_id = list_id.split("-");

      // get the list id as an integer
      const id = parseInt(arr_id[1]);

      const task = TaskCtrl.getTaskById(id);

      const currentItem = TaskCtrl.setCurrentTask(task);

      UiCtrl.addCurrentToForm();
    }

    e.preventDefault();
  };
  const showTotals = () => {
    const totalTasks = TaskCtrl.getTotalTasks();

    UiCtrl.updateTotal(totalTasks);
  };

  const addTask = e => {
    const userInput = UiCtrl.getUserInput();

    // do some validation
    if (userInput.date != "" && userInput.task != "" && userInput.user != "") {
      const newTask = TaskCtrl.addTask(
        userInput.task,
        userInput.date,
        userInput.user,
        userInput.state
      );
      //add task to ls
      Storagectrl.storeToLs(newTask);
      
      
      //add the item to the ui
      UiCtrl.addTaskUi(newTask);
      const clearInputs = UiCtrl.clearInputs();
      showTotals();
    }else{
      alert("input a task");
    }

    e.preventDefault();
  };

  //public methods
  return {
    run: () => {
      UiCtrl.clearEditState();
      const tasks = TaskCtrl.getTasks();
      const populate = UiCtrl.populateTasks(tasks);
      loadListeners();
      showTotals();
    }
  };
})(TaskCtrl, UiCtrl, StorageCtrl);

App.run();