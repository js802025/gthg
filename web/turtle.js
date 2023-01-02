import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var canvas = document.getElementById('c');

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({canvas: canvas});
			renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.physicallyCorrectLights = true;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.setClearColor( 0xcccccc );
            renderer.setPixelRatio( window.devicePixelRatio );;
            scene.background = new THREE.Color(0x212529);

            camera.position.z = 5;
            const pivot = new THREE.Group(); 
            scene.add(pivot);
            var turtle;
             const loader = new GLTFLoader()
            loader.load('https://firebasestorage.googleapis.com/v0/b/gthg-8b42f.appspot.com/o/turtle1.glb?alt=media&token=fda98c87-028f-4308-802b-3d79043833b4', function (gltf) {
                 turtle = gltf.scene || gltf.scenes[ 0 ];
               const box = new THREE.Box3().setFromObject(turtle);
               const size = box.getSize(new THREE.Vector3()).length();
               const center = box.getCenter(new THREE.Vector3());
               console.log(center);
                pivot.add(turtle);
               turtle.position.x += (turtle.position.x - center.x);
               turtle.position.y += (turtle.position.y - center.y);
               turtle.position.z += (turtle.position.z - center.z);
            
             //  camera.position.copy(center);
            //    camera.position.x += size / 2.0;
                camera.position.y += size / 5.0;
            //    camera.position.z += size / 2.0;
               camera.lookAt(center);
               camera.updateProjectionMatrix();
                const light1  = new THREE.AmbientLight( 0xFFFFFF, 1);
                light1.name = 'ambient_light';
                scene.add( light1 );
            
                const light2  = new THREE.DirectionalLight( 0xFFFFFF, 1 * Math.PI);
                light2.position.set(0.5, 0, 5); // ~60º
                light2.name = 'main_light';
                scene.add( light2 );
            
               animate();
            }, undefined, function (error) {
                console.error(error);
            });
            

            function animate() {
				requestAnimationFrame( animate );

				pivot.rotation.y += 0.01;
               

				renderer.render( scene, camera );
			};