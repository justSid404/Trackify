import { users } from "../data/users.js";

const mainContainerElement = document.querySelector('.main-container');
const usernameInputElement = document.querySelector('.username-input');
const passwordInputElement = document.querySelector('.password-input');
const rememberMeInputElement = document.querySelector('.remember-me');
const loginBtnElement = document.querySelector('.login');

//Login page default transition
document.body.classList.add('fade-in');

usernameInputElement.value = '';
passwordInputElement.value = '';
rememberMeInputElement.checked = false;

function login() {

  //Code to verify user login and redirect to home page if user is valid else shows error
  let isUserAuthorized = false;

  users.forEach((user) => {

    if(user.username === usernameInputElement.value) {

      if(user.password === passwordInputElement.value) {

        isUserAuthorized = true;

      }

    }

  });

  if(isUserAuthorized) {

    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
  
    setTimeout(() => {
  
      window.location.href = 'home.html';
  
    }, 500);

  } else {

    document.querySelector('.error-message').classList.add('fade-in');

  }
}


loginBtnElement.addEventListener('click', () => {

  //Code to verify user login and redirect to home page if user is valid else shows error
  login();
  usernameInputElement.value = '';
  passwordInputElement.value = '';
  rememberMeInputElement.checked = false;

});