var mouseInDrag = false;
var mouseData = new Object;
mouseData.inDrag = false;
mouseData.initX = 0;
mouseData.initY = 0;

var observer = new Object;
observer.horizontalAngle = Math.PI * 0.25;
observer.verticalAngle = Math.PI / 4; // From -Pi/2 to Pi/2
observer.distance = 70;
observer.position = [0,0,0];
observer.rotateSensitivity = 0.1;
observer.translateSensitivity = 0.5;
observer.center = [-10,-10,0];
observer.movingForward = false;
observer.movingBack = false;
observer.movingLeft = false;
observer.movingRight = false;
observer.movingUp = false;
observer.movingDown = false;

function recalculateObserverPosition(deltaTime) {
    var travelDistance = (deltaTime / 3) * observer.translateSensitivity;

    if (observer.movingForward != observer.movingBack) {
        var direction = -1;
        if (observer.movingBack) {
            direction = 1;
        }
        observer.center[1] += travelDistance * Math.cos(observer.horizontalAngle) * direction;
        observer.center[0] += travelDistance * Math.sin(observer.horizontalAngle) * direction;
    }

    if (observer.movingLeft != observer.movingRight) {
        var direction = -1;
        if (observer.movingLeft) {
            direction = 1;
        }
        observer.center[1] -= travelDistance * Math.sin(observer.horizontalAngle) * direction;
        observer.center[0] += travelDistance * Math.cos(observer.horizontalAngle) * direction;
    }

    if (observer.movingUp != observer.movingDown) {
        var direction = -1;
        if (observer.movingUp) {
            direction = 1;
        }
        observer.center[2] += travelDistance *  direction;
    }

    var x = Math.sin(observer.horizontalAngle) * Math.cos(observer.verticalAngle) * observer.distance;
    var y = Math.cos(observer.horizontalAngle) * Math.cos(observer.verticalAngle) * observer.distance;
    var z = Math.sin(observer.verticalAngle) * observer.distance;
    observer.position = [observer.center[0] + x, observer.center[1] + y, observer.center[2] + z];

}

function startDrag(x, y) {
    mouseData.inDrag = true;
    mouseData.initX = x;
    mouseData.initY = y;
}

function endDrag() {
    mouseData.inDrag = false;
}

function drag(x, y) {
    if (mouseData.inDrag) {
        var deltaX = x - mouseData.initX;
        var deltaY = y - mouseData.initY;
        mouseData.initX = x;
        mouseData.initY = y;

        observer.horizontalAngle += ((deltaX / 200) * observer.rotateSensitivity) * Math.PI;
        var verticalDelta = ((deltaY / 200) * observer.rotateSensitivity) * Math.PI
        
        if (observer.verticalAngle + verticalDelta < Math.PI / 2
            && observer.verticalAngle + verticalDelta > - Math.PI / 2) {
            observer.verticalAngle += verticalDelta;
        }
    }
}

function mouseStartDrag(event) {
    startDrag(event.clientX-gl.canvas.offsetLeft, event.clientY-gl.canvas.offsetTop);
}

function touchStart(event) {
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
}

function mouseDrag(event) {
    drag(event.clientX-gl.canvas.offsetLeft, event.clientY-gl.canvas.offsetTop);
}

function touchMove(event) {
    drag(event.touches[0].clientX, event.touches[0].clientY);
}

function zoom(event) {
    observer.distance += event.deltaY * 0.1;
    if (observer.distance < 0.01)
        observer.distance = 0.01;
}

function translateObserverKeyDown(event) {
    switch (event.key) {
        case 'w': observer.movingForward = true; break;
        case 's': observer.movingBack = true; break;
        case 'a': observer.movingLeft = true; break;
        case 'd': observer.movingRight = true; break;
        case 'e': observer.movingUp = true; break;
        case 'q': observer.movingDown = true; break;
    }
        
}

function translateObserverKeyUp(event) {
    switch (event.key) {
        case 'w': observer.movingForward = false; break;
        case 's': observer.movingBack = false; break;
        case 'a': observer.movingLeft = false; break;
        case 'd': observer.movingRight = false; break;
        case 'e': observer.movingUp = false; break;
        case 'q': observer.movingDown = false; break;
    }
}