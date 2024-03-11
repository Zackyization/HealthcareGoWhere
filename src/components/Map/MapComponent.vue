<template>
    <div class="Map">
        <div id="map">
        </div>
    </div>
</template>

<script>
/* eslint-disable no-undef */
// import { initMap } from "./Map.js";
export default {
    data() {
        return {
            name: "Map",
            map: null,
            infoWindow: null,
        }
    },
    mounted() {
        // Define a global function that the Google Maps callback will call
        if (!window.google || !window.google.maps) {
            let script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
            script.async = true;
            script.defer = true;

            // Assign initMap to window after ensuring that the script tag is set up correctly
            window.initMap = () => this.initMap();

            document.head.appendChild(script);
        } else {
            this.initMap(); // If Google Maps is already loaded, directly call initMap
        }
    },
    methods: {
        initMap() {
            // The initial center location for the map
            const initialCenter = { lat: -34.397, lng: 150.644 };

            // Creating a new map inside the #map element
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: initialCenter,
                zoom: 18,
            });

            // Info window for markers
            this.infoWindow = new google.maps.InfoWindow();

            // Location button to pan to the current location
            const locationButton = document.createElement('button');
            locationButton.textContent = 'Pan to Current Location';
            locationButton.classList.add('custom-map-control-button');
            this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

            locationButton.addEventListener('click', () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };

                            new google.maps.Marker({
                                position: pos,
                                map: this.map,
                                draggable: false,
                                animation: google.maps.Animation.DROP,
                            });

                            this.infoWindow.setPosition(pos);
                            this.infoWindow.setContent(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
                            this.infoWindow.open(this.map);
                            this.map.setCenter(pos);
                        },
                        () => {
                            this.handleLocationError(true, this.infoWindow, this.map.getCenter());
                        },
                    );
                } else {
                    this.handleLocationError(false, this.infoWindow, this.map.getCenter());
                }
            });
        },

        handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(
                browserHasGeolocation
                    ? 'Error: The Geolocation service failed.'
                    : "Error: Your browser doesn't support geolocation.",
            );
            infoWindow.open(this.map);
        },

        dropMarker(lati, long) {
            new google.maps.Marker({
                position: { lat: lati, lng: long },
                map: this.map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                icon: "assets/HCGoWhere_pin.png",
            });
        }
    }
}
</script>

<style scoped>
</style>