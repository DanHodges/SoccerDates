(function() {
  'use strict';

  angular
    .module('soccerDates')
    .controller('sideNavCtrl', sideNavCtrl);

  sideNavCtrl.$inject = 
  ['$scope','$location','$firebaseObject','$firebaseArray','$filter','$mdDialog','$timeout','$mdSidenav','$log','$mdUtil'];

  function sideNavCtrl
  ($scope,$location, $firebaseObject, $firebaseArray, $filter, $mdDialog, $timeout, $mdSidenav, $log, $mdUtil){

	  $scope.close = function () {
	    $mdSidenav('right').close()
	      .then(function () {
	        $log.debug("close RIGHT is done");
	      });
	  }

	  $scope.toggleRight = buildToggler('right');

	  function buildToggler(navID) {
	    var debounceFn =  $mdUtil.debounce(function(){
	      $mdSidenav(navID)
	        .toggle()
	        .then(function () {
	          $log.debug("toggle " + navID + " is done");
	        });
	      },500);
	    return debounceFn;
	  }

	  function DialogController($scope, $mdDialog) {
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };
	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };
	    $scope.answer = function(answer) {
	      $mdDialog.hide(answer);
	    };
	  }   

	  ///SIGN IN SECTION///
	  var ref = new Firebase("https://soccerdates.firebaseio.com");
	  $scope.login = function () {
	    console.log("I ran");
	    $log.debug("i ran too");
	    ref.authWithPassword({
	      team    : $scope.team,
	      email    : $scope.email,
	      password : $scope.password
	    }, function(error, authData) {
	      if (error) {
	        console.log("Login Failed!", error);
	      } else {
	        console.log("Authenticated successfully with payload:", authData);
	        $location.path("/calendar");
	        $scope.$apply();
	      }
	    });
	  }

	  ///SIGN UP SECTION///
	  $scope.create = function () {
	    console.log("I ran");
	    $log.debug("i ran too");
	    ref.createUser({
	      email    : $scope.newEmail,
	      password : $scope.newPassword
	    }, function(error, userData) {
	      if (error) {
	        console.log("Error creating user:", error);
	      } else {
	        console.log("Successfully created user account with uid:", userData.uid);
	      }
	    }); 
	  };

  } //end sideNavCtrl

})();