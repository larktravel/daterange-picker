'use strict';


var tripRequest = {
  origin: 'NYC',
  destination: 'CUN',
  departs_at: moment('2014-06-01'),
  returns_at: moment('2014-06-05'),
  setRange: function(startDate, endDate){
    tripRequest.departs_at = moment(startDate);
    tripRequest.returns_at = moment(endDate);
  },
  getRange: function(){
    var range = {start: moment(tripRequest.departs_at), end: moment(tripRequest.returns_at)}
    return range
  }
}


angular.module('lark', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])


  .controller('MainCtrl', function ($scope) {
      $scope.tripRequest = tripRequest;
      $scope.dpOptions = {
        earliestDate: new Date(2014, 5, 27),
        months: 2
     }
  })



  .directive('ngTripduration', function () {
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



  .directive('ngDatepicker', function ($document) {
    return {
      require: '?ngModel',
      link: function ($scope, $element, $attributes, ngModel) {
        var earliestSearchDate = ($scope.dpOptions.earliestDate) ? $scope.dpOptions.earliestDate : new Date();
        earliestSearchDate.setMonth(earliestSearchDate.getMonth() - 1);

        var dateRange = [];
        var timeframe = new Timeframe();

        ngModel.$render = function(){
          dateRange = ngModel.$viewValue.getRange();
          initTimeFrame();
        }

        var onRangeSelected = function(range) {
          tripRequest.setRange(range.start, range.end)
          $scope.$apply();
          toggleClass(false);
        }


        $document.bind('click', function(event) {
          var calendarClick = $element.find(event.target).length > 0;
          var target = event.target.id;

          if (calendarClick)
            return;
          
          if(event.target.innerHTML === '+')
            return;
          
          if(target === 'start' || target === 'end') {
            toggleClass(true);
          } else {
            toggleClass(false);
          }
        });

        function initTimeFrame(){
          timeframe.initialize($('#' + $attributes.id + ''), {
            earliest: earliestSearchDate,
            resetButton: $('#reset'),
            startField: $('#start'),
            endField: $('#end'),
            range: dateRange,
            minRange: 2,
            format: 'ddd, MMM Do',
            months: $scope.dpOptions.months ? $scope.dpOptions.months : 2,
            rangeSelected: onRangeSelected
          });
        }

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