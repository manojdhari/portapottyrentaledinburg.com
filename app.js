// main.js
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // =========================
  // MOBILE NAV TOGGLE
  // =========================
  const navToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'site-nav-menu');
    navMenu.id = navMenu.id || 'site-nav-menu';

    navToggle.addEventListener('click', function () {
      const nowActive = !navMenu.classList.contains('active');
      navMenu.classList.toggle('active', nowActive);
      navToggle.setAttribute('aria-expanded', String(nowActive));

      // burger animation (if spans exist)
      const spans = navToggle.querySelectorAll('span');
      if (spans.length >= 3) {
        if (nowActive) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      }
    });

    // Close menu when a link is clicked on mobile
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach((link) => {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 992) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          const spans = navToggle.querySelectorAll('span');
          if (spans.length >= 3) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
          }
        }
      });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 992) return; // desktop only uses hover
      if (!navMenu.classList.contains('active')) return;
      const clickInside = e.target.closest('.nav-menu') || e.target.closest('.mobile-menu-toggle');
      if (!clickInside) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================
  // DROPDOWNS (desktop hover via CSS; mobile/tablet via click)
  // =========================
  (function dropdowns() {
    const mq = window.matchMedia('(max-width: 992px)');
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');

    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector(':scope > a');
      const submenu = dd.querySelector(':scope > .dropdown-menu');
      if (!trigger || !submenu) return;

      // ARIA
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      // On mobile/tablet, toggle on tap; on desktop, CSS :hover handles it
      trigger.addEventListener('click', (e) => {
        if (!mq.matches) return; // desktop: let link work normally
        e.preventDefault(); // mobile: prevent navigation on first tap
        const isOpen = dd.classList.contains('open');

        // close others
        dropdowns.forEach((other) => {
          if (other !== dd) {
            other.classList.remove('open');
            const a = other.querySelector(':scope > a');
            if (a) a.setAttribute('aria-expanded', 'false');
          }
        });

        dd.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // If we resize from mobile -> desktop, clear open states
    window.addEventListener('resize', () => {
      if (!mq.matches) {
        document.querySelectorAll('.nav-menu .dropdown.open').forEach((d) => {
          d.classList.remove('open');
          d.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  })();

  // =========================
  // CONTACT FORM (DEMO SUCCESS)
  // =========================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        service: document.getElementById('service')?.value || '',
        quantity: document.getElementById('quantity')?.value || '',
        date: document.getElementById('date')?.value || '',
        duration: document.getElementById('duration')?.value || '',
        location: document.getElementById('location')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      requestAnimationFrame(() => {
        contactForm.style.display = 'none';
        const formSuccess = document.getElementById('formSuccess');
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => {
            const offsetTop = formSuccess.offsetTop || 0;
            window.scrollTo({ top: Math.max(offsetTop - 100, 0), behavior: 'smooth' });
          }, 100);
        }
      });
    });
  }

  // =========================
  // ACTIVE NAV LINK HIGHLIGHT
  // =========================
  (function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach((link) => {
      const linkPath = link.getAttribute('href');
      if (linkPath === fileName) link.classList.add('active');
    });
  })();

  // =========================
  // INTERSECTION OBSERVER ANIMATIONS
  // =========================
  (function setupAnimations() {
    const animatedElements = document.querySelectorAll(
      '.service-card, .placer-feature-card, .flip-box, .benefit-card, .value-card, .experience-item, .faq-accordion-item'
    );
    if (!animatedElements.length) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    animatedElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  })();

  // =========================
  // SMOOTH SCROLL FOR HASH LINKS
  // =========================
  (function smoothScrollSetup() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop || 0;
            window.scrollTo({ top: Math.max(offsetTop - 80, 0), behavior: 'smooth' });
          }
        }
      });
    });
  })();

  // =========================
  // HEADER BEHAVIOR (HIDE ON SCROLL DOWN + "SCROLLED" CLASS)
  // =========================
  (function headerBehavior() {
    const header = document.querySelector('.header');
    if (!header) return;

    header.style.transition = 'transform 0.3s ease';

    let lastScrollTop = 0;
    let ticking = false;
    const scrollThreshold = 100;

    function onScroll(scrollTop) {
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      if (scrollTop > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (!ticking) {
          requestAnimationFrame(() => onScroll(scrollTop));
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener('load', function () {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (currentScroll > scrollThreshold) header.classList.add('scrolled');
    });
  })();

  // =========================
  // DATE INPUT MIN = TODAY
  // =========================
  (function setDateMin() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }
  })();

  // =========================
  // FAQ ACCORDION (ACCESSIBLE + ANIMATED HEIGHT)
  // =========================
  (function faqAccordion() {
    const items = Array.from(document.querySelectorAll('.faq-accordion-item'));
    if (!items.length) return;

    items.forEach((item, idx) => {
      const btn = item.querySelector('.faq-accordion-button');
      const panel = item.querySelector('.faq-accordion-content');
      if (!btn || !panel) return;

      if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');

      const panelId = panel.id || `faq-panel-${idx}`;
      panel.id = panelId;
      btn.setAttribute('aria-controls', panelId);
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-hidden', 'true');

      panel.style.maxHeight = null;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        items.forEach((i) => {
          i.classList.remove('active');
          const c = i.querySelector('.faq-accordion-content');
          const b = i.querySelector('.faq-accordion-button');
          if (c) {
            c.style.maxHeight = null;
            c.setAttribute('aria-hidden', 'true');
          }
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.setAttribute('aria-hidden', 'false');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    window.addEventListener('resize', () => {
      document
        .querySelectorAll('.faq-accordion-item.active .faq-accordion-content')
        .forEach((p) => (p.style.maxHeight = p.scrollHeight + 'px'));
    });
  })();
});
// Mobile dropdown toggle
document.querySelectorAll('.nav-menu .dropdown > a').forEach(a => {
  a.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
  });
});
