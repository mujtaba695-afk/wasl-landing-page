document.addEventListener('DOMContentLoaded', () => {
    // 1. RE-IMPLEMENTING COUNTERS (DIGITS)
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = (stat) => {
        const targetAttr = stat.getAttribute('data-target');
        if (!targetAttr) return;
        const target = parseInt(targetAttr);
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current);
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateStats(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => statsObserver.observe(stat));

    // 2. EFFICIENCY CALCULATOR LOGIC
    const hcInput = document.getElementById('calc-headcount');
    const hcVal = document.getElementById('calc-headcount-val');
    const densityInput = document.getElementById('calc-density');
    const totalOutput = document.getElementById('calc-total');

    const updateCalc = () => {
        if (!hcInput || !hcVal || !totalOutput) return;
        const hc = parseInt(hcInput.value);
        hcVal.innerText = hc;

        let multiplier = 150;
        if (densityInput.value === 'agile') multiplier = 120;
        if (densityInput.value === 'executive') multiplier = 200;

        const total = (hc * multiplier).toLocaleString();
        totalOutput.innerText = total;
    };

    if (hcInput) {
        hcInput.addEventListener('input', updateCalc);
        densityInput.addEventListener('change', updateCalc);
        updateCalc(); // Initial run
    }

    // 3. TRI-PATH LEAD GEN LOGIC (MODERN SLIDE-OVER)
    const slideOver = document.getElementById('calc-slide-over');
    const overlay = document.getElementById('calc-overlay');
    const openBtns = document.querySelectorAll('.open-calc-form');
    const closeBtn = document.querySelector('.close-slide');
    const interactionNote = document.getElementById('calc-interaction-note');
    const stickyHub = document.querySelector('.sticky-hub');
    const ctaSourceInput = document.getElementById('form-source-cta');

    let headcountInteracted = false;
    let densityInteracted = false;

    if (hcInput) {
        hcInput.addEventListener('mousedown', () => { headcountInteracted = true; });
        hcInput.addEventListener('touchstart', () => { headcountInteracted = true; });
        hcInput.addEventListener('change', () => { headcountInteracted = true; });
    }

    if (densityInput) {
        densityInput.addEventListener('change', () => {
            if (densityInput.value !== "") {
                densityInteracted = true;
                densityInput.classList.remove('calc-invalid');
            }
        });
    }

    const toggleSlide = (active) => {
        if (slideOver) slideOver.classList.toggle('active', active);
        if (overlay) overlay.classList.toggle('active', active);
    };

    // Handle all trigger buttons
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const source = btn.getAttribute('data-cta') || 'General';

            // Validation for Calculator specific path
            if (source === 'Calculator') {
                if (!headcountInteracted || !densityInteracted) {
                    e.preventDefault();
                    if (interactionNote) {
                        interactionNote.style.display = 'block';
                        interactionNote.classList.add('shake');
                        setTimeout(() => interactionNote.classList.remove('shake'), 400);
                    }
                    if (!headcountInteracted && hcInput) hcInput.classList.add('calc-invalid');
                    if (!densityInteracted && densityInput) densityInput.classList.add('calc-invalid');
                    return;
                }
            }

            // Sync source and open
            if (ctaSourceInput) ctaSourceInput.value = source;
            if (interactionNote) interactionNote.style.display = 'none';
            toggleSlide(true);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => toggleSlide(false));
    if (overlay) overlay.addEventListener('click', () => toggleSlide(false));

    // Sticky Hub Visibility on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            stickyHub?.classList.add('visible');
        } else {
            stickyHub?.classList.remove('visible');
        }
    });

    // Modern Field Validation (Number-only phone, Email restrict)
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Strictly numbers
        });
    }

    const calcLeadForm = document.getElementById('calcLeadForm');
    if (calcLeadForm) {
        calcLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = calcLeadForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Transmitting to Advisor...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Request Received. A Cushman & Wakefield expert will contact you within 2 hours.');
                calcLeadForm.reset();
                toggleSlide(false);
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1200);
        });
    }

    // 4. ELITE UI REFINEMENTS (MAGNETIC & TILT)
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .whatsapp-float');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    const tiltCards = document.querySelectorAll('.card-3d, .calc-container');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = x - xc;
            const dy = y - yc;
            card.style.transform = `perspective(1000px) rotateX(${-dy / 60}deg) rotateY(${dx / 60}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });

    // 5. REVEAL ON SCROLL (GLOBAL)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.card, .connectivity-item, .stat-item, .calc-container, .property-content-container, .property-image-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    const revealStyle = document.createElement('style');
    revealStyle.innerHTML = `.reveal { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(revealStyle);

    // 6. MAIN CONTACT FORM STEPS
    const steps = document.querySelectorAll('.form-step');
    const progressDots = document.querySelectorAll('.progress-dot');
    const nextBtns = document.querySelectorAll('.next-step');
    const leadFormMain = document.getElementById('leadForm');
    let currentStepIdx = 0;

    const updateMainForm = () => {
        steps.forEach((step, i) => step.classList.toggle('active', i === currentStepIdx));
        progressDots.forEach((dot, i) => dot.classList.toggle('active', i <= currentStepIdx));
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStepIdx < steps.length - 1) {
                currentStepIdx++;
                updateMainForm();
            }
        });
    });

    if (leadFormMain) {
        leadFormMain.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = leadFormMain.querySelector('button[type="submit"]');
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Success! A Commercial Consultant will reach out shortly.');
                leadFormMain.reset();
                currentStepIdx = 0;
                updateMainForm();
                submitBtn.innerText = 'Request Concierge Call';
                submitBtn.disabled = false;
            }, 1200);
        });
    }
});
