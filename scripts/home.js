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
    if(inputValue.length > 0) {

      document.querySelector('.input-prompt').remove();
      // addTrackerCard(inputValue);
      addTrackerCardWithOption(inputValue, trackers.length, true);

      //Code to open Option menu for a Tracker
      addTrackerOptions(trackers.length - 1);

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
      addTrackerCardWithOption(inputValue, trackers.length, true);

      //Code to open Option menu for a Tracker
      addTrackerOptions(trackers.length-1);

    }

    if(event.key === "Escape") {

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

    if(tempControllerInputElement.value.length > 0) {

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

    } else {

      tempControllerInputElement.placeholder = `Please enter ${trackers[trackerLength].name} to track.`;

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
  
      const tempAddTaskToCard = document.querySelector(`.add-task-tracker-card-${trackerLength}`);
      addTask(trackerLength, tempAddTaskToCard);

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

  //Home page default transition
  document.body.classList.add('fade-in');

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
  
        if(tracker.name.includes(tempSearchBoxValue)) {
  
          searchResults.push({
            index: trackerIndex,
            name: tracker.name
          });
  
        }
  
      });
  
      console.log('Here are the search results:');
      console.log(searchResults);
  
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

        searchResultHtml += `
        <div class="search-result-item-container search-result-item-${resultIndex}-container">
        
          <div class="search-result-item-tracker-name">
          
            ${resultItem.name}
            <svg class="click-to-redirect" fill="#FFFFFF" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="315.1,48.6 196.9,48.6 354.5,206.1 0,206.1 0,284.9 354.5,284.9 196.9,442.4 315.1,442.4 512,245.5 "></polygon> </g></svg>

          </div>

        </div>`;

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
  
      searchBoxElement.placeholder = 'Please type Tracker to search.';
  
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