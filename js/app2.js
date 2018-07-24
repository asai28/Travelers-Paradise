var rad = function(x) {
  return (x * Math.PI) / 180;
};

var myCoordinates = { lat: 33.303016, lng: -111.839485 };
function getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = (R * c) / 1600 + 4.3;
  return d; // returns the distance in meter
}

var panorama;
function getLocation() {
  if (navigator.geolocation) {
    console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    }
  );
  var curLat = position.coords.latitude;
  var curLong = position.coords.longitude;

  $.ajax({
    url:
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      curLat +
      "," +
      curLong +
      "&sensor=true",
    method: "GET"
  }).then(function(response4) {
    var myZipCode =
      response4.results[0].address_components[
        response4.results[0].address_components.length - 1
      ].long_name;
    $.ajax({
      url: "https://ZiptasticAPI.com/" + parseInt(myZipCode),
      method: "GET"
    }).then(function(response5) {
      config.curr_city = JSON.parse(response5).city;
    });
  });

  var image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: position.coords.latitude, lng: position.coords.longitude },
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
    fullscreenControl: true,
    marker: new google.maps.Marker({
      position: { lat: curLat, lng: curLong },
      map: map,
      icon: image
    })
  });
}

$(document).ready(function() {
  $("#leftContainer i").css("float", "right");
  $("#weather i").on("click", function() {
    if ($(this).hasClass("fa-arrow-right")) {
      $(this).addClass("fa-arrow-left");
      $(this).removeClass("fa-arrow-right");
      $(".weather1").hide();
      $(".weather2").hide();
      $("#weather").css("width", "60px");
      $("#weather").css("overflow-x", "hidden");
    } else {
      $(this).addClass("fa-arrow-right");
      $(this).removeClass("fa-arrow-left");
      $(".weather1").show();
      $(".weather2").show();
      $("#weather").css("width", "200px");
    }
  });
  $("#leftContainer i").on("click", function() {
    if ($(this).hasClass("fa-arrow-left")) {
      $(this).addClass("fa-arrow-right");
      $(this).removeClass("fa-arrow-left");
      $("#map").hide();
      $("#mainContainer").hide();
      $("#leftContainer").css("width", "60px");
    } else {
      $(this).addClass("fa-arrow-left");
      $(this).removeClass("fa-arrow-right");
      $("#map").show();
      $("#mainContainer").show();
      $("#leftContainer").css("width", "50vw");
    }
  });
  var cityName = "";
  var cityNameEdited = "";
  $("input").keyup(function(event) {
    if (event.keyCode === 13) {
      $("#search").click();
      cityName = $("#pac-input")
        .val()
        .trim();
      $(".weather1").weather({
        city: cityName,
        autocompleteMinLength: 3
      });
    }
  });
  $("#search").on("click", function(e) {
    e.preventDefault();
    cityName = $("#pac-input")
      .val()
      .trim();
    $(".weather1").weather({
      city: cityName,
      autocompleteMinLength: 3
    });
    for (var i = 0; i < cityName.length; ++i) {
      if (cityName[i] !== " ") {
        cityNameEdited += cityName[i];
      } else {
        cityNameEdited += "+";
      }
    }
    var queryURL =
      "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
      cityNameEdited +
      "+point+of+interest&language=en&key=" +
      config.mapsAPIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var div = $("#mapPoints");
      div.empty();
      cityNameEdited = "";
      for (var i = 0; i < response.results.length; ++i) {
        div.append(
          '<h6 id="' +
            i +
            '"class="pointOfInterest" address="' +
            response.results[i].formatted_address +
            '" + place_id=' +
            response.results[i].place_id +
            ">" +
            response.results[i].name +
            "</h6>"
        );
      }
      $("#mapPoints").append(div);
      $("#mapPoints").on("click", ".pointOfInterest", function() {
        var address = $(this).attr("address");
        var pointOfInterest = $(this);
        var addressEdited = "";
        for (var i = 0; i < address.length; ++i) {
          if (address[i] !== " ") {
            addressEdited += address[i];
          } else {
            addressEdited += "+";
          }
        }
        $.ajax({
          url:
            "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" +
            addressEdited +
            cityNameEdited +
            "&key=" +
            config.mapsAPIKey,
          method: "GET"
        }).then(function(response2) {
          var lat = response2.results[0].geometry.location.lat;
          var lng = response2.results[0].geometry.location.lng;
          function initialize(lat, lng) {
            var fenway = { lat: lat, lng: lng };
            var map = new google.maps.Map(document.getElementById("map"), {
              center: fenway,
              zoom: 14
            });
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById("street-view"),
              {
                position: fenway,
                pov: {
                  heading: 34,
                  pitch: 10
                }
              }
            );
            map.setStreetView(panorama);
          }
          initialize(lat, lng);
          if($("#reviews").length === 1){
            $("#reviews").empty();
          }
          else{
            $('<div id="reviews">').insertAfter($("#mainContainer"));
          }
          $(".points").empty();
          $("#reviews").empty();
          $("#reviews").append(
            '<h5 id="about" style="left: 0px">About Location</h5><br>'
          );
          if (response.results[parseInt(pointOfInterest.attr("id"))].rating) {
            var averageStars = $("<div>");
            if (
              parseFloat(
                response.results[parseInt(pointOfInterest.attr("id"))].rating
              ) -
              parseInt(
                response.results[parseInt(pointOfInterest.attr("id"))].rating
              )
            ) {
              var star = $('<i class="fas fa-star-half-alt fa-1x">');
              $(averageStars).append(star.attr("id", "half"));
            }
            for (
              var j = 0;
              j <
              parseInt(
                response.results[parseInt(pointOfInterest.attr("id"))].rating
              );
              ++j
            ) {
              var star = $(
                '<i class="fas fa-star fa-1x" style="float: right">'
              );
              $(averageStars).append(star.attr("id", j));
            }
            $("#reviews").append(
              "<h7 id='averageReview'>Average Reviews: " +
                response.results[parseInt(pointOfInterest.attr("id"))].rating +
                "</h7>"
            );
            $(averageStars).insertAfter($("#averageReview"));
          } else {
            $("#reviews").append(
              "<h7>Average Reviews: No reviews available </h7><br><br>"
            );
          }

          $("#reviews").append(
            "<br><h7>Distance from your location: " +
              Math.round(
                getDistance({ lat: lat, lng: lng }, myCoordinates) * 100
              ) /
                100 +
              " miles" +
              "</h7><br><br>"
          );
          $.ajax({
            url:
              "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" +
              pointOfInterest.attr("place_id") +
              "&key=" +
              config.mapsAPIKey,
            method: "GET"
          }).then(function(response3) {
            var reviews = response3.result.reviews;
            if (reviews.length) {
              for (var i = 0; i < reviews.length; ++i) {
                var div = $('<div id="review' + i + '">');
                div.append("<h7>" + reviews[i].author_name + "</h7><br>");
                div.append(
                  "<h7>" + "Rating: " + reviews[i].rating + "</h7><br>"
                );
                var stars = $("<div>");
                if (
                  parseFloat(reviews[i].rating) - parseInt(reviews[i].rating)
                ) {
                  var star = $(
                    '<i class="fas fa-star-half-alt fa-1x" style="float: right">'
                  );
                  $(stars).append(star.attr("id", "half"));
                }
                for (var j = 0; j < parseInt(reviews[i].rating); ++j) {
                  var star = $('<i class="fas fa-star fa-1x">');
                  $(stars).append(star.attr("id", j));
                }
                div.append(stars);
                div.append(
                  "<h7>" + reviews[i].relative_time_description + "</h7><br>"
                );
                div.append("<h7>" + '"' + reviews[i].text + '"' + "</h7><br>");
                $("#reviews").append(div);
                $("#reviews").append("<br>");
              }
            } else {
              $("#reviews").append("<h7>No Reviews</h7>");
            }
          });
          $("#leftContainer i").on("click", function() {
            if ($(this).hasClass("fa-arrow-left")) {
              $("#reviews").hide();
            } else {
              $("#reviews").show();
            }
          });
        });
      });
    });
  });
});
