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
  console.log(profile.data);
  setNavbar();

  let userDisplay = document.querySelector('.userDisplay');

  let userPic = document.createElement('userPic');
  userPic.classList.add('userPic');

  let userPicName = document.createElement('h2');
  userPicName.innerText = profile.data.username;
  userPic.append(userPicName);

  let markedBooks = profile.data.books.length;

  let amountOfBooks = document.createElement('h3');
  amountOfBooks.innerText = markedBooks + 'books in "must read"';

  userDisplay.append(userPic, amountOfBooks);

  profile.data.books.map((book) => {
    renderSavedBooks(book);
  });
};

// Render the saved books
let renderSavedBooks = async (book) => {
  //   console.log(book);
  let savedBooks = document.querySelector('.savedBooks');
  let card = document.createElement('div');
  card.classList.add('card');

  let bookSrc = await getData(
    'http://localhost:1337/api/books/' + book.id + '?populate=*'
  );
  let bookCover = document.createElement('img');
  bookCover.src =
    'http://localhost:1337' +
    bookSrc.data.data.attributes.cover.data.attributes.url;
  let cardDiv = document.createElement('div');
  let title = document.createElement('h3');
  title.innerText = book.title;

  let author = document.createElement('h4');
  author.innerText = book.author;

  let pages = document.createElement('p');
  pages.innerText = book.pages + ' pages';

  let year = document.createElement('p');
  year.innerText = 'Release: ' + book.date;

  cardDiv.append(title, author, pages, year);
  card.append(bookCover, cardDiv);
  savedBooks.append(card);
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
