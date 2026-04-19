// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section');
const navLinksItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(139, 69, 19, 0.2)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 69, 19, 0.15)';
    }
});

// ===== Order Product Function =====
function orderProduct(productName) {
    // Scroll to contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-select the product in the form
    const productSelect = document.getElementById('product');
    productSelect.value = productName;
    
    // Focus on the name field
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 800);
}

// ===== Form Submission Handler =====
const orderForm = document.getElementById('orderForm');
const formMessage = document.getElementById('formMessage');

orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        product: document.getElementById('product').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = orderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Send to backend server
        const response = await fetch('/api/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showFormMessage('Thank you! Your order/inquiry has been submitted successfully. We will contact you soon.', 'success');
            orderForm.reset();
        } else {
            throw new Error(result.message || 'Failed to submit order');
        }
    } catch (error) {
        console.error('Submission error:', error);
        
        // Fallback: Try to open WhatsApp with pre-filled message
        const whatsappMessage = `Hi! I'd like to place an order:%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AProduct: ${formData.product || 'Not specified'}%0AMessage: ${formData.message}`;
        window.open(`https://wa.me/919876543210?text=${whatsappMessage}`, '_blank');
        
        showFormMessage('Opening WhatsApp to complete your order...', 'success');
        orderForm.reset();
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
});

// ===== Show Form Message =====
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .gallery-item, .stat, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Counter Animation for Stats =====
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
};

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat .number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    // Simple animation - just add the final value
                    stat.style.opacity = '1';
                }
            });
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// ===== Loading Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Console Welcome Message =====
console.log('%c🌶️ Welcome to Spice Haven!', 'color: #C41E3A; font-size: 24px; font-weight: bold;');
console.log('%cAuthentic Indian Masalas - Crafted with Love', 'color: #F4A300; font-size: 14px;');
console.log('%cContact us: +91 98765 43210 | hello@spicehaven.com', 'color: #8B4513; font-size: 12px;');

// ===== Three.js 3D Scene Setup =====
let scene, camera, renderer, spiceJar, floatingSpices = [];
let animationId;

function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffa500, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6347, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create rotating spice jar
    createSpiceJar();

    // Create floating spices
    createFloatingSpices();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function createSpiceJar() {
    // Jar body (cylinder)
    const jarGeometry = new THREE.CylinderGeometry(1, 1, 2.5, 32);
    const jarMaterial = new THREE.MeshPhongMaterial({
        color: 0xF4A300,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    spiceJar = new THREE.Mesh(jarGeometry, jarMaterial);
    
    // Jar lid
    const lidGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.3, 32);
    const lidMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        shininess: 50
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 1.4;
    spiceJar.add(lid);

    // Label on jar
    const labelGeometry = new THREE.CylinderGeometry(1.02, 1.02, 1.5, 32, 1, true, 0, Math.PI);
    const labelMaterial = new THREE.MeshPhongMaterial({
        color: 0xC41E3A,
        side: THREE.DoubleSide
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    spiceJar.add(label);

    spiceJar.position.x = -2.5;
    spiceJar.position.y = 0;
    scene.add(spiceJar);
}

function createFloatingSpices() {
    const spiceColors = [0xC41E3A, 0xF4A300, 0x8B4513, 0xDAA520];
    const spiceGeometries = [
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.OctahedronGeometry(0.12),
        new THREE.TetrahedronGeometry(0.13)
    ];

    for (let i = 0; i < 15; i++) {
        const geometry = spiceGeometries[Math.floor(Math.random() * spiceGeometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: spiceColors[Math.floor(Math.random() * spiceColors.length)],
            shininess: 30
        });
        
        const spice = new THREE.Mesh(geometry, material);
        
        // Random position
        spice.position.x = (Math.random() - 0.5) * 15 + 2;
        spice.position.y = (Math.random() - 0.5) * 10;
        spice.position.z = (Math.random() - 0.5) * 5 - 2;
        
        // Random rotation speed
        spice.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        // Float speed
        spice.floatSpeed = 0.5 + Math.random() * 0.5;
        spice.floatOffset = Math.random() * Math.PI * 2;
        
        floatingSpices.push(spice);
        scene.add(spice);
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;

    // Rotate spice jar
    if (spiceJar) {
        spiceJar.rotation.y += 0.01;
        spiceJar.rotation.x = Math.sin(time * 0.5) * 0.1;
    }

    // Animate floating spices
    floatingSpices.forEach((spice, index) => {
        spice.rotation.x += spice.rotationSpeed.x;
        spice.rotation.y += spice.rotationSpeed.y;
        spice.rotation.z += spice.rotationSpeed.z;
        
        // Floating motion
        spice.position.y += Math.sin(time + spice.floatOffset) * 0.01;
    });

    renderer.render(scene, camera);
}

// Initialize Three.js when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer && renderer.domElement) {
        renderer.domElement.remove();
    }
});

