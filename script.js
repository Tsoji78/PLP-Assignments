// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  
  return response.json();
}

// Check authentication at the start
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
    return;
  }
  
  // If user is logged in, show their name in header
  if (user) {
    const nav = document.querySelector('nav ul');
    if (nav) {
      const userItem = document.createElement('li');
      userItem.innerHTML = `<a href="#"><i class="fas fa-user"></i> ${user.name}</a>`;
      nav.appendChild(userItem);
      
      // Replace login/signup with logout
      const userActions = document.querySelector('.user-actions');
      if (userActions) {
        userActions.innerHTML = `
          <a href="#" class="btn btn-outline" id="logout-btn">Logout</a>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = 'login.html';
        });
      }
    }
  }
  
  // Set minimum date for departure date picker to today
  const today = new Date().toISOString().split('T')[0];
  const departureDateInput = document.getElementById('departure-date');
  if (departureDateInput) {
    departureDateInput.min = today;
  }
  
  // Initialize page-specific functionality
  if (document.getElementById('booking-form')) {
    initBookingPage(token);
  } else if (document.getElementById('bookings-list')) {
    initMyBookingsPage(token);
  } else if (document.getElementById('status-form')) {
    initLiveStatusPage();
  }
});

// Initialize Booking Page
async function initBookingPage(token) {
  const bookingForm = document.getElementById('booking-form');
  if (!bookingForm) return;
  
  // Handle form submission
  bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
      const fromStation = document.getElementById('from-station').value;
      const toStation = document.getElementById('to-station').value;
      const departureDate = document.getElementById('departure-date').value;
      
      // Fetch trains based on search criteria
      const trains = await fetchAPI(
        `/trains?source=${fromStation}&destination=${toStation}&date=${departureDate}`,
        'GET',
        null,
        token
      );
      
      displayTrainResults(trains);
      bookingForm.parentElement.parentElement.classList.add('hidden');
      document.querySelector('.search-results-section').classList.remove('hidden');
    } catch (error) {
      alert(error.message);
    }
  });
  
  // Display train results
  function displayTrainResults(trains) {
    const trainList = document.getElementById('train-list');
    trainList.innerHTML = '';
    
    if (trains.length === 0) {
      trainList.innerHTML = '<p class="no-results">No trains found for your search criteria</p>';
      return;
    }
    
    trains.forEach(train => {
      const trainCard = document.createElement('div');
      trainCard.className = 'train-card';
      trainCard.dataset.trainId = train.id;
      
      let classesHtml = '';
      train.classes.forEach(cls => {
        classesHtml += `
          <div class="class-option" data-class-id="${cls.id}" data-price="${cls.price}">
            <div class="class-name">${cls.name}</div>
            <div class="class-price">₹${cls.price.toFixed(2)}</div>
            <div class="class-availability">${cls.seats} seats</div>
          </div>
        `;
      });
      
      trainCard.innerHTML = `
        <div class="train-header">
          <div class="train-name">${train.name}</div>
          <div class="train-number">${train.number}</div>
        </div>
        <div class="train-details">
          <div class="departure-arrival">
            <div class="time">${train.departure_time}</div>
            <div class="station">${train.source}</div>
          </div>
          <div class="duration">
            <i class="fas fa-clock"></i>
            <div>${train.duration}</div>
          </div>
          <div class="departure-arrival">
            <div class="time">${train.arrival_time}</div>
            <div class="station">${train.destination}</div>
          </div>
        </div>
        <div class="train-classes">
          ${classesHtml}
        </div>
        <div class="train-actions">
          <button class="btn btn-primary book-train-btn">Book Now</button>
        </div>
      `;
      
      trainList.appendChild(trainCard);
    });
    
    // Add event listeners to class options
    document.querySelectorAll('.class-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-train-btn').forEach(button => {
      button.addEventListener('click', function() {
        const trainCard = this.closest('.train-card');
        const trainId = trainCard.dataset.trainId;
        const selectedClass = trainCard.querySelector('.class-option.selected');
        
        if (!selectedClass) {
          alert('Please select a class');
          return;
        }
        
        const classId = selectedClass.dataset.classId;
        const price = parseFloat(selectedClass.dataset.price);
        
        showBookingDetails(trainId, classId, price);
      });
    });
  }
  
  // Show booking details
  async function showBookingDetails(trainId, classId, price) {
    try {
      // Fetch train details
      const train = await fetchAPI(`/trains/${trainId}`, 'GET', null, token);
      const selectedClass = train.classes.find(c => c.id == classId);
      
      // Update selected train summary
      const selectedTrainSummary = document.getElementById('selected-train-summary');
      selectedTrainSummary.innerHTML = `
        <div class="train-header">
          <div class="train-name">${train.name}</div>
          <div class="train-number">${train.number}</div>
        </div>
        <div class="train-details">
          <div class="departure-arrival">
            <div class="time">${train.departure_time}</div>
            <div class="station">${train.source}</div>
          </div>
          <div class="duration">
            <i class="fas fa-clock"></i>
            <div>${train.duration}</div>
          </div>
          <div class="departure-arrival">
            <div class="time">${train.arrival_time}</div>
            <div class="station">${train.destination}</div>
          </div>
        </div>
        <div class="train-class">
          <strong>Class:</strong> ${selectedClass.name}
        </div>
        <div class="train-price">
          <strong>Price:</strong> ₹${price.toFixed(2)} per passenger
        </div>
      `;
      
      // Generate passenger fields
      const passengerCount = parseInt(document.getElementById('passengers').value);
      generatePassengerFields(passengerCount);
      
      // Show booking details section
      document.querySelector('.search-results-section').classList.add('hidden');
      document.querySelector('.booking-details-section').classList.remove('hidden');
      
      // Handle booking form submission
      const passengerDetailsForm = document.getElementById('passenger-details-form');
      passengerDetailsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
          const journeyDate = document.getElementById('departure-date').value;
          const mobileNumber = document.getElementById('mobile-number').value;
          const email = document.getElementById('email').value;
          
          // Collect passenger details
          const passengerDetails = [];
          document.querySelectorAll('#passenger-fields-container .passenger-field').forEach(field => {
            passengerDetails.push({
              name: field.querySelector('input[type="text"]').value,
              age: field.querySelector('input[type="number"]').value,
              gender: field.querySelector('select').value
            });
          });
          
          // Calculate total amount
          const totalAmount = price * passengerCount;
          
          // Create booking
          const booking = await fetchAPI(
            '/bookings',
            'POST',
            {
              train_id: trainId,
              class_id: classId,
              journey_date: journeyDate,
              passengers: passengerCount,
              passenger_details: passengerDetails,
              total_amount: totalAmount
            },
            token
          );
          
          // Show confirmation
          document.getElementById('pnr-number').textContent = booking.pnr;
          document.getElementById('confirmed-train-number').textContent = train.number;
          document.getElementById('confirmed-train-name').textContent = train.name;
          document.getElementById('confirmed-from').textContent = train.source;
          document.getElementById('confirmed-to').textContent = train.destination;
          
          const departureDate = new Date(journeyDate);
          const formattedDepartureDate = departureDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
          
          document.getElementById('confirmed-departure').textContent = 
            `${formattedDepartureDate}, ${train.departure_time}`;
          document.getElementById('confirmed-arrival').textContent = train.arrival_time;
          document.getElementById('confirmed-class').textContent = selectedClass.name;
          document.getElementById('confirmed-passengers').textContent = passengerCount;
          document.getElementById('confirmed-fare').textContent = 
            `₹ ${totalAmount.toFixed(2)}`;
          
          document.querySelector('.booking-details-section').classList.add('hidden');
          document.querySelector('.booking-confirmation-section').classList.remove('hidden');
        } catch (error) {
          alert(error.message);
        }
      });
    } catch (error) {
      alert(error.message);
    }
  }
  
  // Generate passenger fields
  function generatePassengerFields(count) {
    const container = document.getElementById('passenger-fields-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
      const field = document.createElement('div');
      field.className = 'passenger-field';
      field.innerHTML = `
        <input type="text" placeholder="Passenger ${i} Name" required>
        <select required>
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="number" placeholder="Age" min="1" max="120" required>
      `;
      container.appendChild(field);
    }
  }
  
  // Passenger count change handler
  const passengerCountSelect = document.getElementById('passengers');
  if (passengerCountSelect) {
    passengerCountSelect.addEventListener('change', function() {
      generatePassengerFields(parseInt(this.value));
    });
  }
}

// Initialize My Bookings Page
async function initMyBookingsPage(token) {
  try {
    const bookings = await fetchAPI('/bookings', 'GET', null, token);
    displayBookings(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    displayBookings([]);
  }
  
  function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookings-list');
    const noBookings = document.getElementById('no-bookings');
    
    bookingsList.innerHTML = '';
    
    if (bookings.length === 0) {
      noBookings.classList.remove('hidden');
      return;
    }
    
    noBookings.classList.add('hidden');
    
    bookings.forEach(booking => {
      const bookingCard = document.createElement('div');
      bookingCard.className = 'booking-card';
      
      let statusClass = '';
      let statusText = '';
      
      switch(booking.status) {
        case 'confirmed':
          statusClass = 'status-upcoming';
          statusText = 'Confirmed';
          break;
        case 'cancelled':
          statusClass = 'status-cancelled';
          statusText = 'Cancelled';
          break;
        case 'completed':
          statusClass = 'status-completed';
          statusText = 'Completed';
          break;
      }
      
      bookingCard.innerHTML = `
        <div class="booking-header">
          <div>
            <div class="booking-train">${booking.train_name} (${booking.train_number})</div>
            <div class="booking-pnr">PNR: ${booking.pnr}</div>
          </div>
          <div class="booking-status ${statusClass}">${statusText}</div>
        </div>
        <div class="booking-details">
          <div class="booking-detail-item">
            <span>From</span>
            <strong>${booking.source}</strong>
          </div>
          <div class="booking-detail-item">
            <span>To</span>
            <strong>${booking.destination}</strong>
          </div>
          <div class="booking-detail-item">
            <span>Departure</span>
            <strong>${booking.journey_date}, ${booking.departure_time}</strong>
          </div>
          <div class="booking-detail-item">
            <span>Arrival</span>
            <strong>${booking.arrival_time}</strong>
          </div>
          <div class="booking-detail-item">
            <span>Class</span>
            <strong>${booking.class_name}</strong>
          </div>
          <div class="booking-detail-item">
            <span>Passengers</span>
            <strong>${booking.passengers}</strong>
          </div>
          <div class="booking-detail-item">
            <span>Fare</span>
            <strong>₹${parseFloat(booking.total_amount).toFixed(2)}</strong>
          </div>
        </div>
        <div class="booking-actions">
          ${booking.status === 'confirmed' ? `
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
          // In a real app, you would call an API to cancel the booking
          alert(`Booking ${pnr} has been cancelled`);
          initMyBookingsPage(token); // Refresh the list
        }
      });
    });
    
    document.querySelectorAll('.download-ticket').forEach(button => {
      button.addEventListener('click', function() {
        const pnr = this.dataset.pnr;
        alert(`Downloading ticket for PNR ${pnr}`);
      });
    });
  }
}

// Initialize Live Status Page
function initLiveStatusPage() {
  const statusForm = document.getElementById('status-form');
  if (!statusForm) return;
  
  statusForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const trainNumber = document.getElementById('train-number').value;
    const journeyDate = document.getElementById('journey-date').value;
    
    // In a real app, you would fetch this data from an API
    alert(`Checking live status for train ${trainNumber} on ${journeyDate}`);
    
    // For demo purposes, we'll just show the results section
    document.getElementById('status-results').classList.remove('hidden');
  });
}