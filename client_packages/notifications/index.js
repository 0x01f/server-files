// client

mp.events.add('foo', (arg1, jsonObj) => {
    mp.console.logInfo(arg1);

    const obj = JSON.parse(jsonObj);
    mp.console.logInfo(obj.test);
});