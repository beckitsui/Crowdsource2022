mapboxgl.accessToken =
"pk.eyJ1IjoiYmVja3l6cXh1IiwiYSI6ImNsOXd0cGF6NTAzNDMzeG9lYnd1eW8xcTgifQ.jF1LPKEs0cBdxgc5wpTb0w";

const map = new mapboxgl.Map({
container: document.body,
style: "mapbox://styles/beckyzqxu/cl9wtr9jt000n14o2mbvb3fnr",
center: [-71.10326, 42.36476], // starting position [lng, lat]
zoom: 12, // starting zoom
projection: "globe", // display the map as a 3D globe
});

// stylize the globe effect
map.on("style.load", () => {
  map.setFog({
    range: [1, 7],
    color: "#d6fffc",
    "horizon-blend": 0.03,
    "high-color": "#000000",
    "space-color": "#000000",
    "star-intensity": 0,
  });
});

// limit the search engine boundary extent to greater Boston
const bostonBounds = [-71.191247, 42.227911, -70.648072, 42.450118];
 
// Initialize the geocoder aka the search engine
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  placeholder: "Search Boston", //placeholder text for the search bar
  bbox: bostonBounds, //limit search results to Philadelphia bounds
});
 
// Add the geocoder to the map
map.addControl(geocoder);

map.on("load", () => {
    console.log(map.getStyle());
  });
  