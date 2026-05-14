// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Stop scrolling initially
lenis.stop();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
    });
    if (cursor.style.opacity === "0") {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
});

// Heart Burst Animation for Splash Screen
function createHeartBurst(x, y) {
    const burstCanvas = document.createElement('canvas');
    burstCanvas.style.position = 'fixed';
    burstCanvas.style.inset = '0';
    burstCanvas.style.zIndex = '10001';
    burstCanvas.style.pointerEvents = 'none';
    document.body.appendChild(burstCanvas);

    burstCanvas.width = window.innerWidth;
    burstCanvas.height = window.innerHeight;
    const bctx = burstCanvas.getContext('2d');

    let burstHearts = Array.from({ length: 50 }, () => ({
        x: x,
        y: y,
        size: Math.random() * 12 + 8,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 20 + 10,
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
    }));

    function animateBurst() {
        bctx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
        let active = false;

        burstHearts.forEach(h => {
            h.x += Math.cos(h.angle) * h.speed;
            h.y += Math.sin(h.angle) * h.speed;
            h.speed *= 0.95; // Friction
            h.opacity -= 0.012;
            h.rotation += h.rotationSpeed;

            if (h.opacity > 0) {
                active = true;
                drawBurstHeart(bctx, h);
            }
        });

        if (active) {
            requestAnimationFrame(animateBurst);
        } else {
            burstCanvas.remove();
        }
    }

    function drawBurstHeart(ctx, h) {
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.globalAlpha = h.opacity;
        ctx.fillStyle = '#D4AF37'; // Gold

        const s = h.size;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(0, s * 0.3, -s * 0.05, 0, -s * 0.5, 0);
        ctx.bezierCurveTo(-s * 1.1, 0, -s * 1.1, s * 0.75, -s * 1.1, s * 0.75);
        ctx.bezierCurveTo(-s * 1.1, s * 1.1, -s * 0.75, s * 1.54, 0, s * 2.1);
        ctx.bezierCurveTo(s * 0.75, s * 1.54, s * 1.1, s * 1.1, s * 1.1, s * 0.75);
        ctx.bezierCurveTo(s * 1.1, s * 0.75, s * 1.1, 0, s * 0.5, 0);
        ctx.bezierCurveTo(s * 0.05, 0, 0, s * 0.3, 0, s * 0.3);
        ctx.fill();
        ctx.restore();
    }

    animateBurst();
}

// Hero Section Entry (Wrapped in a function)
const startWebsite = () => {
    window.scrollTo(0, 0);
    if (lenis) lenis.scrollTo(0, { immediate: true });

    // Trigger Heart Burst
    const btn = document.getElementById('open-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    const tl = gsap.timeline();

    tl.to('#splash-card', {
        opacity: 0,
        scale: 1.2, // Scale up slightly for a more "bursting" feel
        filter: 'blur(20px)',
        duration: 1.2,
        ease: "power3.inOut"
    })
        .to('#splash-screen', {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=0.8")
        .to('#hero-zoom-bg', {
            scale: 1,
            duration: 2,
            ease: "power2.out"
        }, "-=1.2")
        .add(() => {
            // Initial reveal for Hero 1
            gsap.to('#intro-text', { opacity: 1, y: -10, duration: 1, ease: "power2.out" });
            gsap.set('#typing-text', { opacity: 1 });
            typeText('typing-text', "THANJAI PONNU");
            gsap.fromTo('#blur-text',
                { opacity: 0, filter: 'blur(20px)', scale: 0.9 },
                { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2, delay: 1.5, ease: "power2.out" }
            );

            lenis.start();
            document.getElementById('splash-screen').style.display = 'none';
            ScrollTrigger.refresh();
        });
};

// Reusable Typing Animation Function
function typeText(elementId, text, speed = 0.1) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        el.appendChild(span);
        gsap.to(span, {
            opacity: 1,
            delay: i * speed,
            duration: 0.1,
            ease: "none"
        });
    });
}

// Hero Section 1 Content Animation (For Scroll Re-entry)
ScrollTrigger.create({
    trigger: "#hero-zoom-section",
    start: "top 20%",
    onEnterBack: () => {
        gsap.to('#intro-text', { opacity: 1, y: -10, duration: 1, ease: "power2.out" });
        gsap.set('#typing-text', { opacity: 1 });
        typeText('typing-text', "THANJAI PONNU");
        gsap.fromTo('#blur-text',
            { opacity: 0, filter: 'blur(20px)', scale: 0.9 },
            { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2, delay: 1.5, ease: "power2.out" }
        );
    },
    onLeave: () => {
        gsap.set(['#intro-text', '#typing-text', '#blur-text'], { opacity: 0, y: 0 });
    },
    onLeaveBack: () => {
        gsap.set(['#intro-text', '#typing-text', '#blur-text'], { opacity: 0, y: 0 });
    }
});

// Open Button Listener
document.getElementById('open-btn').addEventListener('click', startWebsite);

// Scroll Reveals
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

reveals.forEach((el) => {
    let x = 0;
    let y = 50;

    if (el.classList.contains('reveal-left')) {
        x = -100;
        y = 0;
    } else if (el.classList.contains('reveal-right')) {
        x = 100;
        y = 0;
    }

    gsap.fromTo(el,
        {
            opacity: 0,
            x: x,
            y: y
        },
        {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Hero Image Parallax
gsap.to('#hero-img', {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Fireworks Animation logic
class Petal {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20 - Math.random() * 100;
        this.size = Math.random() * 6 + 4;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 1 - 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.color = Math.random() > 0.5 ? '#FF9F43' : '#FAD02E'; // Orange or Yellow
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 1 + this.wind;
        this.angle += 0.02;
        this.rotation += this.rotationSpeed;

        if (this.y > this.canvas.height + 20) {
            this.reset();
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.beginPath();
        // Draw a simple petal shape
        this.ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    }
}

class Firework {
    constructor(canvas, ctx, isBig = false) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isBig = isBig;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height;
        this.targetY = Math.random() * (this.canvas.height * 0.5);
        this.speed = this.isBig ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3;
        this.particles = [];
        this.hue = Math.random() * 360;
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }

        this.particles.forEach((p, i) => {
            p.update();
            if (p.alpha <= 0) this.particles.splice(i, 1);
        });

        if (this.exploded && this.particles.length === 0) {
            this.reset();
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = this.isBig ? 150 : 50;
        const speedMultiplier = this.isBig ? 2 : 1;
        for (let i = 0; i < particleCount; i++) {
            const p = new Particle(this.x, this.y, this.ctx, this.hue);
            if (this.isBig) {
                p.speed *= speedMultiplier;
                p.decay *= 0.5; // Last longer
            }
            this.particles.push(p);
        }
    }

    draw() {
        if (!this.exploded) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        this.particles.forEach(p => p.draw());
    }
}

class Particle {
    constructor(x, y, ctx, hue) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.hue = hue;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 2;
        this.friction = 0.95;
        this.gravity = 0.1;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
    }

    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        this.ctx.fill();
        this.ctx.restore();
    }
}

const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let petals = [];
let fireworksAnimation;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 8; i++) {
    fireworks.push(new Firework(canvas, ctx));
}
// Add big fireworks
for (let i = 0; i < 2; i++) {
    fireworks.push(new Firework(canvas, ctx, true));
}

for (let i = 0; i < 40; i++) {
    petals.push(new Petal(canvas, ctx));
}

const animateFireworks = () => {
    // Clear with a slight fade effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(15, 12, 41, 0.2)'; // Match deep indigo start of gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; // Glow effect

    // Update and Draw Petals
    ctx.globalCompositeOperation = 'source-over'; // Standard mode for petals
    petals.forEach(p => {
        p.update();
        p.draw();
    });

    // Update and Draw Fireworks
    ctx.globalCompositeOperation = 'lighter';
    fireworks.forEach(f => {
        f.update();
        f.draw();
    });
    fireworksAnimation = requestAnimationFrame(animateFireworks);
};

animateFireworks();

// Hero Scroll Zoom Effect (Section 1 - Zoom In)
gsap.to("#hero-zoom-bg", {
    scale: 1.5,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero-zoom-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Hero Scroll Zoom Effect (Section 2 - Zoom Out)
gsap.fromTo("#hero-zoom-bg-2",
    { scale: 1.5 },
    {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero-zoom-section-2",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    }
);

// Text Animations for Section 2 (Triggered on Scroll)
ScrollTrigger.create({
    trigger: "#hero-zoom-section-2",
    start: "top 60%",
    onEnter: () => {
        gsap.to('#intro-text-2', { opacity: 1, y: -10, duration: 1, ease: "power2.out" });
        gsap.set('#typing-text-2', { opacity: 1 });
        typeText('typing-text-2', "DHARMAPURI MAPLA");
        gsap.fromTo('#blur-text-2',
            { opacity: 0, filter: 'blur(20px)', scale: 0.9 },
            { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2, delay: 1.5, ease: "power2.out" }
        );
    },
    onEnterBack: () => {
        gsap.to('#intro-text-2', { opacity: 1, y: -10, duration: 1, ease: "power2.out" });
        gsap.set('#typing-text-2', { opacity: 1 });
        typeText('typing-text-2', "DHARMAPURI MAPLA");
        gsap.fromTo('#blur-text-2',
            { opacity: 0, filter: 'blur(20px)', scale: 0.9 },
            { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2, delay: 1.5, ease: "power2.out" }
        );
    },
    onLeave: () => {
        gsap.set(['#intro-text-2', '#typing-text-2', '#blur-text-2'], { opacity: 0, y: 0 });
    },
    onLeaveBack: () => {
        gsap.set(['#intro-text-2', '#typing-text-2', '#blur-text-2'], { opacity: 0, y: 0 });
    }
});

// Story Section Decorations Animation (Festive Sway/Shake)
gsap.to(".marigold-garland", {
    rotation: 4,
    x: 10,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: {
        each: 0.4,
        from: "center"
    }
});

function animateLeavesTick() {
    lctx.clearRect(0, 0, leafCanvas.width, leafCanvas.height);
    leaves.forEach(leaf => {
        leaf.update();
        leaf.draw(lctx);
    });
}

ScrollTrigger.create({
    trigger: "#decoration-section",
    start: "top 70%",
    onEnter: () => {
        const tl = gsap.timeline();
        tl.to("#trees-bg", { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" })
            .fromTo("#thiru-arch",
                { opacity: 0, y: 500, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 2.5, ease: "power4.out" },
                "-=0.8"
            )
            .to("#couple-container", { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "-=1.2");

        if (leaves.length === 0) initLeaves();
        gsap.ticker.add(animateLeavesTick);
    },
    onLeave: () => gsap.ticker.remove(animateLeavesTick),
    onEnterBack: () => {
        gsap.ticker.add(animateLeavesTick);
        // Sequential reveal on scroll back
        const tl = gsap.timeline();
        tl.to("#trees-bg", { opacity: 1, y: 0, duration: 1 })
            .to("#thiru-arch", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
            .to("#couple-container", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    },
    onLeaveBack: () => {
        gsap.ticker.remove(animateLeavesTick);
        gsap.set(["#trees-bg", "#thiru-arch", "#couple-container"], { opacity: 0, y: 300 });
    }
});

// Invitation Section Reveal
let hearts = [];
const heartCanvas = document.getElementById('heart-canvas');
const hctx = heartCanvas ? heartCanvas.getContext('2d') : null;

function initHearts() {
    if (!heartCanvas) return;
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
    hearts = Array.from({ length: 30 }, () => new Heart(heartCanvas));
}

function animateHeartsTick() {
    if (!hctx) return;
    hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw(hctx);
    });
}

class Heart {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.8 + 0.4; // Slow float up
        this.opacity = Math.random() * 0.4 + 0.2;
        this.swing = Math.random() * 2 + 1;
        this.swingSpeed = Math.random() * 0.01 + 0.005;
    }
    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * this.swingSpeed) * this.swing;
        if (this.y < -20) this.reset();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#C5A059'; // Gold Theme Color

        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(0, s * 0.3, -s * 0.05, 0, -s * 0.5, 0);
        ctx.bezierCurveTo(-s * 1.1, 0, -s * 1.1, s * 0.75, -s * 1.1, s * 0.75);
        ctx.bezierCurveTo(-s * 1.1, s * 1.1, -s * 0.75, s * 1.54, 0, s * 2.1);
        ctx.bezierCurveTo(s * 0.75, s * 1.54, s * 1.1, s * 1.1, s * 1.1, s * 0.75);
        ctx.bezierCurveTo(s * 1.1, s * 0.75, s * 1.1, 0, s * 0.5, 0);
        ctx.bezierCurveTo(s * 0.05, 0, 0, s * 0.3, 0, s * 0.3);
        ctx.fill();
        ctx.restore();
    }
}

ScrollTrigger.create({
    trigger: "#invitation-section",
    start: "top 60%",
    onEnter: () => {
        gsap.to("#invitation-content", {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            filter: "blur(0px)",
            startAt: { filter: "blur(10px)" }
        });
        if (hearts.length === 0) initHearts();
        gsap.ticker.add(animateHeartsTick);
    },
    onLeave: () => gsap.ticker.remove(animateHeartsTick),
    onEnterBack: () => {
        gsap.to("#invitation-content", { opacity: 1, scale: 1, duration: 1.5 });
        gsap.ticker.add(animateHeartsTick);
    },
    onLeaveBack: () => {
        gsap.set("#invitation-content", { opacity: 0, scale: 0.95 });
        gsap.ticker.remove(animateHeartsTick);
    }
});

// Leaf Animation for Story Section
class Leaf {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 15 + 10;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 0.4 + 0.2; // Slow fall
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.5 - 0.25; // Gentle rotation
        this.color = `hsl(${100 + Math.random() * 40}, 70%, ${30 + Math.random() * 20}%)`; // Green shades
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.005) * 1.2; // Softer drift
        this.rotation += this.rotationSpeed;
        if (this.y > this.canvas.height) {
            this.y = -20;
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        // Simple Leaf Shape
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2);
        ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2);
        ctx.fill();

        // Leaf vein
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(0, this.size / 2);
        ctx.stroke();

        ctx.restore();
    }
}

const leafCanvas = document.getElementById('leaf-canvas');
const lctx = leafCanvas.getContext('2d');
let leaves = [];

function initLeaves() {
    leafCanvas.width = window.innerWidth;
    leafCanvas.height = window.innerHeight;
    leaves = Array.from({ length: 40 }, () => new Leaf(leafCanvas));
}

function animateLeaves() {
    lctx.clearRect(0, 0, leafCanvas.width, leafCanvas.height);
    leaves.forEach(leaf => {
        leaf.update();
        leaf.draw(lctx);
    });
    requestAnimationFrame(animateLeaves);
}

window.addEventListener('resize', initLeaves);
window.addEventListener('resize', initHearts);

// Leaf animation is now handled in the decoration-section ScrollTrigger above

// Interactive Form Elements
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(cursor, { scale: 3, duration: 0.3 });
    });
    input.addEventListener('blur', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
});

// Update startWebsite to stop fireworks
const originalStartWebsite = startWebsite;
const startWebsiteWithCleanup = () => {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');

    if (music) {
        music.play().then(() => {
            if (musicBtn) {
                gsap.to(musicBtn, { opacity: 1, pointerEvents: 'auto', duration: 1, delay: 2 });
            }
        }).catch(e => console.log("Audio playback failed:", e));
    }

    cancelAnimationFrame(fireworksAnimation);
    originalStartWebsite();
};

// Music Toggle Logic
const musicBtn = document.getElementById('music-toggle');
const music = document.getElementById('bg-music');
const musicOnIcon = document.getElementById('music-on-icon');
const musicOffIcon = document.getElementById('music-off-icon');

if (musicBtn && music) {
    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicOnIcon.classList.remove('hidden');
            musicOffIcon.classList.add('hidden');
        } else {
            music.pause();
            musicOnIcon.classList.add('hidden');
            musicOffIcon.classList.remove('hidden');
        }
    });
}
document.getElementById('open-btn').removeEventListener('click', startWebsite);
document.getElementById('open-btn').addEventListener('click', startWebsiteWithCleanup);
// Section Snapping Logic
const sections = document.querySelectorAll('section.snap-start');
if (sections.length > 0) {
    ScrollTrigger.create({
        trigger: "main", // Changed to main container to cover all sections
        start: "top top",
        end: "bottom bottom",
        snap: {
            snapTo: 1 / (sections.length - 1),
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power2.inOut"
        }
    });
}

// Welcome Section Animation
ScrollTrigger.create({
    trigger: "#welcome-section",
    start: "top 60%",
    onEnter: () => {
        const tl = gsap.timeline();
        tl.to("#welcome-subtitle", { opacity: 1, y: -20, duration: 1, ease: "power2.out" })
            .to("#welcome-title", {
                opacity: 1,
                y: -20,
                duration: 1.5,
                ease: "power3.out",
                filter: "blur(0px)",
                startAt: { filter: "blur(20px)" }
            }, "-=0.5")
            .to(".welcome-line", { scaleX: 1, opacity: 1, duration: 1, ease: "power2.inOut" }, "-=0.8")
            .to(".welcome-text", { opacity: 1, y: -10, duration: 1, ease: "power2.out" }, "-=0.5")
            .to(".welcome-image", { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=0.5");

        // Background subtle movement
        gsap.to("#welcome-section .bg-repeat", {
            backgroundPosition: "100px 100px",
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    },
    onLeaveBack: () => {
        gsap.set(["#welcome-subtitle", "#welcome-title", ".welcome-text", ".welcome-image"], { opacity: 0, y: 0 });
        gsap.set(".welcome-line", { scaleX: 0, opacity: 0 });
        gsap.set(".welcome-image", { scale: 0.8 });
    }
});

// Save the Date: Scratch Card Logic
const scratchCanvas = document.getElementById('scratch-canvas');
const sctx = scratchCanvas ? scratchCanvas.getContext('2d', { willReadFrequently: true }) : null;
let isDragging = false;

function initScratchCard() {
    if (!scratchCanvas || !sctx) return;

    const container = scratchCanvas.parentElement;
    scratchCanvas.width = container.offsetWidth;
    scratchCanvas.height = container.offsetHeight;

    // Fill with scratchable layer - Deep Red/Maroon
    sctx.fillStyle = '#8B0000';
    sctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Add Gold pattern to the scratch layer
    sctx.globalCompositeOperation = 'source-over';
    sctx.strokeStyle = '#D4AF37';
    sctx.lineWidth = 1;
    sctx.globalAlpha = 0.2;
    for (let i = 0; i < 40; i++) {
        sctx.beginPath();
        sctx.moveTo(Math.random() * scratchCanvas.width, 0);
        sctx.lineTo(Math.random() * scratchCanvas.width, scratchCanvas.height);
        sctx.stroke();
    }
    sctx.globalAlpha = 1;

    // Reset composite for scratching
    sctx.globalCompositeOperation = 'destination-out';
}

function scratch(e) {
    if (!isDragging || !sctx) return;

    const rect = scratchCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    sctx.beginPath();
    sctx.arc(x, y, 30, 0, Math.PI * 2);
    sctx.fill();

    checkScratchPercentage();
}

function checkScratchPercentage() {
    const imageData = sctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    if (percentage > 50) {
        gsap.to(scratchCanvas, {
            opacity: 0, duration: 1, onComplete: () => {
                scratchCanvas.style.display = 'none';
                startCelebration();
            }
        });
    }
}

// Celebration (Balloons & Confetti)
let celebrationActive = false;
let balloons = [];
let confetti = [];
const celebCanvas = document.getElementById('celebration-canvas');
const cctx = celebCanvas ? celebCanvas.getContext('2d') : null;

// Theme Colors for Celebration
const themeColors = ['#FF0000', '#D4AF37']; // Red and Gold

class Balloon {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 100;
        this.radius = Math.random() * 20 + 25;
        this.speedY = Math.random() * 1.5 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.color = '#FF0000'; // Pure Red for Hearts
        this.stringLen = this.radius * 3;
    }
    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y / 50) * 1.5;
        if (this.y < -200) this.reset();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = 0.8;

        // String
        ctx.beginPath();
        ctx.moveTo(0, this.radius);
        ctx.bezierCurveTo(5, this.radius + 10, -5, this.radius + 20, 0, this.radius + this.stringLen);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.stroke();

        // Heart Shape
        const s = this.radius;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(0, s * 0.3, -s * 0.05, 0, -s * 0.5, 0);
        ctx.bezierCurveTo(-s * 1.1, 0, -s * 1.1, s * 0.75, -s * 1.1, s * 0.75);
        ctx.bezierCurveTo(-s * 1.1, s * 1.1, -s * 0.75, s * 1.54, 0, s * 2.1);
        ctx.bezierCurveTo(s * 0.75, s * 1.54, s * 1.1, s * 1.1, s * 1.1, s * 0.75);
        ctx.bezierCurveTo(s * 1.1, s * 0.75, s * 1.1, 0, s * 0.5, 0);
        ctx.bezierCurveTo(s * 0.05, 0, 0, s * 0.3, 0, s * 0.3);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(-s * 0.4, s * 0.4, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();

        ctx.restore();
    }
}

class ConfettiPiece {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        // Only use theme colors
        this.color = themeColors[Math.floor(Math.random() * themeColors.length)];
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        if (this.y > this.canvas.height + 20) this.reset();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startCelebration() {
    if (celebrationActive || !celebCanvas) return;
    celebrationActive = true;
    celebCanvas.width = window.innerWidth;
    celebCanvas.height = window.innerHeight;

    balloons = Array.from({ length: 15 }, () => new Balloon(celebCanvas));
    confetti = Array.from({ length: 80 }, () => new ConfettiPiece(celebCanvas));

    gsap.ticker.add(animateCelebration);

    // Stop celebration after 2 minutes (120,000 ms)
    setTimeout(() => {
        stopCelebration();
    }, 120000);
}

function animateCelebration() {
    if (!cctx) return;
    cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);

    balloons.forEach(b => {
        b.update();
        b.draw(cctx);
    });

    confetti.forEach(c => {
        c.update();
        c.draw(cctx);
    });
}

function stopCelebration() {
    celebrationActive = false;
    gsap.ticker.remove(animateCelebration);

    // Fade out canvas
    gsap.to(celebCanvas, {
        opacity: 0,
        duration: 2,
        onComplete: () => {
            if (cctx) cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
            balloons = [];
            confetti = [];
            celebCanvas.style.opacity = 1; // Reset for next time if needed
        }
    });
}

if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', () => isDragging = true);
    scratchCanvas.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
    scratchCanvas.addEventListener('mousemove', scratch);
    scratchCanvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); }, { passive: false });
}

// Save the Date: Countdown Logic
function updateCountdown() {
    const weddingDate = new Date('May 29, 2026 06:00:00').getTime();
    const now = new Date().getTime();
    const gap = weddingDate - now;

    if (gap < 0) {
        document.getElementById('countdown').innerHTML = "<h3 class='text-secondary font-playfair text-3xl'>The Big Day is Here!</h3>";
        return;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('mins').innerText = m.toString().padStart(2, '0');
    document.getElementById('secs').innerText = s.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Window Resize Handling
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    initScratchCard();
});

// Trigger Init
window.addEventListener('load', initScratchCard);
ScrollTrigger.addEventListener('refreshInit', initScratchCard);
