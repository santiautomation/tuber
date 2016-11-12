var markers = [];
var map;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: -27.468059, lng: -58.835618 }
    });
    directionsDisplay.setMap(map);

    document.getElementById('submit').addEventListener('click', function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    var llenado = document.getElementById('llenado-minimo').value;

    httpGetAsync("http://localhost:5000/api/addresslist?llenado=" + llenado, function(response) {

        var keys = [];
        for (var v in response) {
            waypts.push({
                location: response[v],
                stopover: true
            });
        };

        var startingPoint = document.getElementById('starting-point');

        directionsService.route({
            origin: startingPoint.length > 0 ? startingPoint : 'San Juan 500, Corrientes, Corrientes',
            destination: startingPoint.length > 0 ? startingPoint : 'San Juan 500, Corrientes, Corrientes',
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    });

    httpGetAsync("http://localhost:5000/api/geocodedlist", function(response) {
        for (var v in response) {
            if (response[v].lat !== undefined) {
                var feature = {
                    position: new google.maps.LatLng(response[v].lat, response[v].lng)
                }
                addMarker(feature);

            };
        }
    });
}


function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && (xmlHttp.status == 200 || xmlHttp.status == 304) && callback) {
            console.log("Service resp " + xmlHttp.responseText);
            callback(JSON.parse(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function addMarker(feature) {
    console.log("Feature: " + feature.position);
    var marker = new google.maps.Marker({
        position: feature.position,
        icon: './img/containerIcon.png',
        map: map
    });
}