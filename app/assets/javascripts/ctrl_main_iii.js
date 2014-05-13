/*var MainCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll','dataShare',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll,dataShare){

		$scope.z = true;
		
		$scope.year;

		$scope.months = months;
		$scope.days = days;

		$scope.sideEvents = [[],[],[],[],[],[],[],[],[],[],[],[]];

		$scope.getFromRoute = function(infra){

			$scope.infra = infra;
			$scope.infra.monthsel = {};
			$scope.infra.monthsel[$scope.infra.month] = 'selected';

			if ($scope.year != infra.year){

				$scope.sideEvents = [[],[],[],[],[],[],[],[],[],[],[],[]];
				$scope.year = infra.year;
				$scope.getEvents();

			}

		};



		// Get Events
		////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////
		$scope.getEvents = function(){

			this.options = {
				type: 'events',
				year: $scope.year,
				orderby: 'start_date',
				order: 'ASC'
			};

			ApiModel.query(this.options,function(data){

				$scope.events = data.events;
				var tmp = [[],[],[],[],[],[],[],[],[],[],[],[]];

				$.each(data.events,function(key,val){

					var aa = val.start_date.split('-');
					var aStart = new Date(aa[0],(aa[1]-1),aa[2]);

					var aa = val.end_date.split('-');
					var aEnd = new Date(aa[0],(aa[1]-1),aa[2]);

					if (aStart.getUTCMonth() == aEnd.getUTCMonth()){
						tmp[aStart.getUTCMonth()].push(val);
					} else {
						tmp[aStart.getUTCMonth()].push(val);
						tmp[aEnd.getUTCMonth()].push(val);
					}

				});

				$scope.sideEvents = tmp;

				$scope.populateCalendar();

			});

		};
		////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////



		// Populate Calendar
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////
		$scope.populateCalendar = function(){

			$timeout(function(){$('#month_'+$scope.infra.month).goTo();},10);

			$scope.elist = {};
			$.each($scope.weeks,function(key,val){

				$scope.elist[key] = [];

				$.each($scope.events,function(i,e){

					var aa = e.start_date.split('-');
					var bb = e.end_date.split('-');

					var aStart = new Date(aa[0],(aa[1]-1),aa[2]);
					var aEnd = new Date(bb[0],(bb[1]-1),bb[2]);

					var bStart = new Date(val.days[0].stamp);
					var bEnd = new Date(val.days[6].stamp);

					if (aStart <= bEnd && bStart <= aEnd){
						$scope.elist[key].push(e);
					}

				});

			});

			$scope.rows = [
				[],
				[],
				[],
				[],
				[],
				[]
			];
			
			$.each($scope.elist,function(key,val){

				$scope.rows[key] = [];
				$scope.lineUp(val,key);

			});

			$scope.temp = [];
			$.each($scope.rows,function(week,rows){

				$scope.temp[week] = {};

				$.each(rows,function(row,events){

					$scope.temp[week][row] = [];

					$.each(events,function(key,event){

						var newEvent = {};

						var aa = event.start_date.split('-');
						var start_date = new Date(aa[0],(aa[1]-1),aa[2]);

						var aa = event.end_date.split('-');
						var end_date = new Date(aa[0],(aa[1]-1),aa[2]);

						var s1 = start_date;
						var e1 = end_date;

						var d1 = new Date($scope.weeks[week].days[0].stamp);
						var d7 = new Date($scope.weeks[week].days[6].stamp);

						newEvent.cl = 'spancenter';

						if (s1 < d1){
							s1 = d1;
							newEvent.cl = 'spanleft';
						}
						if (e1 > d7){
							e1 = d7;
							newEvent.cl = 'spanright';
						}
						if (start_date < d1 && end_date > d7){
							newEvent.cl = 'spanboth';	
						}

						var span = dateDiff(s1,e1);

						if (key == 0){
							var f=0;
							var diff = dateDiff(d1,s1);
							while(f<(diff-1)){
								$scope.temp[week][row].push({title: ''});
								f++;
							}
						} else {
							var f=0;

							var aa = $scope.rows[week][row][key-1].end_date.split('-');

							var so = new Date(aa[0],(aa[1]-1),aa[2]);

							var diff = days_between(so,s1);
							while(f<(diff-1)){
								//$scope.temp[week][row].push({title: ''});
								f++;
							}
						}

						$.each(event,function(x,y){

							newEvent[x] = y;

						});

						newEvent.week = week;
						newEvent.span = span;

						$scope.temp[week][row].push(newEvent);



					});

				});

			});

		};
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////



		// Display Date
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.displayDate = function(date){

			var aa = date.split('-');
			var a = new Date(aa[0],(aa[1]-1),aa[2]);

			var n = a;

			var newdate = {
				m: n.getUTCMonth(),
				M: months[n.getUTCMonth()].short,
				MM: months[n.getUTCMonth()].long,
				y: n.getUTCFullYear(),
				d: n.getUTCDate(),
				D: days[n.getUTCDay()].short,
				DD: days[n.getUTCDay()].long
			};
			
			return newdate;

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

	}
];*/