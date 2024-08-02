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

  const newCardhtml = `

  <div class="tracker-card tracker-card-${trackers.length}">
    <div class="tracker">
      +
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
    name: `tracker-card-${trackers.length}`
  });

  console.log(trackers);

})