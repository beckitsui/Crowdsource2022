// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVja3l6cXh1IiwiYSI6ImNsOXdheWtwcjEwZWIzb3BtaHVqdWUyNzQifQ.zBMkm-d5Yoml0nqU0O6czw"; //YOUR KEY HERE

// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/beckyzqxu/cl9wtr9jt000n14o2mbvb3fnr", //YOUR STYLE URL
  center: [-75.1652, 39.9526], // starting position [lng, lat]
  zoom: 12, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

// ADD A GEOJSON SOURCE THAT POINTS TO YOUR LOCAL FILE
map.on("load", function () {
  map.addSource("energy", {
    type: "geojson",
    data: "./energy_usage.geojson",
  });

  // ADD A LAYER TO THE MAP
  map.addLayer({
    id: "energy",
    type: "circle",
    source: "energy",
    layout: {},
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 6,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
});
