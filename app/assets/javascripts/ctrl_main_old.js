/*var MainCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll){
		
		$scope.params = $routeParams;
		$scope.infra = {};
		$scope.infra.today = new Date();
		$scope.mtab = {};
		$scope.months = months;
		$scope.days = days;
		JP($scope.params);



		// Line Up
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////
		$scope.lineUp = function(list,week){
			
			var newList = [];
			var cleanList = [];

			var lastEvent;

			$.each(list,function(key,val){

				lastEvent = val;

				var smash = {};
				$.each(val,function(k,v){
					smash[k] = v;
				});
				
				if (key > 0){
					
					var aa = val.start_date.split('-');
					var aStart = new Date(aa[0],(aa[1]-1),aa[2]);

					var aa = val.end_date.split('-');
					var aEnd = new Date(aa[0],(aa[1]-1),aa[2]);

					var aa = lastEvent.start_date.split('-');
					var bStart = new Date(aa[0],(aa[1]-1),aa[2]);

					var aa = lastEvent.end_date.split('-');
					var bEnd = new Date(aa[0],(aa[1]-1),aa[2]);

					var lap = false;

					if (aStart <= bEnd && bStart <= aEnd){
						// Does Overlap
						lap = true;
					} else {
						lap = false;
					}

					if (lap){
						newList.push(smash);
					} else {
						cleanList.push(smash);
					}

				} else {
					cleanList.push(smash);
				}

			});

			$scope.rows[week].push(cleanList);

			if (newList.length > 0){
				$scope.lineUp(newList,week);
			}

		};
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////



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



		// Get Events
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////
		$scope.getEvents = function(){

			$scope.events = [];
			$scope.temp = [];
			JP('GetEvents');
			$scope.sideEvents = [[],[],[],[],[],[],[],[],[],[],[],[]];

			this.options = {
				type: 'events',
				year: $scope.infra.year,
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
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////



		// Build Calendar
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////
		$scope.buildCalendar = function(year,month,getevents){

			// Set Year & Month
			/////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////////////
			$scope.infra.year = year;
			$scope.infra.month = (month-1);
			$scope.mtab = {};
			$scope.mtab[$scope.infra.month] = 'selected';
			JP($scope.mtab);
			/////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////////////

			$scope.infra.dayOne = new Date($scope.infra.year,($scope.infra.month),1);
			$scope.infra.firstDay = $scope.infra.dayOne.getUTCDay();

			$scope.grid = {};
			$scope.grid.start = new Date($scope.infra.year,($scope.infra.month),1);
			$scope.grid.start.setDate($scope.infra.dayOne.getUTCDate()-$scope.infra.firstDay);

			$scope.grid.end = new Date($scope.grid.start);
			$scope.grid.end.setDate($scope.grid.start.getUTCDate()+41);

			$scope.weeks = [];
			var i = 1;
			var d = 1;
			var w = 1;
			var tdate = new Date($scope.grid.start);
			while(i<=42){
				
				if (tdate.getUTCMonth() == $scope.infra.month){
					this.cl = 'in';
				} else {
					this.cl = 'out';
				}
				if ($scope.weeks[w-1]){
					$scope.weeks[w-1].days[d-1] = {stamp: tdate.getTime(),display: tdate.getUTCDate(),cl: this.cl,i: (i+1)};
				} else {
					$scope.weeks[w-1] = {days: [{stamp: tdate.getTime(),display: tdate.getUTCDate(),cl: this.cl}]};
				}

				tdate.setDate(tdate.getUTCDate()+1);
				d++;if (i%7 === 0){w++;d=1;}i++;
			}
			JP({weeks: $scope.weeks});

			if (getevents){
				$scope.getEvents();
			} else {
				$scope.populateCalendar();
			}

		};
		$scope.buildCalendar(2014,4,true);
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////

		$scope.changeCal = function(year,month,getevents){

			JP($scope.infra.year+'===='+month);

			if (month && month <=12 && month > 0){
				
			} else {
				month = new Date().getMonth();
			}

			if (year){
				
			} else {
				year = new Date().getFullYear();
			}

			if ($scope.infra.year != year){getevents = true;}

			$scope.buildCalendar(year,month,getevents);

		};



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
		$scope.highlight = function(id){

			$scope.hover = {};
			$scope.hover[id] = 'highlight';

		};

	}
];*/