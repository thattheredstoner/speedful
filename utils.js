// Description: Contains utility functions used throughout the game.

/**
 * Returns the element with the given id.
 * @param {string} id - The id of the element to return.
 * @returns {HTMLElement} The element with the given id.
 */
function $(id) {
    return document.getElementById(id);
}


/**
 * Linear interpolation between two values.
 * @param {number} min - The minimum number.
 * @param {number} max - The maximum number.
 * @param {number} t - The interpolation value between 0 and 1.
 * @returns {number} A number between min and max.
 */
function lerp(min, max, t){
    return min + (max - min) * t;
}

/**
 * Calculates the intersection point of two line segments.
 * @param {Object} A - Start point of first line segment with x and y properties.
 * @param {Object} B - End point of first line segment with x and y properties.
 * @param {Object} C - Start point of second line segment with x and y properties.
 * @param {Object} D - End point of second line segment with x and y properties.
 * @returns {Object|null} The intersection point with x, y, and offset properties, or null if no intersection.
 */
function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    if (bottom != 0){
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}


/**
 * Checks if two polygons intersect.
 * @param {Array<Object>} poly1 - First polygon as array of points with x and y properties.
 * @param {Array<Object>} poly2 - Second polygon as array of points with x and y properties.
 * @returns {Array} Array with first element being boolean whether polygons intersect, 
 *                  and second element (if intersection exists) being the intersection point.
 */
function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );
            if (touch){
                return [true, touch];
            }
        }
    }
    return [false];
}

/**
 * Returns a random key based on weighted probabilities.
 * @param {Object} spec - Object where keys are items and values are their weights.
 * @returns {*} A randomly selected key from the spec object.
 */
function weightedRand(spec) {
    var i, j, table=[];
    for (i in spec) {
        for (j = 0; j < spec[i] * 10; j++) {
            table.push(i);
        }
    }
    return table[Math.floor(Math.random() * table.length)];
}

/**
 * Formats milliseconds into a time string (HH:MM:SS or MM:SS).
 * @param {number} milliseconds - Time in milliseconds to format.
 * @returns {string} Formatted time string.
 */
function formatTime(milliseconds){
    var seconds = Math.floor((milliseconds / 1000) % 60);
    var minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    var hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

    var formattedTime = [
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
    ];

    if (hours != 0) formattedTime.unshift(hours.toString().padStart(2, "0"));

    return formattedTime.join(":");
}

/**
 * Creates and displays an alert message on the page with a close button.
 * @param {string} msg - The message to display.
 * @returns {void}
 */
function msg(msg) {
    let element = document.createElement("div");
    element.classList.add("alert");
    element.innerHTML = msg;
    let button = document.createElement("button");
    button.classList.add("closeAlertButton");
    button.innerHTML = "Close";
    button.onclick = function() {
        element.remove();
    }
    element.appendChild(button);
    document.body.appendChild(element);
}