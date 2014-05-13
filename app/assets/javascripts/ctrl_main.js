var MainCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll','dataShare',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll,dataShare){

		var s = {};
		$scope.months = months;
		$scope.days = days;

		$scope.$on('$routeChangeStart',function(next,current){

			JP('RouteChange');

			s.today = new Date();
			s.year = $location.search().year || s.today.getUTCFullYear();
			s.month = $location.search().month || (s.today.getUTCMonth()+1);
			s.month--;
			$scope.year = s.year;
			$scope.month = s.month;
			$scope.monthsel = {};
			$scope.monthsel[s.month] = 'selected';

			if (s.old_year != s.year){
				$timeout(function(){$scope.getSideEvents();},0);
			}

			s.old_year = s.year;

		});

		$scope.getSideEvents = function(){

			$scope.sideEvents = [[],[],[],[],[],[],[],[],[],[],[],[]];

			var tmp = [[],[],[],[],[],[],[],[],[],[],[],[]];

			this.options = {
				type: 'events',
				year: s.year,
				orderby: 'start_date',
				order: 'ASC'
			};

			ApiModel.query(this.options,function(data){

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

			});

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
];