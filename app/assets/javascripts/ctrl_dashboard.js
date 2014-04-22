var DashboardCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.months = months;
		$scope.years = [];
		$scope.today = new Date();
		this.i = (new Date().getFullYear()-5);
		while(this.i < (new Date().getFullYear()+6)){
			$scope.years.push(this.i);
			this.i++;
		};

		$scope.getConfirmed = function(){

			this.options = {
				type: 'events',
				orderby: 'start_date',
				order: 'ASC',
				accepted: true
			};
			if ($scope.cToday){
				delete this.options.from;
			} else {
				this.options.from = $scope.today.toISOString();
			}
			if ($scope.cMonth){
				this.options.month = $scope.cMonth;
				if (!$scope.cYear){
					$scope.cYear = $scope.today.getFullYear();
				}
			}
			if ($scope.cYear){this.options.year = $scope.cYear;}

			ApiModel.query(this.options,function(data){

				$scope.confirmed = data.events;

			});

		};
		$scope.getPending = function(){

			this.options = {
				type: 'events',
				orderby: 'start_date',
				order: 'ASC',
				accepted: false
			};
			if ($scope.pToday){
				delete this.options.from;
			} else {
				this.options.from = $scope.today.toISOString();
			}
			if ($scope.pMonth){
				this.options.month = $scope.pMonth;
				if (!$scope.pYear){
					$scope.pYear = $scope.today.getFullYear();
				}
			}

			ApiModel.query(this.options,function(data){

				$scope.pending = data.events;

			});

		};

		$scope.getConfirmed();
		$scope.getPending();

		// Display Date
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.displayDate = function(date){

			var a = new Date(date+' 00:00:00');
			var n = a;

			var newdate = {
				m: n.getMonth(),
				M: months[n.getMonth()].short,
				MM: months[n.getMonth()].long,
				y: n.getFullYear(),
				d: n.getDate(),
				D: days[n.getDay()].short,
				DD: days[n.getDay()].long
			};
			
			return newdate;

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Compare Dates
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.compareDates = function(a,b){

			a = new Date(a+' 00:00:00');
			b = new Date(b+' 00:00:00');

			JP(a);
			JP(b);
			JP(7777);

			if (a >= b){
				return true;
			} else {
				return false;
			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

}];