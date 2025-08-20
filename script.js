import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Side Navigation Logic ---
    const sideNav = document.getElementById('side-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link-side');
    const sections = document.querySelectorAll('section[id]');
    
    // Toggle navigation on mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sideNav.classList.toggle('expanded');
            } else {
                sideNav.classList.toggle('collapsed');
            }
        });
    }
    
    // Active section highlighting
    function highlightActiveSection() {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close nav on mobile after clicking
                if (window.innerWidth <= 768) {
                    sideNav.classList.remove('expanded');
                }
            }
        });
    });
    
    // --- Skill Progress Bars Animation ---
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.setProperty('--width', width + '%');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
    
    // --- Animation Observer ---
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

    // --- Enhanced Three.js Scene Setup with Better Visibility ---
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5; // Increased exposure for better visibility
    container.appendChild(renderer.domElement);

    // --- Post-processing for Bloom ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.8, // Increased strength for more vibrant colors
        0.6, // Increased radius
        0.1  // Lower threshold for more bloom
    );
    composer.addPass(bloomPass);

    // --- Starfield ---
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 15000; i++) { // Restored star count
        starVertices.push(
            (Math.random() - 0.5) * 3000, 
            (Math.random() - 0.5) * 3000, 
            (Math.random() - 0.5) * 2000
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ 
        size: 1.5, 
        transparent: true, 
        opacity: 0.8, // Increased opacity for stars
        blending: THREE.AdditiveBlending, 
        vertexColors: false, 
        color: 0x64748b
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Infinity Curve Definition ---
    class InfinityCurve extends THREE.Curve {
        constructor(scale = 1) { 
            super(); 
            this.scale = scale; 
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const a = this.scale;
            const t2 = 2 * Math.PI * t;
            const x = a * Math.sqrt(2) * Math.cos(t2) / (Math.sin(t2) ** 2 + 1);
            const y = a * Math.sqrt(2) * Math.cos(t2) * Math.sin(t2) / (Math.sin(t2) ** 2 + 1);
            return optionalTarget.set(x, y, 0);
        }
    }

    const infinityPath = new InfinityCurve(12); // Back to original size
    
    // --- Shader-based Tracer Effect with higher opacity ---
    const tubeSegments = 512;
    const tubeRadius = 0.2; // Original radius
    const tubeGeometry = new THREE.TubeGeometry(infinityPath, tubeSegments, tubeRadius, 12, false);
    
    const tubeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0xff0040) },
            color2: { value: new THREE.Color(0x0080ff) },
            opacity: { value: 0.95 } // Much higher initial opacity
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
                float head = smoothstep(0.0, 0.15, progress) - smoothstep(0.1, 0.15, progress);
                float tail = smoothstep(0.1, 0.8, progress) - smoothstep(0.7, 0.8, progress);
                float combined = head * 2.0 + tail; // Increased brightness
                float noise = snoise(vUv * 10.0 + time * 2.0) * 0.1;
                combined += noise;
                vec3 color = mix(color1, color2, vUv.x);
                gl_FragColor = vec4(color * combined, combined * 0.9 * opacity); // Higher alpha
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const infinityTracer = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(infinityTracer);

    camera.position.z = 35; // Original camera position

    // --- Animation & Scroll Variables ---
    let scrollY = window.scrollY;
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    let targetOpacity = 0.95; // Higher base opacity
    
    // --- Scroll and Animation Logic ---
    function updateTargets() {
        scrollY = window.scrollY;
        const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        targetRotation.x = Math.PI / 6 + scrollY * 0.0005;
        targetRotation.y = Math.PI / 8 + scrollY * 0.00025;

        // Less aggressive fade out
        targetOpacity = (scrollPercent > 0.4) ? Math.max(0.3, 0.95 - (scrollPercent - 0.4) / 0.6 * 0.5) : 0.95;
    }
    
    window.addEventListener('scroll', updateTargets);
    updateTargets();

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        
        // Smoothed rotation and opacity
        const lerpFactor = 0.05;
        currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
        currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;
        
        infinityTracer.rotation.set(currentRotation.x, currentRotation.y, 0);
        tubeMaterial.uniforms.opacity.value += (targetOpacity - tubeMaterial.uniforms.opacity.value) * lerpFactor;

        // Update shader time
        tubeMaterial.uniforms.time.value = elapsedTime * 0.2; // Original speed
        
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

    // --- Typing Effect ---
    const phrases = [
        "I build things for the web.",
        "I create intelligent solutions.",
        "I solve complex problems.",
        "I turn ideas into reality."
    ];
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
});