importScripts("car.js");

var intervalMs = 1000/128;
var expected = Date.now() + intervalMs;
let interval = null;

let cars = [];
let roadBorders = [];
let controls = {
    forward: false,
    reverse: false,
    left: false,
    right: false,
    break: false,
}


self.onmessage = function (e) {
    const { type, data } = e.data;

    switch (type) {
        case 'start':
            cars = [];
            data.cars.forEach(car => {
                cars.push(new PlayerCar(car.x, car.y, car.angle));
            });
            roadBorders = data.roadBorders;
            controls = data.controls;
            if (interval === null) {
                interval = setTimeout(step, interval);
            }

            break;

        case 'stop':
            if (interval !== null) {
                clearTimeout(interval);
                interval = null;
                self.postMessage({ type: 'stopped' });
            }
            break;
        case 'update':
            controls = data.controls;
            break;
    }
};

function step() {
    var dt = Date.now() - expected;
    if (dt > intervalMs) {
        console.log('Overshot: ', dt + 'ms' + ', skipping tick');

        // Skip this tick
        expected += intervalMs;
        interval = setTimeout(step, Math.max(0, intervalMs - dt)); // take into account drift
        return
    }
    
    cars.forEach(car => {
        car.update(cars, roadBorders, controls);
    });
    self.postMessage({ type: 'update', data: { time: performance.now(), cars: cars } });

    expected += intervalMs;
    interval = setTimeout(step, Math.max(0, intervalMs - dt)); // take into account drift
}