import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import carModel from './assets/car2.gltf';
import skybox from './assets/skybox.jpeg';
import asphalt from './assets/asphalt.jpg';

class Main {
    moveF = false;
    moveB = false;
    turnL = false;
    turnR = false;
    velocity = new THREE.Vector3();
    cube;
    cube2;
    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 4;
        this.camera.position.x = 3;
        this.camera.position.y = 2;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer = renderer;
        document.body.appendChild(renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;

        this.loader = new GLTFLoader();

        this.createEvents();
        this.createCube();
        this.createFloor();
        this.createCar();
        this.createLights();
        this.createBackground();
        this.animate();
    }

    createEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        document.addEventListener( 'keydown', (event) => {
            switch (event.code) {
                case "KeyW":
                    this.moveF = true;
                    break;
                case "KeyA":
                    this.turnL = true;
                    break;
                case "KeyS":
                    this.moveB = true;
                    break;
                case "KeyD":
                    this.turnR = true;
                    break;
            }
        });

        document.addEventListener( 'keyup', (event) => {
            switch (event.code) {
                case "KeyW":
                    this.moveF = false;
                    this.velocity.set(0,0,0);
                    break;
                case "KeyA":
                    this.turnL = false;
                    this.velocity.set(0,0,0);
                    break;
                case "KeyS":
                    this.moveB = false;
                    this.velocity.set(0,0,0);
                    break;
                case "KeyD":
                    this.turnR = false;
                    this.velocity.set(0,0,0);
                    break;
            }
        });
    }

    createCube() {
        const cubegeometry = new THREE.BoxGeometry();
        const cubematerial = new THREE.MeshBasicMaterial({ color: 0x136312 });
        const cubematerial2 = new THREE.MeshBasicMaterial({ color: 0x132312 });
        this.cube = new THREE.Mesh(cubegeometry, cubematerial);
        this.cube2 = new THREE.Mesh(cubegeometry, cubematerial2);
        this.cube.position.set(1, 1, -2);
        this.cube2.position.set(1, 1, 2);
        this.scene.add(this.cube);
        this.scene.add(this.cube2);
    }
    createFloor() {
        const floorgeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);

        const floorTexture = new THREE.TextureLoader().load(asphalt);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(100, 100);
        floorTexture.encoding = THREE.sRGBEncoding;

        const floormaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
        const floor = new THREE.Mesh(floorgeometry, floormaterial);
        floor.material.side = THREE.DoubleSide;
        floor.rotation.x = Math.PI / 2;
        floor.rotation.y = 0;
        floor.rotation.z = 0;
        this.scene.add(floor);
    }

    createCar() {
        this.loader.load(carModel, (gltf) => {
            const material = new THREE.MeshStandardMaterial({ color: 0x342523 });
            this.car = gltf.scene;
            this.car.scale.x = 1;
            this.car.scale.y = 1;
            this.car.scale.z = 1;
            this.car.traverse((child) => {
                if (child.isMesh) child.material = material;
                this.scene.add(this.car);
            });
        }, undefined, function (error) {
            console.error(error);
        });
    }
    
    createLights() {
        const light = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
        directionalLight.position.set(8, 1, 1);
        this.scene.add(light);
        this.scene.add(directionalLight);
    }

    createBackground() {
        const geometry = new THREE.SphereGeometry(2000, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(skybox),
            side: THREE.DoubleSide
        });
        this.skysphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.skysphere);
    }
   
    animate() {
        requestAnimationFrame(() => this.animate());
        if(this.moveF == true) {
            this.velocity.setX(0.03);
        }
        if(this.turnR == true) {
            this.velocity.setY(-0.01);
        }
        if(this.moveB == true) {
            this.velocity.setX(-0.03);
        }
        if(this.turnL == true) {
            this.velocity.setY(0.01);
        }
        this.car.translateX(this.velocity.x);
        this.car.rotateY(this.velocity.y);
        this.renderer.render(this.scene, this.camera);
    }
}

(new Main());