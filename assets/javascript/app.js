$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyC1mhcbyj-cORe0g9bVdWzBpzja1Hybh1M",
        authDomain: "train-schedule-97e0f.firebaseapp.com",
        databaseURL: "https://train-schedule-97e0f.firebaseio.com",
        projectId: "train-schedule-97e0f",
        storageBucket: "",
        messagingSenderId: "926315958439"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

      
    // conclick function
    $("#submit").on("click", function() {
      
        //variable with value for html
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
      
        // push the variable into the db
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });

        $("input").val('');
        return false;
    });
      
    //child ref captures the snapshot
    database.ref().on("child_added", function(childSnapshot){
        // console.log(childSnapshot.val());
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
      
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
      
    // TRAIN TIME================================================
        var freq = parseInt(freq);
          
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
          
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
          
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);

        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
          
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
          
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
          
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
        
        //append the data to the table
        $('#currentTime').text(currentTime);
        $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
    },
      
    function(errorObject){
    console.log("Read failed: " + errorObject.code)
    });
      
});