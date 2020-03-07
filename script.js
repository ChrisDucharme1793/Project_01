$(document).ready(function() {
  //adding event listeners
  $("#findBtn").on("click", citySearch);
  $("#searchForm").on("submit", citySearch); // Enables pressing enter to search
  
  function citySearch(e) {
    e.preventDefault();
    if ($("#cityInput").val() !== "") {
      //only run event if search form isn't empty
      $("#cardDiv").hide();
      let city = $("#cityInput").val();
      const queryURL = `https://api.foursquare.com/v2/venues/explore?client_id=PGRFNMWYIQORRWIDI35ABOQZAFAB1AGPMHSLQ4DVNNA3FXQ5&client_secret=BFXFR3RHV1PI232XQ3A2FZ45L2K0LB22ZWWLHBLC5OJ3FX1P&v=20180323&limit=10&near=${city}&query=food_trucks`;
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        $("#map").show();
        $("html, body").animate(
          {
            scrollTop: $("#map").offset().top
          },
          500
        );
        //these are coords for creating map
        let lat = response.response.geocode.center.lat;
        let long = response.response.geocode.center.lng;
         console.log(lat);
        console.log(long);
        //explore endpoint gets a list of recommended breweries in the search area
        let venueArray = response.response.groups[0].items;
     let featuresArray = []; //array for map icons
        //add info of each brewery to features array so we can use them to display the icons on the map
        venueArray.forEach(function(venue) {
          // console.log(venue.venue);
          featuresArray.push({
            type: "Feature",
            properties: {
              description: `<h6><strong>${venue.venue.name}</strong></h6><p>${venue.venue.location.formattedAddress[0]}</p><p>${venue.venue.location.formattedAddress[1]}</p><p><a href="#" id="${venue.venue.id}" class="detailsLink">More details</a></p>`
              
            },
            geometry: {
              type: "Point",
              coordinates: [venue.venue.location.lng, venue.venue.location.lat]
            }
          });
        });
         console.log(featuresArray);
         mapboxgl.accessToken = 'pk.eyJ1IjoiY3d3b3J0aGFuNzYiLCJhIjoiY2s3YjZra3o4MDN2ZzNlcXMyd253dXZuaiJ9.U1XSRZhSttOJw94EelAaHQ';
         var map = new mapboxgl.Map({
           container: 'map',
           style: 'mapbox://styles/mapbox/streets-v11',
           center: [long, lat], // starting position
           zoom: 11 //
         });
         map.addControl(new mapboxgl.NavigationControl());
          map.on("load", function() {
        // Add a layer showing the places.
        map.addLayer({
          id: "places",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: featuresArray
            }
          },
          layout: {
            "icon-image": "beer-15",
            "icon-allow-overlap": true,
            "icon-size": 1.5
          }
        });
      });
         // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
  });
  map.on("mouseenter", "places", function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });
      });
    }
  }
});