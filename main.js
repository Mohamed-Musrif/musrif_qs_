
// Site interactions for Mohamed Musrif QS portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Sticky header shadow on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 10
      ? '0 10px 30px rgba(0,0,0,0.08)'
      : '0 5px 20px rgba(0,0,0,0.05)';
  });

  // Project filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';
        projectCards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          const show = (filter === 'all') || cat.split(' ').includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Testimonials rotation (simple)
  const testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
  if (testimonials.length > 1) {
    let idx = 0;
    setInterval(() => {
      testimonials[idx].style.display = 'none';
      idx = (idx + 1) % testimonials.length;
      testimonials[idx].style.display = '';
    }, 5500);
  }

  // Year in footer
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  // Animate meters when visible (precision meters + skill meters)
  const animateMeters = (root = document) => {
    // Precision bars
    root.querySelectorAll('.meter-fill').forEach(fill => {
      const w = fill.style.width;
      // If width is set inline (e.g., 98%), animate from 0 to it once
      if (w && !fill.dataset.animated) {
        fill.dataset.animated = '1';
        fill.style.width = '0';
        requestAnimationFrame(() => {
          fill.style.width = w;
        });
      }
    });

    // Skill meters
    root.querySelectorAll('.skill-meter').forEach(meter => {
      const pct = meter.getAttribute('data-percent');
      if (!pct) return;
      meter.style.setProperty('--skill-percent', pct + '%');
    });
  };

  // Intersection observer for animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Skill meters become visible
      entry.target.querySelectorAll('.skill-meter').forEach(m => m.classList.add('is-visible'));
      // Precision meter fills
      animateMeters(entry.target);

      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('section').forEach(sec => io.observe(sec));
  // initial
  animateMeters(document);

  // FAQ accordion
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;

      // close others
      document.querySelectorAll('.faq-item').forEach(x => {
        if (x !== item) x.classList.remove('active');
      });

      item.classList.toggle('active');
    });
  });

  // Contact form -> mailto
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('input, textarea, select');
      const values = Array.from(inputs).map(el => el.value.trim());
      const [name, email, projectType, serviceType, details] = values;

      const subject = encodeURIComponent(`QS Inquiry: ${projectType || 'Project'} (${serviceType || 'Service'})`);
      const body = encodeURIComponent(
        `Name/Company: ${name}\nEmail: ${email}\nProject Type: ${projectType}\nService: ${serviceType}\n\nDetails:\n${details}\n\nAttachments: Please reply with drawing upload link or email attachments.`
      );

      window.location.href = `mailto:musrif.aliyar@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});

