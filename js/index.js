$(document).ready(function($) {

  $(".weather2").weather({
    city: config.curr_city,
    tempUnit: "C",
    displayDescription: true,
    displayMinMaxTemp: true,
    displayWind: true,
    displayHumidity: true
  });
  $("<br><br>").insertAfter($(".weather2"));

  $("#search").on("click", function() {
    $(".weather1").weather({
      city: $("#pac-input").val().trim(),
      tempUnit: "C",
      displayDescription: true,
      displayMinMaxTemp: true,
      displayWind: true,
      displayHumidity: true
    });

    if ($(".weather1").length === 1) {
	   $(".weather1").remove();
      var weather1 = $('<div class="weather1">');

      $(weather1).weather({
        city: $("#pac-input").val().trim(),
        tempUnit: "C",
        displayDescription: true,
        displayMinMaxTemp: true,
        displayWind: true,
        displayHumidity: true
	  });
	  $(weather1).insertAfter($(".weather2"));
    }
  });
});

