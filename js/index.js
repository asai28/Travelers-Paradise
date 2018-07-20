$(document).ready(function($) {
  $(".weather2").weather({
    city: "Tucson",
    tempUnit: "C",
    displayDescription: true,
    displayMinMaxTemp: true,
    displayWind: true,
    displayHumidity: true
  });
  console.log($(".weather1").length);

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
		console.log(true);
	   $(".weather1").remove();
	   console.log($(".weather1").length);
      var weather1 = $('<div class="weather1">');

      $(weather1).weather({
        city: $("#pac-input").val().trim(),
        tempUnit: "C",
        displayDescription: true,
        displayMinMaxTemp: true,
        displayWind: true,
        displayHumidity: true
	  });
	  $(weather1).insertBefore($(".weather2"));
	  $("<br><br>").insertBefore($(".weather2"));
    }
  });
});

