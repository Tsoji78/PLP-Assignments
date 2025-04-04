document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('currentUser') || 
                 JSON.parse(sessionStorage.getItem('currentUser')));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set username in sidebar
    const sidebarUsername = document.getElementById('sidebar-username');
    if (sidebarUsername && user.name) {
        sidebarUsername.textContent = user.name;
    }
    
    // Sidebar toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Logout functionality
    const logoutButtons = document.querySelectorAll('#sidebar-logout, .user-dropdown');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    });
    
    // Initialize charts
    initCharts();
    
    // Sample data for charts
    function initCharts() {
        // Bookings Chart
        const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
        const bookingsChart = new Chart(bookingsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Bookings',
                    data: [85, 92, 78, 95, 110, 105, 125, 115, 98, 120, 135, 150],
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        const revenueChart = new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['AC 1st Class', 'AC 2 Tier', 'AC 3 Tier', 'Sleeper', 'Chair Car'],
                datasets: [{
                    data: [15, 25, 30, 20, 10],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#9b59b6',
                        '#e74c3c'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // Simulate loading data
    setTimeout(() => {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.style.opacity = '1';
        });
    }, 500);
});