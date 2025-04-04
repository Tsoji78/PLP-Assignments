// Check authentication at the start
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('currentUser') || 
                        JSON.parse(sessionStorage.getItem('currentUser')));
  
  if (!user && !window.location.pathname.includes('login.html')) {
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
                  localStorage.removeItem('currentUser');
                  sessionStorage.removeItem('currentUser');
                  window.location.href = 'login.html';
              });
          }
      }
  }
  
  // Rest of your existing script.js code...
  // [Keep all the existing code from the original script.js]
});

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const bookingForm = document.getElementById('booking-form');
  const searchResultsSection = document.querySelector('.search-results-section');
  const bookingDetailsSection = document.querySelector('.booking-details-section');
  const bookingConfirmationSection = document.querySelector('.booking-confirmation-section');
  const trainList = document.getElementById('train-list');
  const modifySearchBtn = document.getElementById('modify-search');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const returnDateGroup = document.querySelector('.return-date-group');
  const returnDateInput = document.getElementById('return-date');
  const passengerFieldsContainer = document.getElementById('passenger-fields-container');
  const passengerCountSelect = document.getElementById('passengers');
  
  // Sample train data
  const sampleTrains = [
      {
          number: '12302',
          name: 'Rajdhani Express',
          from: 'Delhi (DEL)',
          to: 'Mumbai (CSTM)',
          departure: '16:35',
          arrival: '08:15',
          duration: '15h 40m',
          classes: [
              { name: 'AC 2 Tier (2A)', price: '₹2,920', availability: 'Available' },
              { name: 'AC 3 Tier (3A)', price: '₹2,015', availability: 'Available' },
              { name: 'Sleeper (SL)', price: '₹1,210', availability: 'RAC 4' }
          ]
      },
      {
          number: '12952',
          name: 'Mumbai Rajdhani',
          from: 'Delhi (DEL)',
          to: 'Mumbai (CSTM)',
          departure: '16:55',
          arrival: '08:45',
          duration: '15h 50m',
          classes: [
              { name: 'AC First Class (1A)', price: '₹4,955', availability: 'Available' },
              { name: 'AC 2 Tier (2A)', price: '₹2,920', availability: 'Available' },
              { name: 'AC 3 Tier (3A)', price: '₹2,015', availability: 'Waitlist 12' }
          ]
      },
      {
          number: '12954',
          name: 'Shatabdi Express',
          from: 'Delhi (DEL)',
          to: 'Mumbai (CSTM)',
          departure: '06:15',
          arrival: '14:25',
          duration: '8h 10m',
          classes: [
              { name: 'Executive Class (EC)', price: '₹3,465', availability: 'Available' },
              { name: 'Chair Car (CC)', price: '₹1,860', availability: 'Available' }
          ]
      },
      {
          number: '12310',
          name: 'Duronto Express',
          from: 'Delhi (DEL)',
          to: 'Mumbai (CSTM)',
          departure: '22:40',
          arrival: '11:30',
          duration: '12h 50m',
          classes: [
              { name: 'AC 2 Tier (2A)', price: '₹2,920', availability: 'Available' },
              { name: 'AC 3 Tier (3A)', price: '₹2,015', availability: 'Available' },
              { name: 'Sleeper (SL)', price: '₹1,210', availability: 'Available' }
          ]
      }
  ];
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  mobileMenuBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
  });
  
  // Tab functionality
  tabButtons.forEach(button => {
      button.addEventListener('click', function() {
          tabButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          if (this.dataset.tab === 'round-trip') {
              returnDateGroup.classList.add('active');
              returnDateInput.disabled = false;
          } else {
              returnDateGroup.classList.remove('active');
              returnDateInput.disabled = true;
          }
      });
  });
  
  // Generate passenger fields based on selection
  passengerCountSelect.addEventListener('change', function() {
      generatePassengerFields(parseInt(this.value));
  });
  
  function generatePassengerFields(count) {
      passengerFieldsContainer.innerHTML = '';
      
      for (let i = 1; i <= count; i++) {
          const passengerField = document.createElement('div');
          passengerField.className = 'passenger-field';
          passengerField.innerHTML = `
              <input type="text" placeholder="Passenger ${i} Name" required>
              <select required>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
              </select>
              <input type="number" placeholder="Age" min="1" max="120" required>
          `;
          passengerFieldsContainer.appendChild(passengerField);
      }
  }
  
  // Booking form submission
  bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const fromStation = document.getElementById('from-station').value;
      const toStation = document.getElementById('to-station').value;
      const departureDate = document.getElementById('departure-date').value;
      const passengers = document.getElementById('passengers').value;
      const travelClass = document.getElementById('class').value;
      
      // In a real app, you would fetch trains from an API based on these values
      // For this demo, we'll use our sample data
      
      // Display search results
      displayTrainResults(sampleTrains);
      bookingForm.parentElement.parentElement.classList.add('hidden');
      searchResultsSection.classList.remove('hidden');
      
      // Scroll to results
      searchResultsSection.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Display train results
  function displayTrainResults(trains) {
      trainList.innerHTML = '';
      
      trains.forEach(train => {
          const trainCard = document.createElement('div');
          trainCard.className = 'train-card';
          
          let classesHtml = '';
          train.classes.forEach(cls => {
              classesHtml += `
                  <div class="class-option">
                      <div class="class-name">${cls.name}</div>
                      <div class="class-price">${cls.price}</div>
                      <div class="class-availability">${cls.availability}</div>
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
                      <div class="time">${train.departure}</div>
                      <div class="station">${train.from}</div>
                  </div>
                  <div class="duration">
                      <i class="fas fa-clock"></i>
                      <div>${train.duration}</div>
                  </div>
                  <div class="departure-arrival">
                      <div class="time">${train.arrival}</div>
                      <div class="station">${train.to}</div>
                  </div>
              </div>
              <div class="train-classes">
                  ${classesHtml}
              </div>
              <div class="train-actions">
                  <button class="btn btn-primary book-train-btn" data-train='${JSON.stringify(train)}'>Book Now</button>
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
              const trainData = JSON.parse(this.dataset.train);
              const selectedClass = this.closest('.train-card').querySelector('.class-option.selected');
              
              if (!selectedClass) {
                  alert('Please select a class');
                  return;
              }
              
              showBookingDetails(trainData, selectedClass);
          });
      });
  }
  
  // Show booking details
  function showBookingDetails(train, classOption) {
      const className = classOption.querySelector('.class-name').textContent;
      const price = classOption.querySelector('.class-price').textContent;
      
      // Update selected train summary
      const selectedTrainSummary = document.getElementById('selected-train-summary');
      selectedTrainSummary.innerHTML = `
          <div class="train-header">
              <div class="train-name">${train.name}</div>
              <div class="train-number">${train.number}</div>
          </div>
          <div class="train-details">
              <div class="departure-arrival">
                  <div class="time">${train.departure}</div>
                  <div class="station">${train.from}</div>
              </div>
              <div class="duration">
                  <i class="fas fa-clock"></i>
                  <div>${train.duration}</div>
              </div>
              <div class="departure-arrival">
                  <div class="time">${train.arrival}</div>
                  <div class="station">${train.to}</div>
              </div>
          </div>
          <div class="train-class">
              <strong>Class:</strong> ${className}
          </div>
          <div class="train-price">
              <strong>Price:</strong> ${price} per passenger
          </div>
      `;
      
      // Generate passenger fields
      generatePassengerFields(parseInt(passengerCountSelect.value));
      
      // Show booking details section
      searchResultsSection.classList.add('hidden');
      bookingDetailsSection.classList.remove('hidden');
      
      // Scroll to booking details
      bookingDetailsSection.scrollIntoView({ behavior: 'smooth' });
      
      // Handle booking form submission
      const passengerDetailsForm = document.getElementById('passenger-details-form');
      passengerDetailsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // In a real app, you would send this data to the server
          // For this demo, we'll just show the confirmation
          
          // Set confirmation details
          document.getElementById('pnr-number').textContent = 'PNR' + Math.floor(10000000 + Math.random() * 90000000);
          document.getElementById('confirmed-train-number').textContent = train.number;
          document.getElementById('confirmed-train-name').textContent = train.name;
          document.getElementById('confirmed-from').textContent = train.from;
          document.getElementById('confirmed-to').textContent = train.to;
          
          // Format departure date from the booking form
          const departureDateInput = document.getElementById('departure-date');
          const departureDate = new Date(departureDateInput.value);
          const formattedDepartureDate = departureDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
          });
          
          document.getElementById('confirmed-departure').textContent = 
              `${formattedDepartureDate}, ${train.departure}`;
          document.getElementById('confirmed-arrival').textContent = train.arrival;
          document.getElementById('confirmed-class').textContent = className;
          document.getElementById('confirmed-passengers').textContent = passengerCountSelect.value;
          
          // Calculate total fare
          const pricePerPassenger = parseInt(price.replace(/[^0-9]/g, ''));
          const totalFare = pricePerPassenger * parseInt(passengerCountSelect.value);
          document.getElementById('confirmed-fare').textContent = 
              `₹ ${totalFare.toLocaleString('en-IN')}`;
          
          // Show confirmation
          bookingDetailsSection.classList.add('hidden');
          bookingConfirmationSection.classList.remove('hidden');
          
          // Scroll to confirmation
          bookingConfirmationSection.scrollIntoView({ behavior: 'smooth' });
      });
  }
  
  // Modify search button
  modifySearchBtn.addEventListener('click', function() {
      searchResultsSection.classList.add('hidden');
      bookingForm.parentElement.parentElement.classList.remove('hidden');
  });
  
  // Print ticket button
  document.getElementById('print-ticket').addEventListener('click', function() {
      window.print();
  });
  
  // Download ticket button
  document.getElementById('download-ticket').addEventListener('click', function() {
      alert('In a real app, this would download your ticket as a PDF');
  });
  
  // Initialize passenger fields
  generatePassengerFields(1);
  
  // Set minimum date for departure date picker to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('departure-date').min = today;
  document.getElementById('return-date').min = today;
});