const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let DB = false;


mp.events.add('packagesLoaded', () => {
   DB = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'rage-test'});
   DB.connect(function(err){
       if(err) return console.log('Ошибка подключения: ' + err.stack);
       console.log('Успешное подключение к базе данных');
   });
});

mp.events.add('playerReady', player => {
    player.call('showLoginDialog');
});

mp.events.add('onLoginAttempt', (player, data) => {
    data = JSON.parse(data);

    DB.query('SELECT * FROM accounts WHERE login = ? LIMIT 1', [data.login], function (err, results) {
        if (err) {
            console.log(err);
            return player.call('showAuthError', ['Ошибка сервера']);
        }

        if (results.length == 0) return player.call('showAuthError', ['Неверный Логин и/или Пароль']);

        const dbPassword = results[0].password;
        bcrypt.compare(data.password, dbPassword).then(function(isMatched) {
            if (isMatched) {
                // Теперь загружаем данные по socialId
                DB.query('SELECT * FROM accounts WHERE socialId = ? LIMIT 1', [player.rgscId], function (err, results) {
                    if (err) {
                        console.log(err);
                        return player.call('showAuthError', ['Ошибка сервера']);
                    }

                    if (results.length == 0) return player.call('showAuthError', ['Пользователь не найден по Social ID']);

                    // Присваиваем nickname объекту player
                    player.nickname = results[0].nickname;
                    player.call('hideLoginDialog', [player.nickname]); // передаем nickname клиенту
                });
            } else {
                player.call('showAuthError', ['Неверный Логин и/или Пароль']);
            }
        });
    });
});

 

 mp.events.add('onRegisterAttempt', (player, data) => {
    data = JSON.parse(data);

    DB.query('SELECT id FROM accounts WHERE login = ?', [data.login], function(err, results) {
        if (results.length > 0) return player.call('showAuthError', ['Аккаунт с таким Логином уже существует']);

        bcrypt.hash(data.password, saltRounds, function(err, passwordHash) {
            DB.query('INSERT INTO accounts SET login = ?, password = ?, nickname = ?, socialId = ?', [data.login, passwordHash, data.nickname, player.rgscId], function(err, results) {
                player.call('hideLoginDialog');
            });
        });
    });
});

// ---------------------------------------------------------- //
