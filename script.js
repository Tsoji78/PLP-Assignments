 // Mobile menu toggle
 const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
 const sidebar = document.querySelector('.sidebar');
 
 mobileMenuBtn.addEventListener('click', () => {
     sidebar.classList.toggle('active');
 });

 // Close sidebar when clicking outside on mobile
 document.addEventListener('click', (e) => {
     if (window.innerWidth <= 1024 && 
         !sidebar.contains(e.target) && 
         !mobileMenuBtn.contains(e.target)) {
         sidebar.classList.remove('active');
     }
 });

 // Utility function to show messages
function showMessage(message, type = 'success') {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 5px; color: white; background-color: ${type === 'success' ? '#28a745' : '#dc3545'}; z-index: 1000;`;
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}

// Handle Login
if (document.querySelector('#login-form')) {
    document.querySelector('#login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email_or_phone = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_or_phone, password })
        });
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('full_name', data.user.full_name);
            showMessage('Login successful!');
            window.location.href = '/dashboard.html';
        } else {
            showMessage(data.message, 'error');
        }
    });
}

// Handle Registration
if (document.querySelector('#register-form')) {
    document.querySelector('#register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = document.querySelector('#full-name').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const password = document.querySelector('#password').value;
        const confirm_password = document.querySelector('#confirm-password').value;

        if (password !== confirm_password) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, phone, password })
        });
        const data = await response.json();

        if (data.success) {
            showMessage('Registration successful! Please login.');
            setTimeout(() => window.location.href = '/login.html', 1000);
        } else {
            showMessage(data.error, 'error');
        }
    });
}

// Handle Dashboard
if (document.querySelector('.dashboard')) {
    const user_id = localStorage.getItem('user_id');
    const full_name = localStorage.getItem('full_name');

    if (!user_id) {
        window.location.href = '/login.html';
        return;
    }

    document.querySelector('.user-name').textContent = full_name;
    document.querySelector('.user-avatar').textContent = full_name[0].toUpperCase() + 
        (full_name.split(' ')[1] ? full_name.split(' ')[1][0].toUpperCase() : '');

    fetch(`/api/bookings/${user_id}`)
        .then(res => res.json())
        .then(bookings => {
            const bookingCount = bookings.length;
            document.querySelector('.stat-value').textContent = bookingCount;
        });
}

// Handle Book Tickets
if (document.querySelector('#book-ticket-form')) {
    document.querySelector('#book-ticket-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
            window.location.href = '/login.html';
            return;
        }

        const origin = document.querySelector('#from-station').value;
        const destination = document.querySelector('#to-station').value;
        const departure_date = document.querySelector('#departure-date').value;
        const travel_class = document.querySelector('#class').value;

        const response = await fetch('/api/book-ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, origin, destination, departure_date, class: travel_class })
        });
        const data = await response.json();

        if (data.success) {
            showMessage('Ticket booked successfully!');
            window.location.href = '/my-bookings.html';
        } else {
            showMessage(data.error, 'error');
        }
    });
}

// Handle My Bookings
if (document.querySelector('.my-bookings')) {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = '/login.html';
        return;
    }

    fetch(`/api/bookings/${user_id}`)
        .then(res => res.json())
        .then(bookings => {
            const bookingList = document.querySelector('.train-list');
            bookingList.innerHTML = '';
            if (bookings.length === 0) {
                bookingList.innerHTML = '<p>No upcoming trips found.</p>';
            } else {
                bookings.forEach(booking => {
                    const item = document.createElement('div');
                    item.className = 'train-item';
                    item.innerHTML = `
                        <div class="train-icon"><i class="fas fa-bus"></i></div>
                        <div class="train-details">
                            <h4>${booking.origin} → ${booking.destination} (Booking #${booking.id})</h4>
                            <p>${booking.departure_date} | ${booking.class}</p>
                        </div>
                        <div class="train-status ${booking.status === 'Confirmed' ? 'on-time' : 'delayed'}">${booking.status}</div>
                    `;
                    bookingList.appendChild(item);
                });
            }
        });
}

// Logout
document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('full_name');
        showMessage('Logged out successfully!');
        window.location.href = '/login.html';
    });
});