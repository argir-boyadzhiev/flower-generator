function getStemRadius(k) {
    return  (1-k) * 0.2 + k * 0.05;
}

function generateStem() {
    for (var i = 0; i < stemPrecision; i++) { // Stem height
        var stemRadiusLower = getStemRadius(i/stemPrecision);
        var stemRadiusHigher = getStemRadius((i+1)/stemPrecision);
        for (var j = 0; j < stemPrecision; j++) { // Stem rings
            // p3 p2
            // p0 p1
            var p0x = Math.cos((j/stemPrecision) * Math.PI * 2) * stemRadiusLower;
            var p0y = Math.sin((j/stemPrecision) * Math.PI * 2) * stemRadiusLower;
            var p0z = (i/stemPrecision) * stemLength;

            var p1x = Math.cos(((j+1)/stemPrecision) * Math.PI * 2) * stemRadiusLower;
            var p1y = Math.sin(((j+1)/stemPrecision) * Math.PI * 2) * stemRadiusLower;
            var p1z = (i/stemPrecision) * stemLength;

            var p2x = Math.cos(((j+1)/stemPrecision) * Math.PI * 2) * stemRadiusHigher;
            var p2y = Math.sin(((j+1)/stemPrecision)  * Math.PI * 2) * stemRadiusHigher;
            var p2z = ((i+1)/stemPrecision) * stemLength;

            var p3x = Math.cos((j/stemPrecision) * Math.PI * 2) * stemRadiusHigher;
            var p3y = Math.sin((j/stemPrecision) * Math.PI * 2) * stemRadiusHigher;
            var p3z = ((i+1)/stemPrecision) * stemLength;

            stemVertexData.push(p0x, p0y, p0z);
            stemVertexData.push(p1x, p1y, p1z);
            stemVertexData.push(p3x, p3y, p3z);

            stemVertexData.push(p1x, p1y, p1z);
            stemVertexData.push(p2x, p2y, p2z);
            stemVertexData.push(p3x, p3y, p3z);
        }
    }
}

function drawStem(animationTime) {
    pushMatrix();
    scale([1,1,getNonlinearAnimationTime(animationTime)]);
    useMatrix();
    popMatrix();
    gl.uniform1i(uPlantPart, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, stemBuffer);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, stemPrecision * stemPrecision * 6);
}