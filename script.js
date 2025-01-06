
// Particle Canvas, declared variables
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Reinitialize particles on resize
});

// Declared variable for particles
let particles = [];

const mouse = {
    x: null,
    y: null
};

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Reset mouse position on leave
canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});


// Define Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocity = {
            x: (Math.random() * 2 - 1) * 0.001,
            y: (Math.random() * 2 - 1) * 0.001,
        };
    }

    // Update particle position
    update() {
        const speedFactor = 0.5;
        this.x += this.velocity.x  * speedFactor;
        this.y += this.velocity.y  * speedFactor;

        const bounceDamping = 0.8;

        // Bounce particles off the walls
        if (this.x <= 0 || this.x >= canvas.width) { this.velocity.x *= -bounceDamping;
        }

        if (this.y <= 0 || this.y >= canvas.height) { this.velocity.y *= -bounceDamping;
        }
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 65;
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.shadowBlur = 0;
    }

    // Interaction logic
    interact(particles) {
        particles.forEach((other) => {
            if (other !== this) {
                const distance = calculateDistance(this, other);
                if (distance < 100) {
                    // Attraction/repulsion logic
                    this.velocity.x += (other.x - this.x) * 0.001;
                    this.velocity.y += (other.y - this.y) * 0.001;
                }
            }
        });

        // Damption after attraction
        const dampingFactor = 0.999;
        this.velocity.x *= dampingFactor;
        this.velocity.y *= dampingFactor;

        // Interaction(particles) with mouse
        if (mouse.x && mouse.y) {
            const distanceToMouse = calculateDistance(this, mouse);
            if (distanceToMouse < 150) {
            const forceDirection = {
                x: mouse.x - this.x,
                y: mouse.y - this.y
        };

        const forceMagnitude = (150 - distanceToMouse) / 150;

        const repulsionStrength = 0.1;
        this.velocity.x += forceDirection.x * forceMagnitude * repulsionStrength;
        this.velocity.y += forceDirection.y * forceMagnitude * repulsionStrength;
    }

}
    
}

}

// Calculate distance between two particles
function calculateDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Initialize particles
function init() {
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

// Function to count particles attracted to the mouse
function countAttractedParticles() {
    let count = 0;
    if (mouse.x && mouse.y) {
        particles.forEach((particle) => {
            const distanceToMouse = calculateDistance(particle, mouse);
            if (distanceToMouse < 150) {
                count++;
            }
        });
    }

    return count;
}


// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.interact(particles);
        particle.update();
        particle.draw();
    });

    // Display the number of attracted particles
    const attractCount = countAttractedParticles();
    ctx.font = '24px Arial';
    ctx.fillStyle = 'cyan';
    ctx.shadowColor = 'cyan';
    ctx.shadowBlur = 40;
    ctx.fillText(`Particles Attracted: `, 20, 40);

    ctx.fillStyle = 'white';
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 20;
    ctx.fillText(`${attractCount}`, 235, 41);

    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
}

// Start the simulation
init();
animate();




