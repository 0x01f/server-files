let loginBrowser;


mp.events.add('showLoginDialog', () => {
    loginBrowser = mp.browsers.new('package://accounts/cef/index.html');
    loginBrowser.execute("mp.invoke('focus', true)");
    mp.gui.chat.activate(false);
});

mp.events.add('hideLoginDialog', () => {
    loginBrowser.execute("mp.invoke('focus', false)");
    loginBrowser.active = false;
    mp.gui.chat.activate(true);
});

mp.events.add('loginAttempt', (data) => {
   mp.events.callRemote('onLoginAttempt', data);
});

mp.events.add('registerAttempt', (data) => {
    mp.events.callRemote('onRegisterAttempt', data);
});

mp.events.add('showAuthError', (errorMessage) => {
    loginBrowser.execute(`showError("${errorMessage}")`);
});

// Tutorial by Lev Angel for https://rage-script.ru