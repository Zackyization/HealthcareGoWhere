

let map, infoWindow;

 export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 18,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new google.maps.Marker({
            position: {lat: position.coords.latitude, lng: position.coords.longitude},
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
          });

          infoWindow.setPosition(pos);
          infoWindow.setContent(position.coords.latitude + "," + position.coords.longitude);
          infoWindow.open(map);
          map.setCenter(pos);

          if (!document.getElementById('dropMarkerButton')) {
            const dropMarkerButton = document.createElement("button");
            dropMarkerButton.textContent = "Drop Marker";
            dropMarkerButton.id = 'dropMarkerButton';
            dropMarkerButton.classList.add("custom-map-control-button");
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(dropMarkerButton);
  
            dropMarkerButton.addEventListener("click", () => {
              dropMarker(1.3506071497737964, 103.68157743691725);
              dropMarker(1.3512329496773734, 103.68138715861222);
              dropMarker(1.3493672932511194, 103.68071286654444);
            });
          }
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

export function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

// window.initMap = initMap;
window.googleMapsCallback = function() {
    initMap();
  };

export function dropMarker(lati, long){
  new google.maps.Marker({
    position: {lat: lati, lng: long},
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    icon: "assets/HCGoWhere_pin.png",
  });
}
