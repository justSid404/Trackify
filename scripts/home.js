import { firebaseConfig } from "../data/db-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set, update, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const cardHolderElement = document.querySelector('.card-holder');
const createTrackerElement = document.querySelector('.create-tracker-card');
const userOptionsBtnElement = document.querySelector('.user-options');
const logoutBtnElement = document.querySelector('.log-out');

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

    // console.log("Initializing app...");
    await initializeApp_phase1();
    await initializeData();
    // await initializeApp_phase2();
    // await addEventListeners();
    // console.log("App initialization complete!");

  } catch(error) {

    console.error("Error during app initialization:", error);

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
    // localStorage.removeItem(userLogged.username);

    //Code to update userData to firebase if userdata exists in LocalStorage
    if(localStorage.getItem(userLogged.username) !== null) {

      const tempLSData = JSON.parse(localStorage.getItem(userLogged.username));
      updateUserData(tempLSData.trackers);
      localStorage.removeItem(userLogged.username);
      
    }
    
    resolve();
    
  });

}

//Code to initialize all the required data
async function initializeData() {

  return new Promise((resolve, reject) => {

    //Code to save trackers data if available on Firebase for respective user 
    getUserData();
    
    resolve();
    
  });

}

//Code to further initialize the app - phase 2
async function initializeApp_phase2() {

  return new Promise((resolve, reject) => {
    
    // //Code to save trackers data to a local variable if data is more than nothing
    // if(userData.trackers.length > 0) {

    //   // userData = JSON.parse(localStorage.getItem(userLogged.username));
    //   // sortTasks();
    //   // updateUserData(userData.trackers);
    //   trackers = userData.trackers;

    // }

    // //Layout handling
    // if(trackers.length === 0) {
    //   cardHolderElement.classList.add('card-holder-zero');
    // } else {
    //   cardHolderElement.classList.remove('card-holder-zero');
    // }

    // //Add trackers as per the trackers array
    // trackers.forEach((tracker, trackerLength) => {
    
    //   const newCardhtml = `
    
    //   <div class="tracker-card tracker-card-${trackerLength}">
    
    //     <div class="tracker-card-title tracker-card-${trackerLength}-title">
    //       ${tracker.name}
    //     </div>
    
    //     <div class="tracker-content content-tracker-card-${trackerLength}">
    
    //     </div>
    //     <div class="tracker-controller">
    
    //       <input class="tracker-controller-input controller-input-tracker-card-${trackerLength}" type="text" data-temp-status="">
    //       <button class="add-task add-task-tracker-card-${trackerLength}">&#10148;</button>
          
    //     </div>
    //   </div>`;
    
    //   cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
    //   cardHolderElement.classList.remove('card-holder-zero');
    //   document.querySelector(`.card-holder`).scrollTo({
    //     left: 0,
    //     behavior: 'smooth'
    //   });
    
    //   const tempAddTaskToCard = document.querySelector(`.add-task-tracker-card-${trackerLength}`);
    //   addTask(trackerLength, tempAddTaskToCard);
    
    //   tracker.task.forEach((taskItem, taskIndex) => {
    
    //     const taskHtml = `
      
    //     <div class="task task-${taskIndex}-tracker-card-${trackerLength} task-${taskItem.status}">
    //       <div class="task-info">
    //         ${taskItem.name}
    //       </div>
          
    //       <div class="task-action">
    
    //         <select class="task-action task-${taskIndex}-action-tracker-card-${trackerLength}" data-task-number="${taskIndex}" data-tracker-card-number="${trackerLength}">
    //           <option value="todo">ToDo</option>
    //           <option value="inpro">In-Process</option>
    //           <option value="done">Completed</option>
    //           <option value="edit">Edit</option>
    //           <option value="remove">Remove</option>
    //         </select>
    
    //       </div>
          
    //     </div>`;
    
    //     document.querySelector(`.content-tracker-card-${trackerLength}`).insertAdjacentHTML('beforeend', taskHtml);
    
    //     document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`).value = taskItem.status;
          
    //     const tempTaskActionElement = document.querySelector(`.task-${taskIndex}-action-tracker-card-${trackerLength}`);
    //     addEventToTaskAction(tempTaskActionElement);
    
    //   }); 
    
    // });
    
    resolve();
    
  });

}

//Code to add Event Listeners to independent elements
async function addEventListeners() {

  return new Promise((resolve, reject) => {

    // //User options button functionality
    // userOptionsBtnElement.addEventListener('click', () => {

    //   if(logoutBtnElement.classList.contains('log-out-transition')) {
    //     logoutBtnElement.classList.remove('log-out-transition');
    //   } else {
    //     logoutBtnElement.classList.add('log-out-transition');

    //     setTimeout(() => {
    //       logoutBtnElement.classList.remove('log-out-transition');
    //     }, 5000);
    //   }

    // });

    // //Logout button functionality
    // logoutBtnElement.addEventListener('click', () => {

    //   localStorage.setItem(userLogged.username, JSON.stringify({

    //     trackers

    //   }));

    //   localStorage.removeItem('userLogged');
    //   window.location.href = 'login.html';
    // });

    // //Code to add new Tracker
    // createTrackerElement.addEventListener('click', () => {
    
    //   takeInputThroughPrompt();
    
    // });
    
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
async function addTrackerCard(inputValue) {

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
    name: inputValue,
    task: []
  });

  console.log(trackers);
  userData.trackers = trackers;
  sortTasks();
  updateUserData(userData.trackers);

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

          console.log(trackers);
          userData.trackers = trackers;
          sortTasks();
          updateUserData(userData.trackers);
          trackers = userData.trackers;
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

    console.log(trackers);
    userData.trackers = trackers;
    sortTasks();
    updateUserData(userData.trackers);
      
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

  // try {

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

      // console.log("No matching user found");

    }

    // console.log(userData.trackers);

    //Code to save trackers data to a local variable if data is more than nothing
    if(userData.trackers.length > 0) {

      // userData = JSON.parse(localStorage.getItem(userLogged.username));
      // sortTasks();
      // updateUserData(userData.trackers);
      trackers = userData.trackers;

    }
    
    //Layout handling
    if(trackers.length === 0) {
      cardHolderElement.classList.add('card-holder-zero');
    } else {
      cardHolderElement.classList.remove('card-holder-zero');
    }

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

  // } catch (error) {
  //   console.error("Error getting user data:", error);
  // }

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

      // Iterate through the results (should be a single result if usernames are unique)
      snapshot.forEach((childSnapshot) => {

        const userKey = childSnapshot.key; // Get the key of the user
        const userRef = ref(db, `userData/${userKey}/`); // Reference to the user's data

        // Update the user's data with the new array
        update(userRef, {

          trackers: userData // Add or update the field with the new array

        });

        // console.log("Array added to the user.");

      });

    } else {

      // console.log("User not found.");

    }

  } catch (e) {

    console.error("Error updating data: ", e);

  }

}