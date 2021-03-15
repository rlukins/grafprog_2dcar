import * as THREE from 'three';
class Main {
	
    constructor() {
        this.scene = new THREE.scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        
    }

    animate() {
        this.controls.update();
        requestAnimationFrame(() => this.animate());
        let tick = this.clock.getElapsedTime() / 10;
        const now = new Date();
        const delta = now - this.lastTick;
        this.lastTick = now;
        this.physics.simulate(delta / 10000000);
        this.planets.animate(tick);
        this.renderer.render(this.scene, this.camera);
    }
}

(new Main())