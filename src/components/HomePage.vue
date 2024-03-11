<template>
    <div class="min-h-screen flex">
        <div class="w-1/2">
            <ChatBot />
        </div>
        <div class="w-1/2">
            <div id="map">
                <Map style="height: 100%; width: 100%" :center="center" :zoom="15"></Map>
            </div>
        </div>
    </div>
</template>
<script>
import ChatBot from './ChatBot/ChatBot.vue';
import Map from "./Map/MapComponent.vue";

export default {
    name: 'HomePage',
    components: {
        ChatBot,
        Map
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
    height: 100%;
    width: 100%;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

.map {
    height: 100%;
    width: 100%;
}
</style>