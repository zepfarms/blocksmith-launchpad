// Mobile Menu
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your inquiry. We will contact you shortly.');
        contactForm.reset();
    });
}

// Scroll Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .expertise-card, .team-member, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Stat Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');
const animateStats = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalText = target.textContent;
            const hasPlus = finalText.includes('+');
            const hasPercent = finalText.includes('%');
            const numericPart = parseInt(finalText.replace(/[^0-9]/g, ''));
            
            if (!isNaN(numericPart)) {
                let current = 0;
                const increment = numericPart / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericPart) {
                        target.textContent = numericPart + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                    }
                }, 20);
            }
            
            observer.unobserve(target);
        }
    });
};

const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
statNumbers.forEach(stat => statsObserver.observe(stat));