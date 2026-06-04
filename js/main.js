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
    const res = await fetch('https://formspree.io/f/xjgdbevj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, date, time, guests, notes, type: 'Reservation' })
    });
    if (res.ok) {
      resMsg.style.color = '#c0704a';
      resMsg.textContent = `Reservation confirmed for ${name} on ${date} at ${time}! See you soon ☕`;
      ['res-name','res-email','res-date','res-time','res-guests','res-notes'].forEach(id => document.getElementById(id).value = '');
    } else { resMsg.style.color = '#c0392b'; resMsg.textContent = 'Something went wrong. Please try again.'; }
  } catch { resMsg.style.color = '#c0392b'; resMsg.textContent = 'Network error.'; }
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
    const res = await fetch('https://formspree.io/f/xjgdbevj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message, type: 'Contact' })
    });
    if (res.ok) {
      formMsg.style.color = '#c0704a';
      formMsg.textContent = `Thanks ${name}! We'll get back to you soon. ☕`;
      ['name','email','message'].forEach(id => document.getElementById(id).value = '');
    } else { formMsg.style.color = '#c0392b'; formMsg.textContent = 'Something went wrong.'; }
  } catch { formMsg.style.color = '#c0392b'; formMsg.textContent = 'Network error.'; }
  sendBtn.textContent = 'Send Message'; sendBtn.disabled = false;
});

// Dark mode
const darkBtn = document.getElementById('darkToggle');
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark'); darkBtn.textContent = '☀️';
}
darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Promo banner dismiss
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');
if (sessionStorage.getItem('promoDismissed')) promoBanner.style.display = 'none';
promoClose.addEventListener('click', () => {
  promoBanner.style.display = 'none';
  sessionStorage.setItem('promoDismissed', 'true');
});

// ── COUNTDOWN TIMER (counts to next 5 PM weekday happy hour) ──
function getNextHappyHour() {
  const now = new Date();
  const target = new Date();
  target.setHours(17, 0, 0, 0); // 5 PM end of happy hour
  const day = now.getDay(); // 0=Sun, 6=Sat
  // If weekend or past 5 PM, find next weekday 5 PM
  if (day === 0 || day === 6 || now >= target) {
    let daysAhead = 1;
    while (true) {
      const next = new Date(now);
      next.setDate(now.getDate() + daysAhead);
      const nd = next.getDay();
      if (nd !== 0 && nd !== 6) { next.setHours(17, 0, 0, 0); return next; }
      daysAhead++;
    }
  }
  return target;
}

function updateCountdown() {
  const now = new Date();
  const target = getNextHappyHour();
  const diff = target - now;
  const timerEl = document.querySelector('.countdown-timer');

  if (diff <= 0) {
    timerEl.innerHTML = '<p class="timer-ended">Happy Hour is on right now! 🎉</p>';
    return;
  }

  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── COOKIE CONSENT ──
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (!localStorage.getItem('cookieConsent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 1500);
}
cookieAccept.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.classList.remove('show');
});
cookieDecline.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'declined');
  cookieBanner.classList.remove('show');
});
