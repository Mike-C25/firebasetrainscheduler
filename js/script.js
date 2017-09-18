$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyBhPt4WJ0qd2HIS8pQGHhPAbIRyZbwS2u8",
        authDomain: "trainschedulerz.firebaseapp.com",
        databaseURL: "https://trainschedulerz.firebaseio.com",
        projectId: "trainschedulerz",
        storageBucket: "",
        messagingSenderId: "975014199256"
    };
    firebase.initializeApp(config);
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');


    $('.main-body').hide();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        $('.main-body').fadeIn(1500);
        authorizedRun();
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    function authorizedRun() {
        // Initialize Firebase


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
            if (trainName != "" && destination != "" && freq != "" && firstArrival != "") {
                database.ref().push({
                    name: trainName,
                    destination: destination,
                    frequency: freq,
                    firstArrival: firstArrival,
                    nextArrival: "",
                    minutesAway: 0,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                console.log("Please Fill Required Boxes");
            }


        });

        database.ref().orderByChild("name").on("child_added", function(childSnapshot) {

            var tN = childSnapshot.val().name;
            var tD = childSnapshot.val().destination;
            var tF = childSnapshot.val().frequency;
            var tFA = childSnapshot.val().firstArrival;
            var tDA = childSnapshot.val().dateAdded;

            var tMA = 0;
            var tNA = "";


            tFA = moment(tFA, "hh:mm");
            var currentTime = moment().format();
            var diffTime = moment().diff(moment(tFA), "minutes");
            var remainder = diffTime % tF;
            tMA = tF - remainder;
            tNA = moment().add(tMA, "minutes");
            tNA = moment(tNA).format("hh:mm");



            $('#table-body').append("<tr>" + "<td class='t-name'>" + tN + "</td>" +
                "<td class='destination'>" + tD + "</td>" + "<td class='frequency'>" +
                tF + "</td>" + "<td class='next-arrival'>" + tNA + "</td>" + "<td class='min-away'>" +
                tMA + "</td>" + "</tr>");
        }, function(err) {
            console.log("Error: " + err);
        });

        // setInterval(timeChange, 60000);

        // function timeChange() {
        //     database.ref().once("child_added", function(snapshot) {
        //         for (key in snapshot.val()) {

        //         }
        //     });

        // }
        // timeChange();
    }




});