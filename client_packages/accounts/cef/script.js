// Tutorial by Lev Angel for https://rage-script.ru

function showRegister(){
    resetError();
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}

function showLogin(){
    resetError();
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
}

function loginAttempt() {
    const login = document.getElementById('log-login').value;
    const password = document.getElementById('log-password').value;
    resetError();

    if (!login || login.length < 3) {
        return showError('Введите Логин');
    }

    if (!password || password.length < 6) {
        return showError('Введите Пароль');
    }

    mp.trigger('loginAttempt', JSON.stringify({login, password}));
}


function registerAttempt() {
    const login = document.getElementById('reg-login').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const nickname = document.getElementById('reg-nickname').value; // добавляем поле nickname
    resetError();

    if (!login || login.length < 3) {
        return showError('Введите Логин');
    }

    if (!password || password.length < 6) {
        return showError('Введите Пароль');
    }

    if (password != passwordConfirm) {
        return showError('Пароли не совпадают');
    }

    if (!nickname || nickname.length < 3) { // проверка на nickname
        return showError('Введите Никнейм');
    }

    mp.trigger('registerAttempt', JSON.stringify({login, password, nickname}));
}


function showError(message){
    const errorBlock = document.getElementById('error');
    errorBlock.innerText = message;
    errorBlock.style.display = 'block';
}

function resetError(){
    const errorBlock = document.getElementById('error');
    errorBlock.innerText = 'message';
    errorBlock.style.display = 'none';
}