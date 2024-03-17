// Create a function that posts a tick message every 100ms and a function that stops the timer
// This is a web worker

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
    }
}