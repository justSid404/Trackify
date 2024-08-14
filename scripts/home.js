import { firebaseConfig } from "../data/db-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set, update, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const cardHolderElement = document.querySelector('.card-holder');
const createTrackerElement = document.querySelector('.create-tracker-card');
const userOptionsBtnElement = document.querySelector('.user-options');
const logoutBtnElement = document.querySelector('.log-out');
const searchBtnElement = document.querySelector('.search-tracker');
const searchBoxElement = document.querySelector('.search-tracker-input');
const searchBtnSvgElement = document.querySelector('.search-tracker-search-button');
const searchCancelBtnElement = document.querySelector('.search-tracker-search-cancel');
const rightArrowBtnElement = document.querySelector('.traverse-right-button');
const leftArrowBtnElement = document.querySelector('.traverse-left-button');

let userAtCard = 0;
let userXP = 0;
let userLevel = 1;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Reference to database services
const db = getDatabase(app);

let userLogged;
let trackers = [];
let userData = {

  trackers: []

};

pageSetup();

async function pageSetup() {

  try{

    await initializeApp_phase1();
    await initializeDataAndRender();
    await initializeApp_phase2();

  } catch(error) {

    //Error during app initialization

  }

}

//Code to initialize the app - phase 1
async function initializeApp_phase1() {
  return new Promise((resolve, reject) => {
    
    //Code to redirect to error.html if user not logged in
    if(localStorage.getItem('userLogged') === null) {
    
      window.location.href = 'error.html';
    
    }

    //Code to get username of logged user and displaying it in appropriate location
    userLogged = JSON.parse(localStorage.getItem('userLogged'));
    document.querySelector('.user-name').innerHTML = userLogged.username;
    
    resolve();
    
  });

}

//Code to initialize all the required data
async function initializeDataAndRender() {

  return new Promise((resolve, reject) => {

    //Code to save trackers data if available on Firebase for respective user 
    getUserData();
    
    resolve();
    
  });

}

//Code to take input from user when creating a new Tracker card
async function takeInputThroughPrompt() {

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

  document.querySelector(`.input-prompt-textbox`).focus();

  document.querySelector('.input-prompt-save').addEventListener('click', () => {

    const inputValue = document.querySelector('.input-prompt-textbox').value;
    if(inputValue.length > 0 && inputValue.length<31) {

      document.querySelector('.input-prompt').remove();
      // addTrackerCard(inputValue);
      addTrackerCardWithOption(inputValue, trackers.length, true);

      //Code to open Option menu for a Tracker
      addTrackerOptions(trackers.length - 1);

    } else if(inputValue.length>30) {

      document.querySelector('.input-prompt-textbox').value = "";
      document.querySelector('.input-prompt-textbox').placeholder = "Please enter up to 30 characters.";

    } else {

      document.querySelector('.input-prompt-textbox').placeholder = "Please enter Tracker name.";

    }
  
  });
  
  document.querySelector('.input-prompt-cancel').addEventListener('click', () => {
  
    document.querySelector('.input-prompt').remove();
  
  });

  document.querySelector('.input-prompt-textbox').addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {

      const inputValue = document.querySelector('.input-prompt-textbox').value;
      document.querySelector('.input-prompt').remove();
      addTrackerCardWithOption(inputValue, trackers.length, true);

      //Code to open Option menu for a Tracker
      addTrackerOptions(trackers.length-1);

    }

    if(event.key === 'Escape') {

      document.querySelector('.input-prompt').remove();

    }

  });

}

//Code to add Tracker card to the card holder
async function addTrackerCardWithOption(trackerName, trackerNumber, isSaveRequired) {
  const newCardhtml = `

  <div class="tracker-card tracker-card-${trackerNumber}">

    <div class="tracker-card-title tracker-card-${trackerNumber}-title">
      <p class="tracker-card-title-p tracker-card-${trackerNumber}-title-p">${trackerName}</p>
      <div class="option-tracker-card option-tracker-card-${trackerNumber}" data-tracker-number="${trackerNumber}">
        &#10247;
      </div>
    </div>

    <div class="tracker-content content-tracker-card-${trackerNumber}">

    </div>
    <div class="tracker-controller">

      <input class="tracker-controller-input controller-input-tracker-card-${trackerNumber}" type="text" data-temp-status="">
      <button class="add-task add-task-tracker-card-${trackerNumber}">&#10148;</button>
      
    </div>
  </div>`;

  cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
  cardHolderElement.classList.remove('card-holder-zero');

  //Scroll to newly created card
  scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${trackerNumber}`));

  const tempAddTaskToCard = document.querySelector(`.add-task-tracker-card-${trackerNumber}`);
  addTask(trackerNumber, tempAddTaskToCard);

  if(isSaveRequired) {

    trackers.push({
      id: trackerNumber,
      name: trackerName,
      task: []
    });
    
    userData.trackers = trackers;
    sortTasks();
    updateUserData(userData.trackers);

    userAtCard = userData.trackers.length - 1;

  }
  

}

//Code to add Task to a Tracker card
async function addTask(trackerLength, tempAddTaskToCard) {

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

    if(tempControllerInputElement.value.length > 0 && tempControllerInputElement.value.length < 51) {

      trackers.forEach((tracker) => {

        if(tracker.id === trackerLength) {

          if(tracker.task === undefined) {

            tracker.task = [];

          }

          if(tempEditStatusValue.length > 0) {

            tracker.task.push(
              {
                id: tracker.task.length,
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
        }
  
      });
      
      userData.trackers = trackers;
      sortTasks();
      updateUserData(userData.trackers);
      trackers = userData.trackers;

      userAtCard = userData.trackers.length - 1;

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

    } else if(tempControllerInputElement.value.length > 50) {

      tempControllerInputElement.value = "";
      tempControllerInputElement.placeholder = `Please enter up to 50 characters.`;

    } else {

      tempControllerInputElement.placeholder = `Please enter task to track.`;

    }

  });

}

//Code to add event listener to a task-action
async function addEventToTaskAction(taskActionElement) {

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

      if(trackers[tempTrackerNo].task[tempTaskNo].status === "done") {

        xpAddOrSubtract("subtract", 5);

      }

      trackers[tempTrackerNo].task[tempTaskNo].status = "inpro";
      tempTaskElement.classList.remove('task-todo');
      tempTaskElement.classList.add('task-inpro');
      tempTaskElement.classList.remove('task-done');

    } else if(taskActionElement.value === "done") {

      if(trackers[tempTrackerNo].task[tempTaskNo].status !== "done") {

        xpAddOrSubtract("add", 5);

      }

      trackers[tempTrackerNo].task[tempTaskNo].status = "done";
      tempTaskElement.classList.remove('task-todo');
      tempTaskElement.classList.remove('task-inpro');
      tempTaskElement.classList.add('task-done');

      confettiAnimation();

    } else if(taskActionElement.value === "edit") {

      trackers = userData.trackers;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).value = trackers[tempTrackerNo].task[tempTaskNo].name;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).tempStatus = trackers[tempTrackerNo].task[tempTaskNo].status;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    } else if(taskActionElement.value === "remove") {

      trackers = userData.trackers;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    }
    
    userData.trackers = trackers;
    sortTasks();
    updateUserData(userData.trackers);

    userAtCard = userData.trackers.length - 1;
      
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

  });

}

//Code to sort all tasks according to inpro -> todo -> done
async function sortTasks() {

  userData.trackers.forEach((tracker, trackerIndex) => {

    let sortedTasks = [];
    const sortSequence = ['inpro', 'todo', 'done'];

    //first adding all inpro tasks, then todo tasks and finally done tasks to sortedTask array which is temp array
    sortSequence.forEach((sequenceItem) => {

      if(tracker.task === undefined) {

        tracker.task = [];

      }

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

//Code to get userData to Firebase
async function getUserData() {

  const userDataRef = ref(db, 'userData');

  // Create a query to find the user with the specific username
  const userQuery = query(userDataRef, orderByChild("username"), equalTo(userLogged.username));
  
  // Get the results of the query
  const snapshot = await get(userQuery);

  if (snapshot.exists()) {

    // Iterate through the results (should be a single result if usernames are unique)
    snapshot.forEach((childSnapshot) => {

      if(childSnapshot.val().trackers) {

        userData = {

          trackers: childSnapshot.val().trackers

        };

      } else {

        userData = {

          trackers: []
      
        }

      }
      
    });

  } else {

    userData = {

      trackers: []
  
    }

  }

  //Code to save trackers data to a local variable if data is more than nothing
  if(userData.trackers.length > 0) {

    trackers = userData.trackers;

  }

  userAtCard = userData.trackers.length - 1;
  
  //Layout handling
  if(trackers.length === 0) {
    cardHolderElement.classList.add('card-holder-zero');
  } else {
    cardHolderElement.classList.remove('card-holder-zero');
  }

  //Add trackers as per the trackers array
  if(trackers.length > 0) {

    trackers.forEach((tracker, trackerLength) => {
      
      addTrackerCardWithOption(tracker.name, trackerLength, false);

      //Code to open Option menu for a Tracker
      addTrackerOptions(trackerLength);

      if(tracker.task) {
    
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

          if(taskItem.status === "done") {
            userXP += 5;
          }
            
          const tempTaskActionElement = document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`);
          addEventToTaskAction(tempTaskActionElement);
      
        }); 

      }
  
    });

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

    localStorage.removeItem('userLogged');
    window.location.href = 'login.html';
  });

  //Code to add new Tracker
  createTrackerElement.addEventListener('click', () => {
  
    takeInputThroughPrompt();
  
  });

  //Calculate level and XP
  calculateLevelAndXP();

  //Home page default transition
  document.body.classList.add('fade-in');

  console.log('User XP: '+userXP);
  console.log('User Level: '+userLevel);

}

//Code to update userData to Firebase
async function updateUserData(userData) {

  try{

    const userDataRef = ref(db, 'userData');

    // Create a query to find the user with the specific username
    const userQuery = query(userDataRef, orderByChild("username"), equalTo(userLogged.username));
    
    // Get the results of the query
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {

      // Convert snapshot to an array of child snapshots
      const children = [];
      snapshot.forEach((childSnapshot) => {
        children.push(childSnapshot);
      });

      // Use a for...of loop to iterate over the children
      for (const childSnapshot of children) {
        const userKey = childSnapshot.key; // Get the key of the user
        const userRef = ref(db, `userData/${userKey}/`); // Reference to the user's data

        // Update the user's data with the new array
        await update(userRef, {
          trackers: userData
        });

        //Delete localStorage data
        localStorage.removeItem(userLogged.username);

      }

    } 

  } catch (e) {

    //Error updating data

  }

}

//Code to open Option menu for a Tracker
async function addTrackerOptions(trackerNumber) {

  const tempTrackerOptions = document.querySelector(`.option-tracker-card-${trackerNumber}`);
  tempTrackerOptions.addEventListener('click', () => {

    const tempTrackerNum = tempTrackerOptions.getAttribute('data-tracker-number');

    if(userData.trackers[tempTrackerNum].task === undefined) {

      userData.trackers[tempTrackerNum].task = [];

    }
      
    let completeCount = 0;
    let inproCount = 0;
    let todoCount = 0;

    userData.trackers[tempTrackerNum].task.forEach((taskItem) => {

      if(taskItem.status === 'done') {
        completeCount++;
      }

      if(taskItem.status === 'inpro') {
        inproCount++;
      }

      if(taskItem.status === 'todo') {
        todoCount++;
      }

    });

    const optionHtml = `
    
      <div class="tracker-option-container">

        <div class="tracker-option-box">
        
          <div class="tracker-option-info">

            <p class="tracker-option-name">Tracker name: ${userData.trackers[tempTrackerNum].name}</p>
            <p class="tracker-option-count">Number of tasks: ${userData.trackers[tempTrackerNum].task.length}</p>
            <p class="tracker-option-count-completed">Number of <span class="highlight-done">Completed</span> tasks: ${completeCount}</p>
            <p class="tracker-option-count-inpro">Number of <span class="highlight-inpro">In-Process</span> tasks: ${inproCount}</p>
            <p class="tracker-option-count-todo">Number of <span class="highlight-todo">To-Do</span> tasks: ${todoCount}</p>
          
          </div>
          

          <div class="tracker-option-action">

            <div class="edit-tracker edit-tracker-card-${trackerNumber}">Edit</div>
            <div class="save-tracker save-tracker-card-${trackerNumber}">Save</div>
          
            <div class="delete-tracker delete-tracker-card-${trackerNumber}">Delete</div>
            <div class="close-tracker close-tracker-card-${trackerNumber}">Close</div>
          
          </div>

        </div>

      </div>
    
    `;

    document.body.insertAdjacentHTML('afterbegin', optionHtml);

    document.querySelector(`.edit-tracker-card-${trackerNumber}`).addEventListener('click', () => {
      
      let completeCount = 0;
      let inproCount = 0;
      let todoCount = 0;

      userData.trackers[tempTrackerNum].task.forEach((taskItem) => {

        if(taskItem.status === 'done') {
          completeCount++;
        }
  
        if(taskItem.status === 'inpro') {
          inproCount++;
        }
  
        if(taskItem.status === 'todo') {
          todoCount++;
        }
  
      });

      document.querySelector('.tracker-option-info').innerHTML = `
      <p>Tracker name: <input class="tracker-option-info-input" type="text"></p>
      <p class="tracker-option-count">Number of tasks: ${userData.trackers[tempTrackerNum].task.length}</p>
      <p class="tracker-option-count-completed">Number of <span class="highlight-done">Completed</span> tasks: ${completeCount}</p>
      <p class="tracker-option-count-inpro">Number of <span class="highlight-inpro">In-Process</span> tasks: ${inproCount}</p>
      <p class="tracker-option-count-todo">Number of <span class="highlight-todo">To-Do</span> tasks: ${todoCount}</p>
      `;

      document.querySelector('.tracker-option-info-input').value = userData.trackers[tempTrackerNum].name;

    });

    document.querySelector(`.save-tracker-card-${trackerNumber}`).addEventListener('click', () => {
      
      let completeCount = 0;
      let inproCount = 0;
      let todoCount = 0;

      userData.trackers[tempTrackerNum].task.forEach((taskItem) => {

        if(taskItem.status === 'done') {
          completeCount++;
        }
  
        if(taskItem.status === 'inpro') {
          inproCount++;
        }
  
        if(taskItem.status === 'todo') {
          todoCount++;
        }
  
      });

      const newTrackerName = document.querySelector('.tracker-option-info-input').value;
      userData.trackers[tempTrackerNum].name = newTrackerName;
      document.querySelector(`.tracker-card-${trackerNumber}-title-p`).innerHTML = newTrackerName;
      trackers = userData.trackers;
      updateUserData(userData.trackers);

      userAtCard = userData.trackers.length - 1;

      document.querySelector('.tracker-option-info').innerHTML = `
      <p class="tracker-option-name">Tracker name: ${userData.trackers[tempTrackerNum].name}</p>
      <p class="tracker-option-count">Number of tasks: ${userData.trackers[tempTrackerNum].task.length}</p>
      <p class="tracker-option-count-completed">Number of <span class="highlight-done">Completed</span> tasks: ${completeCount}</p>
      <p class="tracker-option-count-inpro">Number of <span class="highlight-inpro">In-Process</span> tasks: ${inproCount}</p>
      <p class="tracker-option-count-todo">Number of <span class="highlight-todo">To-Do</span> tasks: ${todoCount}</p>
      `;

    });

    document.querySelector(`.delete-tracker-card-${trackerNumber}`).addEventListener('click', () => {

      userData.trackers.splice(trackerNumber, 1);
      trackers = userData.trackers;
      updateUserData(userData.trackers);

      userAtCard = userData.trackers.length - 1;
      document.querySelector(`.tracker-option-container`).remove();

      cardHolderElement.innerHTML = `

      <div class="create-tracker-card">
        <div class="create-tracker">
          +
        </div>
      </div>`;

      //Code to add new Tracker
      document.querySelector('.create-tracker-card').addEventListener('click', () => {
      
        takeInputThroughPrompt();
      
      });

      trackers.forEach((tracker, trackerNumber) => {

        addTrackerCardWithOption(tracker.name, trackerNumber, false);

        //Code to open Option menu for a Tracker
        addTrackerOptions(trackerNumber);

        if(tracker.task) {
      
          tracker.task.forEach((taskItem, taskIndex) => {
        
            const taskHtml = `
          
            <div class="task task-${taskIndex}-tracker-card-${trackerNumber} task-${taskItem.status}">
              <div class="task-info">
                ${taskItem.name}
              </div>
              
              <div class="task-action">
        
                <select class="task-action task-${taskIndex}-action-tracker-card-${trackerNumber}" data-task-number="${taskIndex}" data-tracker-card-number="${trackerNumber}">
                  <option value="todo">ToDo</option>
                  <option value="inpro">In-Process</option>
                  <option value="done">Completed</option>
                  <option value="edit">Edit</option>
                  <option value="remove">Remove</option>
                </select>
        
              </div>
              
            </div>`;
        
            document.querySelector(`.content-tracker-card-${trackerNumber}`).insertAdjacentHTML('beforeend', taskHtml);
        
            document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerNumber}`).value = taskItem.status;
              
            const tempTaskActionElement = document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerNumber}`);
            addEventToTaskAction(tempTaskActionElement);
        
          }); 
  
        }

      });

    });

    document.querySelector(`.close-tracker-card-${trackerNumber}`).addEventListener('click', () => {

      document.querySelector(`.tracker-option-container`).remove();

    });

  });
}

//Code to scroll to an element in card picker
async function scrollToAnElementInCardPicker(targetElement) {

  // Calculate the position of the target element relative to the container
  const containerLeft = cardHolderElement.getBoundingClientRect().left;
  const targetLeft = targetElement.getBoundingClientRect().left;

  // Calculate the scroll position (target position minus container's current scroll position)
  const scrollPosition = targetLeft - containerLeft + cardHolderElement.scrollLeft;

  // Scroll the container to the target element smoothly
  cardHolderElement.scrollTo({
      left: scrollPosition - 40,
      behavior: 'smooth'
  });

}

//Code to initialize the app - phase 2
async function initializeApp_phase2() {

  //Code to add eventlistener to search button
  searchBtnElement.addEventListener('click', () => {
  
    searchBtnElement.classList.add('search-tracker-clicked');
    searchBoxElement.classList.add('search-tracker-input-transition');
    searchBtnSvgElement.classList.add('search-tracker-search-button-clicked');
    searchBtnSvgElement.classList.remove('disable');
    searchCancelBtnElement.classList.add('search-tracker-search-cancel-clicked');
    searchCancelBtnElement.classList.remove('disable');
  
    searchBoxElement.focus();
  
  }, { once: true });
  
  //Code to add eventlistener to cancel-search button
  searchCancelBtnElement.addEventListener('click', () => {
  
    searchBtnElement.classList.remove('search-tracker-clicked');
    searchBoxElement.classList.remove('search-tracker-input-transition');
    searchBtnSvgElement.classList.remove('search-tracker-search-button-clicked');
    searchBtnSvgElement.classList.add('disable');
    searchCancelBtnElement.classList.remove('search-tracker-search-cancel-clicked');
    searchCancelBtnElement.classList.add('disable');
  
    searchBoxElement.value = '';
  
    setTimeout(() => {
  
      //Code to add eventlistener to search button
      searchBtnElement.addEventListener('click', () => {
  
        searchBtnElement.classList.add('search-tracker-clicked');
        searchBoxElement.classList.add('search-tracker-input-transition');
        searchBtnSvgElement.classList.add('search-tracker-search-button-clicked');
        searchBtnSvgElement.classList.remove('disable');
        searchCancelBtnElement.classList.add('search-tracker-search-cancel-clicked');
        searchCancelBtnElement.classList.remove('disable');
  
        searchBoxElement.focus();
  
      }, { once: true });
  
    }, 500);
  
  });
  
  //Code to add eventlistener to search-svg button
  searchBtnSvgElement.addEventListener('click', () => {
  
    const searchResults = [];
  
    const tempSearchBoxValue = searchBoxElement.value;
  
    if(tempSearchBoxValue.length > 0) {
  
      userData.trackers.forEach((tracker, trackerIndex) => {

        if(tracker.task) {

          tracker.task.forEach((taskItem, taskIndex) => {

            if(taskItem.name.toLowerCase().includes(tempSearchBoxValue.toLowerCase())) {
    
              searchResults.push({
                index: trackerIndex,
                name: tracker.name,
                taskName: taskItem.name
              });
      
            }
            
          });

        }
  
        if(tracker.name.toLowerCase().includes(tempSearchBoxValue.toLowerCase())) {
  
          searchResults.push({
            index: trackerIndex,
            name: tracker.name
          });
  
        }
  
      });
  
      let searchResultHtml = `
      
        <div class="search-result-container fade-out">
        
          <div class="search-result-box">
        
            <div class="search-result-title">
          
              <p class="search-result-title-text">Search Result (${searchResults.length} items)</p>
  
              <div class="close-search-result-box">X</div>
  
            </div>
        
            <div class="search-result-box-content">
          
              `;

      searchResults.forEach((resultItem, resultIndex) => {

        if(resultItem.taskName) {

          searchResultHtml += `
          <div class="search-result-item-container search-result-item-${resultIndex}-container">
          
            <div class="search-result-item-tracker-name">
            
              <div class="search-result-item-info">
              
                <p>Tracker: ${resultItem.name}</p>
                <p>Task: ${resultItem.taskName}</p>

              </div>
              
              <svg class="click-to-redirect" fill="#FFFFFF" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="315.1,48.6 196.9,48.6 354.5,206.1 0,206.1 0,284.9 354.5,284.9 196.9,442.4 315.1,442.4 512,245.5 "></polygon> </g></svg>

            </div>

          </div>`;

        } else {

          searchResultHtml += `
          <div class="search-result-item-container search-result-item-${resultIndex}-container">
          
            <div class="search-result-item-tracker-name">
            
              <div class="search-result-item-info">
              
                <p>Tracker: ${resultItem.name}</p>

              </div>
              
              <svg class="click-to-redirect" fill="#FFFFFF" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="315.1,48.6 196.9,48.6 354.5,206.1 0,206.1 0,284.9 354.5,284.9 196.9,442.4 315.1,442.4 512,245.5 "></polygon> </g></svg>

            </div>

          </div>`;

        }

        

      });
              
      searchResultHtml += `
  
            </div>
        
          </div>
  
        </div>
  
      `;
  
      document.body.insertAdjacentHTML("afterbegin", searchResultHtml);
  
      setTimeout(() => {
  
        document.querySelector('.search-result-container').classList.add('fade-in');
        document.querySelector('.search-result-box').classList.add('search-result-box-transition-in');
  
      }, 0);
  
      document.querySelector('.close-search-result-box').addEventListener('click', () => {
  
        document.querySelector('.search-result-box').classList.remove('search-result-box-transition-in');
        document.querySelector('.search-result-container').classList.remove('fade-in');
  
        document.querySelector('.search-result-box').classList.add('search-result-box-transition-out');
        document.querySelector('.search-result-container').classList.add('fade-out');
        setTimeout(() => {
  
          document.querySelector('.search-result-container').remove();
  
        }, 250);
  
      });

      if(searchResults.length > 0) {

        searchResults.forEach((resultItem, resultIndex) => {

          document.querySelector(`.search-result-item-${resultIndex}-container`).addEventListener('click', () => {

            document.querySelector('.search-result-box').classList.remove('search-result-box-transition-in');
            document.querySelector('.search-result-container').classList.remove('fade-in');
      
            document.querySelector('.search-result-box').classList.add('search-result-box-transition-out');
            document.querySelector('.search-result-container').classList.add('fade-out');
            setTimeout(() => {
      
              document.querySelector('.search-result-container').remove();
              scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${resultItem.index}`));
              userAtCard = resultItem.index;
      
            }, 250);

          });
  
        });

      }
  
    } else {
  
      searchBoxElement.placeholder = 'Please search by Tracker or Task.';
  
    }
  
  });

  //Code to add eventlistener to search-input
  searchBoxElement.addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {

      searchBtnSvgElement.click();

    }

    if(event.key === 'Escape') {

      searchCancelBtnElement.click();

    }

  });
  
  //Code to traverse using right arrow
  rightArrowBtnElement.addEventListener('click', () => {
  
    const tempTrackerLength = userData.trackers.length;
  
    if(userAtCard > 0 && userAtCard <= tempTrackerLength ) {
  
      userAtCard--;
      scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${userAtCard}`));
  
    } else if (userAtCard === 0) {
  
      scrollToAnElementInCardPicker(createTrackerElement);
      userAtCard = "create";
  
    } else if (userAtCard === "create") {
  
      userAtCard = tempTrackerLength - 1;
      scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${userAtCard}`));
  
    }
  
  });
  
  //Code to traverse using left arrow
  leftArrowBtnElement.addEventListener('click', () => {
  
    const tempTrackerLength = userData.trackers.length;
  
    if(userAtCard >= 0 && userAtCard < (tempTrackerLength - 1) ) {
  
      userAtCard++;
      scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${userAtCard}`));
  
    } else if (userAtCard === (tempTrackerLength - 1)) {
  
      scrollToAnElementInCardPicker(createTrackerElement);
      userAtCard = "create";
  
    } else if (userAtCard === "create") {
  
      userAtCard = 0;
      scrollToAnElementInCardPicker(document.querySelector(`.tracker-card-${userAtCard}`));
  
    }
  
  });
  
}

//Code to handle Level increament
async function levelHandler() {

  if(userLevel >= 1 && userLevel <= 5) {

    if(userXP >= 100) {

      userLevel++;
      const diff = userXP - 100;
      userXP = diff;

      starExplodeAnimation();

    }

  } else if(userLevel >= 6 && userLevel <= 10) {

    if(userXP >= 200) {

      userLevel++;
      const diff = userXP - 200;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 10 && userLevel <= 15) {

    if(userXP >= 300) {

      userLevel++;
      const diff = userXP - 300;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 16 && userLevel <= 20) {

    if(userXP >= 400) {

      userLevel++;
      const diff = userXP - 400;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 21 && userLevel <= 25) {

    if(userXP >= 500) {

      userLevel++;
      const diff = userXP - 500;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 26 && userLevel <= 30) {

    if(userXP >= 600) {

      userLevel++;
      const diff = userXP - 600;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 31 && userLevel <= 35) {

    if(userXP >= 700) {

      userLevel++;
      const diff = userXP - 700;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 36 && userLevel <= 40) {

    if(userXP >= 800) {

      userLevel++;
      const diff = userXP - 800;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 41 && userLevel <= 45) {

    if(userXP >= 900) {

      userLevel++;
      const diff = userXP - 900;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 46 && userLevel <= 50) {

    if(userXP >= 1000) {

      userLevel++;
      const diff = userXP - 1000;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 51 && userLevel <= 55) {

    if(userXP >= 1100) {

      userLevel++;
      const diff = userXP - 1100;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 56 && userLevel <= 60) {

    if(userXP >= 1200) {

      userLevel++;
      const diff = userXP - 1200;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 61 && userLevel <= 65) {

    if(userXP >= 1300) {

      userLevel++;
      const diff = userXP - 1300;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 66 && userLevel <= 70) {

    if(userXP >= 1400) {

      userLevel++;
      const diff = userXP - 1400;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 71 && userLevel <= 75) {

    if(userXP >= 1500) {

      userLevel++;
      const diff = userXP - 1500;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 76 && userLevel <= 80) {

    if(userXP >= 1600) {

      userLevel++;
      const diff = userXP - 1600;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 81 && userLevel <= 85) {

    if(userXP >= 1700) {

      userLevel++;
      const diff = userXP - 1700;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 86 && userLevel <= 90) {

    if(userXP >= 1800) {

      userLevel++;
      const diff = userXP - 1800;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 91 && userLevel <= 95) {

    if(userXP >= 1900) {

      userLevel++;
      const diff = userXP - 1900;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel >= 96 && userLevel <= 100) {

    if(userXP >= 2000) {

      userLevel++;
      const diff = userXP - 2000;
      userXP = diff;

      starExplodeAnimation();

    }
    
  } else if(userLevel > 100) {

    if(userXP >= 2500) {

      userLevel++;
      const diff = userXP - 2500;
      userXP = diff;

      starExplodeAnimation();

    }
    
  }
  
}

//Code to add or deduct XP according to task action
async function xpAddOrSubtract(operation, value) {
  
  if(operation === "+" || operation === "add") {

    userXP += value;

  } else if(operation === "-" || operation === "subtract" || operation === "minus") {

    userXP -= value;

  }

  if(userXP > 0) {

    levelHandler();

  } else if(userXP < 0) {

    userLevel--;
    
    if(userLevel >= 1 && userLevel <= 5) {

      userXP = 100 + userXP;
  
    } else if(userLevel >= 6 && userLevel <= 10) {

      userXP = 200 + userXP;
      
    } else if(userLevel >= 10 && userLevel <= 15) {

      userXP = 300 + userXP;
      
    } else if(userLevel >= 16 && userLevel <= 20) {

      userXP = 400 + userXP;
      
    } else if(userLevel >= 21 && userLevel <= 25) {

      userXP = 500 + userXP;
      
    } else if(userLevel >= 26 && userLevel <= 30) {

      userXP = 600 + userXP;
      
    } else if(userLevel >= 31 && userLevel <= 35) {

      userXP = 700 + userXP;
      
    } else if(userLevel >= 36 && userLevel <= 40) {

      userXP = 800 + userXP;
      
    } else if(userLevel >= 41 && userLevel <= 45) {

      userXP = 900 + userXP;
      
    } else if(userLevel >= 46 && userLevel <= 50) {

      userXP = 1000 + userXP;
      
    } else if(userLevel >= 51 && userLevel <= 55) {

      userXP = 1100 + userXP;
      
    } else if(userLevel >= 56 && userLevel <= 60) {

      userXP = 1200 + userXP;
      
    } else if(userLevel >= 61 && userLevel <= 65) {

      userXP = 1300 + userXP;
      
    } else if(userLevel >= 66 && userLevel <= 70) {

      userXP = 1400 + userXP;
      
    } else if(userLevel >= 71 && userLevel <= 75) {

      userXP = 1500 + userXP;
      
    } else if(userLevel >= 76 && userLevel <= 80) {

      userXP = 1600 + userXP;
      
    } else if(userLevel >= 81 && userLevel <= 85) {

      userXP = 1700 + userXP;
      
    } else if(userLevel >= 86 && userLevel <= 90) {

      userXP = 1800 + userXP;
      
    } else if(userLevel >= 91 && userLevel <= 95) {

      userXP = 1900 + userXP;
      
    } else if(userLevel >= 96 && userLevel <= 100) {

      userXP = 2000 + userXP;
      
    } else if(userLevel > 100) {

      userXP = 2500 + userXP;
      
    }

  }

  console.log('User XP: '+userXP);
  console.log('User Level: '+userLevel);

}

async function confettiAnimation() {

  // do this for 1 seconds
  var duration = 1 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    // launch a few confetti from the bottom center
    confetti({
      particleCount: 7,
      angle: 90,
      spread: 80,
      origin: { x: Math.random(), y: Math.random() }
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
}

async function starExplodeAnimation() {

  // do this for 1 seconds
  var duration = 1 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    // launch a few confetti from the bottom center
    confetti({
      spread: 360,
      gravity: 0,
      decay: 0.94,
      startVelocity: 20,
      particleCount: 3,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFAC6C', 'FDFFB8']
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
}

async function calculateLevelAndXP() {

  if(userXP < 100) {
    userLevel = 1;
  } else if(userXP >= 100 && userXP <= 199) {
    userLevel = 2;
    userXP -= 100;
  } else if(userXP >= 200 && userXP <= 299) {
    userLevel = 3;
    userXP -= 200;
  } else if(userXP >= 300 && userXP <= 399) {
    userLevel = 4;
    userXP -= 300;
  } else if(userXP >= 400 && userXP <= 599) {
    userLevel = 5;
    userXP -= 400;
  } else if(userXP >= 600 && userXP <= 799) {
    userLevel = 6;
    userXP -= 600;
  } else if(userXP >= 800 && userXP <= 999) {
    userLevel = 7;
    userXP -= 800;
  } else if(userXP >= 1000 && userXP <= 1199) {
    userLevel = 8;
    userXP -= 1000;
  } else if(userXP >= 1200 && userXP <= 1399) {
    userLevel = 9;
    userXP -= 1200;
  } else if(userXP >= 1400 && userXP <= 1699) {
    userLevel = 10;
    userXP -= 1400;
  } else if(userXP >= 1700 && userXP <= 1999) {
    userLevel = 11;
    userXP -= 1700;
  } else if(userXP >= 2000 && userXP <= 2299) {
    userLevel = 12;
    userXP -= 2000;
  } else if(userXP >= 2300 && userXP <= 2599) {
    userLevel = 13;
    userXP -= 2300;
  } else if(userXP >= 2600 && userXP <= 2899) {
    userLevel = 14;
    userXP -= 2600;
  } else if(userXP >= 2900 && userXP <= 3299) {
    userLevel = 15;
    userXP -= 2900;
  } else if(userXP >= 3300 && userXP <= 3699) {
    userLevel = 16;
    userXP -= 3300;
  } else if(userXP >= 3700  && userXP <= 4099) {
    userLevel = 17;
    userXP -= 3700;
  } else if(userXP >= 4100  && userXP <= 4499) {
    userLevel = 18;
    userXP -= 4100;
  } else if(userXP >= 4500  && userXP <= 4899) {
    userLevel = 19;
    userXP -= 4500;
  } else if(userXP >= 4900  && userXP <= 5399) {
    userLevel = 20;
    userXP -= 4900;
  } else if(userXP >= 5400  && userXP <= 5899) {
    userLevel = 21;
    userXP -= 5400;
  } else if(userXP >= 5900  && userXP <= 6399) {
    userLevel = 22;
    userXP -= 5900;
  } else if(userXP >= 6400  && userXP <= 6899) {
    userLevel = 23;
    userXP -= 6400;
  } else if(userXP >= 6900  && userXP <= 7399) {
    userLevel = 24;
    userXP -= 6900;
  } else if(userXP >= 7400  && userXP <= 7999) {
    userLevel = 25;
    userXP -= 7400;
  } else if(userXP >= 8000  && userXP <= 8599) {
    userLevel = 26;
    userXP -= 8000;
  } else if(userXP >= 8600  && userXP <= 9199) {
    userLevel = 27;
    userXP -= 8600;
  } else if(userXP >= 9200  && userXP <= 9799) {
    userLevel = 28;
    userXP -= 9200;
  } else if(userXP >= 9800  && userXP <= 10399) {
    userLevel = 29;
    userXP -= 9800;
  } else if(userXP >= 10400  && userXP <= 11099) {
    userLevel = 30;
    userXP -= 10400;
  } else if(userXP >= 11100  && userXP <= 11799) {
    userLevel = 31;
    userXP -= 11100;
  } else if(userXP >= 11800  && userXP <= 12499) {
    userLevel = 32;
    userXP -= 11800;
  } else if(userXP >= 12500  && userXP <= 13199) {
    userLevel = 33;
    userXP -= 12500;
  } else if(userXP >= 13200  && userXP <= 1399) {
    userLevel = 34;
    userXP -= 13200;
  } else if(userXP >= 13900  && userXP <= 14699) {
    userLevel = 35;
    userXP -= 13900;
  } else if(userXP >= 14700  && userXP <= 15499) {
    userLevel = 36;
    userXP -= 14700;
  } else if(userXP >= 15500  && userXP <= 16299) {
    userLevel = 37;
    userXP -= 15500;
  } else if(userXP >= 16300  && userXP <= 17099) {
    userLevel = 38;
    userXP -= 16300;
  } else if(userXP >= 17100  && userXP <= 17899) {
    userLevel = 39;
    userXP -= 17100;
  } else if(userXP >= 17900  && userXP <= 18799) {
    userLevel = 40;
    userXP -= 17900;
  } else if(userXP >= 18800  && userXP <= 19699) {
    userLevel = 41;
    userXP -= 18800;
  } else if(userXP >= 19700  && userXP <= 20599) {
    userLevel = 42;
    userXP -= 19700;
  } else if(userXP >= 20600  && userXP <= 21499) {
    userLevel = 43;
    userXP -= 20600;
  } else if(userXP >= 21500  && userXP <= 22399) {
    userLevel = 44;
    userXP -= 21500;
  } else if(userXP >= 22400  && userXP <= 23399) {
    userLevel = 45;
    userXP -= 22400;
  } else if(userXP >= 23400  && userXP <= 24399) {
    userLevel = 46;
    userXP -= 23400;
  } else if(userXP >= 24400  && userXP <= 25399) {
    userLevel = 47;
    userXP -= 24400;
  } else if(userXP >= 25400  && userXP <= 26399) {
    userLevel = 48;
    userXP -= 25400;
  } else if(userXP >= 26400  && userXP <= 27399) {
    userLevel = 49;
    userXP -= 26400;
  } else if(userXP >= 27400  && userXP <= 28499) {
    userLevel = 50;
    userXP -= 27400;
  } else if(userXP >= 28500  && userXP <= 29599) {
    userLevel = 51;
    userXP -= 28500;
  } else if(userXP >= 29600  && userXP <= 30699) {
    userLevel = 52;
    userXP -= 29600;
  } else if(userXP >= 30700  && userXP <= 31799) {
    userLevel = 53;
    userXP -= 30700;
  } else if(userXP >= 31800  && userXP <= 32899) {
    userLevel = 54;
    userXP -= 31800;
  } else if(userXP >= 32900  && userXP <= 33999) {
    userLevel = 55;
    userXP -= 32900;
  } else if(userXP >= 34000  && userXP <= 35199) {
    userLevel = 56;
    userXP -= 34000;
  } else if(userXP >= 35200  && userXP <= 36399) {
    userLevel = 57;
    userXP -= 35200;
  } else if(userXP >= 36400  && userXP <= 37599) {
    userLevel = 58;
    userXP -= 36400;
  } else if(userXP >= 37600  && userXP <= 38799) {
    userLevel = 59;
    userXP -= 37600;
  } else if(userXP >= 38800  && userXP <= 40099) {
    userLevel = 60;
    userXP -= 38800;
  } else if(userXP >= 40100  && userXP <= 41399) {
    userLevel = 61;
    userXP -= 40100;
  } else if(userXP >= 41400  && userXP <= 42699) {
    userLevel = 62;
    userXP -= 41400;
  } else if(userXP >= 42700  && userXP <= 43999) {
    userLevel = 63;
    userXP -= 42700;
  } else if(userXP >= 44000  && userXP <= 45299) {
    userLevel = 64;
    userXP -= 44000;
  } else if(userXP >= 45300  && userXP <= 46699) {
    userLevel = 65;
    userXP -= 45300;
  } else if(userXP >= 46700  && userXP <= 48099) {
    userLevel = 66;
    userXP -= 46700;
  } else if(userXP >= 48100  && userXP <= 49499) {
    userLevel = 67;
    userXP -= 48100;
  } else if(userXP >= 49500  && userXP <= 50899) {
    userLevel = 68;
    userXP -= 49500;
  } else if(userXP >= 50900  && userXP <= 52299) {
    userLevel = 69;
    userXP -= 50900;
  } else if(userXP >= 52300  && userXP <= 53799) {
    userLevel = 70;
    userXP -= 52300;
  } else if(userXP >= 53800  && userXP <= 55299) {
    userLevel = 71;
    userXP -= 53800;
  } else if(userXP >= 55300  && userXP <= 56799) {
    userLevel = 72;
    userXP -= 55300;
  } else if(userXP >= 56800  && userXP <= 58299) {
    userLevel = 73;
    userXP -= 56800;
  } else if(userXP >= 58300  && userXP <= 59799) {
    userLevel = 74;
    userXP -= 58300;
  } else if(userXP >= 59800  && userXP <= 61399) {
    userLevel = 75;
    userXP -= 59800;
  } else if(userXP >= 61400  && userXP <= 62999) {
    userLevel = 76;
    userXP -= 61400;
  } else if(userXP >= 63000  && userXP <= 64599) {
    userLevel = 77;
    userXP -= 63000;
  } else if(userXP >= 64600  && userXP <= 66199) {
    userLevel = 78;
    userXP -= 64600;
  } else if(userXP >= 66200  && userXP <= 67799) {
    userLevel = 79;
    userXP -= 66200;
  } else if(userXP >= 67800  && userXP <= 69499) {
    userLevel = 80;
    userXP -= 67800;
  } else if(userXP >= 69500  && userXP <= 71199) {
    userLevel = 81;
    userXP -= 69500;
  } else if(userXP >= 71200  && userXP <= 72899) {
    userLevel = 82;
    userXP -= 71200;
  } else if(userXP >= 72900  && userXP <= 74599) {
    userLevel = 83;
    userXP -= 72900;
  } else if(userXP >= 74600  && userXP <= 76299) {
    userLevel = 84;
    userXP -= 74600;
  } else if(userXP >= 76300  && userXP <= 78099) {
    userLevel = 85;
    userXP -= 76300;
  } else if(userXP >= 78100  && userXP <= 79899) {
    userLevel = 86;
    userXP -= 78100;
  } else if(userXP >= 79900  && userXP <= 81699) {
    userLevel = 87;
    userXP -= 79900;
  } else if(userXP >= 81700  && userXP <= 83499) {
    userLevel = 88;
    userXP -= 81700;
  } else if(userXP >= 83500  && userXP <= 85299) {
    userLevel = 89;
    userXP -= 83500;
  } else if(userXP >= 85300  && userXP <= 87199) {
    userLevel = 90;
    userXP -= 85300;
  } else if(userXP >= 87200  && userXP <= 89099) {
    userLevel = 91;
    userXP -= 87200;
  } else if(userXP >= 89100  && userXP <= 90999) {
    userLevel = 92;
    userXP -= 89100;
  } else if(userXP >= 91000  && userXP <= 92899) {
    userLevel = 93;
    userXP -= 91000;
  } else if(userXP >= 92900  && userXP <= 94799) {
    userLevel = 94;
    userXP -= 92900;
  } else if(userXP >= 94800  && userXP <= 96999) {
    userLevel = 95;
    userXP -= 94800;
  } else if(userXP >= 97000  && userXP <= 98999) {
    userLevel = 96;
    userXP -= 97000;
  } else if(userXP >= 99000  && userXP <= 100999) {
    userLevel = 97;
    userXP -= 99000;
  } else if(userXP >= 101000 && userXP <= 102999) {
    userLevel = 98;
    userXP -= 101000;
  } else if(userXP >= 103000 && userXP <= 104999) {
    userLevel = 99;
    userXP -= 103000;
  } else if(userXP >= 105000 && userXP <= 106999) {
    userLevel = 100;
    userXP -= 105000;
  } else if (userXP > 106999){

    //To-Do
    userLevel = 100;
    userXP -= 106999;

  }
  
}