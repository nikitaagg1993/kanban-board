let editting;

const assignees = ['Nikita', 'James', 'Jamie'];

function addEditEvent () {
    var modal = document.getElementById("myModal");

    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const assignee = document.getElementById("assignee").value;
    const state = document.getElementById("state").value;
    const label = document.getElementById("add-label");

    const isEdit = label.textContent === "Edit an item";
    addToDo(state, { description, assignee, dueDate, state }, isEdit)
    label.innerHTML = "Add an item";
    modal.style.display = "none";
}

function createNewElement ({ elementType, className, id, text, value, name, title }) {
    const newElement = document.createElement(elementType);
    if(className) newElement.className = className;
    if(id) newElement.id = id;
    if(text)  {
        newElement.className = className;
        const node = document.createTextNode(text);
        newElement.appendChild(node);
    }
    if(value) newElement.value = value;
    if(name) newElement.name = name;
    if(title) newElement.title = title;
    return newElement;
}

function addItem () {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("assignee").value = "";
    document.getElementById("state").value = "to-do";
    var add = document.getElementById("add");
    add.onclick = addEditEvent;
    var cancel = document.getElementById("cancel");
    cancel.onclick = cancelModal;
  }

window.onload = () => {

    const allTasks = window.localStorage.getItem('allTasks') || "{}";

    const parseTasks = JSON.parse(allTasks);

    Object.keys(parseTasks).forEach((item,index) => {
        const task = parseTasks[item];
        renderTask(task, `task${index+1}`)
    });

    let addNew = document.getElementById("addNew");
    addNew.onclick = addItem;
    let addNewP = document.getElementById("addNewP");
    addNewP.onclick = addItem;
    let addNewD = document.getElementById("addNewD");
    addNewD.onclick = addItem;

    assignees.forEach(item => addAssignee(item) )

}

const cancelModal = () =>{
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const renderTask = (task, taskName) => {

    const toDoElement = document.getElementById(task.state);
    const listElement = createNewElement({ elementType: "li", className: "dd-item", id: taskName, title: taskName});
    const descriptionElement = createNewElement({ elementType: "h3", className: "dd-handle", text: task.description, id:taskName, name: taskName });
    const dueDateElement = createNewElement({ elementType: "h5", className: "dd-handle", text: `Due Date: ${task.dueDate}`, id:taskName, name: taskName})
    const assigneeElement = createNewElement({ elementType: "h5", className: "dd-handle", text: task.assignee, id:taskName, name: taskName })
    listElement.appendChild(descriptionElement);
    listElement.appendChild(dueDateElement);
    listElement.appendChild(assigneeElement);
    
    listElement.addEventListener('dblclick', (event) => {
        let currentTask = {};
        const id = event.target.id;
        const storageTask = window.localStorage.getItem('allTasks');
        currentTask = JSON.parse(storageTask)[id];

        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        var add = document.getElementById("add");
        add.value = "Edit";
        add.onclick = addEditEvent;
        var cancel = document.getElementById("cancel");
        cancel.onclick = cancelModal;
        const { description, dueDate, assignee, state } = currentTask;

        document.getElementById("add-label").innerHTML = "Edit an item";
        document.getElementById("description").value = description;
        document.getElementById("dueDate").value = dueDate;
        document.getElementById("assignee").value = assignee;
        document.getElementById("state").value = state;
        editting = { ...currentTask, id };
        
    })
    toDoElement.appendChild(listElement);
  }


const addToDo = (state,task, isEdit) => {

    const tasks = window.localStorage.getItem('allTasks') || "{}";
    const allTasks = JSON.parse(tasks);
    const length = Object.keys(allTasks).length;
    let taskName = '';

    if(isEdit) {
        allTasks[editting.id] = { ...task };
        taskName = editting.id;

        window.localStorage.setItem('allTasks', JSON.stringify(allTasks));
    } else {
        taskName = `task${length+1}`;
        allTasks[taskName] = task;
        window.localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }

    if(isEdit && editting) {
        const parent = document.getElementById(editting.state);
        const child= document.querySelector(`[title="${editting.id}"]`);
        parent.removeChild(child);       
        editting = {};
    }

    renderTask(task, taskName);
    taskName="";
};

const addAssignee = (assignee) => {
    let menu = document.getElementById("menu");
    const mainDiv = createNewElement({ elementType: 'button', id:assignee, title: assignee});
    const icon = createNewElement({elementType: "i", className: "fa fa-user", title: assignee });
    mainDiv.appendChild(icon);
    menu.appendChild(mainDiv);
}
