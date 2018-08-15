/**
 * Create four classes 
 * 1: for handling the tasks
 * 2:for the ui
 * 3:the app controller
 * 4:for local storage
 */

 class Tasks{
    
    constructor(id, name, date, user, state){
        this.id = id;
        this.name = name;
        this.date = date;
        this.user = user;
        this.state = state;
        this.data = {
            tasks:[
                {id:0, name:"Build Website",date:"1/1/2012", user:"samuel", state:"started"},
                {id:0, name:"Android user interface",date:"1/2/2015", user:"lantei", state:"completed"},
                {id:0, name:"Merge Databases",date:"1/1/2019", user:"Muraya", state:"in progress"}
            ],
            currentItem:null,
            totalTasks:0
        }
        
        
    }

    getAllTasks(){
        console.log(this.Tasks.data.tasks);
     }

 }

 class Ui{
     constructor(){}

     populateTasks(tasks){
        const html = '';

        tasks.forEach(function(task){
            
        });
     }

 }

 class LocalStorage{

}


 class App{
    constructor(){
        this.Tasks = new Tasks(0,0,0,0,0);
        this.Ui = new Ui;
        this.LocalStorage = new LocalStorage;
    }

    
 }

 
