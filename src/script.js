'use strict'

const mainPageWindow = document.querySelector('.main');
const loginPageWindow = document.querySelector('.main_on');
const loginPageWindowGreeting = document.querySelector('.greeting');
const contactsPageWindow = document.querySelector('.main_contacts');
const modalWindow = document.querySelector('.modal_form_login');

const contactsBtn = document.querySelectorAll('.contacts_btn');
const backToMainBtn = document.querySelector('.back_to_main');
const loginBtn = document.querySelectorAll('.login_btn');
const logoutBtn = document.querySelectorAll('.logout_btn');
const navLoginBtn = document.querySelector('.header_buttons_login')
const navLogoutBtn = document.querySelector('.header_buttons_logout')
const closeModalBtn = document.querySelector('.close_modal_btn');
const submit = document.querySelector('.submit');

const inpLogin = document.querySelector('.input_login');
const inpPassword = document.querySelector('.input_password');

const loader = document.querySelector('.loader_place');
const errorMes = document.querySelector('.login_error');
const errorMesLoginEmpty = document.querySelector('.login_error-empty');
const errorMesPasswordEmpty = document.querySelector('.password_error-empty');

let loginVal;
let passwordVal;


// вспомогательные функции
// открываем страницу контакты
function contactsOpen() {
    contactsPageWindow.classList.remove('off');
    contactsPageWindow.classList.add('on');
    mainPageWindow.classList.remove('on');
    mainPageWindow.classList.add('off');
    loginPageWindow.classList.remove('on');
    loginPageWindow.classList.add('off');
}

// открываем страницу логин
function loginOpen() {
    loginPageWindow.classList.remove('off');
    loginPageWindow.classList.add('on');
    contactsPageWindow.classList.remove('on');
    contactsPageWindow.classList.add('off');
    mainPageWindow.classList.remove('on');
    mainPageWindow.classList.add('off');
}

// открываем главную страницу
function mainOpen() {
    mainPageWindow.classList.remove('off');
    mainPageWindow.classList.add('on');
    loginPageWindow.classList.remove('on');
    loginPageWindow.classList.add('off');
    contactsPageWindow.classList.remove('on');
    contactsPageWindow.classList.add('off');
}

// меняем кнопки войти/выйти в навбаре если авторизованы
function navLoginOff() {
    navLogoutBtn.classList.add('on');
    navLogoutBtn.classList.remove('off');
    navLoginBtn.classList.add('off');
    navLoginBtn.classList.remove('on');
}

function navLoginOn() {
    navLoginBtn.classList.add('on');
    navLoginBtn.classList.remove('off');
    navLogoutBtn.classList.remove('on');
    navLogoutBtn.classList.add('off');
}

// возвращаемся на главную со страницы контакты если мы не авторизованы
function backToMainOff() {
    contactsPageWindow.classList.remove('on');
    contactsPageWindow.classList.add('off');
    mainPageWindow.classList.remove('off');
    mainPageWindow.classList.add('on');
    loginPageWindow.classList.remove('on');
    loginPageWindow.classList.add('off');
}

// возвращаемся на главную со страницы контакты если мы авторизованы
function backToMainOn() {
    contactsPageWindow.classList.remove('on');
    contactsPageWindow.classList.add('off');
    mainPageWindow.classList.remove('on');
    mainPageWindow.classList.add('off');
    loginPageWindow.classList.remove('off');
    loginPageWindow.classList.add('on');
}


// открываем/закрываем модалку со входом

function modalLoginOpen() {
    modalWindow.classList.remove('off');
    modalWindow.classList.add('on', 'back');
}

function modalLoginClose() {
    modalWindow.classList.remove('on', 'back');
    modalWindow.classList.add('off');
}


// переход на страницу контакты
contactsBtn.forEach(e => {
    e.addEventListener('click', () => {
        contactsOpen();
    });
});


// возвращение на главную
backToMainBtn.addEventListener('click', () => {
    if (localStorage.length > 0) {
        backToMainOn();
    } else {
        backToMainOff();
    }
});


// вход
loginBtn.forEach(e => {
    e.addEventListener('click', () => {
        modalLoginOpen();
    });
});

submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (validationInpLoginEmpty() & validationInpPasswordEmpty()) {
        errorMesOff();
        loginFunc();
    }
});


// валидация логина и пароля
// на пустоту
function validationInpLoginEmpty() {
    if (!inpLogin.value) {
        errorMesLoginEmpty.innerHTML = 'Пожалуйста введите имя пользователя!';
    } else {
        errorMesLoginEmpty.innerHTML = '';
        return true;
    }
}

function validationInpPasswordEmpty() {
        if (!inpPassword.value) {
            errorMesPasswordEmpty.innerHTML = 'Пожалуйста введите пароль!';
        } else {
            errorMesPasswordEmpty.innerHTML = '';
            if (validationPassword()) {
                return true
            }
        }
}

// валидация пароля
function validationPassword() {
    if (inpPassword.value.length >= 8) {
        return true;
    } else {
        errorMesPasswordEmpty.innerHTML = 'Пароль должен быть не менее 8 символов!';
    }
}


// добавляем/удаляем индикатор загрузки
function loaderOn() {
    loader.innerHTML = `
    <div class="loader" id="loader-1"></div>
    `
}

function loaderOff() {
    loader.innerHTML = ''
}

// добавляем/удаляем ошибку при входе
function errorMesOn() {
    errorMes.innerHTML = `Неверный логин или пароль`;
}

function errorMesOff() {
    errorMes.innerHTML = '';
}


// ассинхронные запросы к бд
function loginFunc() {
    try {
        loaderOn();
        setTimeout(async () => {
            loginVal = inpLogin.value;
            passwordVal = inpPassword.value;
            const response = await axios.get('./users.json');
            const mockUser = response.data.find(user => user.username === loginVal && user.password === passwordVal);
            if (mockUser) {
                localStorage.setItem('username', mockUser.username);
                loaderOff();
                modalLoginClose();
                autoCheck();
            } else {
                loaderOff();
                errorMesOn();
            }
        }, 1000);
    } catch {
        alert('Ошибка при входе');
    }
}

// выход
logoutBtn.forEach(e => {
    e.addEventListener('click', () => {
        localStorage.removeItem('username');
        autoCheck();
        inpLogin.value = '';
        inpPassword.value = '';
    })
})


// проверка на авторазацию и отображение нужных элементов
function autoCheck() {
    if (localStorage.length > 0) {
        loginOpen();
        greeting();
        navLoginOff();
    } else {
        mainOpen();
        navLoginOn();
    }
}

// добавляем приветствие
function greeting() {
    loginPageWindowGreeting.innerHTML = `
    <h1>Привет, ${localStorage.getItem('username')}</h1>
    `
}

// отображаем нужную страницу при обновлении страницы
document.addEventListener("DOMContentLoaded", () => {
    autoCheck();
});


// закрываем модалку
closeModalBtn.addEventListener('click', () => {
    modalLoginClose();
    inpLogin.value = '';
    inpPassword.value = '';
    errorMes.innerHTML = '';
    errorMesPasswordEmpty.innerHTML = '';
    errorMesLoginEmpty.innerHTML = '';
})
