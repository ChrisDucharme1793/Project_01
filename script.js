$(document).ready(function () {
  // adding event listeners
  $('#findBtn').on('click', citySearch);
  $('#searchForm').on('submit', citySearch); // Enables pressing enter to search
  $('#map_view').on('click', hideList);
  $('#list_view').on('click', hideMap);


 function hideMap() {
    // $('#map').addClass('hide');
    // $("#venue_list").toggle("hide");

    if ($("#list_view").text() == "HIDE LIST") {
      $("#venue_list").hide();
      $("#list_view").text("SHOW LIST");
    }
    else {
      $("#venue_list").show();
      $("#list_view").text("HIDE LIST");

    }
  }

  function hideList() {
    if ($("#map_view").text() == "HIDE MAP") {
      $("#map").hide();
      $("#map_view").text("SHOW MAP");
    }
    else {
      $("#map").show();
      $("#map_view").text("HIDE MAP");

    }

  }



  /**
   * Function that searches for the city specified
   * @constructor
   * @param {event} e - The on click event returned when #findBtn and #searchForm are clicked
   */
  function citySearch(e) {
    e.preventDefault();
    $('#venue_list').empty();
    if ($('#cityInput').val() !== '') {
      // only run event if search form isn't empty
      $('#cardDiv').hide();
      const city = $('#cityInput').val();
      const BASE_URL = 'https://api.foursquare.com/v2/venues/explore?';
      const queryURL = `${BASE_URL}client_id=PGRFNMWYIQORRWIDI35ABOQZAFAB1AGPMHSLQ4DVNNA3FXQ5&client_secret=BFXFR3RHV1PI232XQ3A2FZ45L2K0LB22ZWWLHBLC5OJ3FX1P&v=20180323&limit=12&near=${city}&query=brewery`;

      $.ajax({
        url: queryURL,
        method: 'GET',
      }).then(function (response) {
        $('#map').show();
        $('html, body').animate(
          {
            scrollTop: $('#map').offset().top,
          },
          500,
        );
        // these are coords for creating map
        const lat = response.response.geocode.center.lat;
        const long = response.response.geocode.center.lng;
        console.log(lat);
        console.log(long);
        // explore endpoint gets a list of recommended breweries in the search area
        const venueArray = response.response.groups[0].items;
        const featuresArray = []; // array for map icons
        // add info of each brewery to features array so we can use them to display the icons on the map
        // adds business to list for users that want to see a list instead of a map
        list_business();
        function list_business() {
          for (var i = 0; i < venueArray.length; i++) {
            var business_name = venueArray[i].venue.name;
            var address = venueArray[i].venue.location.address;
            var business_city = venueArray[i].venue.location.city;
            var business_state = venueArray[i].venue.location.state;
            var a = $('<div>');
            a.addClass("card")
            a.addClass("card-content")
            // var b = $("<article>")
            // b.addClass("tile is-child box")
            // b.addClass("tile")
            //             var business_list = $("<ul>")
            //             business_list.addClass("venues_list")
            // $(business_list).append("<li>" business_name)
            $("#venue_list").append(a);
            // $(a).append(b)
            $(a).append(business_name + ", " + "<br>" + address + ", " + "<br>" + business_city + ", " + "<br>" + business_state)

          }
          venueArray.forEach(function (venue) {
            // console.log(venue.venue);
            featuresArray.push({
              type: 'Feature',
              properties: {
                description: `<h6><strong>${venue.venue.name}</strong></h6><p>${venue.venue.location.formattedAddress[0]}</p><p>${venue.venue.location.formattedAddress[1]}</p><p><a href="#" id="${venue.venue.id}" class="detailsLink">More details</a></p>`,

              },
              geometry: {
                type: 'Point',
                coordinates: [venue.venue.location.lng, venue.venue.location.lat],
              },
            });
          });
          console.log(featuresArray);
          mapboxgl.accessToken = 'pk.eyJ1IjoiY3d3b3J0aGFuNzYiLCJhIjoiY2s3YjZra3o4MDN2ZzNlcXMyd253dXZuaiJ9.U1XSRZhSttOJw94EelAaHQ';
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [long, lat], // starting position
            zoom: 11, //
          });
          map.addControl(new mapboxgl.NavigationControl());
          map.on('load', function () {
            // Add a layer showing the places.
            map.addLayer({
              id: 'places',
              type: 'symbol',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: featuresArray,
                },
              },
              layout: {
                'icon-image': 'beer-15',
                'icon-allow-overlap': true,
                'icon-size': 1.5,
              },
            });
          });
          // Create a popup, but don't add it to the map yet.
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
          });
          map.on('mouseenter', 'places', function (e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });
        };
      })
    }
  };



})


