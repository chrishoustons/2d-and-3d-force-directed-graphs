function MakeOrbit(inclination)
{



    var curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        2, 2,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0              // aRotation
    );

    var points = curve.getPoints( 24 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    geometry.rotateX(Math.PI/2);
    geometry.rotateX(DegToRad(inclination));
    var material = new THREE.LineBasicMaterial( { color : 0x00ff00} );


    // Create the final object to add to the scene
    return new THREE.Line( geometry, material );

}


function DegToRad(degrees)
{
    return degrees * (Math.PI/180);
}