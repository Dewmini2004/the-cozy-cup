// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

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

// Contact form with Formspree
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('formMsg');

sendBtn.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formMsg.style.color = '#c0392b';
    formMsg.textContent = 'Please fill in all fields.';
    return;
  }

  sendBtn.textContent = 'Sending...';
  sendBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xjgdbevj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      formMsg.style.color = '#c0704a';
      formMsg.textContent = `Thanks ${name}! We'll get back to you soon. ☕`;
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      formMsg.style.color = '#c0392b';
      formMsg.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    formMsg.style.color = '#c0392b';
    formMsg.textContent = 'Network error. Please check your connection.';
  }

  sendBtn.textContent = 'Send Message';
  sendBtn.disabled = false;
});