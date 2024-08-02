let userLogged;

if(localStorage.getItem('userLogged') !== null) {
  userLogged = JSON.parse(localStorage.getItem('userLogged'));
  localStorage.removeItem('userLogged');
}

//Home page default transition
document.body.classList.add('fade-in');