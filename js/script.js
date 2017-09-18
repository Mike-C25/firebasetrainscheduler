$(document).ready(function() {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBhPt4WJ0qd2HIS8pQGHhPAbIRyZbwS2u8",
        authDomain: "trainschedulerz.firebaseapp.com",
        databaseURL: "https://trainschedulerz.firebaseio.com",
        projectId: "trainschedulerz",
        storageBucket: "",
        messagingSenderId: "975014199256"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var freq = "";
    var firstArrival = "";
    var nextArrival = "";
    var minAway = "";


    $('#submit').on('click', function(e) {
        e.preventDefault();

        trainName = $('#train_name').val().trim();
        destination = $('#destination').val().trim();
        freq = $('#frequency').val().trim();
        firstArrival = $('#first_train').val().trim();

        database.ref().push({
            name: trainName,
            destination: destination,
            frequency: freq,
            firstArrival: firstArrival,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });

    database.ref().orderByChild("name").on("child_added", function(childSnapshot) {

        // var current = moment().format();
        var tN = childSnapshot.val().name;
        var tD = childSnapshot.val().destination;
        var tF = childSnapshot.val().frequency;
        var tFA = childSnapshot.val().firstArrival;
        var tDA = childSnapshot.val().dateAdded;

        var tMA = 0;
        var tNA = "";


        tFA = moment(tFA, "hh:mm");
        console.log(tFA)
        var currentTime = moment().format();
        console.log(currentTime);
        var diffTime = moment().diff(moment(tFA), "minutes");
        console.log(diffTime);
        var remainder = diffTime % tF;
        console.log(remainder);
       	tMA = tF - remainder;
       	console.log(tMA);
        tNA = moment().add(tMA, "minutes");
        console.log(tMA);
        tNA = moment(tNA).format("hh:mm");
        console.log(tMA);




        $('#table-body').append("<tr>" + "<td class='t-name'>" + tN + "</td>" +
            "<td class='destination'>" + tD + "</td>" + "<td class='frequency'>" +
            tF + "</td>" + "<td class='next-arrival'>" + tNA + "</td>" + "<td class='min-away'>" +
            tMA + "</td>" + "</tr>");
    }, function(err) {
        console.log("Error: " + err);
    });



});