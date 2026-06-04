// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// Menu tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const menuGrids = document.querySelectorAll('.menu-grid');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    menuGrids.forEach(g => g.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Reservation form
const resBtn = document.getElementById('resBtn');
const resMsg = document.getElementById('resMsg');
resBtn.addEventListener('click', async () => {
  const name = document.getElementById('res-name').value.trim();
  const email = document.getElementById('res-email').value.trim();
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;
  const guests = document.getElementById('res-guests').value;
  const notes = document.getElementById('res-notes').value.trim();
  if (!name || !email || !date || !time || !guests) {
    resMsg.style.color = '#c0392b'; resMsg.textContent = 'Please fill in all required fields.'; return;
  }
  resBtn.textContent = 'Confirming...'; resBtn.disabled = true;
  try {
    const response = await fetch('https://formspree.io/f/xjgdbevj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, date, time, guests, notes, type: 'Reservation' })
    });
    if (response.ok) {
      resMsg.style.color = '#c0704a';
      resMsg.textContent = `Reservation confirmed for ${name} on ${date} at ${time}! See you soon ☕`;
      ['res-name','res-email','res-date','res-time','res-guests','res-notes'].forEach(id => document.getElementById(id).value = '');
    } else { resMsg.style.color = '#c0392b'; resMsg.textContent = 'Something went wrong. Please try again.'; }
  } catch { resMsg.style.color = '#c0392b'; resMsg.textContent = 'Network error. Please check your connection.'; }
  resBtn.textContent = 'Confirm Reservation'; resBtn.disabled = false;
});

// Contact form
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('formMsg');
sendBtn.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    formMsg.style.color = '#c0392b'; formMsg.textContent = 'Please fill in all fields.'; return;
  }
  sendBtn.textContent = 'Sending...'; sendBtn.disabled = true;
  try {
    const response = await fetch('https://formspree.io/f/xjgdbevj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message, type: 'Contact' })
    });
    if (response.ok) {
      formMsg.style.color = '#c0704a';
      formMsg.textContent = `Thanks ${name}! We'll get back to you soon. ☕`;
      ['name','email','message'].forEach(id => document.getElementById(id).value = '');
    } else { formMsg.style.color = '#c0392b'; formMsg.textContent = 'Something went wrong. Please try again.'; }
  } catch { formMsg.style.color = '#c0392b'; formMsg.textContent = 'Network error. Please check your connection.'; }
  sendBtn.textContent = 'Send Message'; sendBtn.disabled = false;
});

// ── DARK MODE ──
const darkBtn = document.getElementById('darkToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
  document.body.classList.add('dark');
  darkBtn.textContent = '☀️';
}
darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── PROMO BANNER DISMISS ──
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');
if (sessionStorage.getItem('promoDismissed')) promoBanner.style.display = 'none';
promoClose.addEventListener('click', () => {
  promoBanner.style.display = 'none';
  sessionStorage.setItem('promoDismissed', 'true');
});
