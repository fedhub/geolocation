$(document).ready(function(){

    $('button').click(function(){
        getLocation();
    });

    $('#startWorker').click(function(e){
        e.preventDefault();
        startWorker();
    });

    $('#stopWorker').click(function(e){
        e.preventDefault();
        stopWorker();
    });

    var w;
    function startWorker() {
        if(typeof(Worker) !== "undefined") {
            if(typeof(w) == "undefined") {
                w = new Worker("../demo_workers.js");
            }
            w.onmessage = function(event) {
                //document.getElementById("result").innerHTML = event.data;
                console.log(event.data);
            };
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
        }
    }

    function stopWorker() {
        w.terminate();
        w = undefined;
    }

    var x = document.getElementById("demo");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        var latlon = position.coords.latitude + "," + position.coords.longitude;
        x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

        initialize(position.coords.latitude, position.coords.longitude);

        //var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
        //    +latlon+"&zoom=14&size=400x300&sensor=false";
        //document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";

    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred.";
                break;
        }
    }

});

function initialize(lat,lon) {
    var latlng = new google.maps.LatLng(lat, lon);
    var options =
    {
        zoom: 15,
        center: new google.maps.LatLng(lat, lon),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions:
        {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            poistion: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.SATELLITE]
        },
        navigationControl: true,
        navigationControlOptions:
        {
            style: google.maps.NavigationControlStyle.ZOOM_PAN
        },
        scaleControl: true,
        disableDoubleClickZoom: false,
        draggable: true,
        streetViewControl: true,
        draggableCursor: 'move'
    };
    var map = new google.maps.Map(document.getElementById("map"), options);
    var marker = new google.maps.Marker
    (
        {
            position: new google.maps.LatLng(lat,lon),
            map: map,
            title: 'Click me'
        }
    );
    var infowindow = new google.maps.InfoWindow({
        content: 'Location info:<br/>Country Name:<br/>LatLng:'
    });
    google.maps.event.addListener(marker, 'click', function () {
        // Calling the open method of the infoWindow
        infowindow.open(map, marker);
    });

}