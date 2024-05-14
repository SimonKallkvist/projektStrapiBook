// -_-

let userInfo = document.querySelector('.userInfo');

// Login form change btn

document.querySelector('.registerUserBtn').addEventListener('click', () => {
  document.querySelector('.loginUser').classList.toggle('hidden');
  document.querySelector('.registerUser').classList.toggle('hidden');
});

// When Create user is clicked
document.querySelector('.createUser').addEventListener('click', () => {
  let userName = document.querySelector('#registerUserName');
  let email = document.querySelector('#registerEmail');
  let password = document.querySelector('#registerPassword');
  let repeatPassword = document.querySelector('#repeatPassword');

  console.log(userName, email, password, repeatPassword);

  if (userName.value && email.value && password.value && repeatPassword.value) {
    if (password.value === repeatPassword.value) {
      document.querySelector('.loginUser').classList.toggle('hidden');
      document.querySelector('.registerUser').classList.toggle('hidden');

      //   calling a put request
      createUser(userName.value, email.value, password.value);

      //   resetting the inputs
      userName.style.border = 'none';
      email.style.border = 'none';
      password.style.border = 'none';
      repeatPassword.style.border = 'none';
      userName.value = '';
      email.value = '';
      password.value = '';
      repeatPassword.value = '';
    } else {
      alert('your passwords are not matching here...');
      password.style.border = '1px solid red';
      repeatPassword.style.border = '1px solid red';
    }
  } else {
    alert(
      'hmm...something is fiscschhhyy and not right here, are you sure about this?'
    );
    userName.style.border = '1px solid red';
    email.style.border = '1px solid red';
    password.style.border = '1px solid red';
    repeatPassword.style.border = '1px solid red';
  }
});

//Get data method
let getData = async (url) => {
  try {
    let response = await axios.get(url);
    return response;
  } catch (error) {
    console.log('Error: ' + error);
  }
};

//When login is clicked
document.querySelector('.loginUserBtn').addEventListener('click', () => {
  let username = document.querySelector('#userName');
  let password = document.querySelector('#password');

  if (username.value && password.value) {
    loginUser(username.value, password.value);
  } else {
    alert('you need to provide both username/email and password!');
    username.style.border = '1px solid red';
    password.value = '1px solid red';
  }
});

// Create the user and add them to Strapi
let createUser = async (username, email, password) => {
  console.log(username, email, password);
  try {
    let response = await axios.post(
      'http://localhost:1337/api/auth/local/register',
      {
        username: username,
        email: email,
        password: password,
        // role: 'authen',
      }
    );
    console.log(response);
  } catch (error) {
    console.log('Error: ' + error.message);
    alert('No user was added, try again and check!');
  }
};

// Login User checking towards strapi and storing the Username and the data
let loginUser = async (username, password) => {
  console.log(username, password);
  try {
    let response = await axios.post('http://localhost:1337/api/auth/local', {
      identifier: username,
      password: password,
    });
    console.log(response);
    if (response.status === 200) {
      sessionStorage.setItem('token', response.data.jwt);
      sessionStorage.setItem('username', response.data.user.username);
      setLoginScreen();
    }
  } catch (error) {
    console.log('Error: ' + error);
  }
};

let setLoginScreen = () => {
  // remove the loginForm if there is a token in sessionstorage
  if (sessionStorage.getItem('token')) {
    document.querySelector('.loginForm').classList.add('hidden');
  }

  let userInfo = document.querySelector('.userInfo');
  userInfo.classList.remove('hidden');

  let username = sessionStorage.getItem('username');

  let profileTag = document.createElement('h4');
  profileTag.innerText = username;

  userInfo.append(profileTag);
};

let checkStorage = () => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('token')) {
    setLoginScreen();
  }
};

let setStartScreen = async () => {
  let books = await getData('http://localhost:1337/api/books?populate=*');
  console.log(books);
};

setStartScreen();
checkStorage();
