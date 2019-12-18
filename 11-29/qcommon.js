( function( ) {
      Math.clamp = function(val,min,max) {
          return Math.min(Math.max(val,min),max);
      } 
} )();

function createDashboard(){
  ////////////////////////////////////////////////////////
  renderer.autoClear = false;
  sceneHUD = new THREE.Scene();

  whRatio = window.innerWidth / window.innerHeight;
  halfH = 10;
  halfW = whRatio * halfH;

  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  let omegaTurn = loader.load('https://i.imgur.com/TNNXgJr.png');
  omegaTurn.wrapS = THREE.RepeatWrapping


  var circle = [], circle2 = [], circle3 = [],dash=[];

  for (i = 0; i < 4; i++) {
    dash[i]=new THREE.Mesh(new THREE.RingGeometry( 2, 2.2, 32, 8, -0.9, 4.9), new THREE.MeshPhongMaterial( { color:0xF8F8ff} )); 
    circle[i] = new THREE.Mesh(new THREE.CircleGeometry(2, 80, -0.9, 4.9), new THREE.MeshPhongMaterial({
    color:0xD0e9ff,
    side: THREE.DoubleSide
    }));
  circle2[i] = new THREE.Mesh(new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 4.9), new THREE.MeshPhongMaterial( { color: 0x1742ab, side: THREE.DoubleSide,map:omegaTurn } ));
  circle3[i] = new THREE.Mesh(new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 0.7), new THREE.MeshPhongMaterial( { color: 0xab1d17, side: THREE.DoubleSide } )); ////////红色末标
  if(i == 0 || i == 2)circle2[i].material.color.setHex( 0xcfc754 );
  }

  var pointerer = [], dashBoard = [],point=[];
  
  for (i = 0; i < 4; i++) {
    pointer[i] = new THREE.Group();
    dashBoard[i] = new THREE.Group();
    pointerer[i] = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.1), new THREE.MeshPhongMaterial({
      color: 0xff0000
    }))

    point[i]=new THREE.Mesh(new THREE.CircleGeometry( 0.2, 32 ), new THREE.MeshPhongMaterial({
      color: 0x000000
    }))
    pointerer[i].add(point[i]);
    point[i].position.set(1,0,0);
    pointer[i].add(pointerer[i])
    dashBoard[i].add(circle[i], circle2[i], pointer[i],dash[i],circle3[i])
  }
  

  var lighthud = new THREE.DirectionalLight( 0xffffff, 1 ); // soft white light
  lighthud.position.set(10,10,50);


  sceneHUD.add(dashBoard[0], dashBoard[1], dashBoard[2], dashBoard[3],lighthud)

  dashBoard[0].position.set(-halfW / 2.5, -(halfH - halfW / 10), 0)
  dashBoard[1].position.set(-halfW / 8, -(halfH - halfW / 10), 0)
  dashBoard[2].position.set(halfW / 8, -(halfH - halfW / 10), 0)
  dashBoard[3].position.set(halfW / 2.5, -(halfH - halfW / 10), 0)
  for (i = 0; i < 4; i++) {
  pointer[i].position.z = 0.3
  //pointerer[i].position.y=0.2;
  circle2[i].position.z = 0.1
  circle3[i].position.z = 0.2
  pointerer[i].position.x = -1
  }
  ////////////////////////////////////////////////////////////////////
  var Text2D = THREE_Text.MeshText2D;
  var SpriteText2D = THREE_Text.SpriteText2D;
  var textAlign = THREE_Text.textAlign;
  var sprites=[];

  for (i = 0; i < 4; i++) {
    sprite[i] = new SpriteText2D("0", {
      align: textAlign.center,
      font: '80px Monospace',
      fillStyle: '0x3d59ab',
      antialias: true
    });
    sprite[i].scale.set(0.005, 0.005, 0.005);

    sprites[i] = new SpriteText2D("RPM", {
      align: textAlign.center,
      font: '80px Monospace',
      fillStyle: '0x3d59ab',
      antialias: true
    });
    sprites[i].scale.set(0.005, 0.005, 0.005);

    dashBoard[i].add(sprite[i],sprites[i])
    sprite[i].position.y = 1;
    sprites[i].position.y=0.55;
  }



}




function builddrone(){
  airplane = new THREE.Object3D();
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  texture = loader.load('https://i.imgur.com/qr8kAad.png');
  baby=loader.load('https://i.imgur.com/7t3Nvhs.png');

  var box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.7), new THREE.MeshPhongMaterial({
    color: 0x555555, 
    map: texture
  }));
  box.castShadow = true;
  box.receiveShadow = true; 
  var logo= new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.7), new THREE.MeshPhongMaterial({
  color:0xece7e7,
  map: baby,
  side: THREE.DoubleSide
  }));
  airplane.add(box);
  box.add(logo);
  logo.position.y=.101;
  logo.rotation.x=-Math.PI/2;
  sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.015, 32, 32 ), new THREE.MeshPhongMaterial( {color: 0xFF3030} ) );
  box.add(sphere);
  sphere.position.set(0,0,0.35)

  spherelight = new THREE.PointLight (0xFF3030,1, 0.5);
  scene.add (spherelight)
  var ambientLight = new THREE.AmbientLight(0xfffffff);
  ambientLight.intensity=0.5;
  scene.add(ambientLight);

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
for (i=0;i<4;i++){
  boxLinks[i].castShadow = true;
  boxLinks[i].receiveShadow = true; 
}
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
  for (i=0;i<4;i++){
  motorSides[i].castShadow = true;
  motorSides[i].receiveShadow = true; 
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

    for (i=0;i<4;i++){
  motorCenters[i].castShadow = true;
  motorCenters[i].receiveShadow = true; 
}
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
      for (i=0;i<4;i++){
  motorCenters2[i].castShadow = true;
  motorCenters2[i].receiveShadow = true; 
}
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
for (i=0;i<8;i++){
  motorLinks[i].castShadow = true;
  motorLinks[i].receiveShadow = true; 
}

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
  airplane.add(new THREE.AxesHelper (2));
  return airplane;
}



function buildScene() {

	//scene.add (new THREE.GridHelper (100,100, 'white', 'white'));
  //scene.add (new THREE.AxesHelper (5));  
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  var  texture = loader.load('https://img.freepik.com/free-vector/wood-planks-texture-background-parquet-flooring_1048-2145.jpg?size=338&ext=jpg');
  texture.repeat.set(20, 20);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  let tree = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 10, 30), new THREE.MeshNormalMaterial() );
  let atree;
  atree = tree.clone();
  atree.position.set(15, 5, 30);
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshPhongMaterial({map:texture}));
  scene.add (plane);
  plane.receiveShadow = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-0.1

  atree = tree.clone();
  atree.position.set(-20, 5, 10);
  //	scene.add (atree);
  atree = tree.clone();
  atree.position.set(35, 5, -10);
  //scene.add (atree);
  atree = tree.clone();
  atree.position.set(-10, 5, -40);
  //scene.add (atree);
 // scene.background = cubeMap;
}

var circles=[];
var light2,sphere,spherelight;

function buildObstacle(){
   var geometry = new THREE.TorusGeometry( 1.5, 0.04, 16, 100 );
   var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
   var circle = new THREE.Mesh( geometry, material );
   circles[0]=circle.clone();
   circles[1]=circle.clone();
   circles[2]=circle.clone();
//   scene.add( circles[0],circles[1],circles[2]);
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

function builddroneCannon(){

  var boxShape = new CANNON.Box(new CANNON.Vec3(SIZE*0.3, SIZE*0.2, SIZE*0.7));
  dronebody = new CANNON.Body({ mass: 5 });
  dronebody.addShape(boxShape);
  dronebody.position.set(0,1,0);

  var cylinderShape = new CANNON.Cylinder(SIZE*0.4, SIZE*0.4, SIZE*0.05,50);

  dronebody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1,0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1, -0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1,-0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1, 0.4*SIZE));
  return dronebody;

}
function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,-10,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
  var groundMaterial = new CANNON.Material("groundMaterial");

	// create airplane body
	body =builddroneCannon();
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
	camera.position.z =2;
	camera.position.y =5;


  upcamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  upcamera.position.z =2;
  upcamera.position.y =5;

  light2 = new THREE.SpotLight(0xffffff, 1);
  light2.position.set(-10, 40, -10);
  light2.angle = Math.PI/5;
  light2.penumbra = 1
   scene.add(light2);
   light2.intensity=0.5;
  light2.castShadow = true;
  light2.shadow.mapSize.width = 1024;
  light2.shadow.mapSize.height = 1024;
  light2.shadow.camera.near = 10;
  light2.shadow.camera.far = 200;
  light2.shadow.camera.fov = light2.angle / Math.PI * 180 * 2;

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(0x888888);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	let controls = new THREE.OrbitControls(camera, renderer.domElement); 
	controls.enableKeys = false;
	
	buildScene();
  buildObstacle();
	//////////////////////////////////////////////////////
 

  




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


  scene.add(builddrone());
     curve = drawHermiteCurve(new THREE.Vector3(0, 5, 0), // q0
    new THREE.Vector3(5,0,0), //T1 
    new THREE.Vector3(5,5,-5), // q2
    new THREE.Vector3(0, 0, -5)); // T2
    //scene.add(curve);

}
