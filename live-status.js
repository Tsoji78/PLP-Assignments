document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('currentUser') || 
                 sessionStorage.getItem('currentUser'));
    
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
    
    // Set minimum date for journey date picker to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('journey-date').min = today;
    
    // Sample train data
    const sampleTrains = {
        '12302': {
            name: 'Rajdhani Express (12302)',
            route: [
                { station: 'Delhi (NDLS)', time: '16:35', platform: '5', status: 'departed', actualTime: '16:35' },
                { station: 'Mathura Junction (MTJ)', time: '18:05', platform: '2', status: 'departed', actualTime: '18:10' },
                { station: 'Kota Junction (KOTA)', time: '21:20', platform: '3', status: 'departed', actualTime: '21:25' },
                { station: 'Vadodara Junction (BRC)', time: '02:15', platform: '1', status: 'expected', actualTime: null },
                { station: 'Mumbai Central (BCT)', time: '08:15', platform: '7', status: 'expected', actualTime: null }
            ],
            currentStatus: 'Running 10 mins late',
            lastLocation: 'Kota Junction (KOTA)',
            delay: '10 min'
        },
        '12952': {
            name: 'Mumbai Rajdhani (12952)',
            route: [
                { station: 'Delhi (NDLS)', time: '16:55', platform: '3', status: 'departed', actualTime: '16:55' },
                { station: 'Jaipur Junction (JP)', time: '20:30', platform: '4', status: 'departed', actualTime: '20:30' },
                { station: 'Kota Junction (KOTA)', time: '22:45', platform: '2', status: 'expected', actualTime: null },
                { station: 'Vadodara Junction (BRC)', time: '04:30', platform: '1', status: 'expected', actualTime: null },
                { station: 'Mumbai Central (BCT)', time: '08:45', platform: '5', status: 'expected', actualTime: null }
            ],
            currentStatus: 'On Time',
            lastLocation: 'Jaipur Junction (JP)',
            delay: '0 min'
        }
    };
    
    // Status form submission
    const statusForm = document.getElementById('status-form');
    const statusResults = document.getElementById('status-results');
    
    statusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trainNumber = document.getElementById('train-number').value;
        const journeyDate = document.getElementById('journey-date').value;
        
        // In a real app, you would fetch this data from an API
        // For demo, we'll use our sample data
        const train = sampleTrains[trainNumber];
        
        if (train) {
            displayTrainStatus(train);
        } else {
            alert('Train not found. Please check the train number.');
        }
    });
    
    // Display train status
    function displayTrainStatus(train) {
        document.getElementById('status-train-name').textContent = train.name;
        document.getElementById('current-status').textContent = train.currentStatus;
        document.getElementById('last-location').textContent = train.lastLocation;
        document.getElementById('delay-time').textContent = train.delay;
        
        const timelineContainer = document.getElementById('timeline-container');
        timelineContainer.innerHTML = '';
        
        train.route.forEach((stop, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${stop.status === 'departed' ? 'passed' : ''} ${index === 2 ? 'current' : ''}`;
            
            const isDelayed = stop.actualTime && stop.actualTime !== stop.time;
            
            timelineItem.innerHTML = `
                <div class="timeline-header">
                    <div class="timeline-station">${stop.station}</div>
                    <div class="timeline-time ${isDelayed ? 'delayed' : ''}">
                        ${stop.actualTime || stop.time}
                        ${isDelayed ? `<span class="original-time">(Sched: ${stop.time})</span>` : ''}
                    </div>
                </div>
                <div class="timeline-details">
                    <span>Platform: <strong class="timeline-platform">${stop.platform}</strong></span>
                    <span>Status: <strong>${stop.status === 'departed' ? 'Departed' : 'Expected'}</strong></span>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });
        
        statusResults.classList.remove('hidden');
    }
    
    // Refresh status button
    document.getElementById('refresh-status').addEventListener('click', function() {
        const trainNumber = document.getElementById('train-number').value;
        if (trainNumber) {
            // In a real app, this would refetch the status
            alert('Status refreshed');
        } else {
            alert('Please search for a train first');
        }
    });
});