/**
 * Task manager app using the module pattern
 */

//Strorage controller

//Task controller
const TaskCtrl = (() => {
    const Task = function(id, name, date, user, state){
        this.id = id;
        this.name = name;
        this.date = date;
        this.user = user;
        this.state = state;
    };

    const data = {
        tasks: [
            // {
            //     id: 0,
            //     name: "Build Website",
            //     date: "1/1/2012",
            //     user: "samuel",
            //     state: "started"
            // },
            // {
            //     id: 1,
            //     name: "Android user interface",
            //     date: "1/2/2015",
            //     user: "lantei",
            //     state: "completed"
            // },
            // {
            //     id: 2,
            //     name: "Merge Databases",
            //     date: "1/1/2019",
            //     user: "Muraya",
            //     state: "in progress"
            // }
        ],
        currentItem: null,
        totalTasks: 0
    };

    //public methods
    return {
        getTotalTasks:()=>{
            return data.tasks.length
        },
        getTasks: () => {
            return data.tasks;
        },
        addItem:(name, date, user, state)=>{
            let ID;
            //generate an autoincrement id 
            if(data.tasks.length > 0){
               ID =data.tasks[data.tasks.length - 1].id + 1;
            }else{
                ID =0;
            }
        const newTask = new Task(ID, name, date, user, state);
        
        data.tasks.push(newTask);
        return newTask;
               
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
        tasklist: "#task-list",
        taskInput: "#add-task",
        dateInput: "#add-date",
        userSelect: "#add-user",
        taskState: "input[name=group1]:checked",
        totalTasks:".total-tasks"
    }
    // public methods
    return {
        clearEditState:()=>{
            UiCtrl.clearInputs();
            document.querySelector(UiSelectors.updateBtn).style.display = "none";
            document.querySelector(UiSelectors.deleteBtn).style.display = "none";
            document.querySelector(UiSelectors.backBtn).style.display = "none";
        },
        updateTotal:(amount)=>{
            //get the span class
           document.querySelector(UiSelectors.totalTasks).innerHTML = amount;
        },
        clearInputs:()=>{
            document.querySelector(UiSelectors.taskInput).value = "";
            document.querySelector(UiSelectors.dateInput).value = "";
            document.querySelector(UiSelectors.userSelect).vale = "Choose a user";
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
            }
        },
        populateTasks: (tasks) => {
            let html = "";

            tasks.forEach(function (task) {
                html += `<li class="collection-item" id="item-${task.id}">
            <strong>${task.name}: </strong>${task.user} <em>${task.date}</em>
            <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>
        </li>`;
            });

            document.querySelector(UiSelectors.tasklist).innerHTML = html;
        },

        addTaskUi:(task) =>{
            //create the li
            const li = document.createElement("li");

            //add the class
            li.className = "collection-item";

            //add the id 
            li.id = `item-${task.id}`;

            //insert html

            li.innerHTML = `<strong>${task.name}: </strong>${task.user} <em>${task.date}</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `
            //insert to the ui
            document.querySelector(UiSelectors.tasklist).insertAdjacentElement('beforeend', li);
        }
    };
})();

//App controller

const App = ((TaskCtrl, UiCtrl) => {
    // load event listeners
    const loadListeners = () => {
        const UiSelectors = UiCtrl.getSelectors();

        //add a listener when the user clicks add
        document.querySelector(UiSelectors.addBtn).addEventListener("click", addTask);
        document.querySelector(UiSelectors.tasklist).addEventListener("click", updateMode );
    }

    const updateMode =(e)=>{
        if(e.target.className = "edit-item")        
        e.preventDefault();
    }

    const showTotals = ()=>{
        const totalTasks = TaskCtrl.getTotalTasks();
        
        UiCtrl.updateTotal(totalTasks);
        
    }

    const addTask = (e) => {
        const userInput = UiCtrl.getUserInput();

        // do some validation
        if (userInput.date != "" && userInput.task  != "" && userInput.user != "") {
            const newTask = TaskCtrl.addItem(userInput.task, userInput.date, userInput.user, userInput.state);
            //add the item to the ui

            const addTaskUi = UiCtrl.addTaskUi(newTask);

            const clearInputs = UiCtrl.clearInputs();

            showTotals();
        
        }

        e.preventDefault();
    }

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
})(TaskCtrl, UiCtrl);

App.run();