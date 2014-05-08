var CalCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout','$location','$anchorScroll',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout,$location,$anchorScroll){

		$scope.params = $routeParams;

		$scope.months = months;
		$scope.today = new Date();

		if ($scope.params.month && $scope.params.month <=12 && $scope.params.month > 0){
			$scope.month = ($scope.params.month-1);
		} else {
			$scope.month = $scope.today.getUTCMonth();
		}

		if ($scope.params.year){
			$scope.year = $scope.params.year;
		} else {
			$scope.year = $scope.today.getFullYear();
		}

		$scope.mtab = {};
		$scope.mtab[$scope.month] = 'selected';

		$timeout(function(){
			/*$('.menu').snapscroll({
				botPadding: 1,
				topPadding: 1,
				scrollSpeed: 200,
				scrollEndSpeed: 50,
				scrollOptions: {'axis':'yx'}
			});
			
			$location.hash('month_4');
			$anchorScroll();*/

			$('#month_'+$scope.month).goTo();

		},10);

	}
];