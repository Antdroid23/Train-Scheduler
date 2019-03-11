var config = {
  apiKey: "AIzaSyAA5FDnC2bdS1p7_GCfm0dWk0SON0tikc4",
  authDomain: "train-scheduler-data.firebaseapp.com",
  databaseURL: "https://train-scheduler-data.firebaseio.com",
  projectId: "train-scheduler-data",
  storageBucket: "train-scheduler-data.appspot.com",
  messagingSenderId: "494939048103"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding train data
$("#submit").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequencyMin = $("#frequency-min").val().trim();

  // Creates local "temporary" object for holding employee data
  var train = {
      name: trainName,
      destination: trainDestination,
      time: firstTrain,
      frequency: frequencyMin,
  };
  // Uploads employee data to the database
  database.ref().push(train);

    // Logs everything to console
      console.log(trainName.name);
      console.log(trainDestination.destination);
      console.log(firstTrain.time);
      console.log(frequencyMin.frequency);

alert("Train successfully added");

// Clears all of the text-boxes
$("#train-name").val("");
$("#destination").val("");
$("#first-train").val("");
$("#frequency-min").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childsnapshot) {
  console.log(childsnapshot.val());

   // Store everything into a variable.
   var trainName = childsnapshot.val().name;
   var trainDestination = childsnapshot.val().destination;
   var firstTrain = childsnapshot.val().time;
   var frequencyMin = childsnapshot.val().frequency;

      console.log(trainName);
      console.log(trainDestination);
      console.log(firstTrain);
      console.log(frequencyMin);
 

  calcMinutesAway(childsnapshot.val());
  }, function(errorObject) { // Handle the errors
  console.log("Errors Handled: " + errorObject.code);
});

function calcMinutesAway(train) {
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(train.time, "HH:mm").subtract(1, "years");
  console.log(train.name + "'s first train converted is: " + firstTrainConverted);

  // Current Time
  var currentTime = moment();
  console.log("current time is: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = currentTime.diff(moment(firstTrainConverted), "minutes");
  console.log("difference in time is: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % train.frequency;
  console.log("time apart is: " + tRemainder);

  // Minutes Until Train
  var tMinutesTillTrain = train.frequency - tRemainder;
  console.log("min until next train: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  function display(train, tMinutesTillTrain, nextTrain) {

    nextTrain = moment(nextTrain).format("hh:mm a");
    var trainArray = [train.name, train.destination, train.frequency, nextTrain, tMinutesTillTrain];
  
    var $row = $("<tr>");
    
    for (var i = 0; i < trainArray.length; i++) {
        var $tabledata = $("<td>").text(trainArray[i]);
        $row.append($tabledata);
    }
  
      
    $("#table").append($row);
  }
  
  display(train, tMinutesTillTrain, nextTrain);
}