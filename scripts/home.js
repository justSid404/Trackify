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
const leaderboardsBtnElement = document.querySelector('.leader-boards');
const levelCriteria = [];

let additionalXP = 0;
let additionalXP_Old = 0;

let latestCelebratedLevel = 1;

let isIconClicked = false;

let achievements = [{
  name: 'New Beginning',
  description: 'Login for the first time',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'First Level up',
  description: 'Reach Level 2',
  image: 'images/achievements/First_Level_up.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Private',
  description: 'Reach Level 10',
  image: 'images/achievements/Private.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Private First Class',
  description: 'Reach Level 20',
  image: 'images/achievements/Private_First_Class.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Specialist',
  description: 'Reach Level 30',
  image: 'images/achievements/Specialist.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Corporal',
  description: 'Reach Level 40',
  image: 'images/achievements/Corporal.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Sergeant',
  description: 'Reach Level 50',
  image: 'images/achievements/Sergeant.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Staff Sergeant',
  description: 'Reach Level 60',
  image: 'images/achievements/Staff_Sergeant.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Sergeant First Class',
  description: 'Reach Level 70',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Master Sergeant',
  description: 'Reach Level 80',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'First Sergeant',
  description: 'Reach Level 90',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Sergeant Major',
  description: 'Reach Level 100',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Command Sergeant Major',
  description: 'Reach Level 250',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Sergeant Major of the Army',
  description: 'Reach Level 500',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'What are you?',
  description: 'Reach Level 750',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Are you a God?',
  description: 'Reach Level 1000',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Go beyond... Plus Ultra!',
  description: 'Reach Level 2000',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'The First step',
  description: 'Complete the First task',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Taskmaster',
  description: 'Complete 5 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Decathlon',
  description: 'Complete 10 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Task Tackler',
  description: 'Complete 20 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Triple H',
  description: 'Complete 30 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Forty and Fabulous',
  description: 'Complete 40 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Half-Centurion',
  description: 'Complete 50 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Sixty Steps',
  description: 'Complete 60 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Seventy Strides',
  description: 'Complete 70 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Eighty Achiever',
  description: 'Complete 80 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Ninety to Victory',
  description: 'Complete 90 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Century Crusher',
  description: 'Complete 100 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Double Century',
  description: 'Complete 200 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Triple Century',
  description: 'Complete 300 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Quadruple Force',
  description: 'Complete 400 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Halfway Hero',
  description: 'Complete 500 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Six Hundred Successes',
  description: 'Complete 600 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Seven Hundred Star',
  description: 'Complete 700 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Elite Eight Hundred',
  description: 'Complete 800 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Nine Hundred Notches',
  description: 'Complete 900 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
},
{
  name: 'Task Titan',
  description: 'Complete 1000 tasks',
  image: 'images/achievements/New_Beginning.jpeg',
  achieved: false,
  xpClaimed: false
}];

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
    await updateUserData(userData.trackers, "trackers");

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

            if(tempEditStatusValue === "done") {

              xpAddOrSubtract("add", 5);

            }

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
      updateUserData(userData.trackers, "trackers");
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

      if(trackers[tempTrackerNo].task[tempTaskNo].status === "done") {

        xpAddOrSubtract("subtract", 5);

      }

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

      confettiAnimation(tempTrackerNo, tempTaskNo);

      const notificationOptions = {
        body: "+5XP rewarded :)"
      }

      pushNotification("Task Completed!", notificationOptions);

    } else if(taskActionElement.value === "edit") {

      if(trackers[tempTrackerNo].task[tempTaskNo].status === "done") {

        xpAddOrSubtract("subtract", 5);

      }

      trackers = userData.trackers;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).value = trackers[tempTrackerNo].task[tempTaskNo].name;
      document.querySelector(`.controller-input-tracker-card-${tempTrackerNo}`).tempStatus = trackers[tempTrackerNo].task[tempTaskNo].status;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    } else if(taskActionElement.value === "remove") {

      if(trackers[tempTrackerNo].task[tempTaskNo].status === "done") {

        xpAddOrSubtract("subtract", 5);

      }

      trackers = userData.trackers;
      trackers[tempTrackerNo].task.splice(tempTaskNo, 1);

    }
    
    userData.trackers = trackers;
    sortTasks();
    updateUserData(userData.trackers, "trackers");

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

        userData.trackers = childSnapshot.val().trackers;

      } else {

        userData.trackers = [];

      }

      if(childSnapshot.val().achievements) {

        userData.achievements = childSnapshot.val().achievements;

      } else {

        userData.achievements = achievements;

      }

      if(childSnapshot.val().additionalXP) {

        userData.additionalXP = childSnapshot.val().additionalXP;

      } else {

        userData.additionalXP = 0;

      }

      if(childSnapshot.val().latestCelebratedLevel) {

        userData.latestCelebratedLevel = childSnapshot.val().latestCelebratedLevel;

      } else {

        userData.latestCelebratedLevel = 1;

      }
      
    });

  } else {

    userData = {

      trackers: [],
      achievements: achievements,
      additionalXP: 0,
      latestCelebratedLevel: 1
  
    }

  }

  //Code to check if achievement data exists in userData
  if(userData.achievements) {

    achievements = userData.achievements;

  } else {

    userData.achievements = achievements;
    await updateUserData(userData.achievements, "achievements");
    // console.log(userData);

  }

  //Code to add xpClaimed in each achievement if doesnt exist
  if(!userData.achievements[0].xpClaimed) {

    userData.achievements.forEach((achievementItem) => {

      achievementItem.xpClaimed = false;

    });

    await updateUserData(userData.achievements, "achievements");

  }
  
  //Code to add additionalXP if doesnt exist
  if(!userData.additionalXP) {

    userData.additionalXP = additionalXP;
    // await updateUserData(additionalXP, "additionalXP");

  } else {

    additionalXP = userData.additionalXP;

  }

  //Code to check last celebrated level up
  if(!userData.latestCelebratedLevel) {

    userData.latestCelebratedLevel = latestCelebratedLevel;

  } else {

    latestCelebratedLevel = userData.latestCelebratedLevel;

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

  //Calculate level and XP
  calculateLevelAndXP();

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

    if(document.querySelector('.user-more-options-container')) {

      document.querySelector('.user-more-options-container').classList.add('fade-out');
        
      setTimeout(() => {

        document.querySelector('.user-more-options-container').remove();

      }, 500);

    } else {
      
      let userMoreOptionsHTML = `
    
      <div class="user-more-options-container">
      
        <div class="user-more-options-box">

          <div class="user-more-options-close">X</div>

          <div class="xp-username">${userLogged.username}'s Profile</div>
        
          <div class="badge-icon">
            <canvas class="confetti-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>`;


      if(userLevel >= 1 && userLevel <= 10) {

        //Iron 1 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#bf7e60;} .st1{fill:#828481;} .st2{fill:#3d3d3d;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 11 && userLevel <= 20) {
    
        //Iron 2 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#bf7e60;} .st1{fill:#828481;} .st2{fill:#3d3d3d;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 21 && userLevel <= 30) {
    
        //Bronze 1 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#C4C4C4;} .st1{fill:#E5B97F;} .st2{fill:#C19A6B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 31 && userLevel <= 40) {
    
        //Bronze 2 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#C4C4C4;} .st1{fill:#E5B97F;} .st2{fill:#C19A6B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 41 && userLevel <= 50) {
    
        //Silver 1 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFBF4B;} .st1{fill:#EDEDED;} .st2{fill:#BCBCBC;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 51 && userLevel <= 60) {
    
        //Silver 2 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFBF4B;} .st1{fill:#EDEDED;} .st2{fill:#BCBCBC;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 61 && userLevel <= 70) {
    
        //Gold 1 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#285FFF;} .st1{fill:#FFC54D;} .st2{fill:#E8B04B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 71 && userLevel <= 80) {
    
        //Gold 2 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#E24255;} .st1{fill:#FFC54D;} .st2{fill:#E8B04B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 81 && userLevel <= 90) {
    
        //Medal 1
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFC54D;} .st1{fill:#548DFF;} .st2{fill:#FFE8A2;} </style> <g> <path class="st0" d="M86.2,79l-5.6-5.6c-0.5-0.5-0.8-1.2-0.8-1.9v-7.9c0-1.4-1.2-2.6-2.6-2.6h-7.9c-0.7,0-1.4-0.3-1.9-0.8l-4.7-4.7 c1.9-1,3.2-3,3.2-5.3c0-3.3-2.7-5.9-5.9-5.9s-5.9,2.7-5.9,5.9c0,2.3,1.3,4.3,3.2,5.3l-4.7,4.7c-0.5,0.5-1.2,0.8-1.9,0.8h-7.9 c-1.4,0-2.6,1.2-2.6,2.6v7.9c0,0.7-0.3,1.4-0.8,1.9L33.8,79c-1,1-1,2.7,0,3.7l5.6,5.6c0.5,0.5,0.8,1.2,0.8,1.9v7.9 c0,1.4,1.2,2.6,2.6,2.6h7.9c0.7,0,1.4,0.3,1.9,0.8l5.6,5.6c1,1,2.7,1,3.7,0l5.6-5.6c0.5-0.5,1.2-0.8,1.9-0.8h7.9 c1.4,0,2.6-1.2,2.6-2.6v-7.9c0-0.7,0.3-1.4,0.8-1.9l5.6-5.6C87.2,81.7,87.2,80.1,86.2,79z M60,46.8c2,0,3.5,1.6,3.5,3.5 c0,2-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5C56.5,48.4,58,46.8,60,46.8z"></path> <path class="st1" d="M76.2,50.3H44c-2.5,0-4.5-2-4.5-4.5v-5.3h41.1v5.3C80.6,48.3,78.6,50.3,76.2,50.3z"></path> <rect class="st1" height="27.5" width="41.1" x="39.5" y="12.1"></rect> <rect class="st2" height="29.8" width="17.2" x="51.5" y="12.1"></rect> <path class="st0" d="M82.9,41.9H37.1c-0.7,0-1.2-0.5-1.2-1.2v-0.3c0-0.7,0.5-1.2,1.2-1.2H83c0.7,0,1.2,0.5,1.2,1.2v0.3 C84.1,41.3,83.6,41.9,82.9,41.9z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel >= 91 && userLevel <= 100) {
    
        //Medal 2
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFC54D;} .st1{fill:#F46262;} .st2{fill:#FFE8A2;} </style> <g> <path class="st0" d="M84.5,70c-1.2,0-2.2,0.9-2.4,2L67.8,70l-6.6-13.4c0.7-0.4,1.2-1.2,1.2-2.1c0-1.3-1.1-2.4-2.4-2.4 s-2.4,1.1-2.4,2.4c0,1,0.6,1.9,1.5,2.2L52.6,70l-14.7,2.1c-0.2-1.2-1.2-2.1-2.4-2.1c-1.3,0-2.4,1.1-2.4,2.4c0,1.3,1.1,2.4,2.4,2.4 c0.7,0,1.3-0.3,1.7-0.7l10.6,10.3l-2.5,14.6c-0.1,0-0.2,0-0.4,0c-1.3,0-2.4,1.1-2.4,2.4c0,1.3,1.1,2.4,2.4,2.4 c1.3,0,2.4-1.1,2.4-2.4c0-0.4-0.1-0.8-0.3-1.2l13.1-6.9l13.1,6.9c-0.2,0.3-0.3,0.7-0.3,1.1c0,1.3,1.1,2.4,2.4,2.4 c1.3,0,2.4-1.1,2.4-2.4c0-1.3-1.1-2.4-2.4-2.4c-0.1,0-0.2,0-0.4,0l-2.5-14.6L83,74.3c0.4,0.3,0.9,0.5,1.5,0.5 c1.3,0,2.4-1.1,2.4-2.4C86.9,71.1,85.8,70,84.5,70z"></path> <path class="st1" d="M76.2,54.3H44c-2.5,0-4.5-2-4.5-4.5v-5.3h41.1v5.3C80.6,52.3,78.6,54.3,76.2,54.3z"></path> <rect class="st1" height="27.5" width="41.1" x="39.5" y="16.1"></rect> <rect class="st2" height="29.8" width="17.2" x="51.5" y="16.1"></rect> <path class="st0" d="M82.9,45.9H37.1c-0.7,0-1.2-0.5-1.2-1.2v-0.3c0-0.7,0.5-1.2,1.2-1.2h45.9c0.7,0,1.2,0.5,1.2,1.2v0.3 C84.1,45.3,83.6,45.9,82.9,45.9z"></path> </g> </g></svg>`;
    
    
      } else if(userLevel > 100) {
    
        //Iron 2 badge
        userMoreOptionsHTML += `
    
            <svg class="level-badge-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#F46262;} .st1{fill:#FFC54D;} .st2{fill:#FFFFFF;} .st3{fill:#DBB68F;} </style> <g> <path class="st0" d="M79.6,46.2c-0.7,0-1.3,0.3-1.7,0.9c-4,5.6-10.5,9.3-17.9,9.3s-13.9-3.7-17.9-9.3c-0.4-0.5-1-0.9-1.7-0.9h-2.7 c-1.3,0-2.2,1.2-2,2.5l11,48.1c0.2,0.9,1,1.6,2,1.6h22.5c0.9,0,1.8-0.6,2-1.6l11-48.1c0.3-1.3-0.7-2.5-2-2.5H79.6z"></path> <circle class="st1" cx="60" cy="34.5" r="19.7"></circle> <g> <path class="st2" d="M67.8,73H52.2c-0.9,0-1.6,0.7-1.6,1.6c0,0.9,0.7,1.6,1.6,1.6h15.5c0.9,0,1.6-0.7,1.6-1.6 C69.4,73.7,68.7,73,67.8,73z"></path> <path class="st2" d="M52.2,68.8h15.5c0.9,0,1.6-0.7,1.6-1.6c0-0.9-0.7-1.6-1.6-1.6H52.2c-0.9,0-1.6,0.7-1.6,1.6 C50.6,68.1,51.3,68.8,52.2,68.8z"></path> <path class="st2" d="M67.8,80.4H52.2c-0.9,0-1.6,0.7-1.6,1.6s0.7,1.6,1.6,1.6h15.5c0.9,0,1.6-0.7,1.6-1.6S68.7,80.4,67.8,80.4z"></path> </g> <path class="st3" d="M37.4,105.2h45.2c0.9,0,1.5-0.7,1.5-1.5v-7.2c0-0.9-0.7-1.5-1.5-1.5H37.4c-0.9,0-1.5,0.7-1.5,1.5v7.2 C35.8,104.5,36.5,105.2,37.4,105.2z"></path> <path class="st2" d="M71.4,30.8c-0.6,0-1,0.4-1.1,0.9l-6.6-1l-3.1-6.2c0.3-0.2,0.6-0.6,0.6-1c0-0.6-0.5-1.1-1.1-1.1 c-0.6,0-1.1,0.5-1.1,1.1c0,0.5,0.3,0.9,0.7,1l-3,6.2l-6.8,1c-0.1-0.5-0.5-1-1.1-1c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.5,1.1,1.1,1.1 c0.3,0,0.6-0.1,0.8-0.3l4.9,4.8l-1.2,6.8c-0.1,0-0.1,0-0.2,0c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.5,1.1,1.1,1.1c0.6,0,1.1-0.5,1.1-1.1 c0-0.2-0.1-0.4-0.1-0.5l6.1-3.2l6.1,3.2c-0.1,0.2-0.1,0.3-0.1,0.5c0,0.6,0.5,1.1,1.1,1.1c0.6,0,1.1-0.5,1.1-1.1 c0-0.6-0.5-1.1-1.1-1.1c-0.1,0-0.1,0-0.2,0l-1.2-6.8l4.9-4.7c0.2,0.2,0.4,0.3,0.7,0.3c0.6,0,1.1-0.5,1.1-1.1 C72.5,31.3,72,30.8,71.4,30.8z"></path> </g> </g></svg>`;
    
    
      }

      let currentXP;
      let nextLevelXP;

      levelCriteria.forEach((levelCriteriaItem) => {

        if(levelCriteriaItem.levelNumber === userLevel) {

          currentXP = userXP - levelCriteriaItem.minimumXP;
          nextLevelXP = (levelCriteriaItem.maximumXP + 1) - levelCriteriaItem.minimumXP;

        }

      });
          
          
      userMoreOptionsHTML += `</div>

          <div class="current-and-next-level">
          
            <p class="current-level">Level ${userLevel}</p>
          
            <p class="next-level">Level ${userLevel + 1}</p>
          
          </div>

          <div class="xp-progress-bar">
          
            <div class="xp-progress-bar-base">
            
              <div class="xp-progress-bar-main">
              
                <div class="xp-progress-bar-actual" style=""></div>
              
              </div>
            
            </div>
          
          </div>

          <div class="xp-progress-label">
          
            <p class="xp-gained">${currentXP}XP</p>
          
            <p class="xp-target">${nextLevelXP}XP</p>
          
          </div>
          
          <p class="achievements-header">Achievements</p>
          
          <div class="achievements-container">`;

      achievements.forEach((achievementItem, achievementIndex) => {

        if(achievementItem.achieved === true) {

          userMoreOptionsHTML += `
          
          <div class="achievement-item" oncontextmenu="return false;">
          
            <div class="achievement-item-image-container">
            
              <img class="achievement-item-image" src="${achievementItem.image}">
  
            </div>
          
            <div class="achievement-item-info">
            
              <p class="achievement-title">${achievementItem.name}</p>
              <p class="achievement-description">${achievementItem.description}</p>
  
            </div>
  
          </div>
          `;          

        } else {

          userMoreOptionsHTML += `
          
          <div class="achievement-item" oncontextmenu="return false;">
          
            <div class="achievement-item-image-container achievement-item-image-container-locked">
            
              <img class="achievement-item-image" src="images/achievements/Achievement_Locked.jpeg">
  
            </div>
          
            <div class="achievement-item-info">
            
              <p class="achievement-title">${achievementItem.name}</p>
              <p class="achievement-description">${achievementItem.description}</p>
  
            </div>
  
          </div>
          `;

        }

      });
          
      userMoreOptionsHTML += `

          </div>
        
        </div>

      </div>
      
      `;

      document.body.insertAdjacentHTML("afterbegin", userMoreOptionsHTML);

      document.querySelectorAll('.achievement-item').forEach((achievementItem) => {

        const achievementIcon = achievementItem.querySelector('.achievement-item-image-container').querySelector('.achievement-item-image');

        achievementItem.addEventListener("mousedown", () => {

          isIconClicked = true;

          setTimeout(() => {

            if(isIconClicked) {

              let tempAchievementIcon = achievementIcon.src;

              let previewIconHTML = `
              
              <div class="achievementIcon-preview-container">

                <div class="achievementIcon-preview-close-container">
                
                  <div class="achievementIcon-preview-close">X</div>
                
                </div>
              
                <div class="achievementIcon-preview">
                
                  <img class="achievementIcon-preview-image" src="${tempAchievementIcon}">

                </div>

              </div>

              `;

              document.body.insertAdjacentHTML("afterbegin", previewIconHTML);

              document.querySelector('.achievementIcon-preview-close').addEventListener("click", () => {

                document.querySelector('.achievementIcon-preview-container').remove();

              });

            }

          }, 1000);

        });

        achievementItem.addEventListener("mouseup", () => {

          isIconClicked = false;

        });

        achievementItem.addEventListener("touchstart", (event) => {

          event.preventDefault();

          isIconClicked = true;

          setTimeout(() => {

            if(isIconClicked) {

              let tempAchievementIcon = achievementIcon.src;

              let previewIconHTML = `
              
              <div class="achievementIcon-preview-container">

                <div class="achievementIcon-preview-close-container">
                
                  <div class="achievementIcon-preview-close">X</div>
                
                </div>
              
                <div class="achievementIcon-preview">
                
                  <img class="achievementIcon-preview-image" src="${tempAchievementIcon}">

                </div>

              </div>

              `;

              document.body.insertAdjacentHTML("afterbegin", previewIconHTML);

              document.querySelector('.achievementIcon-preview-close').addEventListener("click", () => {

                document.querySelector('.achievementIcon-preview-container').remove();

              });

            }

          }, 1000);

        });

        achievementItem.addEventListener("touchend", () => {

          isIconClicked = false;

        });

      });

      //Code to add xp progress bar transition
      setTimeout(() => {

        starExplodeAnimation(document.querySelector('.confetti-canvas'));

        document.querySelector('.xp-progress-bar-actual').setAttribute('style', `width:${(currentXP/nextLevelXP) * 100}%`);

      }, 50);

      //Code to add event listener to close button of User XP screen
      document.querySelector('.user-more-options-close').addEventListener('click', () => {

        document.querySelector('.user-more-options-container').classList.add('fade-out');
        
        setTimeout(() => {

          document.querySelector('.user-more-options-container').remove();

        }, 500);

      });
  
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

  setInterval(() => {

    checkAchievements();

  }, 5000);

  //Home page default transition
  document.body.classList.add('fade-in');

}

//Code to update userData to Firebase
async function updateUserData(userData, dataKey) {

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
        if(dataKey === "trackers") {

          await update(userRef, {
            trackers: userData
          });

        } else if(dataKey === "achievements") {

          await update(userRef, {
            achievements
          });

        } else if(dataKey === "additionalXP") {

          await update(userRef, {
            additionalXP
          });

        } else if(dataKey === "latestCelebratedLevel") {

          await update(userRef, {
            latestCelebratedLevel
          });

        }

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
      updateUserData(userData.trackers, "trackers");

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

      userData.trackers.forEach((trackerItem, trackerIndex) => {

        trackerItem.id = trackerIndex;

      });

      trackers = userData.trackers;
      updateUserData(userData.trackers, "trackers");

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

  //Code to add eventlistener to leaderboard button
  leaderboardsBtnElement.addEventListener('click', () => {

    displayLeaderboardScreen();

  });

  //Code to add eventlistener to search button
  searchBtnElement.addEventListener('click', () => {

    leaderboardsBtnElement.classList.add('leader-boards-hide');
  
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

    leaderboardsBtnElement.classList.remove('leader-boards-hide');
  
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

        leaderboardsBtnElement.classList.add('leader-boards-hide');
  
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

//Code to add or deduct XP according to task action
async function xpAddOrSubtract(operation, value) {
  
  if(operation === "+" || operation === "add") {

    userXP += value;
    levelHandler();
    
    levelUpAnimationWithNotification();
    

  } else if(operation === "-" || operation === "subtract" || operation === "minus") {

    userXP -= value;
    levelHandler();

  }

  console.log(userXP);
  console.log(userLevel);

}

//Code to handle Level increament
async function levelHandler_old() {

  if(userLevel >= 1 && userLevel <= 5) {

    if(userXP >= 100) {

      levelUpAnimationWithNotification();

    }

  } else if(userLevel >= 6 && userLevel <= 10) {

    if(userXP >= 200) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 10 && userLevel <= 15) {

    if(userXP >= 300) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 16 && userLevel <= 20) {

    if(userXP >= 400) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 21 && userLevel <= 25) {

    if(userXP >= 500) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 26 && userLevel <= 30) {

    if(userXP >= 600) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 31 && userLevel <= 35) {

    if(userXP >= 700) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 36 && userLevel <= 40) {

    if(userXP >= 800) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 41 && userLevel <= 45) {

    if(userXP >= 900) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 46 && userLevel <= 50) {

    if(userXP >= 1000) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 51 && userLevel <= 55) {

    if(userXP >= 1100) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 56 && userLevel <= 60) {

    if(userXP >= 1200) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 61 && userLevel <= 65) {

    if(userXP >= 1300) {

      levelUpAnimationWithNotification()

    }
    
  } else if(userLevel >= 66 && userLevel <= 70) {

    if(userXP >= 1400) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 71 && userLevel <= 75) {

    if(userXP >= 1500) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 76 && userLevel <= 80) {

    if(userXP >= 1600) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 81 && userLevel <= 85) {

    if(userXP >= 1700) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 86 && userLevel <= 90) {

    if(userXP >= 1800) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 91 && userLevel <= 95) {

    if(userXP >= 1900) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel >= 96 && userLevel <= 100) {

    if(userXP >= 2000) {

      levelUpAnimationWithNotification();

    }
    
  } else if(userLevel > 100) {

    if(userXP >= 2500) {

      levelUpAnimationWithNotification();

    }
    
  }

  for(let i = 0; i < levelCriteria.length; i++) {
    
    if(userLevel === levelCriteria[i].levelNumber) {

      if(userXP >= (levelCriteria[i].maximumXP + 1)) {

        levelHandler();

      } else {

        break;

      }

    } else if(userLevel > 100) {

      if(userXP >= levelCriteria[levelCriteria.length - 1].minimumXP) {

        levelHandler();

      } else {

        break;

      }

    }

  };
  
}

//Code to add Confetti animation
async function confettiAnimation(trackerNumber, taskNumber) {

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

  rewardNotification(trackerNumber, taskNumber);
  
}

//Code to add Star firework animation
async function starExplodeAnimation(confettiCanvas) {

  const myConfetti = confetti.create(confettiCanvas, {
    resize: true, // Resize the canvas to fit its container
  });

  // do this for 1 seconds
  var duration = 0.5 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    // launch a few confetti from the bottom center
    myConfetti({
      spread: 360,
      gravity: 0,
      decay: 0.95,
      startVelocity: 4,
      particleCount: 2,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFAC6C', 'FDFFB8']
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
}

//Code to Calculate Level and XP required each level
async function calculateLevelAndXP() {

  const xpPerLevel = [
    100, 100, 100, 100, 100,
    200, 200, 200, 200, 200, 
    300, 300, 300, 300, 300,
    400, 400, 400, 400, 400,
    500, 500, 500, 500, 500,
    600, 600, 600, 600, 600,
    700, 700, 700, 700, 700,
    800, 800, 800, 800, 800,
    900, 900, 900, 900, 900,
    1000, 1000, 1000, 1000, 1000,
    1100, 1100, 1100, 1100, 1100,
    1200, 1200, 1200, 1200, 1200,
    1300, 1300, 1300, 1300, 1300,
    1400, 1400, 1400, 1400, 1400,
    1500, 1500, 1500, 1500, 1500,
    1600, 1600, 1600, 1600, 1600, 
    1700, 1700, 1700, 1700, 1700,
    1800, 1800, 1800, 1800, 1800,
    1900, 1900, 1900, 1900, 1900,
    2000, 2000, 2000, 2000, 2000
  ];

  let cummulativeXP = 0;

  xpPerLevel.forEach((xpItem, xpIndex) => {

    levelCriteria.push({
      levelNumber: xpIndex + 1,
      minimumXP: cummulativeXP,
      maximumXP: cummulativeXP + xpItem - 1
    });

    cummulativeXP += xpItem;

  });

  levelCriteria.push({
    levelNumber: "100+",
    minimumXP: 105000
  });

  levelCriteria.forEach((levelCriteriaItem) => {

    if(levelCriteriaItem.levelNumber !== "100+") {

      if(userXP >= levelCriteriaItem.minimumXP && userXP <= levelCriteriaItem.maximumXP) {
        userLevel = levelCriteriaItem.levelNumber;
        // userXP -= levelCriteriaItem.minimumXP;
      }

    } else {

      if(userXP >= levelCriteriaItem.minimumXP) {

        // userXP -= levelCriteriaItem.minimumXP;
        userLevel = 100 + Math.ceil(userXP / 2500);

      }

    }

  });
  
}

//Code to add custom notification when one or more than one tasks are completed
async function rewardNotification(trackerNumber, taskNumber) {

  setTimeout(() => {

    const taskCompletedBanner = `
    
    <div class="task-completed-banner-container tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container">

      <div class="task-completed-banner-container-cover tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container-cover"></div>
    
      <div class="banner-name tracker-${trackerNumber}-task-${taskNumber}-banner-name">

        <div class="banner-name-cover tracker-${trackerNumber}-task-${taskNumber}-banner-name-cover"></div>
        <p>Task Completed</p>

      </div>
      

      <div class="reward5XP tracker-${trackerNumber}-task-${taskNumber}-reward5XP">
      
        <div class="reward-cover tracker-${trackerNumber}-task-${taskNumber}-reward-cover"></div>
        <p>+5XP</p>
      
      </div>

    </div>

    `;

    document.querySelector('.notification-section').insertAdjacentHTML("afterbegin", taskCompletedBanner);

    //Timers to trigger unhide transitions
    setTimeout(() => {

      document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container`).classList.add('task-completed-banner-container-unhide');

    }, 50);

    setTimeout(() => {

      document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container-cover`).classList.add('task-completed-banner-container-cover-unhide');

    }, 500);

    setTimeout(() => {

      document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-banner-name-cover`).classList.add('banner-name-cover-unhide');

    }, 750);

    setTimeout(() => {

      document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-reward-cover`).classList.add('reward-cover-unhide');

    }, 1000);

    //Timers to trigger hide transitions
    setTimeout(() => {

      setTimeout(() => {
  
        document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-reward-cover`).classList.remove('reward-cover-unhide');
  
      }, 0);

      setTimeout(() => {
  
        document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-banner-name-cover`).classList.remove('banner-name-cover-unhide');
  
      }, 250);

      setTimeout(() => {
  
        document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container-cover`).classList.remove('task-completed-banner-container-cover-unhide');
  
      }, 500);

      setTimeout(() => {
  
        document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container`).classList.remove('task-completed-banner-container-unhide');

        setTimeout(() => {

          document.querySelector(`.tracker-${trackerNumber}-task-${taskNumber}-completed-banner-container`).remove();

        }, 500);
  
      }, 750);

    }, 5250);
    
  }, 4000);
  
}

//Code to add custom notification when user earns an achievement
async function rewardNotification_Achievement(achievementsName) {

  achievementsName = achievementsName.replace(/ /g, '_');

  setTimeout(() => {

    const taskCompletedBanner = `
    
    <div class="achievement-earned-banner-container achievement-${achievementsName}-earned-banner-container">

      <div class="achievement-earned-banner-container-cover achievement-${achievementsName}-earned-banner-container-cover"></div>
    
      <div class="achievement-banner-name">

        <div class="achievement-banner-name-cover achievement-${achievementsName}-banner-name-cover"></div>
        <p>Achievement Unlocked!</p>

      </div>
      

      <div class="achievement-name achievement-${achievementsName}-name">
      
        <div class="achievement-name-cover achievement-${achievementsName}-name-cover"></div>
        <p style="font-size: 12px">${achievementsName}</p>
      
      </div>
      

      <div class="achievement-reward100XP">
      
        <div class="achievement-reward-cover achievement-${achievementsName}-reward-cover"></div>
        <p style="font-size: 12px">+100XP :D</p>
      
      </div>

    </div>

    `;

    document.querySelector('.notification-section').insertAdjacentHTML("afterbegin", taskCompletedBanner);

    //Timers to trigger unhide transitions
    setTimeout(() => {

      document.querySelector(`.achievement-${achievementsName}-earned-banner-container`).classList.add('achievement-earned-banner-container-unhide');

    }, 50);

    setTimeout(() => {

      document.querySelector(`.achievement-${achievementsName}-earned-banner-container-cover`).classList.add('achievement-earned-banner-container-cover-unhide');

    }, 500);

    setTimeout(() => {

      document.querySelector(`.achievement-${achievementsName}-banner-name-cover`).classList.add('achievement-banner-name-cover-unhide');

    }, 750);

    setTimeout(() => {

      document.querySelector(`.achievement-${achievementsName}-name-cover`).classList.add('achievement-name-cover-unhide');

    }, 1000);

    setTimeout(() => {

      document.querySelector(`.achievement-${achievementsName}-reward-cover`).classList.add('achievement-reward-cover-unhide');

    }, 1250);

    //Timers to trigger hide transitions
    setTimeout(() => {

      setTimeout(() => {
  
        document.querySelector(`.achievement-${achievementsName}-reward-cover`).classList.remove('achievement-reward-cover-unhide');
  
      }, 0);

      setTimeout(() => {
  
        document.querySelector(`.achievement-${achievementsName}-name-cover`).classList.remove('achievement-name-cover-unhide');
  
      }, 250);

      setTimeout(() => {
  
        document.querySelector(`.achievement-${achievementsName}-banner-name-cover`).classList.remove('achievement-banner-name-cover-unhide');
  
      }, 500);

      setTimeout(() => {
  
        document.querySelector(`.achievement-${achievementsName}-earned-banner-container-cover`).classList.remove('achievement-earned-banner-container-cover-unhide');
  
      }, 750);

      setTimeout(() => {
  
        document.querySelector(`.achievement-${achievementsName}-earned-banner-container`).classList.remove('achievement-earned-banner-container-unhide');

        setTimeout(() => {

          document.querySelector(`.achievement-${achievementsName}-earned-banner-container`).remove();

        }, 500);
  
      }, 750);

    }, 5500);
    
  }, 4000);
  
}

//Code to display level up screen when user levels up
async function levelUpScreen() {

  let levelUpHTML = `

  <div class="level-up-and-xp-animation-container">

    <div class="level-up-and-xp-animation-subcontainer">

      <div class="congratulations-text-container">
        <div class="congratulations-text-cover"></div>
        <p class="congratulations-text">CONGRATULATIONS</p>
      </div>

      <div class="leveled-up-text-container">
        <div class="leveled-up-text-cover"></div>
        <p class="leveled-up-text">YOU HAVE LEVELED UP!</p>
      </div>
      
      <div class="new-level-icon-container">

        <div class="new-level-icon-cover"></div>`;
      
    
  if(userLevel >= 1 && userLevel <= 10) {

    //Iron 1 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#bf7e60;} .st1{fill:#828481;} .st2{fill:#3d3d3d;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;


  } else if(userLevel >= 11 && userLevel <= 20) {

    //Iron 2 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#bf7e60;} .st1{fill:#828481;} .st2{fill:#3d3d3d;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;


  } else if(userLevel >= 21 && userLevel <= 30) {

    //Bronze 1 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#C4C4C4;} .st1{fill:#E5B97F;} .st2{fill:#C19A6B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;


  } else if(userLevel >= 31 && userLevel <= 40) {

    //Bronze 2 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#C4C4C4;} .st1{fill:#E5B97F;} .st2{fill:#C19A6B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;


  } else if(userLevel >= 41 && userLevel <= 50) {

    //Silver 1 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFBF4B;} .st1{fill:#EDEDED;} .st2{fill:#BCBCBC;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;


  } else if(userLevel >= 51 && userLevel <= 60) {

    //Silver 2 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFBF4B;} .st1{fill:#EDEDED;} .st2{fill:#BCBCBC;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;


  } else if(userLevel >= 61 && userLevel <= 70) {

    //Gold 1 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#285FFF;} .st1{fill:#FFC54D;} .st2{fill:#E8B04B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "></polygon> <circle class="st1" cx="60" cy="44.8" r="32.2"></circle> <circle class="st2" cx="60" cy="44.8" r="25.3"></circle> <path class="st3" d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"></path> </g> </g></svg>`;


  } else if(userLevel >= 71 && userLevel <= 80) {

    //Gold 2 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#E24255;} .st1{fill:#FFC54D;} .st2{fill:#E8B04B;} .st3{fill:#FFFFFF;} </style> <g> <polygon class="st0" points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3 "></polygon> <circle class="st1" cx="60" cy="46.4" r="32.2"></circle> <circle class="st2" cx="60" cy="46.4" r="25.3"></circle> <path class="st3" d="M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z"></path> </g> </g></svg>`;


  } else if(userLevel >= 81 && userLevel <= 90) {

    //Medal 1
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFC54D;} .st1{fill:#548DFF;} .st2{fill:#FFE8A2;} </style> <g> <path class="st0" d="M86.2,79l-5.6-5.6c-0.5-0.5-0.8-1.2-0.8-1.9v-7.9c0-1.4-1.2-2.6-2.6-2.6h-7.9c-0.7,0-1.4-0.3-1.9-0.8l-4.7-4.7 c1.9-1,3.2-3,3.2-5.3c0-3.3-2.7-5.9-5.9-5.9s-5.9,2.7-5.9,5.9c0,2.3,1.3,4.3,3.2,5.3l-4.7,4.7c-0.5,0.5-1.2,0.8-1.9,0.8h-7.9 c-1.4,0-2.6,1.2-2.6,2.6v7.9c0,0.7-0.3,1.4-0.8,1.9L33.8,79c-1,1-1,2.7,0,3.7l5.6,5.6c0.5,0.5,0.8,1.2,0.8,1.9v7.9 c0,1.4,1.2,2.6,2.6,2.6h7.9c0.7,0,1.4,0.3,1.9,0.8l5.6,5.6c1,1,2.7,1,3.7,0l5.6-5.6c0.5-0.5,1.2-0.8,1.9-0.8h7.9 c1.4,0,2.6-1.2,2.6-2.6v-7.9c0-0.7,0.3-1.4,0.8-1.9l5.6-5.6C87.2,81.7,87.2,80.1,86.2,79z M60,46.8c2,0,3.5,1.6,3.5,3.5 c0,2-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5C56.5,48.4,58,46.8,60,46.8z"></path> <path class="st1" d="M76.2,50.3H44c-2.5,0-4.5-2-4.5-4.5v-5.3h41.1v5.3C80.6,48.3,78.6,50.3,76.2,50.3z"></path> <rect class="st1" height="27.5" width="41.1" x="39.5" y="12.1"></rect> <rect class="st2" height="29.8" width="17.2" x="51.5" y="12.1"></rect> <path class="st0" d="M82.9,41.9H37.1c-0.7,0-1.2-0.5-1.2-1.2v-0.3c0-0.7,0.5-1.2,1.2-1.2H83c0.7,0,1.2,0.5,1.2,1.2v0.3 C84.1,41.3,83.6,41.9,82.9,41.9z"></path> </g> </g></svg>`;


  } else if(userLevel >= 91 && userLevel <= 100) {

    //Medal 2
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#FFC54D;} .st1{fill:#F46262;} .st2{fill:#FFE8A2;} </style> <g> <path class="st0" d="M84.5,70c-1.2,0-2.2,0.9-2.4,2L67.8,70l-6.6-13.4c0.7-0.4,1.2-1.2,1.2-2.1c0-1.3-1.1-2.4-2.4-2.4 s-2.4,1.1-2.4,2.4c0,1,0.6,1.9,1.5,2.2L52.6,70l-14.7,2.1c-0.2-1.2-1.2-2.1-2.4-2.1c-1.3,0-2.4,1.1-2.4,2.4c0,1.3,1.1,2.4,2.4,2.4 c0.7,0,1.3-0.3,1.7-0.7l10.6,10.3l-2.5,14.6c-0.1,0-0.2,0-0.4,0c-1.3,0-2.4,1.1-2.4,2.4c0,1.3,1.1,2.4,2.4,2.4 c1.3,0,2.4-1.1,2.4-2.4c0-0.4-0.1-0.8-0.3-1.2l13.1-6.9l13.1,6.9c-0.2,0.3-0.3,0.7-0.3,1.1c0,1.3,1.1,2.4,2.4,2.4 c1.3,0,2.4-1.1,2.4-2.4c0-1.3-1.1-2.4-2.4-2.4c-0.1,0-0.2,0-0.4,0l-2.5-14.6L83,74.3c0.4,0.3,0.9,0.5,1.5,0.5 c1.3,0,2.4-1.1,2.4-2.4C86.9,71.1,85.8,70,84.5,70z"></path> <path class="st1" d="M76.2,54.3H44c-2.5,0-4.5-2-4.5-4.5v-5.3h41.1v5.3C80.6,52.3,78.6,54.3,76.2,54.3z"></path> <rect class="st1" height="27.5" width="41.1" x="39.5" y="16.1"></rect> <rect class="st2" height="29.8" width="17.2" x="51.5" y="16.1"></rect> <path class="st0" d="M82.9,45.9H37.1c-0.7,0-1.2-0.5-1.2-1.2v-0.3c0-0.7,0.5-1.2,1.2-1.2h45.9c0.7,0,1.2,0.5,1.2,1.2v0.3 C84.1,45.3,83.6,45.9,82.9,45.9z"></path> </g> </g></svg>`;


  } else if(userLevel > 100) {

    //Iron 2 badge
    levelUpHTML += `

        <svg class="new-level-icon-svg" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#F46262;} .st1{fill:#FFC54D;} .st2{fill:#FFFFFF;} .st3{fill:#DBB68F;} </style> <g> <path class="st0" d="M79.6,46.2c-0.7,0-1.3,0.3-1.7,0.9c-4,5.6-10.5,9.3-17.9,9.3s-13.9-3.7-17.9-9.3c-0.4-0.5-1-0.9-1.7-0.9h-2.7 c-1.3,0-2.2,1.2-2,2.5l11,48.1c0.2,0.9,1,1.6,2,1.6h22.5c0.9,0,1.8-0.6,2-1.6l11-48.1c0.3-1.3-0.7-2.5-2-2.5H79.6z"></path> <circle class="st1" cx="60" cy="34.5" r="19.7"></circle> <g> <path class="st2" d="M67.8,73H52.2c-0.9,0-1.6,0.7-1.6,1.6c0,0.9,0.7,1.6,1.6,1.6h15.5c0.9,0,1.6-0.7,1.6-1.6 C69.4,73.7,68.7,73,67.8,73z"></path> <path class="st2" d="M52.2,68.8h15.5c0.9,0,1.6-0.7,1.6-1.6c0-0.9-0.7-1.6-1.6-1.6H52.2c-0.9,0-1.6,0.7-1.6,1.6 C50.6,68.1,51.3,68.8,52.2,68.8z"></path> <path class="st2" d="M67.8,80.4H52.2c-0.9,0-1.6,0.7-1.6,1.6s0.7,1.6,1.6,1.6h15.5c0.9,0,1.6-0.7,1.6-1.6S68.7,80.4,67.8,80.4z"></path> </g> <path class="st3" d="M37.4,105.2h45.2c0.9,0,1.5-0.7,1.5-1.5v-7.2c0-0.9-0.7-1.5-1.5-1.5H37.4c-0.9,0-1.5,0.7-1.5,1.5v7.2 C35.8,104.5,36.5,105.2,37.4,105.2z"></path> <path class="st2" d="M71.4,30.8c-0.6,0-1,0.4-1.1,0.9l-6.6-1l-3.1-6.2c0.3-0.2,0.6-0.6,0.6-1c0-0.6-0.5-1.1-1.1-1.1 c-0.6,0-1.1,0.5-1.1,1.1c0,0.5,0.3,0.9,0.7,1l-3,6.2l-6.8,1c-0.1-0.5-0.5-1-1.1-1c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.5,1.1,1.1,1.1 c0.3,0,0.6-0.1,0.8-0.3l4.9,4.8l-1.2,6.8c-0.1,0-0.1,0-0.2,0c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.5,1.1,1.1,1.1c0.6,0,1.1-0.5,1.1-1.1 c0-0.2-0.1-0.4-0.1-0.5l6.1-3.2l6.1,3.2c-0.1,0.2-0.1,0.3-0.1,0.5c0,0.6,0.5,1.1,1.1,1.1c0.6,0,1.1-0.5,1.1-1.1 c0-0.6-0.5-1.1-1.1-1.1c-0.1,0-0.1,0-0.2,0l-1.2-6.8l4.9-4.7c0.2,0.2,0.4,0.3,0.7,0.3c0.6,0,1.1-0.5,1.1-1.1 C72.5,31.3,72,30.8,71.4,30.8z"></path> </g> </g></svg>`;


  }
  
  levelUpHTML += `

      </div>

      <div class="new-level-number-container">
        <div class="new-level-number-cover"></div>
        <p class="new-level-number">LEVEL ${userLevel}</p>
      </div>
    
    </div>

  </div>`;

  document.body.insertAdjacentHTML("afterbegin", levelUpHTML);

  setTimeout(() => {

    document.querySelector('.level-up-and-xp-animation-container').classList.add('fade-in');

  }, 0);

  const congratsTextCover = document.querySelector('.congratulations-text-cover');
  const congratsText = document.querySelector('.congratulations-text');
  const levelUpTextCover = document.querySelector('.leveled-up-text-cover');
  const levelUpText = document.querySelector('.leveled-up-text');
  const levelBadgeCover = document.querySelector('.new-level-icon-cover');
  const levelBadge = document.querySelector('.new-level-icon-svg');
  const levelNumberCover = document.querySelector('.new-level-number-cover');
  const levelNumber = document.querySelector('.new-level-number');

  //Cover transition for congrats text cover
  setTimeout(() => {

    congratsTextCover.classList.add('congratulations-text-cover-in');

    //Cover transition in part 2
    setTimeout(() => {
  
      congratsText.classList.add('congratulations-text-unhide');
  
    },500);

  }, 50);

  //unhide congrats text cover
  setTimeout(() => {

    congratsTextCover.classList.add('congratulations-text-cover-unhide');

  }, 550);

  //Cover transition for levelup text cover
  setTimeout(() => {

    levelUpTextCover.classList.add('leveled-up-text-cover-in');

    //Cover transition in part 2
    setTimeout(() => {
  
      levelUpText.classList.add('leveled-up-text-unhide');
  
    },500);

  }, 250);

  //unhide levelup text cover
  setTimeout(() => {

    levelUpTextCover.classList.add('leveled-up-text-cover-unhide');

  }, 750);

  //all elements go up
  setTimeout(() => {

    document.querySelector('.level-up-and-xp-animation-subcontainer').classList.add('level-up-and-xp-animation-subcontainer-go-up');

  },3250);

  //Cover transition for new level badge
  setTimeout(() => {

    levelBadgeCover.classList.add('new-level-icon-cover-in');

    //Cover transition in part 2
    setTimeout(() => {
  
      levelBadge.classList.add('new-level-icon-svg-unhide');
  
    },500);

  }, 3750);

  //unhide new level badge
  setTimeout(() => {

    levelBadgeCover.classList.add('new-level-icon-cover-unhide');

  }, 4250);

  //Cover transition for new level text
  setTimeout(() => {

    levelNumberCover.classList.add('new-level-number-cover-in');

    //Cover transition in part 2
    setTimeout(() => {
  
      levelNumber.classList.add('new-level-number-unhide');
  
    },500);

  }, 4750);

  //unhide new level
  setTimeout(() => {

    levelNumberCover.classList.add('new-level-number-cover-unhide');

  }, 5250);

  //Now code to transition out of this screen

  //hide new level
  setTimeout(() => {

    levelNumberCover.classList.remove('new-level-number-cover-unhide');

    //re-Cover transition in part 1
    setTimeout(() => {
  
      levelNumber.classList.remove('new-level-number-unhide');

      //re-COver transition in part 2
      setTimeout(() => {

        levelNumberCover.classList.remove('new-level-number-cover-in');

      }, 0);
  
    }, 500);

  }, 7250);

  //hide new level badge
  setTimeout(() => {

    levelBadgeCover.classList.remove('new-level-icon-cover-unhide');

    //re-Cover transition for new level badge
    setTimeout(() => {
    
      levelBadge.classList.remove('new-level-icon-svg-unhide');
      
      //re-Cover transition in part 2
      setTimeout(() => {
    
        levelBadgeCover.classList.remove('new-level-icon-cover-in');
    
      }, 0);
  
    },500);

  }, 7750);

  //hide levelup text cover
  setTimeout(() => {

    levelUpTextCover.classList.remove('leveled-up-text-cover-unhide');

    //re-Cover transition for levelup text cover
    setTimeout(() => {
  
      levelUpText.classList.remove('leveled-up-text-unhide');
  
      //re-Cover transition in part 2
      setTimeout(() => {
    
        levelUpTextCover.classList.remove('leveled-up-text-cover-in');
    
      }, 0);
  
    },500);

  }, 8250);

  //hide congrats text cover
  setTimeout(() => {

    congratsTextCover.classList.remove('congratulations-text-cover-unhide');

    //Cover transition for congrats text cover
    setTimeout(() => {
  
      congratsText.classList.remove('congratulations-text-unhide');
  
      //Cover transition in part 2
      setTimeout(() => {
    
        congratsTextCover.classList.remove('congratulations-text-cover-in');
    
      }, 0);
  
    },500);

  }, 8750);

  //fade out from Level up screen
  setTimeout(() => {

    document.querySelector('.level-up-and-xp-animation-container').classList.remove('fade-in');
    document.querySelector('.level-up-and-xp-animation-container').classList.add('fade-out');

    //Ultimately remove element
    setTimeout(() => {

      document.querySelector('.level-up-and-xp-animation-container').remove();

    }, 500);

  }, 10000);

}

//Code to display leaderboard screen
async function displayLeaderboardScreen() {

  let tempUsers = [];
  let extractedValues = [];
  let sortedUsers = [];

  const userDataRef = ref(db, 'userData');
  
  // Get the results of the query
  const snapshot = await get(userDataRef);

  if (snapshot.exists()) {

    tempUsers = snapshot.val();
      
    tempUsers.forEach((tempUserItem, tempUserIndex) => {

      let taskCount = 0;

      if(tempUserItem.trackers) {

        tempUserItem.trackers.forEach((trackerItem) => {
  
          if(trackerItem.task) {

            trackerItem.task.forEach((taskItem) => {

              if(taskItem.status === "done") {

                taskCount++;

              }

            });

          }
  
        });

      }

      extractedValues.push({
        'arrayIndex': tempUserIndex,
        'taskCount': taskCount
      });

    });

    extractedValues.sort((a, b) => b['taskCount'] - a['taskCount']);

    extractedValues.forEach((valueItem) => {

      sortedUsers.push(tempUsers[valueItem.arrayIndex]);
      
    });

  }

  let leaderboardHTML = `

  <div class="leader-boards-container">
      
    <div class="leader-boards-box">

      <div class="leader-boards-close">X</div>

      <div class="leader-boards-heading">Leaderboard</div>

      <div class="leader-boards-content">`;

  sortedUsers.forEach((sortedUserItem, sortedUserIndex) => {

    if(!sortedUserItem.additionalXP) {

      sortedUserItem.additionalXP = 0;

    }

    let tempUserXP = (extractedValues[sortedUserIndex].taskCount * 5) + sortedUserItem.additionalXP;
    let tempUserLevel;

    for(let i = 0; i < levelCriteria.length; i++) {
      
      
      if(tempUserXP >= levelCriteria[i].minimumXP && tempUserXP <= levelCriteria[i].maximumXP) {

        tempUserLevel = levelCriteria[i].levelNumber;
        break;

      }

    }
      
    leaderboardHTML += `

    <div class="leader-boards-item">

      <span class="user-rank">${sortedUserIndex + 1}.</span>

      <span class="user-image">

        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" fill="#000000"></circle> <ellipse cx="12" cy="17" rx="7" ry="4" fill="#000000"></ellipse> </g></svg>

      </span>

      <span class="user-info">

        <span class="user-name">${sortedUserItem.username}</span>

        <span class="user-level">Level ${tempUserLevel} with ${(tempUserXP - sortedUserItem.additionalXP)/5} Tasks</span>
      
      </span>`;
      
      
      if(sortedUserIndex === 0) {

        leaderboardHTML += `

      <span class="leader-boards-top">

        <svg class="leader-boards-top-svg" fill="#FFD700" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 277.366 277.366" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M257.799,55.704c-7.706-3.866-17.016-2.36-23.111,3.734l-39.2,39.201l-38.526-86.757C153.753,4.657,146.589,0,138.683,0 s-15.07,4.657-18.278,11.883L81.878,98.64l-39.2-39.201c-6.094-6.093-15.405-7.6-23.111-3.733 C11.864,59.569,7.502,67.935,8.745,76.463l17.879,122.785c1.431,9.829,9.858,17.118,19.791,17.118h184.536 c9.933,0,18.36-7.289,19.791-17.118l17.88-122.786C269.864,67.934,265.502,59.568,257.799,55.704z"></path> <path d="M230.951,237.366H46.415c-11.046,0-20,8.954-20,20s8.954,20,20,20h184.536c11.046,0,20-8.954,20-20 S241.997,237.366,230.951,237.366z"></path> </g> </g></svg>

      </span>`;

      }
      
    leaderboardHTML += `

    </div>`;

  });
        
  leaderboardHTML += `

      </div>
    
    </div>

  </div>`;

  document.body.insertAdjacentHTML("afterbegin", leaderboardHTML);

  document.querySelector('.leader-boards-container').classList.add('fade-in');

  document.querySelector('.leader-boards-close').addEventListener('click', () => {

    document.querySelector('.leader-boards-container').classList.remove('fade-in');
    document.querySelector('.leader-boards-container').classList.add('fade-out');

    setTimeout(() => {

      document.querySelector('.leader-boards-container').remove();

    }, 500);

  });
  
}

//Code to push notification
async function pushNotification(title, options) {

  Notification.requestPermission().then((permission) => {

    if(permission === "granted") {
      new Notification(title, options);
    }

  })
  
}

//Code to check Achievements
async function checkAchievements() {

  const notificationToCall = [];

  //Logic to check Achievement: New Beginning is achieved or not
  if(userLogged.username.length > 0 && achievements[0].achieved === false) {

    achievements[0].achieved = true;
    additionalXP += additionalXP_Old;
    userXP-= additionalXP_Old;

    userData.achievements = achievements;
    await updateUserData(userData.achievements, "achievements");

    notificationToCall.push(achievements[0].name);
    console.log(`Achievement unlocked: ${achievements[0].name}`)

  }

  if(achievements[0].achieved === true && achievements[0].xpClaimed === false) {

    additionalXP += 100;
    additionalXP += additionalXP_Old;
    userXP-= additionalXP_Old;
    achievements[0].xpClaimed = true;

    userData.achievements = achievements;
    await updateUserData(userData.achievements, "achievements");
    await updateUserData(additionalXP, "additionalXP");

  }

  //Logic to check Achievement: First Level up is achieved or not
  if(userLevel >= 2 && achievements[1].achieved === false) {

    achievements[1].achieved = true;

    userData.achievements = achievements;
    await updateUserData(userData.achievements, "achievements");

    notificationToCall.push(achievements[1].name);
    console.log(`Achievement unlocked: ${achievements[1].name}`);

  }

  if(achievements[1].achieved === true && achievements[1].xpClaimed === false) {

    additionalXP += 100;
    additionalXP += additionalXP_Old;
    userXP-= additionalXP_Old;
    achievements[1].xpClaimed = true;

    userData.achievements = achievements;
    await updateUserData(userData.achievements, "achievements");
    await updateUserData(additionalXP, "additionalXP");

  }

  //Logic to check Level 10 to 100 is achieved or not
  for(let i = 1; i <= 10; i++) {
    
    if(userLevel >= (i*10) && achievements[(i+1)].achieved === false) {

      achievements[(i+1)].achieved = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");

      notificationToCall.push(achievements[(i+1)].name);
      console.log(`Achievement unlocked: ${achievements[(i+1)].name}`);

    }

    if(achievements[(i+1)].achieved === true && achievements[(i+1)].xpClaimed === false) {
  
      additionalXP += 100;
      additionalXP += additionalXP_Old;
      userXP-= additionalXP_Old;
      achievements[(i+1)].xpClaimed = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");
      await updateUserData(additionalXP, "additionalXP");
  
    }

  }

  //Logic to check Level 10 to 100 is achieved or not
  for(let i = 1; i <= 10; i++) {
    
    if(userLevel >= (i*10) && achievements[(i+1)].achieved === false) {

      achievements[(i+1)].achieved = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");

      notificationToCall.push(achievements[(i+1)].name);
      console.log(`Achievement unlocked: ${achievements[(i+1)].name}`);

    }

    if(achievements[(i+1)].achieved === true && achievements[(i+1)].xpClaimed === false) {
  
      additionalXP += 100;
      additionalXP += additionalXP_Old;
      userXP-= additionalXP_Old;
      achievements[(i+1)].xpClaimed = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");
      await updateUserData(additionalXP, "additionalXP");
  
    }

  }

  //Logic to check Level 250, 500, 750, 1000 & 2000 is achieved or not
  const levelToCheck = [ {
    achievementNo: 12,
    levelToReach: 250
  },
  {
    achievementNo: 13,
    levelToReach: 500
  },
  {
    achievementNo: 14,
    levelToReach: 750
  },
  {
    achievementNo: 15,
    levelToReach: 1000
  },
  {
    achievementNo: 16,
    levelToReach: 2000
  }];

  // levelToCheck.forEach((levelItem) => {
  for(let i=0; i<levelToCheck.length; i++) {

    if(userLevel >= levelToCheck[i].levelToReach && achievements[levelToCheck[i].achievementNo].achieved === false) {

      achievements[levelToCheck[i].achievementNo].achieved = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");

      notificationToCall.push(achievements[levelToCheck[i].achievementNo].name);
      console.log(`Achievement unlocked: ${achievements[levelToCheck[i].achievementNo].name}`);

    }

    if(achievements[levelToCheck[i].achievementNo].achieved === true && achievements[levelToCheck[i].achievementNo].xpClaimed === false) {
  
      additionalXP += 100;
      additionalXP += additionalXP_Old;
      userXP-= additionalXP_Old;
      achievements[levelToCheck[i].achievementNo].xpClaimed = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");
      await updateUserData(additionalXP, "additionalXP");
  
    }

  }

  //Logic to check if user has completed n amount of tasks for achievement
  const taskCompletedByUser = await getTaskCompletedCount();
  const taskToCheck = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  
  // taskToCheck.forEach((taskItem, taskIndex) => {
  for(let i=0; i<taskToCheck.length; i++) {

    if(taskCompletedByUser >= taskToCheck[i] && achievements[(i + 17)].achieved === false) {

      achievements[(i + 17)].achieved = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");

      notificationToCall.push(achievements[(i + 17)].name);
      console.log(`Achievement unlocked: ${achievements[(i + 17)].name}`);

    }

    if(achievements[(i + 17)].achieved === true && achievements[(i + 17)].xpClaimed === false) {
  
      additionalXP += 100;
      additionalXP += additionalXP_Old;
      userXP-= additionalXP_Old;
      achievements[(i + 17)].xpClaimed = true;

      userData.achievements = achievements;
      await updateUserData(userData.achievements, "achievements");
      await updateUserData(additionalXP, "additionalXP");
  
    }

  }

  //Create notification for all achievements in interval of 2 secs
  for(let i = 0; i < notificationToCall.length; i++) {

    await rewardNotification_Achievement(notificationToCall[i]);
    await delay(10000);

  }

  if(additionalXP > 0) {

    xpAddOrSubtract("add", additionalXP);
    additionalXP_Old = additionalXP;
    additionalXP = 0;

  }
  
}

//Code to get count of completed tasks
async function getTaskCompletedCount() {

  let taskCompletedCount = 0;

  if(userData.trackers) {

    userData.trackers.forEach((trackerItem) => {

      if(trackerItem.task) {
  
        trackerItem.task.forEach((taskItem) => {

          if(taskItem.status === "done") {

            taskCompletedCount++

          }          

        });
        
      }
  
    });

  }

  return taskCompletedCount;
  
}

async function levelUpAnimationWithNotification() {

  if(userLevel > latestCelebratedLevel) {

    setTimeout(() => {
  
      levelUpScreen();
  
      const notificationOptions = {
        body: `You have reached Level ${userLevel} >:)`
      }
  
      pushNotification(`Level up!`, notificationOptions);
  
    }, 11000);

    latestCelebratedLevel = userLevel;

    updateUserData(latestCelebratedLevel, "latestCelebratedLevel");

  }
  
}

//Code to add delay
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Code to handle level Increment decreament
async function levelHandler() {

  levelCriteria.forEach((levelCriteriaItem) => {

    if(levelCriteriaItem.levelNumber !== "100+") {

      if(userXP >= levelCriteriaItem.minimumXP && userXP <= levelCriteriaItem.maximumXP) {
  
        userLevel = levelCriteriaItem.levelNumber;
  
      }

    } else {

      if(userXP >= levelCriteriaItem.minimumXP) {

        userLevel = 100 + Math.ceil(userXP / 2500);

      }

    }

  });

}

console.log(levelCriteria);