function getPetalZ(y) {
    return (Math.atan(y * 6 - 2) * 0.5 + 0.5) * 15;
}

var petalSize = 30;

function getPetalNormalSimpler(i) {
    var ip = i / petalPrecision;
    var i1p = (i+1) / petalPrecision;

    var zi = getPetalZ(ip) / 15;
    var zi1 = getPetalZ(i1p) / 15;
    var zDiff = zi1 - zi;
    
    var b = unitVector([0, 1/petalPrecision, zDiff]);
    var a = [1,0,0];

    var c = unitVector(vectorProduct(a, b));

    return [c[0], -c[1], c[2]];
}

function generatePetals() {
    for (var petalSide = 1; petalSide > -2; petalSide -= 2) {
        for (var i = 0; i < petalPrecision; i++) { // Forward
            for (var j = 0; j <= i; j++) { // Width
                // p3 p2
                // p0 p1

                var ip = i / petalPrecision;
                var i1p = (i+1) / petalPrecision;
                var jp = j / petalPrecision;
                var j1p = (j+1) / petalPrecision;

                var p0x = jp * petalSize;
                var p0y = ip * petalSize;
                var p0z = getPetalZ(ip);
                var n0 = getPetalNormalSimpler(i);

                var p1x = j1p * petalSize;
                var p1y = ip * petalSize;
                var p1z = getPetalZ(ip);
                var n1 = getPetalNormalSimpler(i);

                var p2x = j1p * petalSize;
                var p2y = i1p * petalSize;
                var p2z = getPetalZ(i1p);
                var n2 = getPetalNormalSimpler(i + 1);

                var p3x = jp * petalSize;
                var p3y = i1p * petalSize;
                var p3z = getPetalZ(i1p);
                var n3 = getPetalNormalSimpler(i + 1);

                var uLeft = jp;
                var uRight = j1p;
                var vLower = ip;
                var vHigher = i1p;

                petalVertexData.push(p0x * petalSide, p0y, p0z); petalVertexData.push(uLeft, vLower); petalVertexData.push(n0[0], n0[1], n0[2]);
                petalVertexData.push(p2x * petalSide, p2y, p2z); petalVertexData.push(uRight, vHigher); petalVertexData.push(n2[0], n2[1], n2[2]);
                petalVertexData.push(p3x * petalSide, p3y, p3z); petalVertexData.push(uLeft, vHigher); petalVertexData.push(n3[0], n3[1], n3[2]);

                if (j != i) {
                    petalVertexData.push(p0x * petalSide, p0y, p0z); petalVertexData.push(uLeft, vLower); petalVertexData.push(n0[0], n0[1], n0[2]);
                    petalVertexData.push(p1x * petalSide, p1y, p1z); petalVertexData.push(uRight, vLower); petalVertexData.push(n1[0], n1[1], n1[2]);
                    petalVertexData.push(p2x * petalSide, p2y, p2z); petalVertexData.push(uRight, vHigher); petalVertexData.push(n2[0], n2[1], n2[2]);
                }
            }
        }
    }

    numberOfPetals = Math.ceil(random(3, 12));
}

function drawPetal(horizontalAngle, widthAngle, size, verticalOffset) {
    pushMatrix();
    zRotate(horizontalAngle);
    translate([0,0,verticalOffset]);
    xRotate(-verticalOffset * 13);
    scale([widthAngle,size,size]);
    useMatrix();
    gl.drawArrays(gl.TRIANGLES, 0, petalPrecision * petalPrecision * 6);
    popMatrix();
}

function drawPetals(animationTime) {
    gl.uniform1i(uPlantPart, 3);
    gl.bindBuffer(gl.ARRAY_BUFFER, petalBuffer);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 4*8, 0);
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 4*8, 4*3);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 4*8, 4*5);

    pushMatrix();
    var size = 0.2 * getNonlinearAnimationTime(animationTime);
    translate([0,0,stemLength]);
    for (var i = 0; i < numberOfPetals; i++) {
        drawPetal((i / numberOfPetals) * 360, size * Math.tan(Math.PI / numberOfPetals) * 0.9, size, 0);
    }
    size *= 0.8;
    for (var i = 0; i < numberOfPetals; i++) {
        drawPetal(((i+0.5) / numberOfPetals) * 360, size * Math.tan(Math.PI / numberOfPetals) * 0.9, size, 0.5);
    }
    
    drawPetal(0, 0);
    drawPetal(90, 0);
    drawPetal(180, 0);
    drawPetal(270, 0);

    popMatrix();
}