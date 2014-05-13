var TestCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll','dataShare',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll,dataShare){

		JP($scope.$parent.z);
		
		$scope.params = $routeParams;

		$scope.infra = {};
		$scope.infra.today = new Date();
		$scope.infra.year = $scope.params.year || $scope.infra.today.getFullYear();
		$scope.infra.month = $scope.params.month || ($scope.infra.today.getMonth()+1);
		$scope.infra.month--;



		// Build Calendar
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.buildCalendar = function(){

			var month_first = new Date($scope.infra.year,$scope.infra.month,1);
			var month_last = new Date($scope.infra.year,($scope.infra.month+1),0);
			var offset = month_first.getUTCDay();
			var calendar_start = month_first;
			calendar_start.setDate(month_first.getUTCDate()-offset);

			$scope.months = months;
			$scope.days = days;
			$scope.testr = 'lll';

			$scope.calendar = [];
			var i = 1;
			var d = 1;
			var w = 1;
			while(i<=42){
				
				// Set Day Class
				if (calendar_start.getUTCMonth() == $scope.infra.month){this.cl = 'in';} else {this.cl = 'out';}

				if ($scope.calendar[w-1]){
					$scope.calendar[w-1].days[d-1] = {
						date: calendar_start.getUTCDate(),
						cl: this.cl
					};
				} else {
					$scope.calendar[w-1] = {
						days: [
							{
								date: calendar_start.getUTCDate(),
								cl: this.cl
							}
						]
					};
				}

				// Increase Date by One Day
				calendar_start.setDate(calendar_start.getUTCDate()+1);
				d++;if (i%7 === 0){w++;d=1;}i++;
			}

		};
		$scope.buildCalendar();
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

	}
];