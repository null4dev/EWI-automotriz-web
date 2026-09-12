// ==============================================
// DRIVE - Script de Interactividad & Slider
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Control de Scroll en Header (Transparente a Sólido) ---
    const siteHeader = document.getElementById('siteHeader');
    function handleHeaderScroll() {
        if (!siteHeader) return;
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // --- 1. Navegación Móvil ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (siteHeader && isOpen) {
                siteHeader.classList.add('scrolled');
            } else if (siteHeader && window.scrollY <= 40) {
                siteHeader.classList.remove('scrolled');
            }
        });

        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                if (siteHeader && window.scrollY <= 40) {
                    siteHeader.classList.remove('scrolled');
                }
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                if (siteHeader && window.scrollY <= 40) {
                    siteHeader.classList.remove('scrolled');
                }
            }
        });
    }

    // --- 2. Slider Hero con soporte Touch/Swipe, temporizador de 15s y barra de progreso ---
    const slides = document.querySelectorAll('.slide-item');
    const sliderSection = document.getElementById('slider');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const progressFill = document.getElementById('sliderProgressFill');
    const SLIDE_DURATION = 15000;
    let currentSlide = 0;
    let slideTimer;
    let progressStartTime;
    let progressRafId;

    function updateProgressBar() {
        if (!progressFill) return;
        const elapsed = performance.now() - progressStartTime;
        const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        progressFill.style.width = `${progress}%`;

        if (progress < 100) {
            progressRafId = requestAnimationFrame(updateProgressBar);
        }
    }

    function resetProgress() {
        if (progressRafId) cancelAnimationFrame(progressRafId);
        if (progressFill) progressFill.style.width = '0%';
        progressStartTime = performance.now();
        progressRafId = requestAnimationFrame(updateProgressBar);
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
        resetProgress();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startSliderTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, SLIDE_DURATION);
    }

    function restartSlider() {
        startSliderTimer();
        resetProgress();
    }

    if (slides.length > 0) {
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                restartSlider();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                restartSlider();
            });
        }

        // Soporte gestual táctil para móviles (Swipe izquierda / derecha)
        if (sliderSection) {
            let touchStartX = 0;
            let touchEndX = 0;

            sliderSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            sliderSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diffX = touchStartX - touchEndX;
                if (Math.abs(diffX) > 45) {
                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    restartSlider();
                }
            }, { passive: true });
        }

        showSlide(0);
        startSliderTimer();
    }

    // --- 3. Modal de Citas / Asignación ---
    const modal = document.getElementById('appointmentModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalForm = document.getElementById('appointmentForm');
    const modalConfirmed = document.getElementById('modalConfirmed');
    const closeConfirmedBtn = document.getElementById('closeConfirmedBtn');
    const headerCtaBtn = document.getElementById('headerCtaBtn');
    const vehicleSelect = document.getElementById('clientVehicle');

    window.openAppointmentModal = function(vehicleName) {
        if (!modal) return;
        if (vehicleName && vehicleSelect) {
            for (let option of vehicleSelect.options) {
                if (option.value === vehicleName || option.text.includes(vehicleName)) {
                    vehicleSelect.value = option.value;
                    break;
                }
            }
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (modalForm) {
                modalForm.reset();
                modalForm.style.display = 'block';
            }
            if (modalConfirmed) modalConfirmed.style.display = 'none';
        }, 300);
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (closeConfirmedBtn) closeConfirmedBtn.addEventListener('click', closeModal);
    if (headerCtaBtn) headerCtaBtn.addEventListener('click', () => openAppointmentModal());

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modalForm.style.display = 'none';
            if (modalConfirmed) modalConfirmed.style.display = 'block';
        });
    }
});
