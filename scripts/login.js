import { users } from "../data/users.js";

const mainContainerElement = document.querySelector('.main-container');
const usernameInputElement = document.querySelector('.username-input');
const passwordInputElement = document.querySelector('.password-input');
const rememberMeInputElement = document.querySelector('.remember-me');
const loginBtnElement = document.querySelector('.login');
const signupBtnElement = document.querySelector('.sign-up');
const errorMsgElement = document.querySelector('.error-message');

const validLowerCaseCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const validUpperCaseCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const validNumberCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const validSpecialCharacters = ['_'];

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

    errorMsgElement.classList.add('fade-in');
    usernameInputElement.value = '';
    passwordInputElement.value = '';
    rememberMeInputElement.checked = false;

  }
}

function verifyUsername(value) {

  let isValueLengthValid = false; //done
  let isDuplicateValid = true; //done
  let isfirstCharValid = false; //done
  let isValueLowerCaseValid = false;
  let isValueUpperCaseValid = false;
  let isValueNumberValid = false;
  let isSpecialCharacterValid = false;
  const valueLength = value.length;

  //Verifying username length
  if(valueLength >= 5 && valueLength <= 20) {
    isValueLengthValid = true;
  } 

  //Verifying username is duplicate
  for(let i=0; i<users.length; i++) {
    if(users[i].username === value) {
      isDuplicateValid = false;
      break;
    }
  }

  //Verifying first character
  for(let i=0; i<validLowerCaseCharacters.length; i++) {
    if(validLowerCaseCharacters[i] === value.charAt(0)) {  //check 1
      isfirstCharValid = true;
      break;
    }
  }

  if(!isfirstCharValid) { //Only check if first charcter is not valid after check 1
    for(let i=0; i<validUpperCaseCharacters.length; i++) {
      if(validUpperCaseCharacters[i] === value.charAt(0)) { //check 2
        isfirstCharValid = true;
        break;
      }
    }
  }

  //Verifying username has a-z
  for(let i=0; i<validLowerCaseCharacters.length; i++) {
    for(let j=0; j<value.length; j++) {
      if(validLowerCaseCharacters[i] === value.charAt(j)) {
        isValueLowerCaseValid = true;
      }
    }
  }

  //Verifying username has A-Z
  for(let i=0; i<validUpperCaseCharacters.length; i++) {
    for(let j=0; j<value.length; j++) {
      if(validUpperCaseCharacters[i] === value.charAt(j)) {
        isValueUpperCaseValid = true;
      }
    }
  }

  //Verifying username has 0-9
  for(let i=0; i<validNumberCharacters.length; i++) {
    for(let j=0; j<value.length; j++) {
      if(validNumberCharacters[i] === value.charAt(j)) {
        isValueNumberValid = true;
      }
    }
  }

  //Verifying username has '_'
  for(let i=0; i<validSpecialCharacters.length; i++) {
    for(let j=0; j<value.length; j++) {
      if(validSpecialCharacters[i] === value.charAt(j)) {
        isSpecialCharacterValid = true;
      }
    }
  }

  if(isValueLengthValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- 5 to 20 characters long</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isDuplicateValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- No duplicate Username.</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isfirstCharValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- Must start with a letter.</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isValueLowerCaseValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- May include letters (a-z).</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isValueUpperCaseValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- May include letters (A-Z).</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isValueNumberValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- May include numbers (0-9).</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isSpecialCharacterValid === false) {
    errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span>.
    <p>Please enter a username that meets the following criteria:</p>
    <p>- May include underscores (_).</p>`;
    errorMsgElement.classList.add('fade-in');
    return false;
  }

  if(isValueLengthValid && isDuplicateValid && isfirstCharValid && isValueLowerCaseValid && isValueUpperCaseValid && isValueNumberValid && isSpecialCharacterValid) {
    console.log('Username is correct.');
    return true;
  }

}

function verifyPassword(value) {

//   Your password must:
// - Be at least 12 characters long.
// - Include at least one uppercase letter (A-Z).
// - Include at least one lowercase letter (a-z).
// - Include at least one number (0-9).
// - Include at least one special character (e.g., !, @, #, $, %).
// - Avoid using common words, personal information, or easily guessable patterns.
// - Be unique to this account and not used elsewhere.

  errorMsgElement.classList.add('fade-in');
  return false;

}

usernameInputElement.addEventListener('keydown', (event) => {

  if(event.key === 'Enter'){
    //Code to verify user login and redirect to home page if user is valid else shows error
    login();
  }

});

passwordInputElement.addEventListener('keydown', (event) => {

  if(event.key === 'Enter'){
    //Code to verify user login and redirect to home page if user is valid else shows error
    login();
  }

});


loginBtnElement.addEventListener('click', () => {

  //Code to verify user login and redirect to home page if user is valid else shows error
  login();

});

signupBtnElement.addEventListener('click', () => {

  //Code to Create user if entered username and password are valid
  if(verifyUsername(usernameInputElement.value) && verifyPassword(passwordInputElement.value)) {

    alert('Account created. Please try logging in.');
    window.location.reload();

  }
  // else {

  //   errorMsgElement.innerHTML = `Incorrect <span class="error-focus">Username</span> or <span class="error-focus">Password</span>.
  //   <p>Please create a username that meets the following criteria:</p>
  //   <p>- 5 to 20 characters long</p>
  //   <p>- May include letters (A-Z, a-z), numbers (0-9), and underscores (_)</p>
  //   <p>- No special characters or spaces allowed</p>
  //   <p>- Must start with a letter</p>
  //   <p>- No duplicate Username.</p>`;
  //   errorMsgElement.classList.add('fade-in');

  // }

  

});