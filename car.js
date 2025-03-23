class Car{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 47;
        this.height = 100;

        this.rad = Math.hypot(this.width, this.height)/2;
        this.alpha = Math.atan2(this.width, this.height);

        this.polygon = this.#createPolygon();

        this.speed = 0;
        this.velocity = {x: 0, y: 0};
        this.resistance = 0.02;
        this.angle = 0;
        this.damaged = 0;

        this.controls = {
            forward: false,
            reverse: false,
            left: false,
            right: false,
            break: false,
        };
    }

    update(tiles, traffic) {
        this.polygon = this.#createPolygon();
        this.#move();
    }

    #createPolygon() {
        const points = [];
        points.push({
            x:this.x - Math.sin(this.angle - this.alpha) * this.rad,
            y:this.y - Math.cos(this.angle - this.alpha) * this.rad
        });
        points.push({
            x:this.x - Math.sin(this.angle + this.alpha) * this.rad,
            y:this.y - Math.cos(this.angle + this.alpha) * this.rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle - this.alpha) * this.rad,
            y:this.y - Math.cos(Math.PI + this.angle - this.alpha) * this.rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle + this.alpha) * this.rad,
            y:this.y - Math.cos(Math.PI + this.angle + this.alpha) * this.rad
        });
        return points;
    }

    #move(){
        this.acceleration = 0.07 * (1 - (this.damaged/4));

        // Apply acceleration based on controls
        if (this.controls.forward) {
            this.velocity.x += Math.sin(this.angle) * this.acceleration;
            this.velocity.y += Math.cos(this.angle) * this.acceleration;
        }
        if (this.controls.reverse) {
            this.velocity.x -= Math.sin(this.angle) * (this.acceleration/1.125);
            this.velocity.y -= Math.cos(this.angle) * (this.acceleration/1.125);
        }
        
        let speed = Math.hypot(this.velocity.x, this.velocity.y);
        
        if (this.controls.break) {
            if (speed > 0) {
                const breakFactor = 0.1;
                this.velocity.x *= (1 - breakFactor);
                this.velocity.y *= (1 - breakFactor);
            }
        }

        // Apply friction
        this.velocity.x *= (1 - this.resistance);
        this.velocity.y *= (1 - this.resistance);

        speed = Math.hypot(this.velocity.x, this.velocity.y);
        
        // Stop completely if moving very slowly
        if (Math.abs(speed) < this.resistance) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            speed = 0;
        }

        if (speed != 0) {
            // Handle turning
            const flip = (this.velocity.x * Math.sin(this.angle) + this.velocity.y * Math.cos(this.angle)) > 0 ? 1 : -1;
                
            if(this.controls.left) {
                this.angle += 0.035 * flip;
                // Adjust velocity direction when turning
                this.#rotateVelocity(0.035 * flip);
            }
            if(this.controls.right) {
                this.angle -= 0.035 * flip;
                // Adjust velocity direction when turning
                this.#rotateVelocity(-0.035 * flip);
            }
        }

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    
    #rotateVelocity(angle) {
        // Rotate velocity vector when turning
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const vx = this.velocity.x * cos - this.velocity.y * sin;
        const vy = this.velocity.x * sin + this.velocity.y * cos;
        this.velocity.x = vx;
        this.velocity.y = vy;
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        if (!this.isPlayer) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        }
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.sin(this.angle) * this.width * 2, this.y - Math.cos(this.angle) * this.width * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.speed * Math.sin(this.angle) * 10, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.speed * Math.cos(this.angle) * 10);
        ctx.stroke();
        if (this.collided) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.collided[1].x, this.collided[1].y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }

        /*if (showVelocity) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.speed * Math.sin(this.angle) * 10, this.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - this.speed * Math.cos(this.angle) * 10);
            ctx.stroke();

        }

        if (showPolygon) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
            for (let i = 1; i < this.polygon.length; i++) {
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        if (showCollided && this.collided) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.collided[1].x, this.collided[1].y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }*/

        ctx.restore();
    }
}

class PlayerCar extends Car {
    constructor(x, y) {
        super(x, y);
    }

    update(tiles, traffic, controls) {
        super.update(tiles, traffic);
        this.controls = controls;
    }
}