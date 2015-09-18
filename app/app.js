angular.module("materialExample", ["ngMaterial", "materialCalendar", "firebase"])
.constant('_', window._);

angular.module("materialExample").controller("calendarCtrl", function($scope, $firebaseObject, $filter) {

  $scope._ = _;

  $scope.onEditChange = function () {
    ///$scope.calendar is the object created by Matertial Calendar///
    ///I am modifying it into something I can work with (add games, etc...)///
    var allWeeks = {};
    if ($scope.calendar) {
      var weekCounter = 0;
      var dayCounter = 0;
      ///looping over weeks array-ish objects///
      for (key in $scope.calendar.weeks) {
        allWeeks[weekCounter] = $scope.calendar.weeks[key].slice();
        weekCounter ++;
        ///looping over days array-ish objects///
        for (key2 in $scope.calendar.weeks[key]){
          allWeeks[key][key2] = {
            ///creating a JSON friendly key value pair I can use to sync firebase data-object -->
            /// with local $scope.calendar.weeks/allweeks object///
            id: angular.toJson($scope.calendar.weeks[key][key2]),
            date: $scope.calendar.weeks[key][key2],
            games: {first:""}
          }
          dayCounter++;
        }
      }
      $scope.calendar.weeks = allWeeks;
      // console.log("allWeeks :", allWeeks)
      // console.log("$scope.calendar.weeks :", $scope.calendar.weeks);
    }

    //removes $$hashkey from objects to make them json/firebase friendly
    $scope.ngObjFixHack = function(ngObj) {
      var output;
      output = angular.toJson(ngObj);
      output = angular.fromJson(output);
      return output;
    }  

    var localCal = {};
    if ($scope.calendar) {
      var weekCounter = 0;
      var dayCounter = 0;
      ///looping over weeks array-ish objects///
      for (key in $scope.calendar.weeks) {
        localCal[weekCounter] = $scope.calendar.weeks[key].slice();
        weekCounter ++;
        ///looping over days array-ish objects///
        for (key2 in $scope.calendar.weeks[key]){
          localCal[key][key2] = {
            clicked: $scope.calendar.weeks[key][key2].clicked,
            id: $scope.calendar.weeks[key][key2].id,
            games: $scope.calendar.weeks[key][key2].games
          }
          dayCounter++;
        }
      }
      localCal = $scope.ngObjFixHack(localCal);
      console.log("hacked localCal :", localCal);
    }
    
    var ref = new Firebase("https://soccerdates.firebaseio.com/"); // assume value here is { foo: "bar" }
    var fireCal = $firebaseObject(ref);

    console.log("fireCal :", fireCal);

    if ($scope.calendar && fireCal) {
      var weekCounter = 0;
      var dayCounter = 0;
      ///looping over weeks array-ish objects///
      for (key in localCal) {
        fireCal[weekCounter] = localCal[weekCounter];
        weekCounter ++;
        ///looping over days array-ish objects///
        for (key2 in localCal[key]){
          fireCal[key][key2] = {
            id: localCal[key][key2].id,
            games: localCal[key][key2].games
          }
          dayCounter++;
        }
      }
      fireCal.$save().then(function(ref) {
        ref.key() === fireCal.$id; // true
      }, function(error) {
        console.log("Error:", error);
      });    
    }
  }

  $scope.selectedDate = null;
  $scope.setDirection = function(direction) {
    $scope.direction = direction;
  };
  // $scope.setDirection("verticle");
  $scope.selectedDate;
  $scope.dayClick = function(date) {
    $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
  };
  $scope.prevMonth = function(data) {
    $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
  };
  $scope.nextMonth = function(data) {
    $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
  };
  // $scope.setDayContent = function() {
    
  //   return $scope.calendar;
  // };
  $scope.onEditChange();

});