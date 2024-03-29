var gcontrols;
( function( ) {
      Math.clamp = function(val,min,max) {
          return Math.min(Math.max(val,min),max);
      } 
} )();

function buildScene() {

	scene.add (new THREE.GridHelper (100,100, 'white', 'white'));
	scene.add (new THREE.AxesHelper (5));  
	
	let tree = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 30), new THREE.MeshNormalMaterial() );
	let atree;
	atree = tree.clone();
	atree.position.set(15, 5, 30);
	let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color:0x777777}));
	scene.add (atree,plane);
	plane.rotation.x=-Math.PI/2;
	plane.position.y=-0.1
	atree = tree.clone();
	atree.position.set(-20, 5, 10);
	scene.add (atree);
	atree = tree.clone();
	atree.position.set(35, 5, -10);
	scene.add (atree);
	atree = tree.clone();
	atree.position.set(-10, 5, -40);
	scene.add (atree);
    let circle = new THREE.Mesh( new THREE.TorusGeometry(2.5,0.2,8,100), new THREE.MeshBasicMaterial(  ) );
    circle.position.set(10,5,-10)
    scene.add(circle);
}

function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,-10,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
    var groundMaterial = new CANNON.Material("groundMaterial");
	// create airplane body
	var boxShape = new CANNON.Box(new CANNON.Vec3(SIZE*0.2, SIZE*0.3, SIZE*1));
	body = new CANNON.Body({ mass: 5 });
	body.addShape(boxShape);
	body.position.set(0,1,0);

	var cylinderShape = new CANNON.Cylinder(SIZE*0.8, SIZE*0.8, SIZE*0.2,50);

	body.addShape(cylinderShape, new CANNON.Vec3( -1.0*SIZE, 0,SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3( -1.0*SIZE, 0, -SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3(  1.0*SIZE, 0,-SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3(  1.0*SIZE, 0, SIZE));
	world.addBody(body);
	let groundShape = new CANNON.Plane()
	let groundCM = new CANNON.Material()
	let groundBody = new CANNON.Body({
	mass: 0,
	shape: groundShape,
	material: groundCM
	})
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
	groundBody.position.y=-0.5;
	world.add(groundBody)	
}

function initThree() {
	clock = new THREE.Clock();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 10;
	camera.position.y = 3;
	scene.add( camera );

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(0x888888);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	let controls = new THREE.OrbitControls(camera, renderer.domElement); 
	controls.enableKeys = false;
	
	buildScene();
	//////////////////////////////////////////////////////
	airplane = new THREE.Object3D();
	let pro = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.05), new THREE.MeshBasicMaterial({color:0xffffff}));
	scene.add( airplane);
	let cylinder = [];		
	for(let i = 0 ; i < 4; i++){
	  cylinder[i] = new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,0.2, 50,2,true), 
		   new THREE.MeshBasicMaterial({color:0x0000cc,side:THREE.DoubleSide}))
	  cylinder[i].add(pro.clone());
	  airplane.add (cylinder[i]);
	}
	cylinder[0].material.color = new THREE.Color('purple')
	cylinder[2].material.color = new THREE.Color('purple')
	cylinder[1].material.color = new THREE.Color('red')
	cylinder[3].material.color = new THREE.Color('red')
	cylinder[0].position.set (-1.0*SIZE, 0, SIZE);
	cylinder[1].position.set (-1.0*SIZE, 0, -SIZE);
	cylinder[2].position.set ( 1.0*SIZE, 0, -SIZE);
	cylinder[3].position.set ( 1.0*SIZE, 0, SIZE);

	let mesh = new THREE.Mesh( new THREE.BoxGeometry(SIZE*0.4,SIZE*0.6,SIZE*2), new THREE.MeshNormalMaterial( {wireframe: true } ) );  
	airplane.add (new THREE.AxesHelper(5));
	airplane.add(mesh);
   

  	 gcontrols = new function() {
    this.rollP = 2.5;
    this.rollI = 0;
    this.rollD = 2;
    this.pitchP = 2.5;
    this.pitchI = 0;
    this.pitchD = 2;
  }
 
  var gui = new dat.GUI();
  gui.domElement.id = 'gui';

  var f1 = gui.addFolder("Roll");
  f1.add(gcontrols, 'rollP', 0, 100);
  f1.add(gcontrols, 'rollI', 0, 50);
  f1.add(gcontrols, 'rollD', 0, 100);
  var f2 = gui.addFolder("Pitch");
  f2.add(gcontrols, 'pitchP', 0, 100);
  f2.add(gcontrols, 'pitchI', 0, 50);
  f2.add(gcontrols, 'pitchD', 0, 100);
}

