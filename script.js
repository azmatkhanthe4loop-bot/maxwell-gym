document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');

    // Only run canvas animation if canvas exists (homepage)
    if (canvas) {
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
                this.vy = -Math.random() * 2 - 0.5;
                this.size = Math.random() * 3 + 1;
                this.life = Math.random() * 100 + 50;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.8 ? '255, 69, 0' : '255, 165, 0';
                this.isSpark = Math.random() > 0.9;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;
                this.opacity -= 0.005;

                if (this.isSpark) {
                    this.opacity = Math.random() * 0.8 + 0.2;
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
                    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                    ctx.shadowBlur = 0;
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                }
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            if (window.innerWidth < 600) return;

            const particleCount = window.innerWidth < 1024 ? 50 : 150;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
                particles[i].y = Math.random() * height;
            }
        }

        initParticles();

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
    }

    // Mobile Menu Toggle - Works on all pages
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isActive = navLinks.classList.contains('active');

            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a navigation link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize - close menu if resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
