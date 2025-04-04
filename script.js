// Mobile Navigation Toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add animation to skill bars
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
        }
    });
}, observerOptions);

// Animation for projects on scroll
window.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars when they come into view
    document.querySelectorAll('.progress').forEach(progress => {
        progress.style.width = '0';
        progress.dataset.width = progress.style.width;
        observer.observe(progress);
    });
});