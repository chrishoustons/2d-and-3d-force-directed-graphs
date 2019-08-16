var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.Color(0x000033);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.SphereGeometry( 1, 12, 6);
var material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set(2, 2, 2 );
scene.add( light );
camera.position.z = 5;
var orbit = MakeOrbit(64.95);
console.log(orbit);
scene.add(orbit);

var trackballControls = new THREE.TrackballControls(camera); 
trackballControls.rotateSpeed = 4.0; 
trackballControls.zoomSpeed = 1.0; 
trackballControls.panSpeed = 1.0; 

var clock = new THREE.Clock(); 
function render() { 
  var delta = clock.getDelta(); 
  trackballControls.update(delta); 
  requestAnimationFrame(render); 
  renderer.render(scene, camera); 
}  
render();

function animate() {
    
    cube.rotation.y += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();


