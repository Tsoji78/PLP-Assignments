document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('currentUser')) || 
                 JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user in header
    const userActions = document.getElementById('user-actions');
    if (userActions) {
        userActions.innerHTML = `
            <a href="#" class="btn btn-outline" id="logout-btn">Logout</a>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
    
    // Sample booking data
    const sampleBookings = [
        {
            pnr: 'PNR78541296',
            trainNumber: '12302',
            trainName: 'Rajdhani Express',
            from: 'Delhi (DEL)',
            to: 'Mumbai (CSTM)',
            departure: '15 Jul 2023, 16:35',
            arrival: '16 Jul 2023, 08:15',
            class: 'AC 2 Tier (2A)',
            passengers: 2,
            fare: '₹5,840',
            status: 'upcoming'
        },
        {
            pnr: 'PNR36985214',
            trainNumber: '12952',
            trainName: 'Mumbai Rajdhani',
            from: 'Delhi (DEL)',
            to: 'Mumbai (CSTM)',
            departure: '10 Jul 2023, 16:55',
            arrival: '11 Jul 2023, 08:45',
            class: 'AC 3 Tier (3A)',
            passengers: 1,
            fare: '₹2,015',
            status: 'completed'
        },
        {
            pnr: 'PNR95175382',
            trainNumber: '12954',
            trainName: 'Shatabdi Express',
            from: 'Delhi (DEL)',
            to: 'Mumbai (CSTM)',
            departure: '5 Jul 2023, 06:15',
            arrival: '5 Jul 2023, 14:25',
            class: 'Executive Class (EC)',
            passengers: 3,
            fare: '₹10,395',
            status: 'cancelled'
        }
    ];
    
    // Display bookings
    const bookingsList = document.getElementById('bookings-list');
    const noBookings = document.getElementById('no-bookings');
    const bookingFilter = document.getElementById('booking-filter');
    
    function displayBookings(filter = 'all') {
        bookingsList.innerHTML = '';
        
        const filteredBookings = filter === 'all' 
            ? sampleBookings 
            : sampleBookings.filter(b => b.status === filter);
        
        if (filteredBookings.length === 0) {
            noBookings.classList.remove('hidden');
            return;
        }
        
        noBookings.classList.add('hidden');
        
        filteredBookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            
            let statusClass = '';
            let statusText = '';
            
            switch(booking.status) {
                case 'upcoming':
                    statusClass = 'status-upcoming';
                    statusText = 'Upcoming';
                    break;
                case 'completed':
                    statusClass = 'status-completed';
                    statusText = 'Completed';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Cancelled';
                    break;
            }
            
            bookingCard.innerHTML = `
                <div class="booking-header">
                    <div>
                        <div class="booking-train">${booking.trainName} (${booking.trainNumber})</div>
                        <div class="booking-pnr">PNR: ${booking.pnr}</div>
                    </div>
                    <div class="booking-status ${statusClass}">${statusText}</div>
                </div>
                <div class="booking-details">
                    <div class="booking-detail-item">
                        <span>From</span>
                        <strong>${booking.from}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>To</span>
                        <strong>${booking.to}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>Departure</span>
                        <strong>${booking.departure}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>Arrival</span>
                        <strong>${booking.arrival}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>Class</span>
                        <strong>${booking.class}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>Passengers</span>
                        <strong>${booking.passengers}</strong>
                    </div>
                    <div class="booking-detail-item">
                        <span>Fare</span>
                        <strong>${booking.fare}</strong>
                    </div>
                </div>
                <div class="booking-actions">
                    ${booking.status === 'upcoming' ? `
                        <button class="btn btn-outline cancel-booking" data-pnr="${booking.pnr}">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                    <button class="btn btn-outline download-ticket" data-pnr="${booking.pnr}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            
            bookingsList.appendChild(bookingCard);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.cancel-booking').forEach(button => {
            button.addEventListener('click', function() {
                const pnr = this.dataset.pnr;
                if (confirm(`Are you sure you want to cancel booking ${pnr}?`)) {
                    alert(`Booking ${pnr} has been cancelled`);
                    // In a real app, you would update the booking status via API
                    displayBookings(bookingFilter.value);
                }
            });
        });
        
        document.querySelectorAll('.download-ticket').forEach(button => {
            button.addEventListener('click', function() {
                const pnr = this.dataset.pnr;
                alert(`Downloading ticket for PNR ${pnr}`);
                // In a real app, this would download the ticket PDF
            });
        });
    }
    
    // Initial display
    displayBookings();
    
    // Filter change handler
    bookingFilter.addEventListener('change', function() {
        displayBookings(this.value);
    });
});