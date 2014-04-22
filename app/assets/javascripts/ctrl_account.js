var UserCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.submitting = false;

		// Get Account
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getUser = function(){

			this.options = {
				type: 'users',
				id: current_user.id
			};

			ApiModel.get(this.options,function(data){

				$scope.user = data.user;

			});

		};
		$scope.getUser();
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Save Account
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.saveUser = function(){

			$scope.submitting = true;

			var User = new ApiModel({user: {name: $scope.user.name,email: $scope.user.email}});

			this.options = {
				type: 'users',
				id: current_user.id
			};

			$timeout(function(){

				User.$save(this.options,function(data){

					$scope.submitting = false;

				},function(data){

					$scope.submitting = false;

				});

			},500);

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

	}
];