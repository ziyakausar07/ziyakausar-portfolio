/**
 * ==========================================================================
 * PORTFOLIO CLIENT-SIDE SCRIPT - ZIYAKAUSAR J TAMBOLI
 * Handles theme toggling, mobile navigation, active section tracking,
 * dynamic typewriter, interactive code studio, skills search/filter,
 * project filters, command palette (Ctrl+K), and 1-click clipboard copy.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Core initialization
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();
  initTypewriter();
  initCodeStudio();
  initSkillsFilterAndSearch();
  initProjectFilters();
  initCommandPalette();
  initCopyButtons();
  initContactForm();
  initResumeButton();
  initBackToTop();
  updateCurrentYear();
  initCardSpotlights();
});

/* ---------------------------------------------------------
   1. Theme Toggle (Dark / Light with LocalStorage)
   --------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const root = document.documentElement;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('ziyakausar-portfolio-theme');

  // Determine initial theme
  const initialTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');
  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    toggleTheme();
  });

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('ziyakausar-portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme} theme`);
  }

  // Expose globally for command palette
  window.togglePortfolioTheme = toggleTheme;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fa-solid fa-moon';
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
      } else {
        icon.className = 'fa-solid fa-sun';
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
      }
    }
  }
}

/* ---------------------------------------------------------
   2. Mobile Hamburger Navigation
   --------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  const allNavItems = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  if (!toggleBtn || !navLinks || !overlay) return;

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  allNavItems.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });
}

/* ---------------------------------------------------------
   3. Active Navigation State on Scroll (ScrollSpy)
   --------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    const scrollPos = window.scrollY + 120;

    // Sticky shadow
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ---------------------------------------------------------
   4. Dynamic Typewriter Effect for Hero
   --------------------------------------------------------- */
function initTypewriter() {
  const roleEl = document.getElementById('typewriter-role');
  if (!roleEl) return;

  const roles = [
    'Full-Stack Web Applications',
    'Applied ML & Computer Vision',
    'Production Cloud Deployments',
    'Scalable REST APIs & Databases',
    'Secure Software Solutions'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      roleEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of word
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ---------------------------------------------------------
   5. Interactive Code Studio (Hero Visual)
   --------------------------------------------------------- */
function initCodeStudio() {
  const studioTabs = document.querySelectorAll('.studio-tab');
  const panes = {
    profile: document.getElementById('pane-profile'),
    stack: document.getElementById('pane-stack'),
    deploy: document.getElementById('pane-deploy')
  };

  if (!studioTabs.length) return;

  studioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      studioTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const target = tab.getAttribute('data-tab');
      Object.keys(panes).forEach(key => {
        if (panes[key]) {
          panes[key].classList.remove('active');
        }
      });

      if (panes[target]) {
        panes[target].classList.add('active');
      }
    });
  });
}

/* ---------------------------------------------------------
   6. Skills Filter & Real-Time Search
   --------------------------------------------------------- */
function initSkillsFilterAndSearch() {
  const searchInput = document.getElementById('skills-search-input');
  const clearBtn = document.getElementById('skills-search-clear');
  const categoryBtns = document.querySelectorAll('.skill-cat-btn');
  const categoryCards = document.querySelectorAll('.skill-category-card');
  const allSkillItems = document.querySelectorAll('.skill-item');

  if (!searchInput && !categoryBtns.length) return;

  // Real-time search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
      }

      if (query.length === 0) {
        allSkillItems.forEach(item => {
          item.classList.remove('search-match', 'dimmed');
        });
        categoryCards.forEach(card => card.style.display = 'flex');
        return;
      }

      let anyMatched = false;

      categoryCards.forEach(card => {
        const itemsInCard = card.querySelectorAll('.skill-item');
        let cardHasMatch = false;

        itemsInCard.forEach(item => {
          const skillKey = (item.getAttribute('data-skill') || item.textContent).toLowerCase();
          if (skillKey.includes(query)) {
            item.classList.add('search-match');
            item.classList.remove('dimmed');
            cardHasMatch = true;
            anyMatched = true;
          } else {
            item.classList.remove('search-match');
            item.classList.add('dimmed');
          }
        });

        card.style.display = cardHasMatch ? 'flex' : 'none';
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        allSkillItems.forEach(item => {
          item.classList.remove('search-match', 'dimmed');
        });
        categoryCards.forEach(card => card.style.display = 'flex');
        searchInput.focus();
      });
    }
  }

  // Category tab filters
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetCat = btn.getAttribute('data-cat');

      categoryCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (targetCat === 'all' || cardCat === targetCat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   7. Project Category Filtering
   --------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   8. Developer Command Palette (Ctrl + K)
   --------------------------------------------------------- */
function initCommandPalette() {
  const modal = document.getElementById('cmd-palette-modal');
  const openBtn = document.getElementById('cmd-palette-toggle');
  const closeBtn = document.getElementById('cmd-close-btn');
  const input = document.getElementById('cmd-input');
  const itemsContainer = document.getElementById('cmd-results-list');

  if (!modal || !input) return;

  function openPalette() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 100);
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) {
    openBtn.addEventListener('click', openPalette);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePalette);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePalette();
  });

  // Keyboard shortcut Ctrl + K / Cmd + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closePalette();
    }
  });

  // Filter command items
  input.addEventListener('input', (e) => {
    filterItems(e.target.value.toLowerCase().trim());
  });

  function filterItems(query) {
    const items = itemsContainer.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Handle Command Selection
  itemsContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;

    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closePalette();

    if (action === 'goto' && target) {
      const targetEl = document.querySelector(target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'copy-email') {
      copyToClipboard('ziyakaus07@gmail.com');
      showToast('Email copied: ziyakaus07@gmail.com');
    } else if (action === 'toggle-theme') {
      if (window.togglePortfolioTheme) {
        window.togglePortfolioTheme();
      }
    }
  });
}

/* ---------------------------------------------------------
   9. 1-Click Copy-to-Clipboard Buttons
   --------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-email-btn, .copy-mini-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'ziyakaus07@gmail.com';
      copyToClipboard(email);

      // Visual feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check" style="color: #10b981;"></i> <span>Copied!</span>`;

      showToast(`Email copied: ${email}`);

      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 2200);
    });
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Copy fallback failed', err);
  }
  document.body.removeChild(textarea);
}

/* ---------------------------------------------------------
   10. Contact Form Validation & Mailto Fallback
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusContainer = document.getElementById('form-status');
  if (!form || !statusContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    statusContainer.className = 'form-status';
    statusContainer.style.display = 'none';

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name.');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Please enter a subject.');
      isValid = false;
    }

    // Validate Message (min 10 characters)
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message must be at least 10 characters long.');
      isValid = false;
    }

    if (!isValid) return;

    // Direct mailto pre-fill transmission
    const senderName = encodeURIComponent(nameInput.value.trim());
    const subject = encodeURIComponent(subjectInput.value.trim());
    const body = encodeURIComponent(
      `Hello Ziyakausar,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
    );

    statusContainer.className = 'form-status success';
    statusContainer.innerHTML = `
      <i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i>
      <strong>Form validated successfully!</strong><br>
      Opening your default email client to send your message directly to <strong>ziyakaus07@gmail.com</strong>.
    `;
    statusContainer.style.display = 'block';

    setTimeout(() => {
      window.location.href = `mailto:ziyakaus07@gmail.com?subject=${subject}&body=${body}`;
    }, 1200);

    form.reset();
  });

  function showError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errorMsg = group.querySelector('.form-error');
      if (errorMsg) {
        errorMsg.textContent = message;
      }
    }
  }
}

/* ---------------------------------------------------------
   11. Resume Button Verification & Feedback
   --------------------------------------------------------- */
function initResumeButton() {
  const resumeButtons = document.querySelectorAll('.btn-resume');
  if (!resumeButtons.length) return;

  resumeButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const resumeUrl = button.getAttribute('href');

      try {
        const response = await fetch(resumeUrl, { method: 'HEAD' });
        if (!response.ok) {
          e.preventDefault();
          showToast('Resume PDF is currently being finalized. Please reach out via ziyakaus07@gmail.com for a direct copy!');
        }
      } catch (err) {
        e.preventDefault();
        showToast('Resume PDF will be available upon deployment. Feel free to contact via ziyakaus07@gmail.com');
      }
    });
  });
}

/* ---------------------------------------------------------
   12. Back to Top Functionality
   --------------------------------------------------------- */
function initBackToTop() {
  const floatingBtn = document.getElementById('floating-back-top');
  const footerBtn = document.getElementById('footer-back-top');

  function checkScroll() {
    if (!floatingBtn) return;
    if (window.scrollY > 350) {
      floatingBtn.classList.add('show');
    } else {
      floatingBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (floatingBtn) floatingBtn.addEventListener('click', scrollToTop);
  if (footerBtn) footerBtn.addEventListener('click', scrollToTop);
}

/* ---------------------------------------------------------
   13. Dynamic Footer Year
   --------------------------------------------------------- */
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   14. Card Mouse-Move Spotlight Glow
   --------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.glass-card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ---------------------------------------------------------
   15. Toast Notification Helper
   --------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-container';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--accent-primary);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
