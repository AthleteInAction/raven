var CalendarCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll){

		$scope.params = $routeParams;

		var s = {};
		s.today = new Date();
		s.year = $location.search().year || s.today.getUTCFullYear();
		s.month = $location.search().month || (s.today.getUTCMonth()+1);
		s.month--;

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

			//$timeout(function(){$('#month_'+s.month).goTo();},10);

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

			$scope.overlay = [];
			$.each($scope.rows,function(week,rows){

				$scope.overlay[week] = {};

				$.each(rows,function(row,events){

					$scope.overlay[week][row] = [];

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
								$scope.overlay[week][row].push({title: ''});
								f++;
							}
						} else {
							var f=0;

							var aa = $scope.rows[week][row][key-1].end_date.split('-');

							var so = new Date(aa[0],(aa[1]-1),aa[2]);

							var diff = days_between(so,s1);
							while(f<(diff-1)){
								//$scope.overlay[week][row].push({title: ''});
								f++;
							}
						}

						$.each(event,function(x,y){

							newEvent[x] = y;

						});

						newEvent.text = event.title;
						newEvent.span = span;

						$scope.overlay[week][row].push(newEvent);



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

			this.options = {
				type: 'events',
				year: s.year,
				orderby: 'start_date',
				order: 'ASC'
			};

			ApiModel.query(this.options,function(data){
				
				$scope.events = data.events;

				$scope.populateCalendar();

			});

		};
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////



		// Build Calendar
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////
		$scope.buildCalendar = function(){

			this.month_1 = new Date(s.year,s.month,1);
			this.offset = this.month_1.getUTCDay();

			this.start = this.month_1;
			this.start.setDate(this.month_1.getUTCDate()-this.offset);

			$scope.weeks = [];
			var i = 1;
			var d = 1;
			var w = 1;
			var tdate = this.start;
			while(i<=42){
				
				if (tdate.getUTCMonth() == s.month){
					this.cl = 'in';
				} else {
					this.cl = 'out';
				}
				if ($scope.weeks[w-1]){
					$scope.weeks[w-1].days[d-1] = {
						stamp: tdate.getTime(),
						display: tdate.getUTCDate(),
						cl: this.cl,
						i: (i+1)
					};
				} else {
					$scope.weeks[w-1] = {
						days: [{
							stamp: tdate.getTime(),
							display: tdate.getUTCDate(),
							cl: this.cl
						}]
					};
				}

				tdate.setDate(tdate.getUTCDate()+1);
				d++;if (i%7 === 0){w++;d=1;}i++;
			}

			$scope.getEvents();

		};
		$scope.buildCalendar();
		/////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////

	}
];