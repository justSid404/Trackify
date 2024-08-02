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
    document.querySelector('.input-prompt').remove();
    addTrackerCard(inputValue);
  
  });
  
  document.querySelector('.input-prompt-cancel').addEventListener('click', () => {
  
    document.querySelector('.input-prompt').remove();
  
  });

}

function addTrackerCard(inputValue) {

  const newCardhtml = `

    <div class="tracker-card tracker-card-${trackers.length}">
      <div class="tracker">
        ${inputValue}
      </div>
    </div>`;

    cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
    cardHolderElement.classList.remove('card-holder-zero');
    document.querySelector(`.card-holder`).scrollTo({
      left: 0,
      behavior: 'smooth'
    });

    trackers.push({
      id: trackers.length,
      elementClass: `tracker-card-${trackers.length}`,
      name: inputValue
    });

    console.log(trackers);

}