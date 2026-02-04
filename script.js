document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Resize canvas
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -Math.random() * 2 - 0.5; // Upward movement
            this.size = Math.random() * 3 + 1;
            this.life = Math.random() * 100 + 50;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.8 ? '255, 69, 0' : '255, 165, 0'; // Red-Orange and Orange
            this.isSpark = Math.random() > 0.9; // 10% chance to be a bright spark
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            this.opacity -= 0.005;

            if (this.isSpark) {
                this.opacity = Math.random() * 0.8 + 0.2; // Flicker
            }

            if (this.life <= 0 || this.y < -50 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            if (this.isSpark) {
                ctx.fillStyle = `rgba(255, 255, 200, ${this.opacity})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'white';
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            } else {
                // Smoke/Dust particle
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.shadowBlur = 0;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            }
            ctx.fill();
        }
    }

    // Create particles
    function initParticles() {
        particles = [];
        // Performance: Disable particles on mobile to save battery/CPU
        if (window.innerWidth < 600) return;

        const particleCount = window.innerWidth < 1024 ? 50 : 150;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
            particles[i].y = Math.random() * height;
        }
    }

    initParticles();

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (particles.length > 0) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Mobile Menu Toggle logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking a link (especially useful for hash links)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
