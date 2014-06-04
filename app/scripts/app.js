'use strict';


var tripRequest = {
  origin: 'NYC',
  destination: 'CUN',
  departs_at: moment('2014-06-01'),
  returns_at: moment('2014-06-05')
}


angular.module('lark', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])


  .controller('MainCtrl', function ($scope) {
      $scope.tripRequest = tripRequest;
  })



  .directive('ngTripDurationDisplay', function () {
    return {
      replace: true,
      scope: {
        startDate: '=startDate',
        endDate:   '=endDate'
      },
      link: function($scope, element, $attrs){
        $scope.$watch("startDate", function(){
          setDuration($scope)
        });
        $scope.$watch("endDate", function(){
          setDuration($scope)
        });
      },
      template: '<div>{{duration}} Nights</div>'
    };
    function setDuration($scope) {
      var oneDay = 24*60*60*1000;
      var mSecDiff = moment($scope.startDate).diff(moment($scope.endDate))
      $scope.duration = Math.abs(mSecDiff) / (oneDay)
    }
  })



  .directive('ngDaterangePicker', function ($document) {
    return {
      require: '?ngModel',
      scope: {
        startDate:      '=startDate',
        endDate:        '=endDate',
        minDate:        '=minDate',
        maxDate:        '=maxDate',
        numMonths:      '=numMonths',
        minDuration:    '=minDuration'
      },
      link: function ($scope, $element, $attrs, ngModel) {
        var earliestSearchDate = ($scope.minDate) ? moment($scope.minDate) : moment();
        var numMonths          = $scope.numMonths || 2;
        var minDuration        = $scope.minDuration || 2;
        var dateRange          = [];
        var timeframe          = new Timeframe();
        var startDateInput     = $attrs.startField || "start"
        var endDateInput       = $attrs.endField || "end"
        var initialized        = false

        // Watch for changes on the scoped attributes
        $scope.$watch("startDate", function(){ onRangeUpdate() });
        $scope.$watch("endDate", function(){ onRangeUpdate() });

        // Hide the calendar widget when the document is clicked outside of it
        $document.bind('click', function(event) {
          var calendarClick = $element.find(event.target).length > 0;
          var target = event.target.id;

          if (calendarClick || (event.target.innerHTML === '+'))
            return;
          if (target === startDateInput || target === endDateInput) {
            toggleClass(true);
          } else {
            toggleClass(false);
          }
        });

        // Called when the user selects a date range
        function onRangeSelect(range) {
          $scope.startDate = moment(range.start);
          $scope.endDate = moment(range.end);
          $scope.$apply();
          toggleClass(false);
        }

        // Called whenever the bound dates have been updated (including parent scope)
        function onRangeUpdate(){
          if (initialized === false){
            dateRange = {start: moment($scope.startDate), end: moment($scope.endDate)}
            initTimeFrame();
            initialized = true;
          }
        }

        // Initialize the jQuery DateRangePicker 
        function initTimeFrame(){
          timeframe.initialize($('#' + $attrs.id + ''), {
            earliest: earliestSearchDate,
            // resetButton: $('#reset'),
            startField: $('#' + startDateInput),
            endField: $('#' + endDateInput),
            range: dateRange,
            minRange: minDuration,
            format: 'ddd, MMM Do',
            months: numMonths,
            rangeSelected: onRangeSelect
          });
        }

        function toggleClass(visibility) {
          if(!visibility) {
            $element.removeClass('show').addClass('hide');
          } else {
            $element.removeClass('hide').addClass('show');
          }
        }

      }
    }
  });