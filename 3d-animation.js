// Advanced Burj Khalifa Construction Animation
function initBurjKhalifaAnimation() {
    const container = document.getElementById('tool-container');
    if (!container) return;
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded.');
        return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0d1b2a, 100, 300);
    
    // Enhanced camera setup
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(40, 30, 40);
    
    // Enhanced renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.5);
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
    
    // Create Dubai skyline background
    createSkyline(scene);
    
    // Create desert ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4a574,
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Construction site foundation
    const foundation = createFoundation();
    scene.add(foundation);
    
    // Create multiple tower cranes
    const cranes = createConstructionCranes(scene);
    
    // Create construction materials piles
    createMaterialPiles(scene);
    
    // Burj Khalifa structure components
    const structure = {
        base: null,
        core: null,
        tiers: [],
        spire: null,
        facade: null
    };
    
    // Initialize structure
    initializeStructure(structure);
    
    // Add construction site vehicles
    createConstructionVehicles(scene);
    
    // Animation variables
    let animationTime = 0;
    const totalCycleTime = 60; // Longer cycle for more detailed stages
    let currentStage = 0;
    const stages = ['Foundation', 'Core Structure', 'Superstructure', 'Facade Installation', 'Finishing Works'];
    const stageText = document.getElementById('stage-text');
    
    // Construction progress parameters
    const constructionProgress = {
        foundation: 0,
        core: 0,
        superstructure: 0,
        facade: 0,
        spire: 0
    };
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (!container || !camera || !renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        animationTime += 0.016;
        const cycleTime = animationTime % totalCycleTime;
        
        // Update construction stage based on time
        updateConstructionStage(cycleTime);
        
        // Update stage text
        updateStageIndicator(cycleTime);
        
        // Animate construction progress
        updateConstructionProgress(cycleTime);
        
        // Update 3D models based on progress
        updateStructure(structure, constructionProgress);
        
        // Animate cranes
        animateCranes(cranes, animationTime);
        
        // Smooth camera movement
        updateCamera(camera, animationTime, constructionProgress);
        
        renderer.render(scene, camera);
    }
    
    // Construction stage management
    function updateConstructionStage(cycleTime) {
        const stageDuration = totalCycleTime / stages.length;
        currentStage = Math.floor(cycleTime / stageDuration);
        
        // Gradually progress through construction phases
        const stageProgress = (cycleTime % stageDuration) / stageDuration;
        
        switch(currentStage) {
            case 0: // Foundation
                constructionProgress.foundation = Math.min(stageProgress * 2, 1);
                break;
            case 1: // Core Structure
                constructionProgress.foundation = 1;
                constructionProgress.core = Math.min(stageProgress * 1.5, 1);
                break;
            case 2: // Superstructure
                constructionProgress.core = 1;
                constructionProgress.superstructure = stageProgress;
                break;
            case 3: // Facade Installation
                constructionProgress.superstructure = 1;
                constructionProgress.facade = stageProgress;
                break;
            case 4: // Finishing Works
                constructionProgress.facade = 1;
                constructionProgress.spire = stageProgress;
                break;
        }
    }
    
    function updateStageIndicator(cycleTime) {
        if (stageText) {
            const stageDuration = totalCycleTime / stages.length;
            const stageProgress = (cycleTime % stageDuration) / stageDuration;
            stageText.textContent = `${stages[currentStage]} (${Math.round(stageProgress * 100)}%)`;
        }
    }
    
    function updateStructure(structure, progress) {
        // Update foundation visibility
        if (structure.base) {
            structure.base.visible = progress.foundation > 0;
            structure.base.scale.y = progress.foundation;
        }
        
        // Update core structure
        if (structure.core) {
            structure.core.visible = progress.core > 0;
            structure.core.scale.y = progress.core;
            
            // Add construction grid effect
            const gridOpacity = progress.core > 0.8 ? (1 - progress.core) * 5 : 1;
            structure.core.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = gridOpacity;
                }
            });
        }
        
        // Update superstructure tiers
        structure.tiers.forEach((tier, index) => {
            const tierProgress = Math.max(0, (progress.superstructure * structure.tiers.length - index) / 3);
            tier.visible = tierProgress > 0;
            tier.scale.y = tierProgress;
            
            // Add material transition effect
            if (tierProgress > 0.7 && tierProgress < 1) {
                if (tier.material) {
                    tier.material.opacity = (tierProgress - 0.7) * 3.33;
                }
            }
        });
        
        // Update facade
        if (structure.facade) {
            structure.facade.visible = progress.facade > 0;
            if (structure.facade.material) {
                structure.facade.material.opacity = progress.facade;
                
                // Add glass reflection animation
                structure.facade.material.emissiveIntensity = 0.1 + Math.sin(animationTime) * 0.05;
            }
        }
        
        // Update spire
        if (structure.spire) {
            structure.spire.visible = progress.spire > 0;
            structure.spire.scale.y = progress.spire;
            
            // Add golden glow effect
            if (structure.spire.material) {
                structure.spire.material.emissiveIntensity = 0.5 + Math.sin(animationTime * 2) * 0.3;
            }
        }
    }
    
    // Helper functions
    function createFoundation() {
        const foundationGroup = new THREE.Group();
        
        // Concrete foundation
        const foundationGeo = new THREE.CylinderGeometry(25, 25, 3, 32);
        const foundationMat = new THREE.MeshStandardMaterial({
            color: 0x8a7f8a,
            roughness: 0.9,
            metalness: 0.1
        });
        const foundationMesh = new THREE.Mesh(foundationGeo, foundationMat);
        foundationMesh.position.y = 1.5;
        foundationMesh.castShadow = true;
        foundationMesh.receiveShadow = true;
        foundationGroup.add(foundationMesh);
        
        // Reinforcement bars
        const rebarGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
        const rebarMat = new THREE.MeshStandardMaterial({
            color: 0x7a7a7a,
            roughness: 0.3,
            metalness: 0.7
        });
        
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const radius = 20;
            const rebar = new THREE.Mesh(rebarGeo, rebarMat);
            rebar.position.set(
                Math.cos(angle) * radius,
                2,
                Math.sin(angle) * radius
            );
            foundationGroup.add(rebar);
        }
        
        return foundationGroup;
    }
    
    function createConstructionCranes(scene) {
        const cranes = [];
        const craneCount = 4;
        
        for (let i = 0; i < craneCount; i++) {
            const craneGroup = new THREE.Group();
            
            // Crane base
            const baseGeo = new THREE.CylinderGeometry(1.5, 2, 4, 16);
            const baseMat = new THREE.MeshStandardMaterial({
                color: 0x4a5568,
                roughness: 0.8
            });
            const base = new THREE.Mesh(baseGeo, baseMat);
            base.castShadow = true;
            craneGroup.add(base);
            
            // Crane mast
            const mastGeo = new THREE.BoxGeometry(1, 80, 1);
            const mastMat = new THREE.MeshStandardMaterial({
                color: 0x2d3748,
                roughness: 0.7
            });
            const mast = new THREE.Mesh(mastGeo, mastMat);
            mast.position.y = 40;
            mast.castShadow = true;
            craneGroup.add(mast);
            
            // Crane jib
            const jibLength = 25 + Math.random() * 10;
            const jibGeo = new THREE.BoxGeometry(jibLength, 0.5, 0.5);
            const jibMat = new THREE.MeshStandardMaterial({
                color: 0xf97316,
                roughness: 0.4,
                metalness: 0.6
            });
            const jib = new THREE.Mesh(jibGeo, jibMat);
            jib.position.set(jibLength/2 - 5, 78, 0);
            jib.castShadow = true;
            craneGroup.add(jib);
            
            // Counterweight
            const counterGeo = new THREE.BoxGeometry(3, 2, 2);
            const counterMat = new THREE.MeshStandardMaterial({
                color: 0x718096,
                roughness: 0.9
            });
            const counterweight = new THREE.Mesh(counterGeo, counterMat);
            counterweight.position.set(-5, 78, 0);
            craneGroup.add(counterweight);
            
            // Hook
            const hookGeo = new THREE.SphereGeometry(0.5, 8, 8);
            const hookMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                roughness: 0.3,
                metalness: 0.8
            });
            const hook = new THREE.Mesh(hookGeo, hookMat);
            hook.position.set(jibLength/2 - 5, 60, 0);
            craneGroup.add(hook);
            
            // Position cranes around the site
            const angle = (i / craneCount) * Math.PI * 2;
            const radius = 35;
            craneGroup.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            craneGroup.userData = {
                baseAngle: angle,
                jibLength: jibLength,
                rotationSpeed: 0.5 + Math.random() * 0.5,
                hookSpeed: 1 + Math.random() * 0.5
            };
            
            cranes.push(craneGroup);
            scene.add(craneGroup);
        }
        
        return cranes;
    }
    
    function animateCranes(cranes, time) {
        cranes.forEach((crane, index) => {
            const data = crane.userData;
            
            // Rotate jib
            const jib = crane.children[2];
            if (jib) {
                jib.rotation.y = Math.sin(time * data.rotationSpeed + index) * 0.8;
                
                // Move hook up and down
                const hook = crane.children[4];
                if (hook) {
                    hook.position.y = 60 + Math.sin(time * data.hookSpeed + index) * 15;
                    
                    // Move hook along jib
                    hook.position.x = (data.jibLength/2 - 5) * Math.cos(jib.rotation.y);
                    hook.position.z = (data.jibLength/2 - 5) * Math.sin(jib.rotation.y);
                }
            }
        });
    }
    
    function createMaterialPiles(scene) {
        // Concrete pile
        const concretePile = new THREE.Mesh(
            new THREE.BoxGeometry(8, 4, 8),
            new THREE.MeshStandardMaterial({
                color: 0x9e9e9e,
                roughness: 0.9
            })
        );
        concretePile.position.set(-30, 2, -25);
        concretePile.castShadow = true;
        scene.add(concretePile);
        
        // Steel pile
        const steelGroup = new THREE.Group();
        for (let i = 0; i < 20; i++) {
            const steel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.3, 6 + Math.random() * 4, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x7a7a7a,
                    roughness: 0.3,
                    metalness: 0.8
                })
            );
            steel.position.set(
                25 + (i % 5) * 1.5,
                3 + Math.floor(i / 5) * 1.5,
                20 + Math.floor(i / 5) * 1.5
            );
            steel.castShadow = true;
            steelGroup.add(steel);
        }
        scene.add(steelGroup);
    }
    
    function initializeStructure(structure) {
        // Create base structure
        structure.base = new THREE.Mesh(
            new THREE.CylinderGeometry(20, 20, 10, 32),
            new THREE.MeshStandardMaterial({
                color: 0x5d6d7e,
                roughness: 0.8
            })
        );
        structure.base.position.y = 5;
        structure.base.castShadow = true;
        structure.base.receiveShadow = true;
        scene.add(structure.base);
        
        // Create core structure
        structure.core = new THREE.Group();
        const coreGeo = new THREE.CylinderGeometry(8, 10, 100, 16);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x4a5568,
            roughness: 0.7,
            transparent: true,
            opacity: 0.8
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.castShadow = true;
        coreMesh.receiveShadow = true;
        structure.core.add(coreMesh);
        
        // Add construction grid to core
        const edges = new THREE.EdgesGeometry(coreGeo);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
            color: 0xf97316,
            linewidth: 2
        }));
        structure.core.add(line);
        structure.core.position.y = 55;
        scene.add(structure.core);
        
        // Create tiered structure
        const tiers = [
            { height: 40, radius: 18 },
            { height: 35, radius: 16 },
            { height: 30, radius: 14 },
            { height: 25, radius: 12 },
            { height: 20, radius: 10 },
            { height: 15, radius: 8 },
            { height: 10, radius: 6 }
        ];
        
        tiers.forEach((tier, index) => {
            const tierGeo = new THREE.CylinderGeometry(
                tier.radius * 0.9,
                tier.radius,
                tier.height,
                24
            );
            const tierMat = new THREE.MeshStandardMaterial({
                color: index % 2 === 0 ? 0x5d6d7e : 0x6d7e8f,
                roughness: 0.6,
                metalness: 0.2,
                transparent: true,
                opacity: 0
            });
            const tierMesh = new THREE.Mesh(tierGeo, tierMat);
            tierMesh.castShadow = true;
            tierMesh.receiveShadow = true;
            tierMesh.position.y = 105 + index * 30;
            scene.add(tierMesh);
            structure.tiers.push(tierMesh);
        });
        
        // Create facade
        structure.facade = new THREE.Mesh(
            new THREE.CylinderGeometry(6, 6, 250, 32),
            new THREE.MeshPhysicalMaterial({
                color: 0xa0c8e0,
                roughness: 0.1,
                metalness: 0.9,
                transparent: true,
                opacity: 0,
                transmission: 0.9,
                thickness: 1
            })
        );
        structure.facade.position.y = 125;
        scene.add(structure.facade);
        
        // Create spire
        structure.spire = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 3, 60, 16),
            new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                emissive: 0xd4af37,
                emissiveIntensity: 0.5,
                roughness: 0.3,
                metalness: 0.9
            })
        );
        structure.spire.position.y = 350;
        scene.add(structure.spire);
    }
    
    function createSkyline(scene) {
        // Create distant buildings
        for (let i = 0; i < 15; i++) {
            const height = 30 + Math.random() * 70;
            const width = 20 + Math.random() * 30;
            const depth = 20 + Math.random() * 30;
            const distance = 200 + Math.random() * 100;
            const angle = Math.random() * Math.PI * 2;
            
            const building = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial({
                    color: 0x4a5a6a,
                    roughness: 0.8
                })
            );
            
            building.position.set(
                Math.cos(angle) * distance,
                height / 2,
                Math.sin(angle) * distance
            );
            
            scene.add(building);
        }
    }
    
    function createConstructionVehicles(scene) {
        // Create cement mixer
        const mixerGroup = new THREE.Group();
        
        // Mixer body
        const mixerBody = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 6, 16),
            new THREE.MeshStandardMaterial({
                color: 0xf97316,
                roughness: 0.7
            })
        );
        mixerBody.rotation.z = Math.PI / 2;
        mixerBody.position.set(-15, 2, 20);
        mixerGroup.add(mixerBody);
        
        // Mixer chassis
        const chassis = new THREE.Mesh(
            new THREE.BoxGeometry(8, 1, 3),
            new THREE.MeshStandardMaterial({
                color: 0x2d3748,
                roughness: 0.8
            })
        );
        chassis.position.set(-15, 0.5, 20);
        mixerGroup.add(chassis);
        
        scene.add(mixerGroup);
        
        // Create dump truck
        const truckGroup = new THREE.Group();
        
        // Truck body
        const truckBody = new THREE.Mesh(
            new THREE.BoxGeometry(10, 3, 5),
            new THREE.MeshStandardMaterial({
                color: 0x4a5568,
                roughness: 0.8
            })
        );
        truckBody.position.set(20, 1.5, -25);
        truckGroup.add(truckBody);
        
        // Truck cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(4, 3, 4),
            new THREE.MeshStandardMaterial({
                color: 0x2d3748,
                roughness: 0.7
            })
        );
        cabin.position.set(25, 2, -25);
        truckGroup.add(cabin);
        
        scene.add(truckGroup);
    }
    
    function updateCamera(camera, time, progress) {
        // Calculate overall construction progress
        const overallProgress = (
            progress.foundation * 0.1 +
            progress.core * 0.2 +
            progress.superstructure * 0.3 +
            progress.facade * 0.3 +
            progress.spire * 0.1
        );
        
        // Dynamic camera based on construction progress
        const baseRadius = 60 + overallProgress * 40;
        const baseHeight = 30 + overallProgress * 50;
        const orbitSpeed = 0.1 + overallProgress * 0.1;
        
        camera.position.x = baseRadius * Math.cos(time * orbitSpeed);
        camera.position.z = baseRadius * Math.sin(time * orbitSpeed);
        camera.position.y = baseHeight;
        
        // Look at the construction site with slight offset
        const lookAtHeight = 20 + overallProgress * 100;
        camera.lookAt(0, lookAtHeight, 0);
    }
    
    function updateConstructionProgress(cycleTime) {
        // This function updates construction progress based on time
        // The actual updates are done in updateConstructionStage
    }
    
    // Start animation
    animate();
}

// Initialize 3D animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the container to be fully rendered
    setTimeout(() => {
        if (document.getElementById('tool-container')) {
            initBurjKhalifaAnimation();
        }
    }, 500);
});

// Also initialize when window loads
window.addEventListener('load', function() {
    if (document.getElementById('tool-container')) {
        // Small delay to ensure everything is ready
        setTimeout(initBurjKhalifaAnimation, 300);
    }
});
