$(document).ready(function () {
  // Fetch and populate state options
  $.ajax({
    url: "get_states.php",
    success: function (data) {
      //var states = JSON.parse(data);
      var select = $("#stateSelect");
      for (var i = 0; i < data.length; i++) {
        select.append(
          '<option value="' + data[i] + '">' + data[i] + "</option>"
        );
      }
      // Load chart for the default selected state
      loadChart();
    },
  });
});

function loadChart() {
  var selectedState = $("#stateSelect").val();

  // Fetch data for the selected state
  $.ajax({
    url: "get_data.php",
    data: { state: selectedState }, // Pass the selected state to get_data.php
    dataType: "json", // Set the expected data type
    success: function (data) {
      plotChart(data);
    },
    error: function (xhr, status, error) {
      console.error(error); // Log any errors to the console
    },
  });
}

function plotChart(data) {
  // Extract keys and values from the data object
  var keys = Object.keys(data);
  var values = Object.values(data);

  var trace = {
    type: "bar",
    x: keys,
    y: values,
  };

  var layout = {
    title: "Household Income Density Chart",
    xaxis: { title: "Income Range (in thousands)" },
    yaxis: { title: "Average Percentage of Households" },
  };

  Plotly.newPlot("chartContainer", [trace], layout);
}
