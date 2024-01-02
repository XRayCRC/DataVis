document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loadCSV").addEventListener("click", loadCSVFile);
  document.getElementById("login").addEventListener("click", openLoginWindow);
  document.getElementById("loginBtn").addEventListener("click", validateLogin);
  document.getElementById("logout").addEventListener("click", logoutDB);
  document.getElementById("closeTab").addEventListener("click", exitTab);
  document
    .getElementById("userInfo")
    .addEventListener("click", showUserInfoPopup);
  document.getElementById("showInfo").addEventListener("click", showInfo);
  document
    .getElementById("clientInfo")
    .addEventListener("click", showClientInfo);
  google.charts.load("current", { packages: ["corechart", "table"] });
  google.charts.load("current", {
    packages: ["geochart"],
  });

  // User information object
  var userData;
  var csvData; // Variable to store CSV data

  function isDataLoaded() {
    return csvData !== null; // Check if CSV data is loaded
  }

  function displayMessageInGraphArea(message) {
    document.getElementById("graph").innerHTML = "<p>" + message + "</p>";
  }

  function loadCSVFile() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";

    fileInput.addEventListener("change", function () {
      var file = fileInput.files[0];
      if (file) {
        var fileName = file.name;
        if (fileName.endsWith(".csv")) {
          var reader = new FileReader();

          reader.onload = function (e) {
            var contents = e.target.result;
            if (contents.indexOf(",") === -1) {
              document.getElementById("table").innerText =
                "The data is in the wrong format. Only CSV files can be loaded!";
            } else {
              // Parse the CSV data and assign it to the csvData variable
              csvData = parseCSV(contents);
              var tableData = new google.visualization.DataTable();
              var lines = contents.split("\n");
              var header = lines[0].split(",");
              for (var i = 0; i < header.length; i++) {
                tableData.addColumn(
                  typeof header[i] === "number" ? "number" : "string",
                  header[i]
                );
              }
              var data = [];
              for (var j = 1; j < lines.length; j++) {
                var line = lines[j].split(",");
                if (line.length === header.length) {
                  data.push(line);
                }
              }
              tableData.addRows(data);
              var table = new google.visualization.Table(
                document.getElementById("table")
              );
              table.draw(tableData, { showRowNumber: true });
              var tableContainer = document.getElementById("table-container");
              tableContainer.style.maxHeight = "300px"; // Set your desired maximum height
              tableContainer.style.overflowY = "auto";
              document.getElementById("message").innerText =
                "Number of records: " + data.length;
            }
          };

          reader.readAsText(file);
        } else {
          document.getElementById("table").innerText =
            "The data is in the wrong format. Only CSV files can be loaded!";
        }
      }
    });

    fileInput.click();
  }

  function openLoginWindow() {
    // Show the login form
    document.getElementById("login-form").style.display = "block";
  }

  function validateLogin() {
    var login = document.getElementById("login-input").value;
    var password = document.getElementById("password-input").value;

    // AJAX request to the PHP script
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText === "success") {
          // Retrieve user information from the PHP script
          fetchUserInfo(login);
        } else {
          loginFailure();
        }
      }
    };

    // Send login and password to the PHP script
    xhr.send("login=" + login + "&password=" + password);
  }

  function fetchUserInfo(login) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "UserInfo.php", true); // Create a new PHP script to retrieve user info
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        if (response.success) {
          userData = {
            uid: response.uid,
            username: response.login,
            name: response.name,
            gender: response.gender,
          };

          // Hide the login section and display a success message in the message area
          hideLoginSection();
          document.getElementById("message").innerHTML =
            "<p>Login successful! Welcome, " + userData.name + "</p>";
        } else {
          loginFailure();
        }
      }
    };

    // Send a request to get user information
    xhr.send("login=" + login);
  }

  function logoutDB() {
    if (userData) {
      // Confirm the logout
      if (confirm("Are you sure you want to logout?")) {
        // Clean user information
        userData = null;
        document.getElementById("message").innerText = "Successful logout";
      }
    } else {
      document.getElementById("message").innerText = "You are not logged in.";
    }
  }

  function exitTab() {
    if (confirm("Are you sure you want to exit?")) {
      window.close();
    }
  }

  function parseCSV(csvText) {
    var lines = csvText.split("\n");
    var result = [];

    // Split the first line into headers
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  }

  //Event Listeners to Call viewChart() based on which chart is selected
  document.getElementById("Line").addEventListener("click", function () {
    viewChart("Line");
  });
  document.getElementById("Bar").addEventListener("click", function () {
    viewChart("Bar");
  });
  document.getElementById("Scatter").addEventListener("click", function () {
    viewChart("Scatter");
  });
  document.getElementById("Pie").addEventListener("click", function () {
    viewChart("Pie");
  });
  document.getElementById("GeoChart").addEventListener("click", function () {
    viewChart("GeoChart");
  });
  function viewChart(chartType) {
    if (!isDataLoaded()) {
      displayMessageInGraphArea("Please load data first");
    } else {
      var dataSelection = document.querySelector(
        'input[name="data-selection"]:checked'
      );

      if (dataSelection) {
        var selectedValue = dataSelection.value;

        if (selectedValue === "Death") {
          var chartData = new google.visualization.DataTable();
          chartData.addColumn("date", "date");
          chartData.addColumn("number", "death");
          for (var i = 0; i < csvData.length; i++) {
            chartData.addRow([
              new Date(csvData[i].date),
              parseFloat(csvData[i].death),
            ]);
          }
          var chartOptions = {
            title: "Death Over Time",
            legend: { position: "bottom" },
          };

          var chart;
          if (chartType === "Line") {
            chart = new google.visualization.LineChart(
              document.getElementById("graph")
            );
          } else if (chartType === "Bar") {
            chart = new google.visualization.BarChart(
              document.getElementById("graph")
            );
          } else if (chartType === "Scatter") {
            chart = new google.visualization.ScatterChart(
              document.getElementById("graph")
            );
          } else {
            displayMessageInGraphArea(
              "Chart not allowed for the selected choice"
            );
            return;
          }

          chart.draw(chartData, chartOptions);
        } else if (selectedValue === "Hospitalizations") {
          var chartData = new google.visualization.DataTable();
          chartData.addColumn("date", "date");
          chartData.addColumn("number", "hospitalized");
          for (var i = 0; i < csvData.length; i++) {
            chartData.addRow([
              new Date(csvData[i].date),
              parseFloat(csvData[i].hospitalized),
            ]);
          }
          var chartOptions = {
            title: "Hospitalizations Over Time",
            legend: { position: "bottom" },
          };

          var chart;
          if (chartType === "Line") {
            chart = new google.visualization.LineChart(
              document.getElementById("graph")
            );
          } else if (chartType === "Bar") {
            chart = new google.visualization.BarChart(
              document.getElementById("graph")
            );
          } else {
            displayMessageInGraphArea(
              "Chart not allowed for the selected choice"
            );
            return;
          }

          chart.draw(chartData, chartOptions);
        } else if (selectedValue === "Negative") {
          if (chartType === "GeoChart") {
            var chartData = new google.visualization.DataTable();
            chartData.addColumn("string", "State");
            chartData.addColumn("number", "Negative");
            for (var i = 0; i < csvData.length; i++) {
              const state = csvData[i].state;
              const negative = parseInt(csvData[i].negative);
              if (!isNaN(negative)) {
                chartData.addRow([state, negative]);
              }
            }

            var chartOptions = {
              region: "US",
              displayMode: "regions",
              resolution: "provinces",
              colorAxis: { colors: ["green", "blue"] },
              title: "Negative Cases by State (GeoChart)",
            };

            var chart = new google.visualization.GeoChart(
              document.getElementById("graph")
            );
            chart.draw(chartData, chartOptions);
          } else if (chartType === "Pie") {
            var chartData = new google.visualization.DataTable();
            chartData.addColumn("string", "State");
            chartData.addColumn("number", "Negative");
            for (var i = 0; i < csvData.length; i++) {
              const state = csvData[i].state;
              const negative = parseFloat(csvData[i].negative);
              if (!isNaN(negative)) {
                chartData.addRow([state, negative]);
              }
            }

            var chartOptions = {
              title: "Negative Cases by State (Pie Chart)",
            };

            var chart = new google.visualization.PieChart(
              document.getElementById("graph")
            );
            chart.draw(chartData, chartOptions);
          } else {
            displayMessageInGraphArea(
              "Invalid chart type for the selected data"
            );
          }

          // Display a table for the selected data
          displayTable(selectedValue);
        }
      }
    }
  }

  function displayTable(dataSelection) {
    var tableData = new google.visualization.DataTable();

    // Add columns based on the data selection
    if (dataSelection === "Death") {
      tableData.addColumn("date", "Date");
      tableData.addColumn("number", "Death");
      for (var i = 0; i < csvData.length; i++) {
        const date = new Date(csvData[i].date);
        const death = parseFloat(csvData[i].death);
        if (!isNaN(death)) {
          tableData.addRow([date, death]);
        } else {
          console.log(
            'Invalid "Death" value at index ' + i + ": " + csvData[i].death
          );
        }
      }
    } else if (dataSelection === "Hospitalizations") {
      tableData.addColumn("date", "Date");
      tableData.addColumn("number", "Hospitalizations");
      for (var i = 0; i < csvData.length; i++) {
        const date = new Date(csvData[i].date);
        const hospitalized = parseFloat(csvData[i].hospitalized);
        if (!isNaN(hospitalized)) {
          tableData.addRow([date, hospitalized]);
        } else {
          console.log(
            'Invalid "Hospitalizations" value at index ' +
              i +
              ": " +
              csvData[i].hospitalized
          );
        }
      }
    } else if (dataSelection === "Negative") {
      tableData.addColumn("string", "State");
      tableData.addColumn("number", "Negative");
      for (var i = 0; i < csvData.length; i++) {
        const string = new String(csvData[i].state);
        const negative = parseFloat(csvData[i].negative);
        if (!isNaN(negative)) {
          tableData.addRow([string, negative]);
        } else {
          console.log(
            'Invalid "Negative" value at index ' +
              i +
              ": " +
              csvData[i].negative
          );
        }
      }
    }

    var table = new google.visualization.Table(
      document.getElementById("table")
    );
    table.draw(tableData, { showRowNumber: true });
  }

  function showInfo() {
    // Display info about your name, class ID, and project due date
    alert(
      "Name: Christian-Ray Conrad\nClass ID: CPS4745 - 01\nProject Due Date: 10/29/23"
    );
  }

  function showClientInfo() {
    // Get user's browser and OS information
    var browserInfo = "Browser: " + navigator.appName;
    browserInfo += "\nVersion: " + navigator.appVersion;
    browserInfo +=
      "\nType: " +
      (navigator.cookieEnabled ? "Cookies Enabled" : "Cookies Disabled");
    browserInfo +=
      "\nJava: " + (navigator.javaEnabled() ? "Java Enabled" : "Java Disabled");

    // Display browser and OS information
    alert(browserInfo);
  }

  /*function showLoginSection() {
    if (userInfo) {
      // If the user is already logged in, display a message in the message section
      document.getElementById("message").innerText =
        "You are already logged in as " + userInfo.username;
    } else {
      // If the user is not logged in, show the login form
      var loginSection = document.getElementById("login-section");
      loginSection.style.display = "block";
    }
  }*/

  function hideLoginSection() {
    // Hide the login form
    document.getElementById("login-form").style.display = "none";
  }

  /*function loginSuccess() {
    // Hide the login section and display a success message in the message area
    hideLoginSection();
    document.getElementById("message").innerText = "Login successful!";
  }*/

  function loginFailure() {
    // Display a failure message in the message area
    document.getElementById("message").innerText =
      "Login failed. Please check your credentials.";
  }

  function showUserInfoPopup() {
    if (userInfo) {
      // Create a popup window
      var popup = window.open("", "User Info", "width=400, height=300");

      // Create a user info string
      var userInfoStr = "User Info\n";
      userInfoStr += "UID: " + userInfo.uid + "\n";
      userInfoStr += "Login: " + userInfo.username + "\n";
      userInfoStr += "Name: " + userInfo.name + "\n";
      userInfoStr += "Gender: " + userInfo.gender + "\n";

      // Write user info to the popup
      popup.document.write("<pre>" + userInfoStr + "</pre>");
    } else {
      alert("You are not logged in. Please log in first.");
    }
  }
});
