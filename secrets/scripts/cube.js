let scene, camera, renderer, cube, raycaster, mouse, intersects, controls;
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        controls = {
            isMouseDown: false,
            prevMouseX: 0,
            prevMouseY: 0,
        };

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

        window.addEventListener('mousedown', (event) => {
            controls.isMouseDown = true;
            controls.prevMouseX = event.clientX;
            controls.prevMouseY = event.clientY;
        });

        window.addEventListener('mousemove', (event) => {
            if (controls.isMouseDown) {
                const deltaX = event.clientX - controls.prevMouseX;
                const deltaY = event.clientY - controls.prevMouseY;

                cube.rotation.x += deltaY * 0.01;
                cube.rotation.y += deltaX * 0.01;

                controls.prevMouseX = event.clientX;
                controls.prevMouseY = event.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            controls.isMouseDown = false;
        });
        function notActive() {
            if (cube.rotation.x > 0) {
                cube.rotation.x -= 0.01;
            }
            if (cube.rotation.y > 0) {
                cube.rotation.y -= 0.01;
            }
            if (cube.rotation.x < 0) {
                cube.rotation.x += 0.01;
            }
            if (cube.rotation.y < 0) {
                cube.rotation.y += 0.01;
            }

        }
        function animate() {
            requestAnimationFrame(animate);
            notActive();
            renderer.render(scene, camera);
        }
        

        animate();