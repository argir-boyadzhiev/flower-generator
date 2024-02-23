function getLeafEdgeHorizontalOffset(k, leafParams) { // k is from 0 to 1
    var p0 = [0,0];
    var p1 = [leafParams.edgeP1x, leafParams.edgeP1y];
    var p2 = [leafParams.edgeP2x, leafParams.edgeP2y];
    var p3 = [1,0];
    var p = bezier2(p0, p1, p2, p3, k);
    p[0] *= leafParams.size * 20;
    return p;
}

function getLeafPlain(k, leafParams) {
    var p0 = [0,0];
    var p1 = [leafParams.plainP1x, leafParams.plainP1y];
    var p2 = [leafParams.plainP2x, leafParams.plainP2y];
    var p3 = [1, leafParams.plainP3y];
    var p = bezier2(p0, p1, p2, p3, k);
    p[0] *= leafParams.size * 20;
    p[1] *= leafParams.size * 20;
    return p;
}

function getLeafTilt(k, leafParams) {
    var p0 = 0;
    var p1 = leafParams.tiltP1;
    var p2 = leafParams.tiltP2;
    var p3 = leafParams.tiltP3;
    var p = bezier1(p0, p1, p2, p3, k);
    return p * 5;
}

function generateLeafs() {
    var leafParams = new Object;
    leafParams.size = random(0.5, 1.0);
    leafParams.edgeP1x = random(0.1, 0.9);
    leafParams.edgeP2x = random(0.1, 0.9);
    leafParams.edgeP1y = random(0.1, 0.2);
    leafParams.edgeP2y = random(0.1, 0.2);

    leafParams.plainP1x =  random(0.1, 0.9);
    leafParams.plainP2x = random(0.1, 0.9);
    leafParams.plainP1y = random(-0.5, 0.5);
    leafParams.plainP2y = random(-0.5, 0.5);
    leafParams.plainP3y = random(-0.3, 0.3);

    leafParams.tiltP1 = random(-0.1, 0.1);
    leafParams.tiltP2 = random(-0.2, 0.2);
    leafParams.tiltP3 = random(-0.5, 0.5);

    for (var leafSide = 1; leafSide > -2; leafSide -= 2) {
        for (var i = 0; i < leafPrecision; i++) { // Forward
            var leafEdgeLower = getLeafEdgeHorizontalOffset(i/leafPrecision, leafParams);
            var leafEdgeHigher = getLeafEdgeHorizontalOffset((i+1)/leafPrecision, leafParams);
            var zOffsetFromTiltLower = getLeafTilt(i/leafPrecision, leafParams);
            var zOffsetFromTiltHigher = getLeafTilt((i+1)/leafPrecision, leafParams);
            for (var j = 0; j < leafPrecision; j++) { // Width
                var leafPlainLeftLower = getLeafPlain(((j/leafPrecision) * leafEdgeLower[1] * -1) + 1, leafParams);
                var leafPlainRightLower = getLeafPlain((((j+1)/leafPrecision) * leafEdgeLower[1] * -1) + 1, leafParams);
                var leafPlainLeftHigher = getLeafPlain(((j/leafPrecision) * leafEdgeHigher[1] * -1) + 1, leafParams);
                var leafPlainRightHigher = getLeafPlain((((j+1)/leafPrecision) * leafEdgeHigher[1] * -1) + 1, leafParams);

                // p3 p2
                // p0 p1
                var p0x = leafPlainLeftLower[0];
                var p0y = leafEdgeLower[0];
                var p0z = leafPlainLeftLower[1] + zOffsetFromTiltLower;

                var p1x = leafPlainRightLower[0];
                var p1y = leafEdgeLower[0];
                var p1z = leafPlainRightLower[1] + zOffsetFromTiltLower;

                var p2x = leafPlainRightHigher[0];
                var p2y = leafEdgeHigher[0];
                var p2z = leafPlainRightHigher[1] + zOffsetFromTiltHigher;

                var p3x = leafPlainLeftHigher[0];
                var p3y = leafEdgeHigher[0];
                var p3z = leafPlainLeftHigher[1] + zOffsetFromTiltHigher;

                var uLeft = j/leafPrecision;
                var uRight = (j+1)/leafPrecision;
                var vLower = i/leafPrecision;
                var vHigher = (i+1)/leafPrecision;

                leafVertexData.push(p0x * leafSide, p0y, p0z); leafVertexData.push(uLeft, vLower);
                leafVertexData.push(p1x * leafSide, p1y, p1z); leafVertexData.push(uRight, vLower);
                leafVertexData.push(p3x * leafSide, p3y, p3z); leafVertexData.push(uLeft, vHigher);

                leafVertexData.push(p1x * leafSide, p1y, p1z); leafVertexData.push(uRight, vLower);
                leafVertexData.push(p2x * leafSide, p2y, p2z); leafVertexData.push(uRight, vHigher);
                leafVertexData.push(p3x * leafSide, p3y, p3z); leafVertexData.push(uLeft, vHigher);
            }
        }
    }
}

function generateLeafPlacements() {
    leafPlacementType = Math.ceil(random(0,4));
    switch(leafPlacementType) {
        // [horizontalAngle, verticalAngle, stemPlace, size] 
        case 1: // Inlined pairs going upward
            leafPlacements[0] = [0, 45, 0, 1];
            leafPlacements[1] = [180, 45, 0, 1];
            leafPlacements[2] = [0, 45, 6, 0.5];
            leafPlacements[3] = [180, 45, 6, 0.5];
            leafPlacements[4] = [0, 45, 12, 0.1];
            leafPlacements[5] = [180, 45, 12, 0.1];
            break;
        case 2: // Rotated pairs going upward
            leafPlacements[0] = [0, 45, 0, 1];
            leafPlacements[1] = [180, 45, 0, 1];
            leafPlacements[2] = [60, 45, 6, 0.5];
            leafPlacements[3] = [240, 45, 6, 0.5];
            leafPlacements[4] = [120, 45, 12, 0.1];
            leafPlacements[5] = [300, 45, 12, 0.1];
            break;
        case 3: // Shifting singles
            leafPlacements[0] = [0, 45, 0, 1];
            leafPlacements[1] = [180, 45, 6, 0.5];
            leafPlacements[2] = [0, 45, 12, 0.1];
            break;
        case 4: // Rotating singles
            leafPlacements[0] = [0, 45, 0, 1];
            leafPlacements[1] = [60, 45, 6, 0.5];
            leafPlacements[2] = [120, 45, 12, 0.1];
            break;
    }
    
    for (var i = 0; i < leafPlacements.length; i++) {
        // make some random offsed to the params so it looks more natural
        leafPlacements[i][0] += random(-5,5);
        leafPlacements[i][1] += random(-3,3);
        leafPlacements[i][2] += random(-0.2,0.2);
        leafPlacements[i][3] += leafPlacements[i][3] * random(-0.05,0.05);
    }
}

function drawLeafs(animationTime) {
    gl.uniform1i(uPlantPart, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, leafBuffer);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 4*5, 0);
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 4*5, 4*3);
    var stemAnimationTime = animationTime < 0.5 ? animationTime * 2 : 1
    for (var i = 0; i < leafPlacements.length; i++) {
        drawLeaf(leafPlacements[i][0], leafPlacements[i][1], leafPlacements[i][2] * getNonlinearAnimationTime(stemAnimationTime), leafPlacements[i][3] * getNonlinearAnimationTime(animationTime));
    }
}

function drawLeaf(horizontalAngle, verticalAngle, stemPlace, size) {
    pushMatrix();
    translate([0,0,stemPlace]);
    zRotate(horizontalAngle);
    xRotate(-verticalAngle);
    scale([size,size,size]);
    useMatrix();
    gl.drawArrays(gl.TRIANGLES, 0, leafPrecision * leafPrecision * 2 * 6);
    popMatrix();
}