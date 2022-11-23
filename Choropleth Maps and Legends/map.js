// import our local data about philadelphia population by census tract
import phillyCensus from "./data/PhillyPopulation.geojson" assert { type: "json" };
console.log(phillyCensus);
// calculate population density: total pop/area
phillyCensus.features.forEach((d) => {
    d.properties["POP_DENSITY"] =
      d.properties.COUNT_ALL_RACES_ETHNICITIES / d.properties.AreaKM;
  });
   
  console.log(phillyCensus);

//   filter out the entries whose population density is less than 100 inhabitants per square kilometer
phillyCensus.features = phillyCensus.features.filter((d) => {
    return d.properties.POP_DENSITY > 100;
  });

 
// YOUR TOKEN HERE
mapboxgl.accessToken =
"pk.eyJ1IjoiYmVja3l6cXh1IiwiYSI6ImNsOXdheWtwcjEwZWIzb3BtaHVqdWUyNzQifQ.zBMkm-d5Yoml0nqU0O6czw";
const map = new mapboxgl.Map({
  container: "map", // Container ID
  style: "mapbox://styles/beckyzqxu/cl9wtr9jt000n14o2mbvb3fnr", // YOUR STYLE HERE
  projection: "globe",
  //   center on philadelphia
  center: [-75.1638, 39.9526],
  zoom: 10,
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

// once the basemap is loaded, begin to add data sources and layers
map.on("load", () => {
    //   add source for philly data
    map.addSource("phillyPop", {
      type: "geojson",
      data: phillyCensus,
    });
   
    // add layer for philly data
    map.addLayer({
      id: "phillyPop",
      type: "fill",
      source: "phillyPop", // reference the data source
      layout: {},
      paint: {
        // style the layer based on POP_DENSITY property
          "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "POP_DENSITY"],
          100, //threshold for the first color
          "#737373", //first color
          1000, //threshold for the second color
          "#969696", //second color
          2000, //threshold for the third color
          "#bdbdbd", //third color
          5000, //threshold for the fourth color
          "#d9d9d9", //fourth color
          10000, //threshold for the fifth color
          "#f7f7f7", //fifth color
        ]},
    });
  });
  

