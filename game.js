class Game {
    constructor() {
        this.worker = null;
        this.paused = false;
        this.lastTickSampleTime = performance.now();
        this.mspt = [0];

        this.animationFrame = null;
        this.lastAnimationFrameTime = performance.now();
        this.mspf = 0;

        this.cars = [];
    }

    // Initialise the worker
    init(numCars, mapDifficulty, carDifficulty, cars = []) {
        this.#setGame(numCars, mapDifficulty, carDifficulty, cars);
        
        this.worker = new Worker('tick.js');
        this.worker.onmessage = this.#handleWorkerMessage.bind(this);

        this.animationFrame = requestAnimationFrame(this.#draw.bind(this));
    }

    // Handle incoming messages from the worker
    #handleWorkerMessage(event) {
        const { type, data } = event.data;
        
        if (type === 'update') {
            data.cars.forEach((car, i) => {
                this.cars[i].x = car.x;
                this.cars[i].y = car.y;
                this.cars[i].angle = car.angle;
                this.cars[i].speed = car.speed;
                this.cars[i].collided = car.collided;

                this.cars[i].polygon = car.polygon;
            });

            this.mspt.push(performance.now() - this.lastTickSampleTime);
            if (this.mspt.length > 100) {
                this.mspt.shift();
            }
            this.lastTickSampleTime = performance.now();
        }
    }

    // Start the ticker
    start(numCars, mapDifficulty, carDifficulty, cars = []) {
        if (!this.worker) {
            this.init();
        }
        
        this.paused = false;
        this.worker.postMessage({ 
            type: 'start', 
            data: {
                cars: this.cars,
                roadBorders: [],
                controls: {
                    forward: false,
                    reverse: false,
                    left: false,
                    right: false,
                    break: false
                }
            }
        });
    }

    updateControls(controls) {
        this.worker.postMessage({
            type: 'update',
            data: { controls }
        });
    }

    // Stop the ticker
    pause() {
        if (this.worker && !this.paused) {
            this.worker.postMessage({ type: 'stop' });
            this.paused = true;
            
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    // Clean up resources
    stop() {
        if (this.worker) {
            this.pause();
            this.worker.terminate();
            this.worker = null;
        }

        cancelAnimationFrame(this.animationFrame);
    }

    #draw() {
        const now = performance.now();
        this.mspf = now - this.lastAnimationFrameTime;
        this.lastAnimationFrameTime = now;

        checkDev();

        $("fpsDebug").innerText = `${(1000 / this.mspf).toFixed(2)}`;
        $("tpsDebug").innerText = `${(100000 / this.mspt.reduce((a, b) => a + b)).toFixed(2)}`;

        carCanvas.width = window.innerWidth;
        carCanvas.height = window.innerHeight;
    
        carCtx.msImageSmoothingEnabled = false;
        carCtx.mozImageSmoothingEnabled = false;
        carCtx.webkitImageSmoothingEnabled = false;
        carCtx.imageSmoothingEnabled = false;
    
        carCtx.save();

        carCtx.translate(-this.cars[0].x + carCanvas.width/2, -this.cars[0].y + carCanvas.height/2);

        /*this.cars.forEach(car => {
            car.draw(carCtx);
        });*/
        this.cars[0].draw(carCtx);

        carCtx.restore();

        this.animationFrame = requestAnimationFrame(this.#draw.bind(this));
    }

    // Initialises the game state
    #setGame(numCars, mapDifficulty, carDifficulty, cars = []) {
        // For multiplayer games, cars are made by the server and sent to the client
        /*if (cars) {
            for (let i = 0; i < numCars; i++) {

            }
        } else {
            this.cars = [];
            for (let i = 0; i < numCars; i++) {
                this.cars.push(new Car(0, 0));
            }
        }*/
        
        this.cars.push(new PlayerCar(0, 0));
    }
}