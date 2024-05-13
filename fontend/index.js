// -_-

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
      //   resetting the inputs
      userName.style.border = 'none';
      email.style.border = 'none';
      password.style.border = 'none';
      repeatPassword.style.border = 'none';
      userName.value = '';
      email.value = '';
      password.value = '';
      repeatPassword.value = '';

      //   calling a put request
      createUser();
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
