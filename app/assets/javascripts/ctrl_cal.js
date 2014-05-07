var CalCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll){

		$scope.params = $routeParams;

		$scope.months = months;
		$scope.today = new Date();
		$scope.month = ($scope.today.getUTCMonth()+1);

		JP($scope.month);
		JP('month_'+$scope.month);

		//$location.hash('tester');
		//$anchorScroll();

		$timeout(function(){
			$('.tcontent').snapscroll({
				botPadding: 1,
				topPadding: 1,
				scrollSpeed: 200,
				scrollEndSpeed: 50,
				scrollOptions: {'axis':'xy'}
			});
		},1000);

	}
];