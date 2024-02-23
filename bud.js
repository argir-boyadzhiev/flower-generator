function getBudRadius(k) {
    if (k < 0.5) {
        return k/0.5;
    }
    else {
        return Math.sqrt(1 - Math.pow(k*2 - 1, 2));
    }
}

function generateBud() {
    for (var i = 0; i < budPrecision; i++) { // Frond to end
        var radiusLower = getBudRadius(i/budPrecision) * 0.2;
        var radiusHigher = getBudRadius((i+1)/budPrecision) * 0.2;
        var zi = i/budPrecision;
        if (zi < 0.5) {
            zi = zi * 2 - 0.5;
        }
        var zi1 = (i+1)/budPrecision;
        if (zi1 < 0.5) {
            zi1 = zi1 * 2 - 0.5;
        }
        for (var j = 0; j < budPrecision; j++) { // Rings
            var jk = (j/budPrecision) * Math.PI * 2;
            var j1k = ((j+1)/budPrecision) * Math.PI * 2;

            // p3 p2
            // p0 p1
            var p0x = Math.cos(jk) * radiusLower;
            var p0y = Math.sin(jk) * radiusLower;
            var p0z = zi;

            var p1x = Math.cos(j1k) * radiusLower;
            var p1y = Math.sin(j1k) * radiusLower;
            var p1z = zi;

            var p2x = Math.cos(j1k) * radiusHigher;
            var p2y = Math.sin(j1k) * radiusHigher;
            var p2z = zi1;

            var p3x = Math.cos(jk) * radiusHigher;
            var p3y = Math.sin(jk) * radiusHigher;
            var p3z = zi1;

            budVertexData.push(p0x, p0y, p0z);
            budVertexData.push(p1x, p1y, p1z);
            budVertexData.push(p3x, p3y, p3z);

            budVertexData.push(p1x, p1y, p1z);
            budVertexData.push(p2x, p2y, p2z);
            budVertexData.push(p3x, p3y, p3z);
        }
    }
}

function drawBud(animationTime) {
    pushMatrix();
    translate([0,0, stemLength * getNonlinearAnimationTime(animationTime) - 0.5]);
    useMatrix();
    popMatrix();
    gl.uniform1i(uPlantPart, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, budBuffer);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, budPrecision * budPrecision * 6);
}