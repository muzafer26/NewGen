document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide Icon Initialization ──
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ── Navbar Scroll Active Class ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }, { passive: true });

  // ── Mobile Menu Toggle ──
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('mobile-overlay');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      overlay.classList.toggle('active');
      const isOpen = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close menu on link click or overlay click
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (toggle) toggle.classList.remove('open');
      menu.classList.remove('open');
      overlay.classList.remove('active');
    });
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (toggle) toggle.classList.remove('open');
      menu.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // ── Hero Auto-Carousel ──
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let currentSlide = 0;
  let carouselInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, 6000);
  }

  function stopCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  if (slides.length > 0) {
    startCarousel();

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startCarousel();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startCarousel();
      });
    });
  }

  // ── Smooth Scroll & Active Nav Links ──
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ── Scroll Reveal Animations ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Stat Counters Animation ──
  const stats = document.querySelectorAll('.about__stat-num');
  const statsSection = document.querySelector('.about__stats');

  if (statsSection && stats.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(stat => {
            const countTo = parseInt(stat.getAttribute('data-count'), 10);
            const suffix = stat.getAttribute('data-suffix') || '';
            let currentCount = 0;
            const duration = 1500;
            const increment = countTo / (duration / 16);

            const counter = setInterval(() => {
              currentCount += increment;
              if (currentCount >= countTo) {
                stat.textContent = countTo + suffix;
                clearInterval(counter);
              } else {
                stat.textContent = Math.floor(currentCount) + suffix;
              }
            }, 16);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('open');
          answer.style.maxHeight = '0px';
        }
      });
    }
  });

  // ── Airplane Scroll Animation Effect ──
  const airplane = document.getElementById('scroll-airplane');
  if (airplane) {
    let currentTop = 10;
    let targetTop = 10;
    let currentRotation = 180;
    let targetRotation = 180;
    let lastScrollY = window.scrollY;
    
    // Set initial position
    airplane.style.top = `${currentTop}vh`;
    airplane.style.transform = 'translate(50%, -50%) rotate(180deg)';

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const scrollPercent = scrollY / docHeight;
        targetTop = 10 + scrollPercent * 80; // Bound between 10vh and 90vh
        
        const delta = scrollY - lastScrollY;
        let bankAngle = delta * 1.5;
        bankAngle = Math.max(-45, Math.min(45, bankAngle));
        
        if (delta > 0) {
          targetRotation = 180 + bankAngle;
        } else if (delta < 0) {
          targetRotation = 0 + bankAngle;
        }
      }
      lastScrollY = scrollY;
    }, { passive: true });

    let lastSpawnTime = 0;
    
    function spawnTrailParticle(topPercent, rotation) {
      const particle = document.createElement('div');
      particle.className = 'flight-trail';
      
      // Offset slightly to align particle with the plane's tail depending on direction
      const offset = (rotation > 90) ? -3 : 3;
      
      particle.style.top = `${topPercent + offset}vh`;
      particle.style.right = `120px`; // Match track position
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 800);
    }

    function animateAirplane() {
      // Smoothly interpolate position (Inertia factor 0.1)
      const prevTop = currentTop;
      currentTop += (targetTop - currentTop) * 0.1;
      airplane.style.top = `${currentTop}vh`;

      // Smoothly interpolate rotation (Shortest path modular diff)
      let diff = targetRotation - currentRotation;
      diff = ((diff + 180) % 360) - 180;
      currentRotation += diff * 0.1;
      
      airplane.style.transform = `translate(50%, -50%) rotate(${currentRotation}deg)`;

      // Slowly decay target rotation banking back to flat orientation
      if (targetRotation > 90) {
        targetRotation += (180 - targetRotation) * 0.05;
      } else {
        targetRotation += (0 - targetRotation) * 0.05;
      }

      // Generate flight path particles when moving
      const now = Date.now();
      const speed = Math.abs(currentTop - prevTop);
      if (speed > 0.05 && (now - lastSpawnTime > 120)) {
        spawnTrailParticle(currentTop, currentRotation);
        lastSpawnTime = now;
      }

      requestAnimationFrame(animateAirplane);
    }
    
    // Start animation loop
    requestAnimationFrame(animateAirplane);
  }

  // ── Scroll Progress Indicator ──
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        progress.style.width = `${(scrollY / docHeight) * 100}%`;
      }
    }, { passive: true });
  }

  // ── Trip Planner Form ──
  const plannerForm = document.getElementById('whatsapp-planner-form');
  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const dest = document.getElementById('planner-destination').value;
      const date = document.getElementById('planner-date').value;
      const travellers = document.getElementById('planner-travellers').value;
      const budget = document.getElementById('planner-budget').value;
      const reqs = document.getElementById('planner-requirements').value || 'None';
      
      const text = `Hi New Generation! I'm planning a trip:\n\n` +
                   `📍 Destination: ${dest}\n` +
                   `📅 Date: ${date}\n` +
                   `👥 Travellers: ${travellers}\n` +
                   `💰 Budget: ${budget}\n` +
                   `📝 Special Requirements: ${reqs}`;
                   
      const whatsappUrl = `https://wa.me/919794426577?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

});
