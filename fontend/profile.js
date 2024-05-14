//-_-
//Get data method
let getData = async (url) => {
  try {
    let response = await axios.get(url);
    return response;
  } catch (error) {
    console.log('Error: ' + error);
  }
};

// Collect the data from the profile
let setProfile = async () => {
  let profile = await getData(
    'http://localhost:1337/api/users/' +
      sessionStorage.getItem('user') +
      '?populate=*'
  );
  //   let user = sessionStorage.getItem(JSON.parse('user'));

  setNavbar();
  console.log(profile);
};

//Setup the navBar
let setNavbar = () => {
  let userInfo = document.querySelector('.userInfo');
  userInfo.innerHTML = '';
  userInfo.classList.remove('hidden');

  let username = sessionStorage.getItem('username');

  let profileTag = document.createElement('h4');
  profileTag.classList.add('profileTag');
  profileTag.innerText = username;

  let profileLink = document.createElement('a');
  profileLink.href = 'profile.html';
  profileLink.innerText = 'Profile';
  let icon = document.createElement('i');
  icon.style.fontSize = '32px';
  icon.style.marginRight = '-24px';
  icon.classList.add('fa-solid', 'fa-user');

  let logOutBtn = document.createElement('button');
  logOutBtn.classList.add('btn', 'logOutBtn');
  logOutBtn.innerText = 'Logout';
  logOutBtn.addEventListener('click', () => {
    logoutUser();
  });

  userInfo.append(icon, profileTag, profileLink, logOutBtn);
};

//Logout the user when on profile page
let logoutUser = () => {
  sessionStorage.clear();
  window.location.href = 'index.html';
};

setProfile();
