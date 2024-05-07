var map, marker;
var fullscreenButton = document.getElementById('fullscreen-btn');

function initMap() {
  map = L.map('map').setView([51.505, -0.09], 13); // Default location and zoom level
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
      fullscreenButton.classList.add('fullscreen-hidden');
    } else {
      fullscreenButton.classList.remove('fullscreen-hidden');
    }
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  document.getElementById("location").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
  const pos = new L.LatLng(latitude, longitude);
  map.setView(pos, 15); // Set the zoom level to 15 when showing the location

  if (marker) {
    marker.setLatLng(pos);
  } else {
    marker = L.marker(pos).addTo(map);
  }
  getAddress(latitude, longitude);
}

function getAddress(latitude, longitude) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("address").innerHTML = "Address: " + data.display_name;
    })
    .catch(error => {
      document.getElementById("address").innerHTML = "Error getting address: " + error;
    });
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("location").innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("location").innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      document.getElementById("location").innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("location").innerHTML = "An unknown error occurred."
      break;
  }
}

function toggleFullScreen() {
  var elem = document.getElementById('map');
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
}

initMap();