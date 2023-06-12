import './style.css'
import * as THREE from 'three';
import { ShaderNode, color, lights, toneMapping, MeshStandardNodeMaterial, PointsNodeMaterial } from 'three/nodes';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
var light1, light2, light3, light4, light5, light6;

initialisation()

function initialisation() {

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.setZ(0.5);

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  const sphereGeometry = new THREE.SphereGeometry( 0.02, 10, 10 );

  const addLight = ( hexColor, intensity = 1, distance = 1 ) => {

    const material = new MeshStandardNodeMaterial();
    material.colorNode = color( hexColor );
    material.lightsNode = lights();

    const mesh = new THREE.Mesh( sphereGeometry, material );

    const light = new THREE.PointLight( hexColor, intensity, distance );
    light.add( mesh );

    scene.add( light );
    
    return light;
  };

  light1 = addLight( 0xfffb00 );
  light2 = addLight( 0x0040ff );
  light3 = addLight( 0x783f04 );
  light4 = addLight( 0xFF0000 );
  light5 = addLight( 0x8300ff );
  light6 = addLight( 0x00ff7b );

  const allLightsNode = lights( [ light1, light2, light3, light4, light5, light6 ] );

  const points = [];

  for ( let i = 0; i < 30000; i ++ ) {
    const point = new THREE.Vector3().random().subScalar( 0.5 ).multiplyScalar( 2 );
    points.push( point );
  }

  const geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
  const materialPoints = new PointsNodeMaterial();

  const customLightingModel = new ShaderNode( ( inputs ) => {

    const { lightColor, reflectedLight } = inputs;

    reflectedLight.directDiffuse.addAssign( lightColor );
  } );

  const lightingModelContext = allLightsNode.context( 
    { lightingModelNode: { direct: customLightingModel } } 
  );

  materialPoints.lightsNode = lightingModelContext;

  const pointCloud = new THREE.Points( geometryPoints, materialPoints );
  scene.add( pointCloud );

  renderer = new WebGPURenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  renderer.toneMappingNode = toneMapping( THREE.LinearToneMapping, 1 );
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 0;
  controls.maxDistance = 3;

  window.addEventListener( 'resize', () =>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  } );
}

function animate() {

  const time = Date.now() * 0.002;
  const scale = 0.9;

  light1.position.x = Math.sin( time * 0.7 ) * scale;
  light1.position.y = Math.cos( time * 0.5 ) * scale;
  light1.position.z = Math.cos( time * 0.3 ) * scale;

  light2.position.x = Math.cos( time * 0.5 ) * scale;
  light2.position.y = Math.sin( time * 0.9 ) * scale;
  light2.position.z = Math.sin( time * 0.1 ) * scale;

  light3.position.x = Math.sin( time * 0.8 ) * scale;
  light3.position.y = Math.cos( time * 0.4 ) * scale;
  light3.position.z = Math.sin( time * 0.2 ) * scale;

  light4.position.x = Math.sin( time * 0.4 ) * scale;
  light4.position.y = Math.cos( time * 0.6 ) * scale;
  light4.position.z = Math.cos( time * 0.2 ) * scale;

  light5.position.x = Math.sin( time * 0.5 ) * scale;
  light5.position.y = Math.cos( time * 0.8 ) * scale;
  light5.position.z = Math.cos( time * 0.9 ) * scale;

  light6.position.x = Math.sin( time * 0.9 ) * scale;
  light6.position.y = Math.cos( time * 0.4 ) * scale;
  light6.position.z = Math.cos( time * 0.8 ) * scale;

  renderer.render( scene, camera );
}