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

createTrackerElement.addEventListener('click', () => {

  const newCardhtml = `

  <div class="tracker-card tracker-card-${trackers.length}">
    <div class="tracker">
      +
    </div>
  </div>`;

  cardHolderElement.insertAdjacentHTML('afterbegin', newCardhtml);
  document.querySelector(`.card-holder`).scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  trackers.push({
    id: trackers.length,
    name: `tracker-card-${trackers.length}`
  });

})