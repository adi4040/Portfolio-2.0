import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Navigation & UI ---
    const navToggle = document.getElementById('nav-toggle');
    const navContent = document.getElementById('nav-content');
    if (navToggle && navContent) {
        navToggle.addEventListener('click', () => navContent.classList.toggle('hidden'));
    }

    const tabsContainer = document.getElementById('tabs-container');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });
    }

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

    // --- Enhanced Three.js Scene Setup ---
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Post-processing for Bloom ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.5, // radius
        0.1  // threshold
    );
    composer.addPass(bloomPass);

    // --- Starfield ---
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        starVertices.push((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ 
        size: 1.5, transparent: true, opacity: 0.7, 
        blending: THREE.AdditiveBlending, vertexColors: false, color: 0x64748b
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Infinity Curve Definition ---
    class InfinityCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const a = this.scale;
            const t2 = 2 * Math.PI * t;
            const x = a * Math.sqrt(2) * Math.cos(t2) / (Math.sin(t2) ** 2 + 1);
            const y = a * Math.sqrt(2) * Math.cos(t2) * Math.sin(t2) / (Math.sin(t2) ** 2 + 1);
            return optionalTarget.set(x, y, 0);
        }
    }

    const infinityPath = new InfinityCurve(12);
    
    // --- New Shader-based Tracer Effect ---
    const tubeSegments = 512;
    const tubeRadius = 0.2;
    const tubeGeometry = new THREE.TubeGeometry(infinityPath, tubeSegments, tubeRadius, 12, false);
    
    const tubeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0xff0040) },
            color2: { value: new THREE.Color(0x0080ff) },
            opacity: { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float opacity;

            // Simplex noise function for turbulence
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m; m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                float progress = fract(vUv.x - time);
                
                // Create the glowing head of the trail
                float head = smoothstep(0.0, 0.15, progress) - smoothstep(0.1, 0.15, progress);
                
                // Create the fading tail
                float tail = smoothstep(0.1, 0.8, progress) - smoothstep(0.7, 0.8, progress);
                
                // Combine head and tail for the main shape
                float combined = head * 2.0 + tail;
                
                // Add turbulent noise for a plasma/energy effect
                float noise = snoise(vUv * 10.0 + time * 2.0) * 0.1;
                combined += noise;
                
                // Mix colors based on position
                vec3 color = mix(color1, color2, vUv.x);
                
                // Final color and alpha
                gl_FragColor = vec4(color * combined, combined * 0.8 * opacity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const infinityTracer = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(infinityTracer);

    camera.position.z = 35;

    // --- Animation & Scroll Variables ---
    let scrollY = window.scrollY;
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    let targetOpacity = 1.0;
    
    // --- Scroll and Animation Logic ---
    function updateTargets() {
        scrollY = window.scrollY;
        const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        targetRotation.x = Math.PI / 6 + scrollY * 0.0005;
        targetRotation.y = Math.PI / 8 + scrollY * 0.00025;

        // Fade out after 40% scroll
        targetOpacity = (scrollPercent > 0.4) ? Math.max(0.0, 1.0 - (scrollPercent - 0.4) / 0.5) : 1.0;
    }
    
    window.addEventListener('scroll', updateTargets);
    updateTargets();

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        
        // --- Smoothed (Lerped) Rotation and Opacity ---
        const lerpFactor = 0.05;
        currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
        currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;
        
        infinityTracer.rotation.set(currentRotation.x, currentRotation.y, 0);
        tubeMaterial.uniforms.opacity.value += (targetOpacity - tubeMaterial.uniforms.opacity.value) * lerpFactor;

        // Update shader time for animation
        tubeMaterial.uniforms.time.value = elapsedTime * 0.2;
        
        // Subtle camera movement
        camera.position.x = Math.sin(elapsedTime * 0.1) * 0.5;
        camera.position.y = Math.cos(elapsedTime * 0.15) * 0.3;
        camera.lookAt(0, 0, 0);
        
        // Subtle star movement
        stars.rotation.y += 0.0001;
        
        composer.render();
    }
    animate();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    });

    // Typing effect from the original code (no changes)
    const phrases = [ "I build things for the web.", "I create intelligent solutions.", "I solve complex problems.", "I turn ideas into reality." ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            document.body.classList.remove('is-loading');
            document.querySelectorAll('.animate-on-load').forEach(el => el.classList.add('loaded'));
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }
});
