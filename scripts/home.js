let userLogged;
let trackers = [];

const cardHolderElement = document.querySelector('.card-holder');
const createTrackerElement = document.querySelector('.create-tracker-card');

if(localStorage.getItem('userLogged') !== null) {
  userLogged = JSON.parse(localStorage.getItem('userLogged'));
  localStorage.removeItem('userLogged');
}

//Home page default transition
document.body.classList.add('fade-in');

//Layout handling
if(trackers.length === 0) {
  cardHolderElement.classList.add('card-holder-zero');
} else {
  cardHolderElement.classList.remove('card-holder-zero');
}

//Code to add new Tracker
createTrackerElement.addEventListener('click', () => {

  takeInputThroughPrompt();

});

function takeInputThroughPrompt() {

  const promptHtml = `

  <div class="input-prompt">

    <div class="input-prompt-box">
      What will the Tracker name?
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

      <input class="tracker-controller-input controller-input-tracker-card-${trackerLength}" type="text">
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

    console.log(trackers);

}

function addTask(trackerLength, tempAddTaskToCard) {

  const tempControllerInputElement = document.querySelector(`.controller-input-tracker-card-${trackerLength}`);

  tempControllerInputElement.addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {
      tempAddTaskToCard.click();
    }

  })

  tempAddTaskToCard.addEventListener('click', () => {

    if(tempControllerInputElement.value.length > 0) {

      trackers.forEach((tracker) => {

        if(tracker.id === trackerLength) {
          tracker.task.push(
            {
              name: tempControllerInputElement.value,
              status: 'To Do'
            }
          );
        }
  
      });

      const taskHtml = `
  
        <div class="task task-tracker-card-${trackerLength} task-todo">
          <div class="task-info">
            ${trackers[trackerLength].task[trackers[trackerLength].task.length - 1].name}
          </div>
          
          <div class="task-action">

            <select class="task-${trackers[trackerLength].task.length - 1}-action-tracker-card-${trackerLength}" data-task-number="${trackers[trackerLength].task.length - 1}" data-tracker-card-number="${trackerLength}">
              <option value="todo">ToDo</option>
              <option value="inpro">In-Process</option>
              <option value="done">Completed</option>
              <option value="edit">Edit</option>
              <option value="remove">Remove</option>
            </select>

          </div>
          
        </div>`;

      document.querySelector(`.content-tracker-card-${trackerLength}`).insertAdjacentHTML('beforeend', taskHtml);

      tempControllerInputElement.value = '';

    } else {

      tempControllerInputElement.placeholder = `Please enter ${trackers[trackerLength].name} to track.`;

    }

  });

}