// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );
}

// Theme toggle (persists across pages via localStorage)
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const iconMoon = document.getElementById('iconMoon');
const iconSun = document.getElementById('iconSun');

function setTheme(isLight) {
  root.classList.toggle('light', isLight);
  if (iconMoon) iconMoon.classList.toggle('hidden', isLight);
  if (iconSun) iconSun.classList.toggle('hidden', !isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
setTheme(localStorage.getItem('theme') === 'light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => setTheme(!root.classList.contains('light')));
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form (only present on contact.html) — submits to Formspree via AJAX
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form && status) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultHTML = submitBtn ? submitBtn.innerHTML : '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.add('hidden');
    status.classList.remove('text-red-400');
    status.classList.add('text-emerald-400');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.textContent = 'กำลังส่ง...';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = '✓ ส่งข้อความเรียบร้อยแล้ว ขอบคุณครับ';
        status.classList.remove('hidden', 'text-red-400');
        status.classList.add('text-emerald-400');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      status.textContent = '✕ ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือทักมาที่ jarudet.pai@gmail.com โดยตรง';
      status.classList.remove('hidden', 'text-emerald-400');
      status.classList.add('text-red-400');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = submitBtnDefaultHTML;
      }
      setTimeout(() => status.classList.add('hidden'), 6000);
    }
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();