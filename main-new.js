/* ============================================
   FRESH JAVASCRIPT - Franklin Porta Potty
   Zero forced reflows, optimized performance
   ============================================ */

   document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initDropdowns();
    initSmoothScroll();
    initFAQ();
    initPerf();
  });
  
  /* ============================================
     MOBILE MENU - Touch-optimized
     ============================================ */
  function initMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) return;
  
    const openMenu = () => {
      toggle.classList.add("active");
      menu.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
  
    toggle.addEventListener("click", () => {
      const isActive = toggle.classList.contains("active");
      isActive ? closeMenu() : openMenu();
    });
  
    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });
  
    // Close with ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }
  
  /* ============================================
     DROPDOWN MENUS - Mobile (tap) & Desktop (hover/focus)
     Re-initializes on resize to match current viewport
     ============================================ */
  function initDropdowns() {
    const dropdowns = Array.from(document.querySelectorAll(".dropdown"));
    if (!dropdowns.length) return;
  
    const open = (dd) => {
      dd.classList.add("active");
      const trigger = dd.querySelector(":scope > a");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    };
    const close = (dd) => {
      dd.classList.remove("active");
      const trigger = dd.querySelector(":scope > a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    };
    const closeAll = (except = null) => {
      dropdowns.forEach((d) => {
        if (d !== except) close(d);
      });
    };
  
    const mql = window.matchMedia("(max-width: 968px)");
    const state = new WeakMap(); // per dropdown: { handlers: [...] }
    let globalHandlers = [];
  
    const addHandler = (el, type, fn) => {
      el.addEventListener(type, fn);
      globalHandlers.push({ el, type, fn });
    };
    const addLocalHandler = (dd, el, type, fn) => {
      el.addEventListener(type, fn);
      const s = state.get(dd) || { handlers: [] };
      s.handlers.push({ el, type, fn });
      state.set(dd, s);
    };
  
    const cleanup = () => {
      // Remove global handlers
      globalHandlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      globalHandlers = [];
  
      // Remove per-dropdown handlers
      dropdowns.forEach((dd) => {
        const s = state.get(dd);
        if (s && s.handlers) {
          s.handlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
        }
        state.delete(dd);
      });
  
      // Collapse all
      closeAll();
    };
  
    const attachMobile = () => {
      dropdowns.forEach((dd) => {
        const trigger = dd.querySelector(":scope > a");
        const submenu = dd.querySelector(":scope > .dropdown-menu");
        if (!trigger || !submenu) return;
  
        trigger.setAttribute("aria-haspopup", "true");
        trigger.setAttribute("aria-expanded", dd.classList.contains("active") ? "true" : "false");
  
        const onClick = (e) => {
          e.preventDefault(); // Prevent navigation to parent section on mobile
          const isOpen = dd.classList.contains("active");
          closeAll(dd);
          if (!isOpen) open(dd);
        };
        addLocalHandler(dd, trigger, "click", onClick);
      });
  
      // Outside tap closes
      addHandler(document, "click", (e) => {
        const hit = dropdowns.some((d) => d.contains(e.target));
        if (!hit) closeAll();
      });
  
      // ESC closes
      addHandler(document, "keydown", (e) => {
        if (e.key === "Escape") closeAll();
      });
    };
  
    const attachDesktop = () => {
      dropdowns.forEach((dd) => {
        const trigger = dd.querySelector(":scope > a");
        const menu = dd.querySelector(":scope > .dropdown-menu");
        if (!trigger || !menu) return;
  
        trigger.setAttribute("aria-haspopup", "true");
        trigger.setAttribute("aria-expanded", "false");
  
        const onEnter = () => open(dd);
        const onLeave = (e) => {
          if (!dd.contains(e.relatedTarget)) close(dd);
        };
        const onFocusIn = () => open(dd);
        const onFocusOut = (e) => {
          if (!dd.contains(e.relatedTarget)) close(dd);
        };
  
        addLocalHandler(dd, dd, "mouseenter", onEnter);
        addLocalHandler(dd, dd, "mouseleave", onLeave);
        addLocalHandler(dd, dd, "focusin", onFocusIn);
        addLocalHandler(dd, dd, "focusout", onFocusOut);
      });
  
      // Click elsewhere closes
      addHandler(document, "click", (e) => {
        const hit = dropdowns.some((d) => d.contains(e.target));
        if (!hit) closeAll();
      });
  
      // ESC closes
      addHandler(document, "keydown", (e) => {
        if (e.key === "Escape") closeAll();
      });
    };
  
    // Initial attach
    if (mql.matches) attachMobile();
    else attachDesktop();
  
    // Reattach on resize (debounced)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nowMobile = window.innerWidth <= 968;
        cleanup();
        if (nowMobile) attachMobile();
        else attachDesktop();
      }, 200);
    });
  }
  
  /* ============================================
     SMOOTH SCROLL - Performance optimized
     ============================================ */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;
  
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }
  
  /* ============================================
     FAQ ACCORDION - Zero forced reflows
     ============================================ */
  function initFAQ() {
    const buttons = document.querySelectorAll(".faq-accordion-button");
    if (!buttons.length) return;
  
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const item = this.closest(".faq-accordion-item");
        if (!item) return;
        const plus = this.querySelector(".faq-plus");
        const isOpen = item.classList.contains("active");
  
        // Close siblings
        document.querySelectorAll(".faq-accordion-item.active").forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const op = other.querySelector(".faq-plus");
            if (op) op.textContent = "+";
          }
        });
  
        // Toggle current
        if (isOpen) {
          item.classList.remove("active");
          if (plus) plus.textContent = "+";
        } else {
          item.classList.add("active");
          if (plus) plus.textContent = "−";
        }
      });
    });
  }
  
  /* ============================================
     PERFORMANCE OPTIMIZATIONS
     ============================================ */
  function initPerf() {
    // Lazy load images below the fold (native or fallback)
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  
    // Preconnect to external domains (example: image CDN)
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://ik.imagekit.io";
    document.head.appendChild(preconnect);
  }
  