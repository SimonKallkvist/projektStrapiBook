// -_-

let userInfo = document.querySelector('.userInfo');

// Login form change btns
document.querySelector('.registerUserBtn').addEventListener('click', () => {
  document.querySelector('.loginUser').classList.toggle('hidden');
  document.querySelector('.registerUser').classList.toggle('hidden');
  resetForm();
});
document.querySelector('.backBtn').addEventListener('click', () => {
  document.querySelector('.loginUser').classList.toggle('hidden');
  document.querySelector('.registerUser').classList.toggle('hidden');
  resetForm();
});

let resetForm = () => {
  let inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
};

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

// When logut btn is pressed
// document.querySelector('.logOut').addEventListener('click', () => {
//   logoutUser();
// });

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
  try {
    let response = await axios.post('http://localhost:1337/api/auth/local', {
      identifier: username,
      password: password,
    });
    if (response.status === 200) {
      sessionStorage.setItem('token', response.data.jwt);
      sessionStorage.setItem('username', response.data.user.username);
      sessionStorage.setItem('user', response.data.user.id);
      setLoginScreen();
      setUserFavoriteBooks(response.data.user.id);
      setStartScreen();
    }
  } catch (error) {
    console.log('Error: ' + error);
    alert('invalid Username or Password!');
  }
};

let setUserFavoriteBooks = async (userId) => {
  try {
    let response = await axios.get(
      `http://localhost:1337/api/users/${userId}?populate=*`
    );
    let favoriteBooksId = Array.from(response.data.books);
    console.log(favoriteBooksId);
    sessionStorage.setItem('bookId', JSON.stringify(favoriteBooksId));
  } catch (error) {
    console.log('error: ' + error);
  }
};

let logoutUser = () => {
  sessionStorage.clear();
  checkStorage();
  setStartScreen();
};

// When looged in show btns in nav and set username
let setLoginScreen = () => {
  // remove the loginForm if there is a token in sessionstorage
  if (sessionStorage.getItem('token')) {
    document.querySelector('.loginForm').classList.add('hidden');

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
  }
};

let resetLogin = () => {
  document.querySelector('.loginForm').classList.remove('hidden');
  let userInfo = document.querySelector('.userInfo');
  //   userInfo.remove('profileTag');
  userInfo.classList.add('hidden');
};

// check if someone is logged in
let checkStorage = () => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('token')) {
    setLoginScreen();
  } else {
    resetLogin();
  }
};

// get all books and loop them Print cards
let setStartScreen = async () => {
  let book = await getData('http://localhost:1337/api/books?populate=*');
  let books = Array.from(book.data.data);
  //   console.log(books);

  let sortCategory = document.querySelector('#sortCategory');
  console.log(books);

  sortCategory.addEventListener('change', () => {
    sortTheList(books, sortCategory.value);
  });

  renderSavedBooks(books);
};

// sortthe List
let sortTheList = (list, sort) => {
  console.log(list, sort);
  if (sort === 'title') {
    // Return the list based on Titles
    list.sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
    console.log('Title change', list);
    renderSavedBooks(list);
  } else if (sort === 'author') {
    // Return the list based on Author
    list.sort((a, b) => a.attributes.author.localeCompare(b.attributes.author));
    console.log('Author change', list);
    renderSavedBooks(list);
  } else {
    // Return the list based on Ratings
  }
};

let renderSavedBooks = (books) => {
  let bookContainer = document.querySelector('.bookContainer');
  bookContainer.innerHTML = '';
  if (books) {
    books.map((book) => {
      let card = document.createElement('div');
      card.classList.add('card');

      let bookCover = document.createElement('img');
      bookCover.src =
        'http://localhost:1337' + book.attributes.cover.data.attributes.url;
      let cardDiv = document.createElement('div');

      if (sessionStorage.getItem('token')) {
        let favBokId = JSON.parse(sessionStorage.getItem('bookId'));

        let bookmarkBtn = document.createElement('div');
        bookmarkBtn.classList.add('bookmark');

        let bookIcon = document.createElement('i');
        bookIcon.setAttribute('favorite', 'false');

        if (favBokId.some((ide) => ide.id === book.id)) {
          bookIcon.classList.add('fa-solid', 'fa-bookmark');
          bookIcon.setAttribute('favorite', 'true');
        } else {
          bookIcon.classList.add('fa-regular', 'fa-bookmark');
          bookIcon.setAttribute('favorite', 'false');
        }

        bookmarkBtn.append(bookIcon);

        // CHange the bookmark and add or delete from users favorite books

        bookmarkBtn.addEventListener('click', () => {
          let isFavorite = bookIcon.getAttribute('favorite') === 'true';
          if (isFavorite) {
            bookIcon.setAttribute('favorite', 'false');
            bookIcon.classList.add('fa-regular');
            bookIcon.classList.remove('fa-solid');
            // kalla på funktion för att ta bort från favoritlistan
            removeFavoriteBook(book.id);
          } else {
            bookIcon.setAttribute('favorite', 'true');
            bookIcon.classList.remove('fa-regular');
            bookIcon.classList.add('fa-solid');
            // kalla på funktion för att sätta en ny favoritbok
            setFavoriteBook(book.id);
          }
        });

        cardDiv.append(bookmarkBtn);
      }

      let title = document.createElement('h3');
      title.innerText = book.attributes.title;

      let author = document.createElement('h4');
      author.innerText = book.attributes.author;

      let pages = document.createElement('p');
      pages.innerText = book.attributes.pages + ' pages';

      let year = document.createElement('p');
      year.innerText = 'Release: ' + book.attributes.date;

      let seeMoreBtn = document.createElement('button');
      seeMoreBtn.classList.add('btn', 'seeMore');
      seeMoreBtn.innerText = 'See more';

      cardDiv.append(title, author, pages, year, seeMoreBtn);
      card.append(bookCover, cardDiv);
      bookContainer.append(card);
    });
  }
};

let setFavoriteBook = async (bookId) => {
  let token = sessionStorage.getItem('token');
  console.log(token, sessionStorage.getItem('user'), bookId);
  let bookResponseFull;
  let userBookList;
  // Getting all the books of the user
  try {
    let userBooks = await axios.get(
      `http://localhost:1337/api/users/${sessionStorage.getItem(
        'user'
      )}?populate=*`
    );
    userBookList = userBooks.data.books;
    console.log(userBookList);
  } catch (error) {
    console.log('Error: ' + error);
  }

  //Getting the specific book
  try {
    let bookResponse = await axios.get(
      `http://localhost:1337/api/books/${bookId}?populate=*`
    );
    bookResponseFull = bookResponse.data.data;
  } catch (error) {
    console.log('Error: ' + error);
  }

  userBookList.push(bookResponseFull);
  // Adding the book to the user
  try {
    let response = await axios.put(
      `http://localhost:1337/api/users/${sessionStorage.getItem('user')}`,
      {
        books: userBookList,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log('Error: ' + error.response.data);
  }

  // Update the sessionStorage with newly added book
  sessionStorage.removeItem('bookId');
  sessionStorage.setItem('bookId', JSON.stringify(userBookList));
};

//Removing the book from the user
let removeFavoriteBook = async (bookId) => {
  let token = sessionStorage.getItem('token');
  // console.log(token, sessionStorage.getItem('user'), bookId);
  let bookResponseFull;
  let userBookList;
  // Getting all the books of the user
  try {
    let userBooks = await axios.get(
      `http://localhost:1337/api/users/${sessionStorage.getItem(
        'user'
      )}?populate=*`
    );
    userBookList = userBooks.data.books;
    console.log(userBookList);
  } catch (error) {
    console.log('Error: ' + error);
  }

  console.log(userBookList);

  //Getting the specific book
  try {
    let bookResponse = await axios.get(
      `http://localhost:1337/api/books/${bookId}`
    );
    bookResponseFull = bookResponse.data.data;
  } catch (error) {
    console.log('Error: ' + error);
  }

  console.log(bookResponseFull);
  userBookList = userBookList.filter((item) => item.id !== bookResponseFull.id);
  console.log('Updated userBookList:', userBookList);

  console.log(userBookList);

  // Adding the book to the user
  try {
    let response = await axios.put(
      `http://localhost:1337/api/users/${sessionStorage.getItem('user')}`,
      {
        books: userBookList,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log('Error: ' + error.response.data);
  }
  sessionStorage.removeItem('bookId');
  sessionStorage.setItem('bookId', JSON.stringify(userBookList));
};

// document.addEventListener(
//   'DOMContentLoaded',
//   function () {
setStartScreen();
checkStorage();
//   },
//   false
// );
