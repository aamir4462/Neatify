document.addEventListener('DOMContentLoaded', () => {
    // Initialize Web3Forms
    const WEB3FORMS_ACCESS_KEY = "d6661ac9-1f60-4211-b13c-8b6491e6b460";

    // Dynamic Year Update
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Header & Mobile Menu
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('translate-x-full');
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Sticky Header Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/90', 'backdrop-blur-xl', 'shadow-xl', 'py-2');
            header.classList.remove('py-4');
        } else {
            header.classList.remove('bg-white/90', 'backdrop-blur-xl', 'shadow-xl', 'py-2');
            header.classList.add('py-4');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Instant Quote Calculator
    const quoteForm = document.getElementById('quote-form');
    const quoteResultContainer = document.getElementById('quote-result-container');
    const quoteResultText = document.getElementById('quote-result');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const service = document.getElementById('quote-service').value;
            const quantity = parseInt(document.getElementById('quote-rooms').value) || 1;
            
            let basePrice = 45; // Default for Carpet
            
            switch(service) {
                case 'sofa': basePrice = 65; break;
                case 'upholstery': basePrice = 35; break;
                case 'mattress': basePrice = 55; break;
                default: basePrice = 45;
            }
            
            const total = basePrice * quantity;
            
            quoteResultText.innerText = `£${total}`;
            quoteResultContainer.classList.remove('hidden');
            
            // Scroll to result on mobile
            if (window.innerWidth < 768) {
                quoteResultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };

    if (slides.length > 0) {
        // Initial setup
        showSlide(0);
        startSlideShow();

        // Event Listeners
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlideShow();
                startSlideShow();
            });
        });

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopSlideShow);
            carouselContainer.addEventListener('mouseleave', startSlideShow);
        }
    }

    // Contact Form Handling (EmailJS)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const btn = this.querySelector('button');
            const originalBtnText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            
            const formData = new FormData(contactForm);
            formData.append("access_key", WEB3FORMS_ACCESS_KEY);
            formData.append("subject", "New Contact Form Submission from Neatify");
            formData.append("from_name", "Neatify Website");

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formStatus.innerText = 'Message sent successfully! We will contact you soon.';
                    formStatus.className = 'text-center text-sm font-medium mt-4 text-secondary';
                    contactForm.reset();
                } else {
                    console.log(response);
                    formStatus.innerText = json.message || 'Something went wrong!';
                    formStatus.className = 'text-center text-sm font-medium mt-4 text-red-500';
                }
            })
            .catch(error => {
                console.log(error);
                formStatus.innerText = 'Service temporarily unavailable. Please try again later.';
                formStatus.className = 'text-center text-sm font-medium mt-4 text-red-500';
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
                setTimeout(() => { formStatus.innerText = ''; }, 5000);
            });
        });
    }
    // Booking Form Handling (EmailJS)
    const bookingForm = document.getElementById('booking-form');
    const bookingStatus = document.getElementById('booking-status');

    if (bookingForm) {
        // Set minimum date to today
        const dateInput = bookingForm.querySelector('input[type="date"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const btn = this.querySelector('button');
            const originalBtnText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
            
            const formData = new FormData(bookingForm);
            formData.append("access_key", WEB3FORMS_ACCESS_KEY);
            formData.append("subject", "New Booking Request from Neatify");
            formData.append("from_name", "Neatify Booking");

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    bookingStatus.innerText = 'Booking request sent! We will confirm your slot shortly.';
                    bookingStatus.className = 'text-center text-sm font-medium mt-4 text-secondary';
                    bookingForm.reset();
                } else {
                    console.log(response);
                    bookingStatus.innerText = json.message || 'Something went wrong!';
                    bookingStatus.className = 'text-center text-sm font-medium mt-4 text-red-500';
                }
            })
            .catch(error => {
                console.log(error);
                bookingStatus.innerText = 'Booking service unavailable. Please call us to book.';
                bookingStatus.className = 'text-center text-sm font-medium mt-4 text-red-500';
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
                setTimeout(() => { bookingStatus.innerText = ''; }, 5000);
            });
        });
    }

    // WhatsApp Widget Logic
    const whatsappToggle = document.getElementById('whatsapp-toggle');
    const whatsappWindow = document.getElementById('whatsapp-window');
    const closeWhatsapp = document.getElementById('close-whatsapp');

    if (whatsappToggle && whatsappWindow) {
        whatsappToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (whatsappWindow.classList.contains('show')) {
                whatsappWindow.classList.remove('show');
                setTimeout(() => {
                    if (!whatsappWindow.classList.contains('show')) {
                        whatsappWindow.classList.add('hidden');
                    }
                }, 300);
            } else {
                whatsappWindow.classList.remove('hidden');
                setTimeout(() => {
                    whatsappWindow.classList.add('show');
                }, 10);
            }
        });

        if (closeWhatsapp) {
            closeWhatsapp.addEventListener('click', (e) => {
                e.stopPropagation();
                whatsappWindow.classList.remove('show');
                setTimeout(() => {
                    if (!whatsappWindow.classList.contains('show')) {
                        whatsappWindow.classList.add('hidden');
                    }
                }, 300);
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!whatsappWindow.contains(e.target) && !whatsappToggle.contains(e.target)) {
                whatsappWindow.classList.remove('show');
                setTimeout(() => {
                    if (!whatsappWindow.classList.contains('show')) {
                        whatsappWindow.classList.add('hidden');
                    }
                }, 300);
            }
        });
    }
});

