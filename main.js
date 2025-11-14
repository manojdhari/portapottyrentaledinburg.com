document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MOBILE NAV TOGGLE
  // =========================
  const navToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (navToggle && navMenu) {
    navToggle.setAttribute("aria-expanded", "false")
    navToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.toggle("active")
      navToggle.classList.toggle("active", isActive)
      navToggle.setAttribute("aria-expanded", String(isActive))
      document.body.style.overflow = isActive ? "hidden" : ""
    })
  }

  const dropdowns = document.querySelectorAll(".dropdown")
  const isMobile = () => window.innerWidth <= 968

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(":scope > a")
    const menu = dropdown.querySelector(".dropdown-menu")

    if (!trigger || !menu) return

    // Mobile click behavior
    trigger.addEventListener("click", (e) => {
      if (isMobile()) {
        e.preventDefault()
        e.stopPropagation()

        // Close other dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active")
          }
        })

        // Toggle current dropdown - use CSS transition instead of reading scrollHeight
        dropdown.classList.toggle("active")
        const isOpen = dropdown.classList.contains("active")
        trigger.setAttribute("aria-expanded", String(isOpen))
      }
    })

    // Desktop hover behavior
    if (!isMobile()) {
      dropdown.addEventListener("mouseenter", () => {
        trigger.setAttribute("aria-expanded", "true")
      })
      dropdown.addEventListener("mouseleave", () => {
        trigger.setAttribute("aria-expanded", "false")
      })
    }
  })

  // Close mobile menu on link click
  document.querySelectorAll(".nav-menu a:not(.dropdown > a)").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobile() && navMenu && navToggle) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
        navToggle.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    })
  })

  // Close mobile menu on outside click
  document.addEventListener("click", (e) => {
    if (!isMobile() || !navMenu.classList.contains("active")) return
    if (!e.target.closest(".nav-menu") && !e.target.closest(".mobile-menu-toggle")) {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  // =========================
  // CONTACT FORM
  // =========================
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      requestAnimationFrame(() => {
        contactForm.style.display = "none"
        const formSuccess = document.getElementById("formSuccess")
        if (formSuccess) {
          formSuccess.style.display = "block"
          // Use scrollIntoView instead of reading offsetTop
          setTimeout(() => {
            formSuccess.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 100)
        }
      })
    })
  }
  // =========================
  // ACTIVE NAV LINK HIGHLIGHT
  // =========================
  ;(function highlightActiveLink() {
    const currentPath = window.location.pathname
    const fileName = currentPath.split("/").pop() || "index.html"
    const menuLinks = document.querySelectorAll(".nav-menu a")
    menuLinks.forEach((link) => {
      const linkPath = link.getAttribute("href")
      if (linkPath === fileName) link.classList.add("active")
    })
  })()

  // =========================
  // INTERSECTION OBSERVER ANIMATIONS (ULTRA OPTIMIZED)
  // =========================
  ;(function setupAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const animatedElements = document.querySelectorAll(
      ".service-card, .placer-feature-card, .flip-box, .benefit-card, .value-card, .review-card",
    )
    if (!animatedElements.length) return

    const observerOptions = {
      threshold: 0.05,
      rootMargin: "50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            observer.unobserve(entry.target)
          }
        })
      })
    }, observerOptions)

    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease"
      el.style.willChange = "opacity, transform"
      observer.observe(el)
    })
  })()

  // =========================
  // SMOOTH SCROLL FOR HASH LINKS
  // =========================
  ;(function smoothScrollSetup() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]')
    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href")
        if (href && href !== "#") {
          const targetId = href.substring(1)
          const targetElement = document.getElementById(targetId)
          if (targetElement) {
            e.preventDefault()
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }
      })
    })
  })()

  // =========================
  // HEADER BEHAVIOR (OPTIMIZED - ZERO FORCED REFLOWS)
  // =========================
  ;(function headerBehavior() {
    const header = document.querySelector(".header")
    if (!header) return

    let lastScrollTop = 0
    let ticking = false
    const scrollThreshold = 100

    function onScroll() {
      const scrollTop = window.pageYOffset

      // Use CSS transitions instead of reading layout properties
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        header.style.transform = "translateY(-100%)"
      } else {
        header.style.transform = "translateY(0)"
      }

      header.classList.toggle("scrolled", scrollTop > scrollThreshold)

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
      ticking = false
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll)
          ticking = true
        }
      },
      { passive: true },
    )
  })()

  // =========================
  // DATE INPUT MIN = TODAY
  // =========================
  ;(function setDateMin() {
    const dateInput = document.getElementById("date")
    if (dateInput) {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, "0")
      const dd = String(today.getDate()).padStart(2, "0")
      dateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`)
    }
  })()

  // =========================
  // FAQ ACCORDION (OPTIMIZED - NO FORCED REFLOWS)
  // =========================
  ;(function faqAccordion() {
    const items = Array.from(document.querySelectorAll(".faq-accordion-item"))
    if (!items.length) return

    items.forEach((item, idx) => {
      const btn = item.querySelector(".faq-accordion-button")
      const panel = item.querySelector(".faq-accordion-content")
      if (!btn || !panel) return

      if (!btn.hasAttribute("type")) btn.setAttribute("type", "button")

      const panelId = panel.id || `faq-panel-${idx}`
      panel.id = panelId
      btn.setAttribute("aria-controls", panelId)
      btn.setAttribute("aria-expanded", "false")
      panel.setAttribute("role", "region")
      panel.setAttribute("aria-hidden", "true")

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active")

        // Close all items - use CSS transitions instead of calculating scrollHeight
        items.forEach((i) => {
          i.classList.remove("active")
          const b = i.querySelector(".faq-accordion-button")
          const c = i.querySelector(".faq-accordion-content")
          if (c) c.setAttribute("aria-hidden", "true")
          if (b) b.setAttribute("aria-expanded", "false")
        })

        // Open clicked item if it was closed - CSS handles max-height transition
        if (!isOpen) {
          item.classList.add("active")
          panel.setAttribute("aria-hidden", "false")
          btn.setAttribute("aria-expanded", "true")
        }
      })
    })
  })()
})
