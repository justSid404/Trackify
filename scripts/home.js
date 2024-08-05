let userLogged;

if(localStorage.getItem('userLogged') === null) {

  window.location.href = 'error.html';

}

userLogged = JSON.parse(localStorage.getItem('userLogged'));
document.querySelector('.user-name').innerHTML = userLogged.username;
// localStorage.removeItem(userLogged.username);

let userData;

if(localStorage.getItem(userLogged.username) !== null) {

  userData = JSON.parse(localStorage.getItem(userLogged.username));
  sortTasks();

} else {

  userData = {

    trackers: []

  }

}

let trackers = [];

const cardHolderElement = document.querySelector('.card-holder');
const createTrackerElement = document.querySelector('.create-tracker-card');
const userOptionsBtnElement = document.querySelector('.user-options');
const logoutBtnElement = document.querySelector('.log-out');

// if(localStorage.getItem('userLogged') !== null) {
//   userLogged = JSON.parse(localStorage.getItem('userLogged'));
//   localStorage.removeItem('userLogged');
// }

if(localStorage.getItem(userLogged.username) !== null) {

  trackers = userData.trackers;

}

console.log(trackers);

//Home page default transition
document.body.classList.add('fade-in');

//Add trackers as per the trackers array
trackers.forEach((tracker, trackerLength) => {

  const newCardhtml = `

  <div class="tracker-card tracker-card-${trackerLength}">

    <div class="tracker-card-title tracker-card-${trackerLength}-title">
      ${tracker.name}
    </div>

    <div class="tracker-content content-tracker-card-${trackerLength}">

    </div>
    <div class="tracker-controller">

      <input class="tracker-controller-input controller-input-tracker-card-${trackerLength}" type="text" data-temp-status="">
      <button class="add-task add-task-tracker-card-${trackerLength}">&#10148;</button>
      
    </div>
  </div>`;

  cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
  cardHolderElement.classList.remove('card-holder-zero');
  document.querySelector(`.card-holder`).scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  const tempAddTaskToCard = document.querySelector(`.add-task-tracker-card-${trackerLength}`);
  addTask(trackerLength, tempAddTaskToCard);

  tracker.task.forEach((taskItem, taskIndex) => {

    const taskHtml = `
  
    <div class="task task-${taskIndex}-tracker-card-${trackerLength} task-${taskItem.status}">
      <div class="task-info">
        ${taskItem.name}
      </div>
      
      <div class="task-action">

        <select class="task-action task-${taskIndex}-action-tracker-card-${trackerLength}" data-task-number="${taskIndex}" data-tracker-card-number="${trackerLength}">
          <option value="todo">ToDo</option>
          <option value="inpro">In-Process</option>
          <option value="done">Completed</option>
          <option value="edit">Edit</option>
          <option value="remove">Remove</option>
        </select>

      </div>
      
    </div>`;

    document.querySelector(`.content-tracker-card-${trackerLength}`).insertAdjacentHTML('beforeend', taskHtml);

    document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`).value = taskItem.status;
      
    const tempTaskActionElement = document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`);
    addEventToTaskAction(tempTaskActionElement);

  }); 

});

//Layout handling
if(trackers.length === 0) {
  cardHolderElement.classList.add('card-holder-zero');
} else {
  cardHolderElement.classList.remove('card-holder-zero');
}

//User options button functionality
userOptionsBtnElement.addEventListener('click', () => {

  if(logoutBtnElement.classList.contains('log-out-transition')) {
    logoutBtnElement.classList.remove('log-out-transition');
  } else {
    logoutBtnElement.classList.add('log-out-transition');

    setTimeout(() => {
      logoutBtnElement.classList.remove('log-out-transition');
    }, 5000);
  }

});

//Logout button functionality
logoutBtnElement.addEventListener('click', () => {

  localStorage.setItem(userLogged.username, JSON.stringify({

    trackers

  }));

  localStorage.removeItem('userLogged');
  window.location.href = 'login.html';
});

//Code to add new Tracker
createTrackerElement.addEventListener('click', () => {

  takeInputThroughPrompt();

});

//Code to take input from user when creating a new Tracker card
function takeInputThroughPrompt() {

  const promptHtml = `

  <div class="input-prompt">

    <div class="input-prompt-box">
      What will be the Tracker name?
      <label class="input-prompt-label">

        <input class="input-prompt-checkbox" type="checkbox">Recurring Tasks?

      </label>
      <input class="input-prompt-textbox" type="text">
      <div class="input-prompt-buttons">
        <button class="input-prompt-save">Save</button>
        <button class="input-prompt-cancel">Cancel</button>
      </div>
      
    </div>

  </div>`;

  document.body.insertAdjacentHTML('afterbegin', promptHtml);

  document.querySelector('.input-prompt-save').addEventListener('click', () => {

    const inputValue = document.querySelector('.input-prompt-textbox').value;
    if(inputValue.length > 0) {

      document.querySelector('.input-prompt').remove();
      addTrackerCard(inputValue);

    } else {

      document.querySelector('.input-prompt-textbox').placeholder = "Please enter Tracker name.";

    }
  
  });
  
  document.querySelector('.input-prompt-cancel').addEventListener('click', () => {
  
    document.querySelector('.input-prompt').remove();
  
  });

  document.querySelector('.input-prompt-textbox').addEventListener('keydown', (event) => {

    if(event.key === "Enter") {
      const inputValue = document.querySelector('.input-prompt-textbox').value;
      document.querySelector('.input-prompt').remove();
      addTrackerCard(inputValue);
    }

    if(event.key === "Escape") {
      document.querySelector('.input-prompt').remove();
    }

  });

}

//Code to add Tracker card to the card holder
function addTrackerCard(inputValue) {

  const trackerLength = trackers.length;

  const newCardhtml = `

  <div class="tracker-card tracker-card-${trackerLength}">

    <div class="tracker-card-title tracker-card-${trackerLength}-title">
      ${inputValue}
    </div>

    <div class="tracker-content content-tracker-card-${trackerLength}">

    </div>
    <div class="tracker-controller">

      <input class="tracker-controller-input controller-input-tracker-card-${trackerLength}" type="text" data-temp-status="">
      <button class="add-task add-task-tracker-card-${trackerLength}">&#10148;</button>
      
    </div>
  </div>`;

  cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
  cardHolderElement.classList.remove('card-holder-zero');
  document.querySelector(`.card-holder`).scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  const tempAddTaskToCard = document.querySelector(`.add-task-tracker-card-${trackerLength}`);
  addTask(trackerLength, tempAddTaskToCard);

  trackers.push({
    id: trackerLength,
    elementClass: `tracker-card-${trackerLength}`,
    name: inputValue,
    task: []
  });

  sortTasks();
  console.log(trackers);
  userData.trackers = trackers;
  localStorage.setItem(userLogged.username, JSON.stringify(userData));

}

//Code to add Task to a Tracker card
function addTask(trackerLength, tempAddTaskToCard) {

  const tempControllerInputElement = document.querySelector(`.controller-input-tracker-card-${trackerLength}`);

  tempControllerInputElement.addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {
      tempAddTaskToCard.click();
    }

  })

  tempAddTaskToCard.addEventListener('click', () => {

    let tempEditStatusValue = '';
    if(document.querySelector(`.controller-input-tracker-card-${trackerLength}`).tempStatus) {
      tempEditStatusValue = document.querySelector(`.controller-input-tracker-card-${trackerLength}`).tempStatus;
    }

    if(tempControllerInputElement.value.length > 0) {

      trackers.forEach((tracker) => {

        if(tracker.id === trackerLength) {

          if(tempEditStatusValue.length > 0) {

            tracker.task.push(
              {
                name: tempControllerInputElement.value,
                status: tempEditStatusValue
              }
            );
            document.querySelector(`.controller-input-tracker-card-${trackerLength}`).tempStatus = '';

          } else {

            tracker.task.push(
              {
                name: tempControllerInputElement.value,
                status: 'todo'
              }
            );

          }

          console.log(trackers);
          userData.trackers = trackers;
          sortTasks();
          trackers = userData.trackers;
          localStorage.setItem(userLogged.username, JSON.stringify(userData));
          // localStorage.setItem('trackers', JSON.stringify(trackers));
        }
  
      });

      document.querySelector(`.content-tracker-card-${trackerLength}`).innerHTML = '';

      trackers[trackerLength].task.forEach((taskItem, taskIndex) => {

        const taskHtml = `
      
        <div class="task task-${taskIndex}-tracker-card-${trackerLength} task-${taskItem.status}">
          <div class="task-info">
            ${taskItem.name}
          </div>
          
          <div class="task-action">

            <select class="task-action task-${taskIndex}-action-tracker-card-${trackerLength}" data-task-number="${taskIndex}" data-tracker-card-number="${trackerLength}">
              <option value="todo">ToDo</option>
              <option value="inpro">In-Process</option>
              <option value="done">Completed</option>
              <option value="edit">Edit</option>
              <option value="remove">Remove</option>
            </select>

          </div>
          
        </div>`;

        document.querySelector(`.content-tracker-card-${trackerLength}`).insertAdjacentHTML('beforeend', taskHtml);

        document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`).value = taskItem.status;

        addEventToTaskAction(document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`));

      });

      tempControllerInputElement.value = '';

    } else {

      tempControllerInputElement.placeholder = `Please enter ${trackers[trackerLength].name} to track.`;

    }

  });

}

//Code to add event listener to a task-action
function addEventToTaskAction(taskActionElement) {

  const tempTrackerNo = taskActionElement.getAttribute('data-tracker-card-number');
  const tempTaskNo = taskActionElement.getAttribute('data-task-number');

  const tempTaskElement = document.querySelector(`.task-${tempTaskNo}-tracker-card-${tempTrackerNo}`);

  taskActionElement.addEventListener('change', () => {

    if(taskActionElement.value === "todo") {

      trackers[tempTrackerNo].task[tempTaskNo].status = "todo";
      tempTaskElement.classList.add('task-todo');
      tempTaskElement.classList.remove('task-inpro');
      tempTaskElement.classList.remove('task-done');

    } else if(taskActionElement.value === "inpro") {

      trackers[tempTrackerNo].task[tempTaskNo].status = "inpro";
      tempTaskElement.classList.remove('task-todo');
      tempTaskElement.classList.add('task-inpro');
      tempTaskElement.classList.remove('task-done');

    } else if(taskActionElement.value === "done") {

      trackers[tempTrackerNo].task[tempTaskNo].status = "done";
      tempTaskElement.classList.remove('task-todo');
      tempTaskElement.classList.remove('task-inpro');
      tempTaskElement.classList.add('task-done');

    } else if(taskActionElement.value === "edit") {

      trackers = userData.trackers;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).value = trackers[tempTrackerNo].task[tempTaskNo].name;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).tempStatus = trackers[tempTrackerNo].task[tempTaskNo].status;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    } else if(taskActionElement.value === "remove") {

      trackers = userData.trackers;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    }

    console.log(trackers);
    userData.trackers = trackers;
    sortTasks();
      
    document.querySelector(`.content-tracker-card-${tempTrackerNo}`).innerHTML = '';

    trackers[tempTrackerNo].task.forEach((taskItem, taskIndex) => {

      const taskHtml = `
    
      <div class="task task-${taskIndex}-tracker-card-${tempTrackerNo} task-${taskItem.status}">
        <div class="task-info">
          ${taskItem.name}
        </div>
        
        <div class="task-action">

          <select class="task-action task-${taskIndex}-action-tracker-card-${tempTrackerNo}" data-task-number="${taskIndex}" data-tracker-card-number="${tempTrackerNo}">
            <option value="todo">ToDo</option>
            <option value="inpro">In-Process</option>
            <option value="done">Completed</option>
            <option value="edit">Edit</option>
            <option value="remove">Remove</option>
          </select>

        </div>
        
      </div>`;

      document.querySelector(`.content-tracker-card-${tempTrackerNo}`).insertAdjacentHTML('beforeend', taskHtml);

      document.querySelector(`.task-${taskIndex}-action-tracker-card-${tempTrackerNo}`).value = taskItem.status;

      addEventToTaskAction(document.querySelector(`.task-${taskIndex}-action-tracker-card-${tempTrackerNo}`));

    });
    localStorage.setItem(userLogged.username, JSON.stringify(userData));

  });

}

//Code to sort all tasks according to inpro -> todo -> done
function sortTasks() {

  userData.trackers.forEach((tracker, trackerIndex) => {

    let sortedTasks = [];
    const sortSequence = ['inpro', 'todo', 'done'];

    //first adding all inpro tasks, then todo tasks and finally done tasks to sortedTask array which is temp array
    sortSequence.forEach((sequenceItem) => {

      tracker.task.forEach((taskItem) => {

        if(sequenceItem === taskItem.status) {
  
          sortedTasks.push(taskItem);
  
        }
  
      });

    });

    //Once array is sorted, we replace content of tracker array with sortedTasks array
    userData.trackers[trackerIndex].task = sortedTasks;

  });

}