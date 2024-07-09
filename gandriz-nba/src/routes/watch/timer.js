let timer;

onmessage = e => {
    clearInterval(timer);
    if (e.data.message === 'START') {
        timer = setInterval(() => {
            postMessage('TICK');
        }, e.data.interval);
    } else if (e.data.message === 'START TIMEOUT') {
        console.log('START TIMEOUT');
        timer = setInterval(() => {
            postMessage('TICK TIMEOUT');
        }, e.data.interval);
    } else if (e.data.message === 'START 24S') {
        timer = setInterval(() => {
            postMessage('TICK 24S');
        }, e.data.interval);
    }
}