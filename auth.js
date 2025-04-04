

document.addEventListener('DOMContentLoaded', function() {
  // Seed user data
  const users = [
      {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          bookings: []
      },
      {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          password: "password123",
          bookings: []
      }
  ];

  // DOM Elements
  const loginForm = document.getElementById('login-form');
  
  // Login form submission
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('remember').checked;
      
      // Validate user
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
          // Store user in session
          if (rememberMe) {
              localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
              sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
          
          // Redirect to booking page
          window.location.href = 'index.html';
      } else {
          alert('Invalid email or password');
      }
  });
  
  // Check if user is already logged in
  function checkAuth() {
      const user = JSON.parse(localStorage.getItem('currentUser') || 
                   sessionStorage.getItem('currentUser'));
      
      if (user && window.location.pathname.includes('login.html')) {
          window.location.href = 'index.html';
      }
  }
  
  checkAuth();
});

// Registration form (if on register page)
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            bookings: []
        };
        
        users.push(newUser);
        
        // Auto-login and redirect
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    });
}