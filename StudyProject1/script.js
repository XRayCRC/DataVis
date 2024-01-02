$(document).ready(function () {
  // Chart.js configuration
  var ctx = document.getElementById("lineChart").getContext("2d");
  var lineChart;

  // Function to load and display the chart
  function loadChart(data) {
    if (lineChart) {
      lineChart.destroy();
    }

    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "GDP",
            data: data.values,
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
            pointRadius: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear", // If your x-axis is numerical
            position: "bottom", // Position of the x-axis
            title: {
              display: true,
              text: "Year",
            },
          },
          y: {
            type: "linear", // If your y-axis is numerical
            position: "left", // Position of the y-axis
            title: {
              display: true,
              text: "US_GDP",
            },
          },
        },
      },
    });
  }

  // Event listener for the "Load Data" button
  $("#loadDataBtn").click(function () {
    $.ajax({
      url: "displayChart.php",
      success: function (jsonData) {
        console.log(jsonData.labels, jsonData.values);
        loadChart(jsonData);
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
});
