function addtask(){
    const newTask = document.createElement('li')
    const taskList = document.getElementById('task-list')

    taskList.appendChild(newTask)
    newTask.textContent = document.getElementById('input-task').value

    newTask.className = 'flex items-center justify-between bg-blue-100 p-2 my-2 rounded-lg shadow-sm w-80' 

    deletetask(newTask)
}

function deletetask(newtask){
    const deletebtn = document.createElement('button')
    deletebtn.textContent = 'Delete'

    deletebtn.className = 'ml-4 p-1 px-1 text-sm bg-red-400 text-white rounded-xl hover:bg-red-600';

    newtask.appendChild(deletebtn)

    deletebtn.onclick = function(){
        newtask.remove()
    }
}