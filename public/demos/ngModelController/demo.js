angular.module("demo", [])
.directive("clockInput", clock)
.controller("TimeCtrl", TimeCtrl);

function clock() {
  return {
    // we require an instance of ng-model to work
    require: "ngModel",
    link: function(scope, el, attrs, ngModel) {

      // initialize the non-angular widget, and
      // pass in our model updating fn
      var clock = donutClock({
        onInput: view2model,
        el: el[0],
      });

      // when angular detects a change to the model,
      // we update our widget
      ngModel.$render = model2view;
        
      function model2view(time) {
        clock.set(ngModel.$viewValue);
      }

      function view2model(fromView) {
        ngModel.$setViewValue(fromView);
      }

    }
  }
}



function TimeCtrl($scope, $interpolate, $interval) {
  var MINUTE = 60 * 1000;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  var CIRCLE = Math.PI * 2;
  var COLOUR_TIME_OFFSET = Math.PI / 2;

  $scope.item = { time: new Date(0) };
  var ticker;

  var h = 201;
  var s = 80;
  var hsl = $interpolate("hsl({{h}}, {{s}}%, {{l}}%)");

  $scope.timeToColour = function(time) {
    var ratio = Math.sin((time / DAY) * CIRCLE - COLOUR_TIME_OFFSET);
    var l = 20 + (70 * ratio);
    return hsl({h:h,s:s,l:l});
  };

  Object.defineProperty($scope, "ticking", {
    get: function() {
      return !!ticker;
    }
  });

  $scope.toggle = function() {
    if(ticker) {
      $interval.cancel(ticker);
      ticker = null;
    } else {
      ticker = $interval(function() {
        $scope.item.time = new Date(+$scope.item.time + 5 * MINUTE);
      }, 16);
    }
  }
}
