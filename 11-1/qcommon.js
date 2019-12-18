( function( ) {
      Math.clamp = function(val,min,max) {
          return Math.min(Math.max(val,min),max);
      } 
} )();

function loadCubemap() {


var path = "https://threejs.org/examples/textures/cube/SwedishRoyalCastle/";
var format = '.jpg';
var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];

var loader = new THREE.CubeTextureLoader();
loader.setCrossOrigin ('');
var cubeMap = loader.load(urls);
cubeMap.format = THREE.RGBFormat;
return cubeMap;

}



function buildScene() {

	//scene.add (new THREE.GridHelper (100,100, 'white', 'white'));
	scene.add (new THREE.AxesHelper (5));  
	 let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
 var  texture = loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7q-bIPKu2mnIq4CVKe8IcPgqrOx0w2-KKJDIO8cHmwAnF-XI5');
  texture.repeat.set(20, 20);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
	let tree = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 10, 30), new THREE.MeshNormalMaterial() );
	let atree;
	atree = tree.clone();
	atree.position.set(15, 5, 30);
	let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color:0x777777,map:texture}));
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
  var cubeMap = loadCubemap();
 // scene.background = cubeMap;
}

var circles=[],curve;

function buildObstacle(){
   var geometry = new THREE.TorusGeometry( 1.5, 0.04, 16, 100 );
   var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
   var circle = new THREE.Mesh( geometry, material );
   circles[0]=circle.clone();
   circles[1]=circle.clone();
   circles[2]=circle.clone();
   scene.add( circles[0],circles[1],circles[2]);
   circles[0].position.set(5,5,-5);
   circles[1].position.set(8,5,-10);
   circles[2].position.set(-10,5,5);
   //circles[2].rotation.y=Math.PI/2;

}
function drawHermiteCurve(p1, t1, p2, t2) {
    var s, s2, s3, h1, h2, h3, h4;
    var pt = new THREE.Vector3();
    var material = new THREE.LineBasicMaterial({
        color: 0xffff00 // yellow
    });

    var geometry = new THREE.Geometry();

    for (s = 0; s <= 1; s += 0.1) {
        s2 = s * s;
        s3 = s2 * s;
        h1 = 2 * s3 - 3 * s2 + 1;
        h2 = -2 * s3 + 3 * s2;
        h3 = s3 - 2 * s2 + s;
        h4 = s3 - s2;

        pt.set(0, 0, 0);
        pt.add(p1.clone().multiplyScalar(h1));
        pt.add(p2.clone().multiplyScalar(h2));
        pt.add(t1.clone().multiplyScalar(h3));
        pt.add(t2.clone().multiplyScalar(h4));
        // pt.addScaledVector(p1, h1);  // no longer supported
       //console.log(pt);
        geometry.vertices.push(pt.clone());
    }

    return new THREE.Line(geometry, material);
}


function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,-10,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
    var groundMaterial = new CANNON.Material("groundMaterial");
	// create airplane body
	var boxShape = new CANNON.Box(new CANNON.Vec3(SIZE*0.3, SIZE*0.2, SIZE*0.7));
	body = new CANNON.Body({ mass: 5 });
	body.addShape(boxShape);
	body.position.set(0,1,0);

	var cylinderShape = new CANNON.Cylinder(SIZE*0.4, SIZE*0.4, SIZE*0.05,50);

	body.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1,0.4*SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1, -0.4*SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1,-0.4*SIZE));
	body.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1, 0.4*SIZE));
	world.addBody(body);
	let groundShape = new CANNON.Plane()
	let groundCM = new CANNON.Material()
	let groundBody = new CANNON.Body({
	mass: 0,
	shape: groundShape,
	material: groundCM
	})
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
	groundBody.position.y=-0.15;
	world.add(groundBody)	
}

function initThree() {
	clock = new THREE.Clock();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z =3;
	camera.position.y =2;
	scene.add( camera );
  var  light = new THREE.PointLight(0xffffff);
  light.position.set(20,200, 20);
  scene.add(light)
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(0x888888);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	let controls = new THREE.OrbitControls(camera, renderer.domElement); 
	controls.enableKeys = false;
	
	buildScene();
  buildObstacle();
	//////////////////////////////////////////////////////
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  airplane = new THREE.Object3D();
  texture = loader.load('https://i.imgur.com/qr8kAad.png');
  
  var box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.7), new THREE.MeshPhongMaterial({
    color: 0x555555, 
    map: texture
  }));
  airplane.add(box)
  //////////////////////////////////////////boxLinks
  let boxLinks = []
  for (i = 0; i < 4; i++) {
    boxLinks[i] = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.02), new THREE.MeshPhongMaterial({
      color: 0x333333,
      map: texture
    }));
    airplane.add(boxLinks[i])
  }
  boxLinks[0].position.set(-.25, 0, .3)
  boxLinks[0].rotation.y = Math.PI / 4
  boxLinks[1].position.set(-.25, 0, -.3)
  boxLinks[1].rotation.y = -Math.PI / 4
  boxLinks[2].position.set(.25, 0, -.30)
  boxLinks[2].rotation.y = Math.PI / 4
  boxLinks[3].position.set(.25, 0, .30)
  boxLinks[3].rotation.y = -Math.PI / 4
  //////////////////////////////////////////motorSides
  let motorSides = []
  material = new THREE.MeshPhongMaterial({
    color: 0x333333,
    side: THREE.DoubleSide,
    map: texture
  })
  motorSides[0] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 4, 2.5), material)
  motorSides[0].position.set(-.40, .10, .40)
  motorSides[1] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 2.8, 2.5), material)
  motorSides[1].position.set(-.40, .10, -.40)
  motorSides[2] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, 1, 2.5), material)
  motorSides[2].position.set(.40, .10, -.40)
  motorSides[3] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, -0.5, 2.5), material)
  motorSides[3].position.set(.40, .10, .40)
  for (i = 0; i < 4; i++) {
    airplane.add(motorSides[i])
  }
  //////////////////////////////////////////motorCenters
  let motorCenters = [], motorCenters2 = []
  for (i = 0; i < 4; i++) {
    motorCenters[i] = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .35, .50), new THREE.MeshPhongMaterial({
      color: 0xCCCCCC, 
      map: texture
    }));
    airplane.add(motorCenters[i])
  }
  motorCenters[0].position.set(-.40, 0, .40)
  motorCenters[1].position.set(-.40, 0, -.40)
  motorCenters[2].position.set(.40, 0, -.40)
  motorCenters[3].position.set(.40, 0, .40)
  for (i = 0; i < 4; i++) {
    motorCenters2[i] = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .30, 50, 2, true), new THREE.MeshPhongMaterial({
      color: 0x333333, 
      map: texture
    }));
    airplane.add(motorCenters2[i])
  }
  motorCenters2[0].position.set(-.40, -.05, .40)
  motorCenters2[1].position.set(-.40, -.05, -.40)
  motorCenters2[2].position.set(.40, -.05, -.40)
  motorCenters2[3].position.set(.40, -.05, .40)
  //////////////////////////////////////////motorLinks
  let motorLinks = []
  for (i = 0; i < 8; i++) {
    motorLinks[i] = new THREE.Mesh(new THREE.BoxGeometry(.45, .04, .02), new THREE.MeshPhongMaterial({
      color: 0x333333,
      map: texture
    }));
    airplane.add(motorLinks[i])
  }
  motorLinks[0].position.set(-.60, 0, .40)
  motorLinks[1].position.set(-.60, 0, -.40)
  motorLinks[2].position.set(.60, 0, -.40)
  motorLinks[3].position.set(.60, 0, .40)
  motorLinks[0].rotation.z = -Math.PI / 6
  motorLinks[1].rotation.z = -Math.PI / 6
  motorLinks[2].rotation.z = Math.PI / 6
  motorLinks[3].rotation.z = Math.PI / 6
  motorLinks[4].position.set(-.40, 0, .60)
  motorLinks[4].rotation.y = -Math.PI / 2
  motorLinks[4].rotation.x = -Math.PI / 6
  motorLinks[5].position.set(-.40, 0, -.60)
  motorLinks[5].rotation.y = -Math.PI / 2
  motorLinks[5].rotation.x = Math.PI / 6
  motorLinks[6].position.set(.40, 0, -.60)
  motorLinks[6].rotation.y = -Math.PI / 2
  motorLinks[6].rotation.x = Math.PI / 6
  motorLinks[7].position.set(.40, 0, .60)
  motorLinks[7].rotation.y = -Math.PI / 2
  motorLinks[7].rotation.x = -Math.PI / 6
  //////////////////////////////////////////motors
  
  motorTexture = loader.load('https://i.imgur.com/yCho2gY.png');
  let motors=[];
  for(i=0;i<4;i++){
    motors[i] = new THREE.Mesh(new THREE.PlaneGeometry(.75, .10), new THREE.MeshPhongMaterial({map:motorTexture,transparent: true, side:THREE.DoubleSide}))
    motors[i].rotation.x = -Math.PI / 2
    airplane.add(motors[i])	
  }
  motors[0].position.set(-.40, .10, .40)
  motors[1].position.set(-.40, .10, -.40)
  motors[2].position.set(.40, .10, -.40)
  motors[3].position.set(.40, .10, .40)
  scene.add(airplane);
  airplane.add(new THREE.AxesHelper (2))
 // airplane.scale.set(3,3,3);
	/*airplane = new THREE.Object3D();
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
	airplane.add(mesh);*/
     curve = drawHermiteCurve(new THREE.Vector3(0, 5, 0), // q0
    new THREE.Vector3(5,0,0), //T1 
    new THREE.Vector3(5,5,-5), // q2
    new THREE.Vector3(0, 0, -5)); // T2
    scene.add(curve);

}
