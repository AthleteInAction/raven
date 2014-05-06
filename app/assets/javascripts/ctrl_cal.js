var CalCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.cellheight = 98;
		$scope.cellwidth = 138;

		$scope.w = [0,1,2,3,4,5];
		$scope.d = [0,1,2,3,4,5,6];
		$scope.o = 0;
		$scope.today = new Date();
		$scope.events = [];
		$scope.dates = {};
		var i=0;
		while(i<31){
			i++;
			$scope.dates[i] = [];
		}

		if ($scope.params.month){
			$scope.month = $scope.params.month;
		} else {
			$scope.month = $scope.today.getMonth()+1;
		}

		if ($scope.params.year){
			$scope.year = $scope.params.year;
		} else {
			$scope.year = $scope.today.getFullYear();
		}

		$scope.startDay = new Date($scope.month+'/1/'+$scope.year).getDay();

		$scope.daysInMonth = function(month,year){
			return new Date(year,month,0).getDate();
		};

		$scope.endDate = $scope.daysInMonth($scope.month,$scope.year);

		$scope.weekDays = [
			'Sun',
			'Mon',
			'Tues',
			'Wed',
			'Thurs',
			'Fri',
			'Sat'
		];

		$scope.events = {};
		$scope.events[1] = {
			title: 'This is an event!'
		};

		$scope.setDate = function(w,d){

			d = d+1;
			this.s = w*7;
			this.date = (this.s+d)-$scope.startDay;
			this.cap = $scope.endDate;

			this.result = {
				date: this.date,
				type: 'in'
			};

			if (this.date <= 0){
				this.result.date = $scope.daysInMonth(($scope.month-1),$scope.year)+this.date;
				this.result.type = 'out';
			} else if (this.date > $scope.endDate){
				this.result.date = this.date-$scope.endDate;
				this.result.type = 'out';
			} else {
				if (this.date == $scope.today.getDate()){
					this.result = {
						date: this.date,
						type: 'today'
					};					
				}
			}

			return this.result;

		};

		$scope.getEvents = function(){

			this.options = {
				year: $scope.year,
				month: $scope.month,
				type: 'events'
			};

			ApiModel.query(this.options,function(data){

				var temp = [];

				angular.forEach(data.events,function(val){

					var sdt = new Date(val.start_date);
					var edt = new Date(val.end_date);

					var top = Math.ceil((sdt.getUTCDate()+$scope.startDay)/7);
					top = ((top*$scope.cellheight)-$scope.cellheight)+(top+20);
					val.setTop = top;

					var d = sdt.getUTCDay();
					var left = (d*$scope.cellwidth)+(d+5);
					val.setLeft = left;

					var dif = (edt.getUTCDate()-sdt.getUTCDate());
					var width = (((dif*$scope.cellwidth)+dif)-8)+$scope.cellwidth;
					val.setWidth = width;

					temp.push(val);

				});

				$scope.events = temp;

			});

		};
		$scope.getEvents();

		$scope.getInfo = function(item){

			//JP(item);

		};

	}
];