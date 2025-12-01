// Create background particles
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size and position
        const size = Math.random() * 80 + 30;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// Initialize form with sample data for demo
function initializeForm() {
    // Only initialize if we're on the index page
    if (!document.getElementById('open_1')) return;
    
    const sampleData = {
        'open_1': 415.50,
        'high_1': 418.75,
        'low_1': 414.20,
        'close_1': 417.80,
        'volume_1': 5421800,
        'vwap_1': 416.45,
        'open_2': 417.50,
        'high_2': 419.25,
        'low_2': 416.30,
        'close_2': 418.40,
        'volume_2': 5124500,
        'vwap_2': 417.85,
        'open_3': 418.20,
        'high_3': 420.50,
        'low_3': 417.60,
        'close_3': 419.75,
        'volume_3': 4987600,
        'vwap_3': 419.10
    };
    
    for (const [key, value] of Object.entries(sampleData)) {
        const element = document.getElementById(key);
        if (element) {
            element.value = value;
        }
    }
}

// Add input validation and formatting
function setupInputValidation() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isNaN(this.value)) {
                // Format to 2 decimal places for price inputs
                if (this.name.includes('open') || this.name.includes('high') || 
                    this.name.includes('low') || this.name.includes('close') || 
                    this.name.includes('vwap')) {
                    this.value = parseFloat(this.value).toFixed(2);
                }
            }
        });
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initializeForm();
    setupInputValidation();
    
    // Add form submission handler
    const form = document.querySelector('.stock-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<div class="loading"></div> Processing...';
                submitBtn.disabled = true;
            }
        });
    }
});