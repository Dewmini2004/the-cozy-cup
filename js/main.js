// ── CONFIG ──
const JSONBIN_BIN_ID = '6a2133ceda38895dfe85373f';
const JSONBIN_KEY = '$2a$10$KSgO4UIPUUjxFhx.T96MdegtzwN4Y5OImEEGHcx.Ct1NHyxFvZGaa';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

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

// Promo banner
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');
if (sessionStorage.getItem('promoDismissed')) promoBanner.style.display = 'none';
promoClose.addEventListener('click', () => {
  promoBanner.style.display = 'none';
  sessionStorage.setItem('promoDismissed', 'true');
});

// Countdown timer
function getNextHappyHour() {
  const now = new Date();
  const target = new Date();
  target.setHours(17, 0, 0, 0);
  const day = now.getDay();
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
  const diff = getNextHappyHour() - new Date();
  const timerEl = document.querySelector('.countdown-timer');
  if (diff <= 0) { timerEl.innerHTML = '<p class="timer-ended">Happy Hour is on right now! 🎉</p>'; return; }
  document.getElementById('cd-hours').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Cookie consent
const cookieBanner = document.getElementById('cookieBanner');
if (!localStorage.getItem('cookieConsent')) setTimeout(() => cookieBanner.classList.add('show'), 1500);
document.getElementById('cookieAccept').addEventListener('click', () => { localStorage.setItem('cookieConsent', 'accepted'); cookieBanner.classList.remove('show'); });
document.getElementById('cookieDecline').addEventListener('click', () => { localStorage.setItem('cookieConsent', 'declined'); cookieBanner.classList.remove('show'); });

// ── REAL-TIME REVIEWS ──
let allReviews = [];
let selectedStars = 0;

// Star picker
const starSpans = document.querySelectorAll('#starPicker span');
starSpans.forEach(star => {
  star.addEventListener('mouseover', () => highlightStars(+star.dataset.val));
  star.addEventListener('mouseout', () => highlightStars(selectedStars));
  star.addEventListener('click', () => { selectedStars = +star.dataset.val; highlightStars(selectedStars); });
});
function highlightStars(n) {
  starSpans.forEach(s => s.classList.toggle('active', +s.dataset.val <= n));
}

// Fetch reviews from JSONBin
async function fetchReviews() {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const data = await res.json();
    allReviews = data.record.reviews || [];
    renderReviews();
  } catch {
    document.getElementById('reviewsGrid').innerHTML = '<p style="text-align:center;color:var(--text-muted)">Could not load reviews.</p>';
  }
}

// Render reviews
function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  const sort = document.getElementById('rvSort').value;
  const rvCount = document.getElementById('rvCount');

  let sorted = [...allReviews];
  if (sort === 'newest') sorted.reverse();
  else if (sort === 'highest') sorted.sort((a,b) => b.rating - a.rating);
  else if (sort === 'lowest') sorted.sort((a,b) => a.rating - b.rating);

  rvCount.textContent = `${allReviews.length} review${allReviews.length !== 1 ? 's' : ''}`;

  if (sorted.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">No reviews yet — be the first! ☕</p>';
    return;
  }

  grid.innerHTML = sorted.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const initials = r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    const date = new Date(r.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    return `
      <div class="review-card">
        <div class="stars">${stars}</div>
        <p>"${r.text}"</p>
        <div class="reviewer">
          <div class="reviewer-avatar">${initials}</div>
          <div><strong>${r.name}</strong><span>${date}</span></div>
        </div>
      </div>`;
  }).join('');
}

// Submit review
document.getElementById('rvSubmit').addEventListener('click', async () => {
  const name = document.getElementById('rv-name').value.trim();
  const text = document.getElementById('rv-text').value.trim();
  const rvMsg = document.getElementById('rvMsg');

  if (!name || !text || selectedStars === 0) {
    rvMsg.style.color = '#c0392b';
    rvMsg.textContent = 'Please fill in your name, rating, and review.';
    return;
  }

  document.getElementById('rvSubmit').textContent = 'Submitting...';
  document.getElementById('rvSubmit').disabled = true;

  const newReview = { name, text, rating: selectedStars, date: new Date().toISOString() };
  const updatedReviews = [...allReviews, newReview];

  try {
    const res = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
      body: JSON.stringify({ reviews: updatedReviews })
    });
    if (res.ok) {
      allReviews = updatedReviews;
      renderReviews();
      rvMsg.style.color = '#c0704a';
      rvMsg.textContent = `Thanks ${name}! Your review is live. ☕`;
      document.getElementById('rv-name').value = '';
      document.getElementById('rv-text').value = '';
      selectedStars = 0;
      highlightStars(0);
    } else {
      rvMsg.style.color = '#c0392b';
      rvMsg.textContent = 'Could not save review. Please try again.';
    }
  } catch {
    rvMsg.style.color = '#c0392b';
    rvMsg.textContent = 'Network error. Please try again.';
  }

  document.getElementById('rvSubmit').textContent = 'Submit Review';
  document.getElementById('rvSubmit').disabled = false;
});

// Sort change
document.getElementById('rvSort').addEventListener('change', renderReviews);

// Load reviews on page load
fetchReviews();
