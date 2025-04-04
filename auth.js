// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Login form submission
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const { token, user } = await response.json();
    
    // Store token and user
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to home page
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});

// Registration form submission
document.getElementById('register-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  try {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    // Auto-login after registration
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Registration successful but login failed');
    }
    
    const { token, user } = await loginResponse.json();
    
    // Store token and user
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to home page
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});

// Check if user is already logged in
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token && user && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  } else if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

checkAuth();