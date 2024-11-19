<template>
  <div
    ref="mapContainer"
    class="map-container"
    style="width: 100%; height: 250px"
  ></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import shahadPin from "../assets/shahadpin.png";

export default {
  name: "MapBoxMap",
  props: {
    accessToken: {
      type: String,
      required: true,
    },
    center: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      mapLink:
        "https://www.google.com/maps/place/Vasaplatsen+7B,+411+26+G%C3%B6teborg/@57.6993155,11.9686789,473",
    };
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: "mapbox://styles/fannykarlsson/cm1rvfrdn00zo01r25vu59qvw",
      center: this.center,
      zoom: 15,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";
    markerElement.innerHTML = `
        <a href="${this.mapLink}">
          <img src="${shahadPin}" width="60" height="60" style="margin-top: 8px" />
        </a>
      `;

    new mapboxgl.Marker(markerElement).setLngLat(this.center).addTo(this.map);
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
}

.custom-marker {
  text-align: center;
}
</style>
