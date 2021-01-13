function createListCities(citySearch) {
    $("city-list").empty();


    var keys = Object.keys(citySearch);
    for (var i = 0; i < keys.length; i++) {
        var cityEntry = $("<button>");
        cityEntry.addClass("list-group-item list-group-item-action");

        var splitStr = keys[i].toLowerCase().split(" ");
        for (var m = 0; m < splitStr.length; m++) {
            splitStr[m] = splitStr[m].charAt(0).toUpperCase() + splitStr[m].substring(1);
        }

        var titleCity = splitStr.join(" ");
        cityEntry.text(titleCity);
        $("#city-list").append(cityEntry);
    }

}

function CityWeather(city, citySearch) {
    createListCities(citySearch);
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=e9797fed1b8f5fa313f54a9250a79519&q=Sydney,Au" + city;
    //country code -- third example -- city name

    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    //api.openweathermap.org/data/2.5/weather?q=London&appid={API key}

    //var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=e9797fed1b8f5fa313f54a9250a79519" + city;





    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=e9797fed1b8f5fa313f54a9250a79519&q=Sydney,Au" + city;

    var latitude;
    var longitude;

    $.ajax({
        url: queryURL1,
        method: "GET"
    })

    .then(function(weather) {
        console.log(queryURL1);
        console.log(weather);

        var nowMoment = moment();
        var displayMo = $("<h3>"); //h3
        $("#city-name").empty();
        $("#city-name").append(
            displayMo.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );

        var cityName = $("<h3>").text(weather.name); //h3
        $("#city-name").prepend(cityName);

        var weatherIcon = $("<img>");
        weatherIcon.attr(
            "src",
            "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"
        );
        $("#current").empty();
        $("#current").append(weatherIcon);

        $("#current-temp").text("Temperature: " + weather.main.temp + " °C");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + "MPH");

        latitude = weather.coord.lat;
        longitude = weather.coord.lon;


        var queryURL3 = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=metric&appid=e9797fed1b8f5fa313f54a9250a79519&q=Sydney,Au" +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;

        $.ajax({
            url: queryURL3,
            method: "GET"

        }).then(function(uvIndex) {
            console.log(uvIndex);

            var uvIndexDisplay = $("<button>");
            uvIndexDisplay.addClass("btn btn-danger");

            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
            console.log(uvIndex[0].value);

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(forecast) {
                console.log(queryURL2);
                console.log(forecast);

                for (var i = 6; i < forecast.list.length; i += 8) {
                    var forecastDate = $("<h5>"); //h5
                    var forecastPosition = (i + 2) / 8;

                    console.log("#forecast-date" + forecastPosition);

                    $("#forecast-date" + forecastPosition).empty();
                    $("#forecast-date" + forecastPosition).append(
                        forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
                    );

                    var forecastIcon = $("<img>");
                    forecastIcon.attr(
                        "src",
                        "https://openweathermap.org/img/wn/" +
                        forecast.list[i].weather[0].icon +
                        ".png"
                    );

                    $("#forecast-icon" + forecastPosition).empty();
                    $("#forecast-icon" + forecastPosition).append(forecastIcon);

                    console.log(forecast.list[i].weather[0].icon);

                    $("#forecast-temp" + forecastPosition).text(
                        "Temp: " + forecast.list[i].main.temp + " °C"
                    );

                    $("#forecast-humidity" + forecastPosition).text(
                        "Humidity: " + forecast.list[i].main.humidity + "%"
                    );

                    $(".forecast").attr(
                        "style",
                        "background-color: dodgerblue; color:white"
                    );

                }
            });

        });
    });

}

$(document).ready(function() {
    var citySearchListString = localStorage.getItem("citySearch");
    var citySearch = JSON.parse(citySearchListString);
    if (citySearch == null) {
        citySearch = {};
    }
    createListCities(citySearch);

    $("#current-weather").hide();
    $("#forecast-weather").hide();

    $("#search-button").on("click", function(event) {
        event.preventDefault();
        var city = $("#city-input")
            .val()
            .trim()
            .toLowerCase();

        if (city != "") {
            citySearch[city] = true;
            localStorage.setItem("citySearch", JSON.stringify(citySearch));

            CityWeather(city, citySearch);

            $("#current-weather").show();
            $("#forecast-weather").show();
        }
    });

    $("#city-list").on("click", "button", function(event) {
        event.preventDefault();
        var city = $(this).text();

        CityWeather(city, citySearch);

        $("#current-weather").show();
        $("#forecast-weather").show();
    });
});