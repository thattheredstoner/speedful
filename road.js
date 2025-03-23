class Road {
    constructor(tileCount) {
        this.map = [];
        this.tileCount = tileCount;

        this.width = 640;
        this.height = 640;

        this.offset = 128;

        this.laneCount = 2;
    }

    generateTiles(difficulty) {
        this.map = [];

        let tileCount = this.tileCount;

        let currentXTile = 0;
        let currentYTile = 0;

        this.map[0] = new RoadTile(currentXTile, currentYTile, this.width, this.height, this.offset, 0, 0, false, 0);

        currentYTile++;

        
    }

    getLaneCenter(laneIndex) {
        const laneWidth = (this.width - this.offset - 250)/this.laneCount;
        return (-this.width + this.offset + 250)/2 + laneWidth/2 + laneIndex * laneWidth;
    }

    draw(ctx, mapCtx) {
        let offset_tile = window.innerHeight * 3.5;
        for (var i = 0; i < road.tileCount; i++) {
            // Check if tile is visible
            if (this.map[i].x + this.width < car.x - offset_tile || this.map[i].x - this.width > car.x + offset_tile || this.map[i].y + this.height < car.y - offset_tile || this.map[i].y - this.height > car.y + offset_tile) continue;
            this.map[i].draw(ctx, mapCtx);
        }
    }
}