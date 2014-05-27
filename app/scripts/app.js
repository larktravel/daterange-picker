'use strict';

angular.module('lark', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])

  .controller('MainCtrl', function ($scope) {
      $scope.dpOptions = {
        // earliest possible search date
        earliestDate: new Date(2014, 5, 27),

        // # of calenders
        months: 2,

        // set selected start and end date
        startDate: new Date(2014, 5, 28),
        endDate: new Date(2014, 6, 12)
     }

     $scope.daysCount = countDays($scope.dpOptions.startDate, $scope.dpOptions.endDate);
     $scope.nightsCount = $scope.daysCount - 1;
  })

  .directive('ngTripduration', function ($compile, $parse) {
    return {
      replace: true,
      template: '<div>{{daysCount}} Days / {{nightsCount}} Nights</div>'
    };
  })

  .directive('ngDatepicker', function ($compile, $parse, $document) {
    return {
      require: 'ngModel',
      link: function (scope, $element, $attributes, ngModel) {

        var earliestSearchDate = (scope.dpOptions.earliestDate) ? scope.dpOptions.earliestDate : new Date();
        var startDate = (scope.dpOptions.startDate) ? scope.dpOptions.startDate : new Date();
        var endDate = (scope.dpOptions.endDate) ? scope.dpOptions.endDate : new Date();

        earliestSearchDate.setMonth(earliestSearchDate.getMonth() - 1);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setMonth(endDate.getMonth() - 1);

        $('#start').val(startDate.toString());

        var callbackFunction = function(range) {
          scope.dpOptions.startDate = range.start;
          scope.dpOptions.endDate = range.end;

          scope.daysCount = countDays(scope.dpOptions.startDate, scope.dpOptions.endDate);
          scope.nightsCount = scope.daysCount - 1;

          toggleClass(false);
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
            months: scope.dpOptions.months ? scope.dpOptions.months : 2,
            rangeSelected: callbackFunction
        });

        $document.bind('click', function(event) {
            var calendarClick = $element.find(event.target).length > 0;

            if (calendarClick)
                return;

            if(event.target.innerHTML === '+')
              return;

            var target = event.target.id;
            if(target === 'start' || target === 'end') {
              toggleClass(true);
            } else {
              toggleClass(false);
            }
        });

        function toggleClass(visibility) {
          if(!visibility) {
            $element.removeClass('show');
            $element.addClass('hide');
          } else {
            $element.removeClass('hide');
            $element.addClass('show');
          }
        }
      }
    }
  });

  function countDays(startDate, endDate) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

    return Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
  }



