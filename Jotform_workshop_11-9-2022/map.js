// api key to access JotForm, switch my key for yours
JF.initialize({ apiKey: "bd6072aea659a8236ebda9f2aaccd4fb" }); //PUT YOUR OWN KEY HERE

// get form submissions from JotForm Format: (formID, callback)
JF.getFormSubmissions("223123543052039", function (response) {
  //response: all submission to our form
  //response[0]: the first response
  //console.log(response);
  //console.log(response[0]['answers']);
  const submissions = [];

  //add all response.answers to our object
  //iterate through all responses
  for (var i = 0; i < response.length; i++) {
    //create an empty dictionary
    const submissionProps = {};

    //Object.keys() is a method to extract the keys from Objects{:}
    //response[0].answers: the response[i]'s answers -> they are stores as a list of Objects{:}
    //there are ~8 answers -> keys stores answer[key]'s string values
    //returns [1,2,3,4,5,6,7,8]
    const keys = Object.keys(response[i].answers);
    //console.log(keys);

    //BASICALLY we are constructing clean version of answers as Object{}
    //for each key in keys, create a new function with (answer) as parameter
    //console.log(response[i].answers);

    keys.forEach((a) => {
      //Conditional (ternary) operator: >> cfname (if)? "cfname" (else): "name"
      //response[0].answers is a list of object
      const lookup = response[i].answers[a].cfname ? "cfname" : "name";
      submissionProps[response[i].answers[a][lookup]] =
        response[i].answers[a].answer;
    });

    //convert location coordinate string to float array

    // Current: “Longitude: -71.1062527\r\nLatitude: 42.3769747”
    // Target Format: [-71.1062527, 42.3769747].
    submissionProps["Location Coordinates"] = submissionProps["Location Coordinates"].split(/\r?\n/).map((x) => parseFloat(x.replace(/[^\d.-]/g, ""))).slice(0,2);
      //map() is similar to a forEach loop
      // x.replace(/[^\d.-]/g, "") get rid of all non-numeric values
      
    //add submission to submissions array
    submissions.push(submissionProps);
    console.log(submissions[0]["Location Coordinates"]);
  }
  //Import Layers from DeckGL
  const { MapboxLayer, ScatterplotLayer } = deck;

  //mapbox token
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmVja3l6cXh1IiwiYSI6ImNsOXd0cGF6NTAzNDMzeG9lYnd1eW8xcTgifQ.jF1LPKEs0cBdxgc5wpTb0w";

  const map = new mapboxgl.Map({
    container: document.body,
    style: "mapbox://styles/beckyzqxu/cl9wtr9jt000n14o2mbvb3fnr",
    center: [-71.10326, 42.36476], // starting position [lng, lat]
    zoom: 12, // starting zoom
    projection: "globe", // display the map as a 3D globe
  });

  map.on("load", () => {
    const firstLabelLayerId = map.getStyle().layers.find((layer) => layer.type === "symbol").id;

    map.addLayer(
      new MapboxLayer({
        id: "deckgl-circle",
        type: ScatterplotLayer,
        data: submissions,
        getPosition: (d) => {
          return d["Location Coordinates"];
        },
        // Styles
        radiusUnits: "pixels",
        getRadius: 10,
        opacity: 0.2,
        stroked: false,
        filled: true,
        radiusScale: 3,
        getFillColor: [255, 0, 0],
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 255],
        parameters: {
          depthTest: false,
        },
        onClick: (info) => {
          getImageGallery(info.object.fileUpload);

          //return img url 
          console.log(info.object.fileUpload);
          flyToClick(info.object["Location Coordinates"]);
        },
      }),
      firstLabelLayerId
    );
    
    //what are the forms of images parameter
    function getImageGallery(images, text) {
      const imageGallery = document.createElement("div");
      imageGallery.id = "image-gallery";
 
      for (var i = 0; i < images.length; i++) {
        const image = document.createElement("img");
        image.src = images[i];
 
        imageGallery.appendChild(image);
      }


      // add exit button to image gallery
      const exitButton = document.createElement("button");
      exitButton.id = "exit-button";
      exitButton.innerHTML = "x";
      exitButton.addEventListener("click", () => {
        document.getElementById("image-gallery").remove();
      });

      //style the exit button
      exitButton.style.position = "fixed";
      exitButton.style.top = "0";
      exitButton.style.right = "0";
      exitButton.style.borderRadius = "0";
      exitButton.style.padding = "1rem";
      exitButton.style.fontSize = "2rem";
      exitButton.style.fontWeight = "bold";
      exitButton.style.backgroundColor = "white";
      exitButton.style.border = "none";
      exitButton.style.cursor = "pointer";
      exitButton.style.zIndex = "1";

      imageGallery.appendChild(exitButton);

      document.body.appendChild(imageGallery);
    }

    function flyToClick(coords){
      map.flyTo({
        center: [coords[0], coords[1]],
        zoom: 17,
        essential: true, 
      })
    }
    
    // create “current location” function, which doesn’t trigger until called upon.
    function addUserLocation(latitude, longitude) {
      return map.addLayer(
        new MapboxLayer({
          id: "user-location",
          type: ScatterplotLayer,
          data: [{ longitude, latitude }],
          getPosition: (d) => [d.longitude, d.latitude],
          getSourceColor: [0, 255, 0],
          sizeScale: 15,
          getSize: 10,
          radiusUnits: "pixels",
          getRadius: 5,
          opacity: 0.7,
          stroked: false,
          filled: true,
          radiusScale: 3,
          getFillColor: [3, 202, 252],
          parameters: {
            depthTest: false,
          },
        })
      );
    }
 
    // get current location
    const successCallback = (position) => {
      // add new point layer of current location to deck gl
      const { latitude, longitude } = position.coords;
      addUserLocation(latitude, longitude);
    };
 
    const errorCallback = (error) => {
      console.log(error);
    };
 
// create async function to await for current location and then return the promise as lat long coordinates then resolve the promise
    function getCurrentLocation() {
      const currentLocation = navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback
      );
      return currentLocation;
    }
    if (navigator.geolocation) {
      getCurrentLocation();
    }
    const locationButton = document.createElement("div");
    // create a button that will request the users location
    locationButton.textContent = "Where am I?";
    locationButton.id = "location-button";
    locationButton.addEventListener("click", () => {
      // when clicked, get the users location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
 
          locationButton.textContent =
            "Where am I? " +
            position.coords.latitude.toFixed(3) +
            ", " +
            position.coords.longitude.toFixed(3);
 
          addUserLocation(latitude, longitude);
          flyToClick([longitude, latitude]);
        });
      }
    });
 
    // append the button
    document.body.appendChild(locationButton);

  });
});
