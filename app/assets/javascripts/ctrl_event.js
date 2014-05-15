var EventCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.current_user = current_user;
		$scope.users = {};
		$scope.invitations = [];
		$scope.etab = {people: 'selected'};

		// Get all users associated with the event
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		$scope.getUsers = function(){

			this.options = {
				type: 'events',
				id: $scope.params.id,
				extend: 'users'
			};

			ApiModel.query(this.options,function(data){

				$.each(data.users,function(i,user){

					$scope.users[user.id] = user;
					if (!user.name){
						$scope.users[user.id].name = '--';
					}

				});

				$scope.getEvent();

			});

		};
		$scope.getUsers();
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////



		// Get Event
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		$scope.getEvent = function(){

			this.options = {
				type: 'events',
				id: $scope.params.id
			};

			ApiModel.get(this.options,function(data){

				$timeout(function(){

					$scope.event = data.event;
					$scope.event.from = new Date(Date.parse(data.event.start_date));
					$scope.event.to = new Date(Date.parse(data.event.end_date));
					$scope.event.hashtag = 'wambl';

					$scope.getInvitations();

				},0);

			});

		};
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////



		// Change Tabs
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		$scope.changeTab = function(tab){

			$scope.etab = {};
			$scope.etab[tab] = 'selected';

		};
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////



		// Get Invitations
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getInvitations = function(map){

			this.options = {
				type: 'events',
				id: $scope.params.id,
				extend: 'invitations'
			};

			var tmp = [];

			ApiModel.query(this.options,function(data){

				$.each(data.invitations,function(i,invite){

					if (invite.invitee_id == current_user.id){
						$scope.myInvitation = invite;
					} else {
						invite.user = $scope.users[invite.invitee_id];
						tmp.push(invite);
					}

				});

				$scope.invitations = tmp;

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

}];