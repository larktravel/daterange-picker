'use strict';


angular.module('lark', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])

  .controller('MainCtrl', function ($scope) {
      $scope.ngCal = {
        // earliest possible search date
        earliestDate: new Date(2014, 5, 22),

        // # of calenders
        months: 2,

        // set selected start and end date
        startDate: new Date(2014, 5, 23),
        endDate: new Date(2014, 6, 12)
     }
  })

  .directive('ngStart', function ($compile, $parse) {
    return {
      link: function ($scope, $element, $attributes, ngModel) {
        //console.log('ng start attrs', $attributes.value);
      }
    }
  })

  .directive('ngEnd', function ($compile, $parse) {
    return {
      link: function ($scope, $element, $attributes, ngModel) {
        //console.log('ng end attrs', $attributes.value);
      }
    }
  })

  // now need to update the scope when the calendar is modified

  .directive('ngCal', function ($compile, $parse) {
    return {
      link: function ($scope, $element, $attributes, ngModel) {

        // console.log($scope.ngCal);
        // console.log('attrs', $attributes);
        // console.log('$element', $('#cal1_container'));

        var earliestSearchDate = $scope.ngCal.earliestDate;
        var startDate = $scope.ngCal.startDate;
        var endDate = $scope.ngCal.endDate;

        earliestSearchDate.setMonth(earliestSearchDate.getMonth() - 1);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setMonth(endDate.getMonth() - 1);

        $('#start').val(startDate.toString());

        var func = function(range) {
          console.log('range', range);
        }

        var timeframe = new Timeframe();
        timeframe.initialize($('#' + $attributes.id + ''), {
            earliest: earliestSearchDate,
            resetButton: $('#reset'),
            startField: $('#start'),
            endField: $('#end'),
            range: { start: startDate, end: endDate },
            minRange: 2,
            format: 'ddd MMM d',
            months: $scope.ngCal.months ? $scope.ngCal.months : 2,
            rangeSelected: func
        });

        $scope.$watch(timeframe.range.start, function() {
          console.log('range start', timeframe.range.start);
        });


      }
    }
  });