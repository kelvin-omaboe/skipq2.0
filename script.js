// App State
let currentUser = null;
let isOtpSent = false;
let bookingData = {};
let isAdmin = false;
let allBookings = [];
let allPayments = [];
let excludedDates = [];
let maxTicketsPerBus = 50;
let currentTicketsSold = 0;
let bookedSeats = [];
let selectedPaymentMethod = null;




// Paystack Configuration - LIVE PUBLIC KEY
const PAYSTACK_PUBLIC_KEY = 'pk_live_511a715f9a472f5f811e06e0db53ed6b2b23f3ca'; // Live Paystack public key

// Route data structure with regions: departure station -> available destinations with prices
const routeData = {
    // Greater Accra Region Stations
    'kaneshie-station': {
        region: 'Greater Accra',
        city: 'Accra',
        stationName: 'Kaneshie Station',
        destinations: {
            'kumasi': { name: '🌳 Kumasi', price: 45, region: 'Ashanti' },
            'tamale': { name: '🌾 Tamale', price: 65, region: 'Northern' },
            'cape-coast': { name: '🏖️ Cape Coast', price: 35, region: 'Central' },
            'ho': { name: '⛰️ Ho', price: 40, region: 'Volta' },
            'sunyani': { name: '🌿 Sunyani', price: 50, region: 'Bono' }
        }
    },
    'circle-station': {
        region: 'Greater Accra',
        city: 'Accra',
        stationName: 'Circle Station',
        destinations: {
            'kumasi': { name: '🌳 Kumasi', price: 48, region: 'Ashanti' },
            'tamale': { name: '🌾 Tamale', price: 68, region: 'Northern' },
            'ho': { name: '⛰️ Ho', price: 42, region: 'Volta' },
            'koforidua': { name: '🏞️ Koforidua', price: 30, region: 'Eastern' }
        }
    },
    'tema-station': {
        region: 'Greater Accra',
        city: 'Tema',
        stationName: 'Tema Station',
        destinations: {
            'kumasi': { name: '🌳 Kumasi', price: 50, region: 'Ashanti' },
            'ho': { name: '⛰️ Ho', price: 38, region: 'Volta' },
            'koforidua': { name: '🏞️ Koforidua', price: 28, region: 'Eastern' }
        }
    },
    'madina-station': {
        region: 'Greater Accra',
        city: 'Accra',
        stationName: 'Madina Station',
        destinations: {
            'kumasi': { name: '🌳 Kumasi', price: 47, region: 'Ashanti' },
            'tamale': { name: '🌾 Tamale', price: 67, region: 'Northern' },
            'koforidua': { name: '🏞️ Koforidua', price: 25, region: 'Eastern' }
        }
    },

    // Ashanti Region Stations
    'kejetia-station': {
        region: 'Ashanti',
        city: 'Kumasi',
        stationName: 'Kejetia Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 45, region: 'Greater Accra' },
            'tamale': { name: '🌾 Tamale', price: 35, region: 'Northern' },
            'sunyani': { name: '🌿 Sunyani', price: 25, region: 'Bono' },
            'wa': { name: '🌅 Wa', price: 55, region: 'Upper West' }
        }
    },
    'adum-station': {
        region: 'Ashanti',
        city: 'Kumasi',
        stationName: 'Adum Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 42, region: 'Greater Accra' },
            'tamale': { name: '🌾 Tamale', price: 32, region: 'Northern' },
            'cape-coast': { name: '🏖️ Cape Coast', price: 30, region: 'Central' }
        }
    },
    'tech-junction': {
        region: 'Ashanti',
        city: 'Kumasi',
        stationName: 'Tech Junction',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 44, region: 'Greater Accra' },
            'sunyani': { name: '🌿 Sunyani', price: 22, region: 'Bono' },
            'wa': { name: '🌅 Wa', price: 52, region: 'Upper West' }
        }
    },

    // Northern Region Stations
    'tamale-central': {
        region: 'Northern',
        city: 'Tamale',
        stationName: 'Central Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 65, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 35, region: 'Ashanti' },
            'wa': { name: '🌅 Wa', price: 25, region: 'Upper West' },
            'bolgatanga': { name: '🏔️ Bolgatanga', price: 20, region: 'Upper East' }
        }
    },
    'kalpohin-station': {
        region: 'Northern',
        city: 'Tamale',
        stationName: 'Kalpohin Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 62, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 32, region: 'Ashanti' },
            'wa': { name: '🌅 Wa', price: 22, region: 'Upper West' }
        }
    },

    // Central Region Stations
    'kotokuraba-station': {
        region: 'Central',
        city: 'Cape Coast',
        stationName: 'Kotokuraba Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 35, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 30, region: 'Ashanti' },
            'takoradi': { name: '🏭 Takoradi', price: 15, region: 'Western' }
        }
    },
    'pedu-station': {
        region: 'Central',
        city: 'Cape Coast',
        stationName: 'Pedu Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 32, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 28, region: 'Ashanti' }
        }
    },

    // Volta Region Stations
    'ho-central': {
        region: 'Volta',
        city: 'Ho',
        stationName: 'Ho Central Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 40, region: 'Greater Accra' },
            'koforidua': { name: '🏞️ Koforidua', price: 25, region: 'Eastern' },
            'aflao': { name: '🌊 Aflao', price: 15, region: 'Volta' }
        }
    },
    'bankoe-station': {
        region: 'Volta',
        city: 'Ho',
        stationName: 'Bankoe Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 38, region: 'Greater Accra' },
            'koforidua': { name: '🏞️ Koforidua', price: 22, region: 'Eastern' }
        }
    },

    // Bono Region Stations
    'sunyani-station': {
        region: 'Bono',
        city: 'Sunyani',
        stationName: 'Sunyani Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 50, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 25, region: 'Ashanti' },
            'wa': { name: '🌅 Wa', price: 35, region: 'Upper West' }
        }
    },

    // Eastern Region Stations
    'new-juaben-station': {
        region: 'Eastern',
        city: 'Koforidua',
        stationName: 'New Juaben Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 30, region: 'Greater Accra' },
            'ho': { name: '⛰️ Ho', price: 25, region: 'Volta' },
            'kumasi': { name: '🌳 Kumasi', price: 40, region: 'Ashanti' }
        }
    },

    // Upper West Region Stations
    'wa-central': {
        region: 'Upper West',
        city: 'Wa',
        stationName: 'Wa Central Station',
        destinations: {
            'kumasi': { name: '🌳 Kumasi', price: 55, region: 'Ashanti' },
            'tamale': { name: '🌾 Tamale', price: 25, region: 'Northern' },
            'sunyani': { name: '🌿 Sunyani', price: 35, region: 'Bono' }
        }
    },

    // Western Region Stations
    'takoradi-station': {
        region: 'Western',
        city: 'Takoradi',
        stationName: 'Takoradi Station',
        destinations: {
            'accra': { name: '🏛️ Accra', price: 45, region: 'Greater Accra' },
            'cape-coast': { name: '🏖️ Cape Coast', price: 15, region: 'Central' },
            'kumasi': { name: '🌳 Kumasi', price: 40, region: 'Ashanti' }
        }
    },

    // Upper East Region Stations
    'bolgatanga-station': {
        region: 'Upper East',
        city: 'Bolgatanga',
        stationName: 'Bolgatanga Station',
        destinations: {
            'tamale': { name: '🌾 Tamale', price: 20, region: 'Northern' },
            'accra': { name: '🏛️ Accra', price: 85, region: 'Greater Accra' },
            'kumasi': { name: '🌳 Kumasi', price: 55, region: 'Ashanti' }
        }
    }
};

// Region data for easy access
const regionData = {
    'Greater Accra': '🏛️ Greater Accra Region',
    'Ashanti': '🌳 Ashanti Region', 
    'Northern': '🌾 Northern Region',
    'Central': '🏖️ Central Region',
    'Volta': '⛰️ Volta Region',
    'Eastern': '🏞️ Eastern Region',
    'Western': '🏭 Western Region',
    'Bono': '🌿 Bono Region',
    'Upper West': '🌅 Upper West Region',
    'Upper East': '🏔️ Upper East Region'
};

// Payment method names
const paymentMethodNames = {
    'card': '💳 Card Payment',
    'mobile_money': '📱 Mobile Money',
    'bank_transfer': '🏦 Bank Transfer'
};

// Initialize app
function init() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travelDate').min = today;
    document.getElementById('travelDate').value = today;

    // Format phone input
    document.getElementById('phoneInput').addEventListener('input', formatPhoneInput);
    
    // Initialize departure regions
    initializeDepartureRegions();
    
    // Add change listeners for price calculation
    document.getElementById('destinationSelect').addEventListener('change', calculatePrice);
    document.getElementById('passengerCount').addEventListener('change', calculatePrice);
}

function initializeDepartureRegions() {
    const departureRegionSelect = document.getElementById('departureRegionSelect');
    departureRegionSelect.innerHTML = '<option value="">1️⃣ First, select your region</option>';
    
    // Add all regions
    Object.keys(regionData).sort().forEach(regionKey => {
        const option = document.createElement('option');
        option.value = regionKey;
        option.textContent = regionData[regionKey];
        departureRegionSelect.appendChild(option);
    });
}

function updateDepartureStations() {
    const selectedRegion = document.getElementById('departureRegionSelect').value;
    const departureStationSelect = document.getElementById('departureStationSelect');
    
    // Reset station selection
    departureStationSelect.innerHTML = '<option value="">2️⃣ Then, choose your station</option>';
    
    if (selectedRegion) {
        // Get stations in the selected region
        const stationsInRegion = Object.keys(routeData).filter(stationKey => {
            return routeData[stationKey].region === selectedRegion;
        });
        
        // Group by city within the region
        const stationsByCity = {};
        stationsInRegion.forEach(stationKey => {
            const station = routeData[stationKey];
            if (!stationsByCity[station.city]) {
                stationsByCity[station.city] = [];
            }
            stationsByCity[station.city].push({
                key: stationKey,
                name: station.stationName
            });
        });
        
        // Add stations grouped by city
        Object.keys(stationsByCity).sort().forEach(city => {
            if (Object.keys(stationsByCity).length > 1) {
                // Create optgroup if multiple cities
                const optgroup = document.createElement('optgroup');
                optgroup.label = `📍 ${city}`;
                
                stationsByCity[city].forEach(station => {
                    const option = document.createElement('option');
                    option.value = station.key;
                    option.textContent = station.name;
                    optgroup.appendChild(option);
                });
                
                departureStationSelect.appendChild(optgroup);
            } else {
                // Add directly if only one city
                stationsByCity[city].forEach(station => {
                    const option = document.createElement('option');
                    option.value = station.key;
                    option.textContent = station.name;
                    departureStationSelect.appendChild(option);
                });
            }
        });
        
        departureStationSelect.disabled = false;
    } else {
        departureStationSelect.disabled = true;
    }
    
    // Reset destination selections
    resetDestinationSelections();
}

function resetDestinationSelections() {
    const destinationRegionSelect = document.getElementById('destinationRegionSelect');
    const destinationSelect = document.getElementById('destinationSelect');
    
    destinationRegionSelect.innerHTML = '<option value="">1️⃣ First, select destination region</option>';
    destinationSelect.innerHTML = '<option value="">2️⃣ Then, choose your destination</option>';
    destinationRegionSelect.disabled = true;
    destinationSelect.disabled = true;
    
    calculatePrice();
}

function updateDestinations() {
    const departureStation = document.getElementById('departureStationSelect').value;
    const destinationRegionSelect = document.getElementById('destinationRegionSelect');
    
    if (departureStation && routeData[departureStation]) {
        // Get available destination regions from this departure station
        const availableDestinations = routeData[departureStation].destinations;
        const availableRegions = new Set();
        
        Object.values(availableDestinations).forEach(dest => {
            availableRegions.add(dest.region);
        });
        
        // Populate destination regions
        destinationRegionSelect.innerHTML = '<option value="">1️⃣ First, select destination region</option>';
        
        Array.from(availableRegions).sort().forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = regionData[region];
            destinationRegionSelect.appendChild(option);
        });
        
        destinationRegionSelect.disabled = false;
    } else {
        resetDestinationSelections();
    }
}

function updateDestinationCities() {
    const departureStation = document.getElementById('departureStationSelect').value;
    const selectedDestinationRegion = document.getElementById('destinationRegionSelect').value;
    const destinationSelect = document.getElementById('destinationSelect');
    
    destinationSelect.innerHTML = '<option value="">2️⃣ Then, choose your destination</option>';
    
    if (departureStation && selectedDestinationRegion && routeData[departureStation]) {
        const availableDestinations = routeData[departureStation].destinations;
        
        // Filter destinations by selected region
        const destinationsInRegion = Object.keys(availableDestinations).filter(destKey => {
            return availableDestinations[destKey].region === selectedDestinationRegion;
        });
        
        destinationsInRegion.forEach(destKey => {
            const destination = availableDestinations[destKey];
            const option = document.createElement('option');
            option.value = JSON.stringify({
                key: destKey,
                name: destination.name,
                price: destination.price,
                region: destination.region,
                departureStation: routeData[departureStation].stationName
            });
            option.textContent = `${destination.name} - GH₵${destination.price}`;
            destinationSelect.appendChild(option);
        });
        
        destinationSelect.disabled = false;
    } else {
        destinationSelect.disabled = true;
    }
    
    calculatePrice();
}

function formatPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length >= 7) {
        value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
    } else if (value.length >= 4) {
        value = value.slice(0, 3) + ' ' + value.slice(3);
    }
    
    e.target.value = value;
}

function checkExcludedDate() {
    const selectedDate = document.getElementById('travelDate').value;
    const dateWarning = document.getElementById('dateWarning');
    const dateWarningReason = document.getElementById('dateWarningReason');
    const bookButton = document.getElementById('bookButton');
    const travelDateInput = document.getElementById('travelDate');
    
    // Find if the selected date is excluded
    const excludedDate = excludedDates.find(item => item.date === selectedDate);
    
    if (excludedDate) {
        // Show warning
        dateWarning.classList.remove('hidden');
        dateWarningReason.textContent = `Reason: ${excludedDate.reason}`;
        
        // Add shake animation to date input
        travelDateInput.classList.add('warning-shake');
        setTimeout(() => {
            travelDateInput.classList.remove('warning-shake');
        }, 500);
        
        // Disable booking button
        bookButton.disabled = true;
        bookButton.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
        
        // Hide price display
        document.getElementById('priceDisplay').classList.add('hidden');
        document.getElementById('paymentMethods').classList.add('hidden');
    } else {
        // Hide warning
        dateWarning.classList.add('hidden');
        
        // Re-enable booking if other conditions are met
        calculatePrice();
    }
}

  


function adminLogin() {
    isAdmin = true;
    currentUser = {
        phone: 'Admin',
        displayPhone: 'Administrator'
    };
    showAdminScreen();
}

function showAdminScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('bookingScreen').classList.add('hidden');
    document.getElementById('adminScreen').classList.remove('hidden');
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('userPhone').textContent = 'Admin Dashboard';
    
    // Initialize admin data
    initializeAdmin();
}

function initializeAdmin() {
    // Set max tickets input
    document.getElementById('maxTicketsInput').value = maxTicketsPerBus;
    
    // Display routes overview
    displayRoutesOverview();
    
    // Update capacity display
    updateCapacityDisplay();
    
    // Update bookings display
    updateBookingsDisplay();
    
    // Update payments display
    updatePaymentsDisplay();
}

function displayRoutesOverview() {
    const container = document.getElementById('routesOverview');
    container.innerHTML = '';
    
    // Group routes by city
    const routesByCity = {};
    Object.keys(routeData).forEach(stationKey => {
        const station = routeData[stationKey];
        if (!routesByCity[station.city]) {
            routesByCity[station.city] = [];
        }
        routesByCity[station.city].push({
            key: stationKey,
            station: station
        });
    });
    
    Object.keys(routesByCity).forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.className = 'bg-white p-4 rounded-lg border border-gray-200';
        
        let stationsHtml = '';
        routesByCity[city].forEach(route => {
            const destinationCount = Object.keys(route.station.destinations).length;
            stationsHtml += `
                <div class="flex justify-between items-center py-1">
                    <span class="text-sm">${route.station.stationName}</span>
                    <span class="text-xs text-blue-600 font-medium">${destinationCount} routes</span>
                </div>
            `;
        });
        
        cityDiv.innerHTML = `
            <h5 class="font-bold text-gray-800 mb-2">📍 ${city}</h5>
            <div class="text-sm text-gray-600">
                ${stationsHtml}
            </div>
        `;
        
        container.appendChild(cityDiv);
    });
}

function showAdminTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('text-red-600', 'border-b-2', 'border-red-600');
        tab.classList.add('text-gray-500');
    });
    
    // Show selected panel
    document.getElementById(tabName + 'Panel').classList.remove('hidden');
    
    // Activate selected tab
    const activeTab = document.getElementById(tabName + 'Tab');
    activeTab.classList.add('active', 'text-red-600', 'border-b-2', 'border-red-600');
    activeTab.classList.remove('text-gray-500');
}

function updateMaxTickets() {
    const input = document.getElementById('maxTicketsInput');
    const newMax = parseInt(input.value);
    
    if (newMax < 1 || newMax > 100) {
        alert('Maximum tickets must be between 1 and 100');
        return;
    }
    
    maxTicketsPerBus = newMax;
    updateCapacityDisplay();
    alert(`Maximum tickets per bus updated to ${newMax}`);
}

function updateCapacityDisplay() {
    document.getElementById('displayMaxTickets').textContent = maxTicketsPerBus;
    document.getElementById('displayTicketsSold').textContent = currentTicketsSold;
    document.getElementById('displayAvailable').textContent = maxTicketsPerBus - currentTicketsSold;
}

function excludeDate() {
    const dateInput = document.getElementById('excludeDate');
    const reasonInput = document.getElementById('excludeReason');
    
    const date = dateInput.value;
    const reason = reasonInput.value.trim() || 'No service';
    
    if (!date) {
        alert('Please select a date to exclude');
        return;
    }
    
    // Check if date is already excluded
    if (excludedDates.some(item => item.date === date)) {
        alert('This date is already excluded');
        return;
    }
    
    excludedDates.push({ date, reason });
    updateExcludedDatesList();
    
    // Clear inputs
    dateInput.value = '';
    reasonInput.value = '';
    
    alert(`Date ${date} excluded successfully`);
}

function updateExcludedDatesList() {
    const container = document.getElementById('excludedDatesList');
    
    if (excludedDates.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No dates excluded</p>';
        return;
    }
    
    container.innerHTML = '';
    excludedDates.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white p-2 rounded border border-gray-200';
        div.innerHTML = `
            <div>
                <div class="font-semibold text-sm">${new Date(item.date).toLocaleDateString()}</div>
                <div class="text-xs text-gray-500">${item.reason}</div>
            </div>
            <button onclick="removeExcludedDate(${index})" class="text-red-500 hover:text-red-700 text-sm">🗑️</button>
        `;
        container.appendChild(div);
    });
}

function removeExcludedDate(index) {
    if (confirm('Remove this excluded date?')) {
        excludedDates.splice(index, 1);
        updateExcludedDatesList();
    }
}

function refreshBookings() {
    updateBookingsDisplay();
    alert('Bookings refreshed!');
}

function refreshPayments() {
    updatePaymentsDisplay();
    alert('Payments refreshed!');
}

function exportPayments() {
    if (allPayments.length === 0) {
        alert('No payment data to export');
        return;
    }

    // Create CSV content
    const csvContent = [
        'Transaction ID,Ticket ID,Amount,Payment Method,Status,Date,Customer Phone',
        ...allPayments.map(payment => 
            `${payment.transactionId},${payment.ticketId},${payment.amount},${payment.method},${payment.status},${payment.date},${payment.customerPhone}`
        )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkipQ_Payments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function updateBookingsDisplay() {
    // Update statistics
    document.getElementById('totalBookings').textContent = allBookings.length;
    
    const totalRevenue = allBookings.reduce((sum, booking) => {
        return sum + parseInt(booking.price.replace('GH₵ ', ''));
    }, 0);
    document.getElementById('totalRevenue').textContent = `GH₵ ${totalRevenue}`;
    
    const totalPassengers = allBookings.reduce((sum, booking) => {
        return sum + parseInt(booking.passengers);
    }, 0);
    document.getElementById('totalPassengers').textContent = totalPassengers;
    
    // Update bookings list
    const container = document.getElementById('bookingsList');
    
    if (allBookings.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-gray-500">No bookings yet</div>';
        return;
    }
    
    container.innerHTML = '';
    allBookings.slice(-10).reverse().forEach(booking => {
        const div = document.createElement('div');
        div.className = 'p-4 border-b border-gray-100 hover:bg-gray-50';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="font-semibold text-sm">${booking.ticketId}</div>
                    <div class="text-sm text-gray-600">${booking.from} → ${booking.to}</div>
                    <div class="text-xs text-gray-500">${booking.date} • ${booking.passengers} passengers • Seats: ${booking.seats}</div>
                </div>
                <div class="text-right">
                    <div class="font-semibold text-green-600">${booking.price}</div>
                    <div class="text-xs text-gray-500">${booking.bookingTime}</div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function updatePaymentsDisplay() {
    // Update statistics
    const successfulPayments = allPayments.filter(p => p.status === 'success').length;
    const failedPayments = allPayments.filter(p => p.status === 'failed').length;
    const pendingPayments = allPayments.filter(p => p.status === 'pending').length;
    
    document.getElementById('successfulPayments').textContent = successfulPayments;
    document.getElementById('failedPayments').textContent = failedPayments;
    document.getElementById('pendingPayments').textContent = pendingPayments;
    
    const totalPaymentRevenue = allPayments
        .filter(p => p.status === 'success')
        .reduce((sum, payment) => sum + payment.amount, 0);
    document.getElementById('totalPaymentRevenue').textContent = `GH₵ ${totalPaymentRevenue}`;
    
    // Update payments list
    const container = document.getElementById('paymentsList');
    
    if (allPayments.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-gray-500">No payment transactions yet</div>';
        return;
    }
    
    container.innerHTML = '';
    allPayments.slice(-10).reverse().forEach(payment => {
        const statusColor = payment.status === 'success' ? 'text-green-600' : 
                          payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600';
        const statusIcon = payment.status === 'success' ? '✅' : 
                         payment.status === 'failed' ? '❌' : '⏳';
        
        const div = document.createElement('div');
        div.className = 'p-4 border-b border-gray-100 hover:bg-gray-50';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="font-semibold text-sm">${payment.transactionId}</div>
                    <div class="text-sm text-gray-600">Ticket: ${payment.ticketId}</div>
                    <div class="text-xs text-gray-500">${paymentMethodNames[payment.method]} • ${payment.customerPhone}</div>
                </div>
                <div class="text-right">
                    <div class="font-semibold">GH₵ ${payment.amount}</div>
                    <div class="text-xs ${statusColor}">${statusIcon} ${payment.status.toUpperCase()}</div>
                    <div class="text-xs text-gray-500">${payment.date}</div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function showBookingScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('adminScreen').classList.add('hidden');
    document.getElementById('bookingScreen').classList.remove('hidden');
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('userPhone').textContent = currentUser.phone;
}

function calculatePrice() {
    const destinationSelect = document.getElementById('destinationSelect');
    const passengerCount = parseInt(document.getElementById('passengerCount').value);
    const priceDisplay = document.getElementById('priceDisplay');
    const paymentMethods = document.getElementById('paymentMethods');
    const totalPriceElement = document.getElementById('totalPrice');
    const seatsAvailableElement = document.getElementById('seatsAvailable');
    const bookButton = document.getElementById('bookButton');
    const selectedDate = document.getElementById('travelDate').value;

    // Check if date is excluded
    const isDateExcluded = excludedDates.some(item => item.date === selectedDate);
    
    // Calculate available seats
    const availableSeats = maxTicketsPerBus - currentTicketsSold;

    if (destinationSelect.value && passengerCount && !isDateExcluded) {
        const routeInfo = JSON.parse(destinationSelect.value);
        const totalPrice = routeInfo.price * passengerCount;
        
        totalPriceElement.textContent = `GH₵ ${totalPrice}`;
        seatsAvailableElement.textContent = availableSeats;
        priceDisplay.classList.remove('hidden');
        paymentMethods.classList.remove('hidden');
        
        // Check if enough seats available
        if (passengerCount <= availableSeats) {
            // Enable booking only if payment method is selected
            if (selectedPaymentMethod) {
                bookButton.disabled = false;
                bookButton.classList.remove('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
            } else {
                bookButton.disabled = true;
                bookButton.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
            }
            seatsAvailableElement.className = 'text-lg font-bold text-green-600';
        } else {
            bookButton.disabled = true;
            bookButton.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
            seatsAvailableElement.className = 'text-lg font-bold text-red-600';
        }
    } else {
        priceDisplay.classList.add('hidden');
        paymentMethods.classList.add('hidden');
        bookButton.disabled = true;
        bookButton.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
    }
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update UI to show selected method
    document.querySelectorAll('#paymentMethods .bg-white').forEach(card => {
        card.classList.remove('border-green-400', 'border-blue-400', 'border-purple-400');
        card.classList.add('border-gray-200');
    });
    
    // Highlight selected method
    event.currentTarget.classList.remove('border-gray-200');
    if (method === 'card') {
        event.currentTarget.classList.add('border-green-400');
    } else if (method === 'mobile_money') {
        event.currentTarget.classList.add('border-blue-400');
    } else if (method === 'bank_transfer') {
        event.currentTarget.classList.add('border-purple-400');
    }
    
    // Show selected method
    document.getElementById('selectedPaymentMethod').classList.remove('hidden');
    document.getElementById('paymentMethodName').textContent = paymentMethodNames[method];
    
    // Re-calculate to enable/disable book button
    calculatePrice();
}

function initiatePayment() {
    const departureStation = document.getElementById('departureStationSelect');
    const destination = document.getElementById('destinationSelect');
    const travelDate = document.getElementById('travelDate').value;
    const passengerCount = parseInt(document.getElementById('passengerCount').value);
    const totalPrice = document.getElementById('totalPrice').textContent;

    if (!departureStation.value || !destination.value || !travelDate || !selectedPaymentMethod) {
        alert('Please fill in all required fields and select a payment method');
        return;
    }

    // Check if date is excluded
    if (excludedDates.some(item => item.date === travelDate)) {
        alert('Sorry, this date is not available for booking. Please select another date.');
        return;
    }

    // Check capacity
    if (currentTicketsSold + passengerCount > maxTicketsPerBus) {
        alert(`Sorry, only ${maxTicketsPerBus - currentTicketsSold} seats available. Please reduce passenger count.`);
        return;
    }

    const routeInfo = JSON.parse(destination.value);
    const amountInPesewas = routeInfo.price * passengerCount * 100; // Convert to pesewas for Paystack
    
    // Show loading state
    const bookButton = document.getElementById('bookButton');
    const bookButtonText = document.getElementById('bookButtonText');
    const paymentLoader = document.getElementById('paymentLoader');
    
    bookButton.disabled = true;
    bookButtonText.textContent = 'Processing Payment...';
    paymentLoader.classList.remove('hidden');

    // Prepare booking data
    const assignedSeats = [];
    for (let i = 0; i < passengerCount; i++) {
        let seatNumber = currentTicketsSold + i + 1;
        assignedSeats.push(seatNumber);
        bookedSeats.push(seatNumber);
    }
    
    bookingData = {
        ticketId: 'SQ' + Date.now().toString().slice(-8),
        from: routeInfo.departureStation,
        to: routeInfo.name.replace(/🏛️|🌳|🌾|🏖️|⛰️|🌿|🏞️|🌅|🏭|🌊|🏔️/g, '').trim(),
        date: new Date(travelDate).toLocaleDateString('en-GB'),
        passengers: passengerCount.toString(),
        seats: assignedSeats.join(', '),
        price: totalPrice,
        paymentMethod: selectedPaymentMethod,
        bookingTime: new Date().toLocaleString(),
        userPhone: currentUser.phone,
        amount: routeInfo.price * passengerCount
    };

    // Create payment transaction record
    const paymentTransaction = {
        transactionId: 'TXN' + Date.now().toString().slice(-6),
        ticketId: bookingData.ticketId,
        amount: bookingData.amount,
        method: selectedPaymentMethod,
        status: 'pending',
        date: new Date().toLocaleString(),
        customerPhone: currentUser.phone
    };

    // Add to payments array
    allPayments.push(paymentTransaction);

    // Use Paystack for ALL payment methods - they handle everything
    if (selectedPaymentMethod === 'card') {
        // Use Paystack for card payments
        initiatePaystackPayment(amountInPesewas, paymentTransaction);
    } else {
        // Use Paystack for mobile money and bank transfers too
        simulateAlternativePayment(amountInPesewas, paymentTransaction);
    }
}

function initiatePaystackPayment(amount, paymentTransaction) {
    // Note: In production, replace with your actual Paystack public key
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY, // Your actual Paystack public key
        email: currentUser.phone.replace('+233', '') + '@skipq.com', // Generate email from phone
        amount: amount, // Amount in pesewas
        currency: 'GHS',
        ref: paymentTransaction.transactionId,
        metadata: {
            ticketId: bookingData.ticketId,
            from: bookingData.from,
            to: bookingData.to,
            passengers: bookingData.passengers
        },
        callback: function(response) {
            // Payment successful
            paymentTransaction.status = 'success';
            paymentTransaction.paystackRef = response.reference;
            
            // Update payment in array
            const paymentIndex = allPayments.findIndex(p => p.transactionId === paymentTransaction.transactionId);
            if (paymentIndex !== -1) {
                allPayments[paymentIndex] = paymentTransaction;
            }
            
            completeBooking();
        },
        onClose: function() {
            // Payment cancelled
            paymentTransaction.status = 'failed';
            
            // Update payment in array
            const paymentIndex = allPayments.findIndex(p => p.transactionId === paymentTransaction.transactionId);
            if (paymentIndex !== -1) {
                allPayments[paymentIndex] = paymentTransaction;
            }
            
            resetBookingButton();
            alert('Payment was cancelled. Please try again.');
        }
    });
    
    handler.openIframe();
}

function simulateAlternativePayment(amount, paymentTransaction) {
    // Use Paystack for ALL payment methods - they handle mobile money and bank transfers
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser.phone.replace('+233', '') + '@skipq.com',
        amount: amount,
        currency: 'GHS',
        ref: paymentTransaction.transactionId,
        channels: selectedPaymentMethod === 'mobile_money' 
            ? ['mobile_money'] // Only show mobile money options
            : selectedPaymentMethod === 'bank_transfer'
            ? ['bank'] // Only show bank transfer options
            : ['card', 'bank', 'ussd', 'qr', 'mobile_money'], // All options for card
        metadata: {
            ticketId: bookingData.ticketId,
            from: bookingData.from,
            to: bookingData.to,
            passengers: bookingData.passengers,
            payment_method: selectedPaymentMethod
        },
        callback: function(response) {
            // Real payment successful
            paymentTransaction.status = 'success';
            paymentTransaction.paystackRef = response.reference;
            
            // Update payment in array
            const paymentIndex = allPayments.findIndex(p => p.transactionId === paymentTransaction.transactionId);
            if (paymentIndex !== -1) {
                allPayments[paymentIndex] = paymentTransaction;
            }
            
            completeBooking();
        },
        onClose: function() {
            // Payment cancelled or failed
            paymentTransaction.status = 'failed';
            
            // Update payment in array
            const paymentIndex = allPayments.findIndex(p => p.transactionId === paymentTransaction.transactionId);
            if (paymentIndex !== -1) {
                allPayments[paymentIndex] = paymentTransaction;
            }
            
            resetBookingButton();
            alert('Payment was cancelled or failed. Please try again.');
        }
    });
    
    handler.openIframe();
}

function completeBooking() {
    // Add to all bookings for admin tracking
    allBookings.push(bookingData);
    
    // Update ticket count
    currentTicketsSold += parseInt(bookingData.passengers);

    // Reset booking button
    resetBookingButton();

    // Show ticket
    showTicket();
}

function resetBookingButton() {
    const bookButton = document.getElementById('bookButton');
    const bookButtonText = document.getElementById('bookButtonText');
    const paymentLoader = document.getElementById('paymentLoader');
    
    bookButton.disabled = false;
    bookButtonText.textContent = '🎫 Book Your Ticket Now';
    paymentLoader.classList.add('hidden');
}

function showTicket() {
    document.getElementById('ticketId').textContent = bookingData.ticketId;
    document.getElementById('ticketFrom').textContent = bookingData.from;
    document.getElementById('ticketTo').textContent = bookingData.to;
    document.getElementById('ticketDate').textContent = bookingData.date;
    document.getElementById('ticketPassengers').textContent = bookingData.passengers;
    document.getElementById('ticketSeats').textContent = bookingData.seats;
    document.getElementById('ticketPrice').textContent = bookingData.price;
    document.getElementById('ticketPaymentMethod').textContent = paymentMethodNames[bookingData.paymentMethod];
    
    document.getElementById('ticketModal').classList.remove('hidden');
}

function closeTicketModal() {
    document.getElementById('ticketModal').classList.add('hidden');
    
    // Reset form for new booking
    document.getElementById('departureRegionSelect').value = '';
    document.getElementById('departureStationSelect').innerHTML = '<option value="">2️⃣ Then, choose your station</option>';
    document.getElementById('departureStationSelect').disabled = true;
    document.getElementById('destinationRegionSelect').innerHTML = '<option value="">1️⃣ First, select destination region</option>';
    document.getElementById('destinationRegionSelect').disabled = true;
    document.getElementById('destinationSelect').innerHTML = '<option value="">2️⃣ Then, choose your destination</option>';
    document.getElementById('destinationSelect').disabled = true;
    document.getElementById('passengerCount').value = '1';
    document.getElementById('priceDisplay').classList.add('hidden');
    document.getElementById('paymentMethods').classList.add('hidden');
    document.getElementById('bookButton').disabled = true;
    document.getElementById('dateWarning').classList.add('hidden');
    
    // Reset payment method selection
    selectedPaymentMethod = null;
    document.getElementById('selectedPaymentMethod').classList.add('hidden');
    document.querySelectorAll('#paymentMethods .bg-white').forEach(card => {
        card.classList.remove('border-green-400', 'border-blue-400', 'border-purple-400');
        card.classList.add('border-gray-200');
    });
}

function downloadTicket() {
    // Create a simple text-based ticket for download
    const ticketContent = `
⚡ SKIPQ E-TICKET ⚡
==========================================
Skip the Queue, Book with Ease

Ticket ID: ${bookingData.ticketId}
🚏 From: ${bookingData.from}
🏙️ To: ${bookingData.to}
📅 Date: ${bookingData.date}
👥 Passengers: ${bookingData.passengers}
🪑 Seat Numbers: ${bookingData.seats}
💳 Payment Method: ${paymentMethodNames[bookingData.paymentMethod]}
💰 Total Paid: ${bookingData.price}
🕒 Booked: ${bookingData.bookingTime}

==========================================
Present this ticket to the driver
Visit us at SkipQ.com
==========================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkipQ_Ticket_${bookingData.ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function logout() {
    currentUser = null;
    isOtpSent = false;
    isAdmin = false;
    selectedPaymentMethod = null;
    
    // Reset auth form
    document.getElementById('phoneInput').value = '';
    document.getElementById('phoneInput').disabled = false;
    document.getElementById('otpInput').value = '';
    document.getElementById('otpSection').classList.add('hidden');
    document.getElementById('authButton').textContent = '🚀 Send OTP';
    
    // Show auth screen
    document.getElementById('bookingScreen').classList.add('hidden');
    document.getElementById('adminScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('userInfo').classList.add('hidden');
    document.getElementById('ticketModal').classList.add('hidden');
}

// Initialize the app
init();