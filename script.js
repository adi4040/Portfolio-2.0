import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

document.addEventListener('DOMContentLoaded', function() {
  // --- LeetCode Configuration ---
  // IMPORTANT: Update this with your actual LeetCode username
  // This should be your LeetCode username, not your LeetCode ID
  // Example: if your LeetCode profile URL is https://leetcode.com/johndoe/
  // then your username is 'johndoe'
  const LEETCODE_CONFIG = {
    username: 'ZDt3Xwkjvl', // This username is working with the API
    displayName: 'Aditya Suryawanshi', // Your display name
    enableGraphQL: false, // Disabled due to CORS restrictions
    enableUnofficialAPI: true, // This API works correctly
    enableAlternativeAPI: false, // Disabled to use only Unofficial API
    cacheDuration: 5 * 60 * 1000, // 5 minutes cache duration
    rateLimitDelay: 1000, // 1 second between API calls
    maxRetries: 3, // Maximum retry attempts
    enableOfflineMode: true // Enable offline fallback mode
  };

  // --- LeetCode API State Management ---
  const LeetCodeAPI = {
    cache: new Map(),
    rateLimitQueue: [],
    isProcessing: false,
    lastCallTime: 0,
    retryCount: 0,
    offlineData: null
  };

  // --- Mobile Navigation Logic ---
  const sideNav = document.getElementById('side-nav');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navClose = document.getElementById('nav-close');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link-side');
  const sections = document.querySelectorAll('section[id]');

  const isMobile = window.innerWidth <= 768;

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      sideNav?.classList.add('active');
      navOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileMenu() {
    sideNav?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navClose) navClose.addEventListener('click', closeMobileMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        if (isMobile) closeMobileMenu();
        setTimeout(() => {
          const offsetTop = targetSection.offsetTop - (isMobile ? 60 : 0);
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }, isMobile ? 300 : 0);
      }
    });
  });

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

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(highlightActiveSection);
  });

  // --- Intersection/Scroll Animations (for content visibility) ---
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: isMobile ? 0.1 : 0.15, rootMargin: isMobile ? '0px' : '50px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

  // --- Three.js Scene Setup ---
  const container = document.getElementById('webgl-container');

  const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
  const starCount = isMobile ? 5000 : 15000;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: isMobile ? "low-power" : "high-performance"
  });

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.appendChild(renderer.domElement);

  // --- Post-processing (desktop only) ---
  let composer, bloomPass;
  if (!isMobile) {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.4,
      0.6,
      0.12
    );
    composer.addPass(bloomPass);
  }

  // --- Starfield ---
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < starCount; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 2000
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({
    size: isMobile ? 1.2 : 1.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    color: 0x64748b
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // --- Infinity Curve Tracer (scroll-reactive) ---
  class InfinityCurve extends THREE.Curve {
    constructor(scale = 1) { super(); this.scale = scale; }
    getPoint(t, target = new THREE.Vector3()) {
      const a = this.scale;
      const t2 = 2 * Math.PI * t;
      const x = a * Math.sqrt(2) * Math.cos(t2) / (Math.sin(t2) ** 2 + 1);
      const y = a * Math.sqrt(2) * Math.cos(t2) * Math.sin(t2) / (Math.sin(t2) ** 2 + 1);
      return target.set(x, y, 0);
    }
  }

  const infinityPath = new InfinityCurve(isMobile ? 10 : 12);
  const tubeSegments = isMobile ? 256 : 512;
  const tubeRadius = isMobile ? 0.15 : 0.2;
  const tubeGeometry = new THREE.TubeGeometry(infinityPath, tubeSegments, tubeRadius, 12, false);

  const tracerBaseOpacity = isMobile ? 0.85 : 0.95;
  let tubeMaterial;

  if (isMobile) {
    tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0080,
      transparent: true,
      opacity: tracerBaseOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  } else {
    tubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Color(0xff0040) },
        color2: { value: new THREE.Color(0x0080ff) },
        opacity: { value: tracerBaseOpacity }
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
        void main() {
          float p = fract(vUv.x - time);
          float intensity = smoothstep(0.0, 0.3, p) * smoothstep(1.0, 0.7, p);
          vec3 color = mix(color1, color2, vUv.x);
          gl_FragColor = vec4(color * intensity, intensity * opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  const infinityTracer = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(infinityTracer);

  camera.position.z = isMobile ? 40 : 35;

  // Scroll-reactive rotation and base opacity for the tracer
  let targetRotX = Math.PI / 6;
  let targetRotY = Math.PI / 8;
  let currentRotX = targetRotX;
  let currentRotY = targetRotY;

  let baseTracerOpacityTarget = tracerBaseOpacity;
  let currentTracerOpacity = tracerBaseOpacity;

  function updateScrollTargets() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollPercent = scrollY / maxScroll;

    const rxFactor = isMobile ? 0.0003 : 0.0005;
    const ryFactor = isMobile ? 0.00015 : 0.00025;

    targetRotX = Math.PI / 6 + scrollY * rxFactor;
    targetRotY = Math.PI / 8 + scrollY * ryFactor;

    const fadeStart = 0.4;
    if (scrollPercent > fadeStart) {
      const fade = 1.0 - (scrollPercent - fadeStart) / (0.5);
      baseTracerOpacityTarget = Math.max(0.2, tracerBaseOpacity * fade);
    } else {
      baseTracerOpacityTarget = tracerBaseOpacity;
    }
  }
  window.addEventListener('scroll', updateScrollTargets);
  updateScrollTargets();

  function setTracerOpacity(op) {
    if (tubeMaterial.uniforms && tubeMaterial.uniforms.opacity) {
      tubeMaterial.uniforms.opacity.value = op;
    } else if ('opacity' in tubeMaterial) {
      tubeMaterial.opacity = op;
    }
  }

  // Helpers
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);



  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Infinity tracer motion
    if (!isMobile && tubeMaterial.uniforms) {
      tubeMaterial.uniforms.time.value = t * 0.2;
    }
    const rotLerp = 0.08;
    currentRotX += (targetRotX - currentRotX) * rotLerp;
    currentRotY += (targetRotY - currentRotY) * rotLerp;
    infinityTracer.rotation.x = currentRotX;
    infinityTracer.rotation.y = currentRotY;

    // Stars
    stars.rotation.y += isMobile ? 0.00005 : 0.0001;

    camera.lookAt(0, 0, 0);

    if (composer && !isMobile) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  animate();

  // --- Handle Resize ---
  function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    if (composer && !isMobile) composer.setSize(width, height);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
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

  // --- Performance: pause when tab hidden on mobile ---
  if (isMobile) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animationId)
      else animate();
    });
  }

  // --- LeetCode Modal Functionality ---
  const leetcodeModal = document.getElementById('leetcode-modal');
  const leetcodeStatsBtn = document.getElementById('leetcode-stats-btn');
  const leetcodeModalClose = document.getElementById('leetcode-modal-close');
  const leetcodeModalOverlay = document.querySelector('.leetcode-modal-overlay');
  const leetcodeLoading = document.getElementById('leetcode-loading');
  const leetcodeContent = document.getElementById('leetcode-content');

  function openLeetCodeModal() {
    leetcodeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    fetchLeetCodeData();
  }

  function closeLeetCodeModal() {
    leetcodeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners for modal
  if (leetcodeStatsBtn) {
    leetcodeStatsBtn.addEventListener('click', openLeetCodeModal);
  }
  if (leetcodeModalClose) {
    leetcodeModalClose.addEventListener('click', closeLeetCodeModal);
  }
  if (leetcodeModalOverlay) {
    leetcodeModalOverlay.addEventListener('click', closeLeetCodeModal);
  }

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && leetcodeModal.classList.contains('active')) {
      closeLeetCodeModal();
    }
  });

  // --- LeetCode API Utility Functions ---
  
  // Cache management
  function getCachedData(key) {
    const cached = LeetCodeAPI.cache.get(key);
    if (cached && Date.now() - cached.timestamp < LEETCODE_CONFIG.cacheDuration) {
      return cached.data;
    }
    LeetCodeAPI.cache.delete(key);
    return null;
  }

  function setCachedData(key, data) {
    const dataWithMetadata = {
      ...data,
      _source: 'cache',
      _timestamp: Date.now()
    };
    LeetCodeAPI.cache.set(key, {
      data: dataWithMetadata,
      timestamp: Date.now()
    });
  }

  // Rate limiting
  async function rateLimitedCall(fn) {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const timeSinceLastCall = now - LeetCodeAPI.lastCallTime;
      
      if (timeSinceLastCall < LEETCODE_CONFIG.rateLimitDelay) {
        const delay = LEETCODE_CONFIG.rateLimitDelay - timeSinceLastCall;
        setTimeout(() => executeCall(fn, resolve, reject), delay);
      } else {
        executeCall(fn, resolve, reject);
      }
    });
  }

  async function executeCall(fn, resolve, reject) {
    try {
      LeetCodeAPI.lastCallTime = Date.now();
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  // Retry mechanism with exponential backoff
  async function retryWithBackoff(fn, maxRetries = LEETCODE_CONFIG.maxRetries) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`API call failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Offline mode management
  function saveOfflineData(data) {
    try {
      const dataWithMetadata = {
        ...data,
        _source: 'offline',
        _timestamp: Date.now()
      };
      localStorage.setItem('leetcode_offline_data', JSON.stringify({
        data: dataWithMetadata,
        timestamp: Date.now()
      }));
      LeetCodeAPI.offlineData = dataWithMetadata;
    } catch (error) {
      console.warn('Failed to save offline data:', error);
    }
  }

  function getOfflineData() {
    try {
      const cached = localStorage.getItem('leetcode_offline_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Use offline data if it's less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Failed to load offline data:', error);
    }
    return null;
  }

  // Enhanced LeetCode API Integration with proper error handling
  async function fetchLeetCodeData() {
    const username = LEETCODE_CONFIG.username;
    
    // Validate username
    if (!username || username === 'YOUR_ACTUAL_USERNAME' || username === '') {
      displayLeetCodeError('Please configure your LeetCode username in the script');
      return;
    }
    
    try {
      // Show loading state
      leetcodeLoading.style.display = 'block';
      leetcodeContent.style.display = 'none';

      // Check cache first
      const cacheKey = `leetcode_${username}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log('Using cached LeetCode data');
        displayLeetCodeData(cachedData);
        return;
      }

      // Check offline data if no cache
      if (LEETCODE_CONFIG.enableOfflineMode) {
        const offlineData = getOfflineData();
        if (offlineData) {
          console.log('Using offline LeetCode data');
          displayLeetCodeData(offlineData);
          // Still try to fetch fresh data in background
          fetchFreshDataInBackground(username, cacheKey);
          return;
        }
      }

      // Try multiple username formats if the first one fails
      const usernameFormats = [
        username,
        username.toLowerCase(),
        username.replace(/[^a-zA-Z0-9]/g, ''),
        'ZDt3Xwkjvl' // Original ID as fallback
      ];

      let profileData = null;
      let lastError = null;

      for (const testUsername of usernameFormats) {
        console.log(`Trying username format: ${testUsername}`);
        
        // Method 1: Try unofficial API (prioritize this since it works correctly)
        if (LEETCODE_CONFIG.enableUnofficialAPI) {
          try {
            profileData = await rateLimitedCall(() => 
              retryWithBackoff(() => fetchFromUnofficialsAPI(testUsername))
            );
            if (profileData && profileData.status === 'success') {
              console.log(`Success with Unofficial API for username: ${testUsername}`);
              break; // Exit the loop once we get successful data from Unofficial API
            }
          } catch (error) {
            console.log(`Unofficial API failed for ${testUsername}:`, error);
            lastError = error;
          }
        }
        
        // Method 2: Try alternative API only if Unofficial API fails
        if (!profileData && LEETCODE_CONFIG.enableAlternativeAPI) {
          try {
            profileData = await rateLimitedCall(() => 
              retryWithBackoff(() => fetchFromAlternativeAPI(testUsername))
            );
            if (profileData) {
              console.log(`Success with Alternative API for username: ${testUsername}`);
              break;
            }
          } catch (error) {
            console.log(`Alternative API failed for ${testUsername}:`, error);
            lastError = error;
          }
        }
      }

      if (!profileData) {
        throw new Error(lastError?.message || 'All configured API methods failed');
      }
      
      if (profileData) {
        // Cache the successful result
        setCachedData(cacheKey, profileData);
        
        // Save for offline mode
        if (LEETCODE_CONFIG.enableOfflineMode) {
          saveOfflineData(profileData);
        }
        
        displayLeetCodeData(profileData);
      } else {
        throw new Error('No data received');
      }
      
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      displayLeetCodeError(error.message);
    }
  }

  // Background fetch for offline mode
  async function fetchFreshDataInBackground(username, cacheKey) {
    try {
      let profileData = null;
      
      // Try to fetch fresh data silently
      if (LEETCODE_CONFIG.enableGraphQL) {
        try {
          profileData = await rateLimitedCall(() => 
            retryWithBackoff(() => fetchFromGraphQL(username))
          );
        } catch (error) {
          console.log('Background GraphQL fetch failed:', error);
        }
      }
      
      if (!profileData && LEETCODE_CONFIG.enableUnofficialAPI) {
        try {
          profileData = await rateLimitedCall(() => 
            retryWithBackoff(() => fetchFromUnofficialsAPI(username))
          );
        } catch (error) {
          console.log('Background unofficial API fetch failed:', error);
        }
      }
      
      if (!profileData && LEETCODE_CONFIG.enableAlternativeAPI) {
        try {
          profileData = await rateLimitedCall(() => 
            retryWithBackoff(() => fetchFromAlternativeAPI(username))
          );
        } catch (error) {
          console.log('Background alternative API fetch failed:', error);
        }
      }
      
      if (profileData) {
        // Update cache and offline data silently
        setCachedData(cacheKey, profileData);
        if (LEETCODE_CONFIG.enableOfflineMode) {
          saveOfflineData(profileData);
        }
        console.log('Background data fetch successful');
      }
    } catch (error) {
      console.log('Background fetch failed:', error);
    }
  }

  // Method 1: Direct GraphQL API (Primary)
  async function fetchFromGraphQL(username) {
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            realName
            avatar
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
            totalSubmissionNum {
              difficulty
              count
            }
          }
          contributions {
            points
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.matchedUser) {
      throw new Error('User not found or profile is private');
    }

    // Transform GraphQL data to expected format
    const user = data.data.matchedUser;
    const stats = user.submitStats;
    
    const easy = stats.acSubmissionNum.find(s => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.acSubmissionNum.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.acSubmissionNum.find(s => s.difficulty === 'Hard')?.count || 0;
    
    return {
      status: 'Success',
      username: user.username,
      realName: user.profile.realName,
      avatar: user.profile.avatar,
      ranking: user.profile.ranking,
      totalSolved: easy + medium + hard,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      contributionPoints: user.contributions?.points || 0,
      reputation: 0, // GraphQL doesn't provide this easily
      _source: 'live',
      _timestamp: Date.now()
    };
  }

  // Method 2: Unofficial API (Fallback)
  async function fetchFromUnofficialsAPI(username) {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    if (!response.ok) {
      throw new Error(`Unofficial API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Unofficial API response:', data); // Debug log
    
    if (data.status !== 'Success' && data.status !== 'success') {
      throw new Error(data.message || 'API returned error status');
    }
    
    return {
      ...data,
      _source: 'live',
      _timestamp: Date.now(),
      _apiSource: 'unofficial' // Add source identifier
    };
  }

  // Method 3: Alternative unofficial API
  async function fetchFromAlternativeAPI(username) {
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}`);
    
    if (!response.ok) {
      throw new Error(`Alternative API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Alternative API response:', data); // Debug log
    
    // Transform the response to match expected format
    return {
      status: 'Success',
      username: data.username,
      totalSolved: data.solvedProblem || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      ranking: data.ranking || 'N/A',
      contributionPoints: data.contributionPoint || 0,
      reputation: data.reputation || 0,
      _source: 'live',
      _timestamp: Date.now()
    };
  }

  // Method 4: CORS-safe API (using JSONP-like approach)
  async function fetchFromCorsSafeAPI(username) {
    try {
      // Use a CORS proxy or alternative endpoint
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`CORS-safe API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'Success') {
        throw new Error(data.message || 'API returned error status');
      }
      
      return {
        ...data,
        _source: 'live',
        _timestamp: Date.now()
      };
    } catch (error) {
      console.log('CORS-safe API failed:', error);
      throw error;
    }
  }

  // Enhanced display function with better error handling
  function displayLeetCodeData(data) {
    try {
      console.log('Displaying LeetCode data:', data); // Debug log
      console.log('API Source:', data._apiSource || 'unknown'); // Show which API was used
      
      // Hide loading, show content
      leetcodeLoading.style.display = 'none';
      leetcodeContent.style.display = 'block';

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Update profile info with fallbacks
        const nameElement = document.getElementById('leetcode-name');
        const usernameElement = document.getElementById('leetcode-username');
        
        if (nameElement) {
          nameElement.textContent = data.realName || LEETCODE_CONFIG.displayName || data.username || 'LeetCode User';
        }
        if (usernameElement) {
          usernameElement.textContent = `@${data.username || 'unknown'}`;
        }

        // Update statistics with proper field mapping based on API response
        const totalSolved = data.totalSolved || 0;
        const ranking = data.ranking || 'N/A';
        const contributionPoints = data.contributionPoints || 0;
        const reputation = data.reputation || 0;

        console.log('Statistics to update:', { totalSolved, ranking, contributionPoints, reputation }); // Debug log

        updateElementText('leetcode-total-solved', totalSolved);
        updateElementText('leetcode-ranking', ranking);
        updateElementText('leetcode-contribution', contributionPoints);
        updateElementText('leetcode-reputation', reputation);

        // Update difficulty breakdown with correct field mapping
        const easyCount = data.easySolved || 0;
        const mediumCount = data.mediumSolved || 0;
        const hardCount = data.hardSolved || 0;
        const total = easyCount + mediumCount + hardCount;

        console.log('Difficulty breakdown:', { easyCount, mediumCount, hardCount, total }); // Debug log

        updateElementText('leetcode-easy-count', easyCount);
        updateElementText('leetcode-medium-count', mediumCount);
        updateElementText('leetcode-hard-count', hardCount);

        // Animate progress bars with safety checks
        setTimeout(() => {
          if (total > 0) {
            updateProgressBar('leetcode-easy-bar', (easyCount / total) * 100);
            updateProgressBar('leetcode-medium-bar', (mediumCount / total) * 100);
            updateProgressBar('leetcode-hard-bar', (hardCount / total) * 100);
          }
        }, 100);

        // Generate recent activity (since real data might not be available)
        generateRecentActivity(data);
      }, 50); // Small delay to ensure DOM is ready

    } catch (error) {
      console.error('Error displaying LeetCode data:', error);
      displayLeetCodeError('Error displaying data');
    }
  }

  // Helper functions
  function updateElementText(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Updating ${elementId} with value: ${value}`); // Debug log
      element.textContent = value;
    } else {
      console.error(`Element with id '${elementId}' not found`); // Debug error
    }
  }

  function updateProgressBar(elementId, percentage) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Updating progress bar ${elementId} with percentage: ${percentage}%`); // Debug log
      element.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    } else {
      console.error(`Progress bar element with id '${elementId}' not found`); // Debug error
    }
  }

  function generateRecentActivity(data) {
    const recentList = document.getElementById('leetcode-recent-list');
    if (!recentList) return;

    // Since recent submissions aren't available in most APIs,
    // we'll show a message instead of mock data
    if (data.totalSolved > 0) {
      const acceptanceRate = data.acceptanceRate ? `${data.acceptanceRate}%` : 'N/A';
      const totalQuestions = data.totalQuestions || 'N/A';
      
      recentList.innerHTML = `
        <div class="recent-item">
          <i class="fas fa-chart-line" style="color: #10B981;"></i>
          <div class="recent-item-content">
            <div class="recent-item-title">Performance Stats</div>
            <div class="recent-item-details">
              <strong>${data.totalSolved}</strong> problems solved out of <strong>${totalQuestions}</strong> total
              <br>
              <strong>Acceptance Rate:</strong> ${acceptanceRate}
              <br>
              <a href="https://leetcode.com/${data.username}/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style="color: #3B82F6; text-decoration: none;">
                View detailed activity on LeetCode →
              </a>
            </div>
          </div>
        </div>
        <div class="recent-item" style="background: rgba(16, 185, 129, 0.1); border-color: #10B981;">
          <i class="fas fa-database" style="color: #10B981;"></i>
          <div class="recent-item-content">
            <div class="recent-item-title">Data Source</div>
            <div class="recent-item-details">
              ${data._source === 'cache' ? 'Cached data' : data._source === 'offline' ? 'Offline data' : 'Live data'}
              ${data._timestamp ? ` • Last updated: ${new Date(data._timestamp).toLocaleString()}` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      recentList.innerHTML = `
        <div class="recent-item">
          <i class="fas fa-rocket" style="color: #6B7280;"></i>
          <div class="recent-item-content">
            <div class="recent-item-title">Get Started</div>
            <div class="recent-item-details">No problems solved yet. Start your coding journey!</div>
          </div>
        </div>
      `;
    }
  }

  // Cache management functions
  function clearCache() {
    LeetCodeAPI.cache.clear();
    console.log('LeetCode cache cleared');
  }

  function getCacheStats() {
    return {
      size: LeetCodeAPI.cache.size,
      entries: Array.from(LeetCodeAPI.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        expiresIn: LEETCODE_CONFIG.cacheDuration - (Date.now() - value.timestamp)
      }))
    };
  }

  // Enhanced error display with specific error messages and offline mode info
  function displayLeetCodeError(errorMessage = 'Unknown error') {
    leetcodeLoading.style.display = 'block';
    leetcodeContent.style.display = 'none';
    
    let errorHtml = '';
    
    if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control-Allow-Origin')) {
      errorHtml = `
        <i class="fas fa-ban" style="color: #EF4444; font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin: 0.5rem 0;">CORS Policy Blocked</h3>
        <p>Direct API access is blocked by browser security policies.</p>
        <div style="font-size: 0.8rem; color: #6B7280; margin-top: 1rem;">
          <p>This is expected behavior. The system will:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Use cached data if available</li>
            <li>Try alternative APIs</li>
            <li>Show offline data if configured</li>
          </ul>
        </div>
      `;
    } else if (errorMessage.includes('not found') || errorMessage.includes('private')) {
      errorHtml = `
        <i class="fas fa-user-slash" style="color: #F59E0B; font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin: 0.5rem 0;">Profile Not Found</h3>
        <p>The username might be incorrect or the profile is set to private.</p>
        <div style="font-size: 0.8rem; color: #6B7280; margin-top: 1rem;">
          <p>To fix this:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Check if the username is correct</li>
            <li>Make sure your LeetCode profile is public</li>
            <li>Go to Settings → Privacy → Set to Public</li>
          </ul>
        </div>
      `;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorHtml = `
        <i class="fas fa-wifi" style="color: #EF4444; font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin: 0.5rem 0;">Network Error</h3>
        <p>Unable to connect to LeetCode servers.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please check your internet connection and try again.</p>
        ${LEETCODE_CONFIG.enableOfflineMode ? `
          <div style="font-size: 0.8rem; color: #10B981; margin-top: 0.5rem;">
            <i class="fas fa-info-circle"></i> Offline mode is enabled - cached data will be used when available.
          </div>
        ` : ''}
      `;
    } else {
      errorHtml = `
        <i class="fas fa-exclamation-triangle" style="color: #EF4444; font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin: 0.5rem 0;">Unable to Load Statistics</h3>
        <p>There was an error loading your LeetCode data.</p>
        <p style="font-size: 0.8rem; color: #6B7280; margin-top: 0.5rem;">${errorMessage}</p>
      `;
    }
    
    // Add retry button with rate limiting info
    errorHtml += `
      <button onclick="fetchLeetCodeData()" style="
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.9rem;
      ">Retry</button>
      <div style="font-size: 0.7rem; color: #6B7280; margin-top: 0.5rem;">
        <i class="fas fa-clock"></i> Rate limited to ${LEETCODE_CONFIG.rateLimitDelay}ms between requests
      </div>
    `;
    
    leetcodeLoading.innerHTML = errorHtml;
  }
});