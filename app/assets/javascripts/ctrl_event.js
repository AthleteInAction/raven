var EventCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.current_user = current_user;
		$scope.users = {};
		$scope.invitations = {
			all: {},
			invited: {},
			confirmed: {},
			declined: {}
		};
		$scope.contacts = {
			all: {},
			invited: {},
			uninvited: {}
		};
		$scope.etab = {info: 'selected'};
		$scope.invite_class = null;
		$scope.invite_message = null;

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

					$scope.getInvitations();
					$scope.getComments();
					if (data.event.hashtag){$scope.getInstagram();}

				},0);

			});

		};
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////



		// Get Instagram
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		$scope.getInstagram = function(){

			this.options = {
				type: 'instagram',
				extend: $scope.event.hashtag
			};

			ApiModel.query(this.options,function(data){

				$scope.instagrams = data.body.data;
				JP(data.body);

			});

		};
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////



		// Get Comments
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		$scope.getComments = function(){
			
			this.options = {
				type: 'events',
				id: $scope.params.id,
				extend: 'comments'
			};

			ApiModel.query(this.options,function(data){

				$scope.comments = [];

				$.each(data.comments,function(i,comment){

					comment.user = $scope.users[comment.user_id];

					if (comment.user_id == current_user.id){
						comment.d_class = 'me';
					} else {
						comment.d_class = 'other';
					}

					if (comment.user.name){
						comment.show_name = comment.user.name;
					} else {
						comment.show_name = comment.user.email;
					}

					$scope.comments.push(comment);

				});

				JP({comments: $scope.comments});

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
		$scope.test = [
			{
				name: 'AAAA',
				email: 'AAAA'
			},
			{
				name: 'BBBB',
				email: 'BBBB'
			}
		];
		$scope.getInvitations = function(map){

			this.options = {
				type: 'events',
				id: $scope.params.id,
				extend: 'invitations'
			};

			var tmp = {
				all: {},
				invited: {},
				confirmed: {},
				declined: {}
			};

			ApiModel.query(this.options,function(data){

				$.each(data.invitations,function(i,invite){

					invite.user = $scope.users[invite.invitee_id];

					if (invite.invitee_id == current_user.id){
						$scope.myInvitation = invite;
					} else {

						tmp.all[invite.user.id] = invite;
						$scope.contacts.all[invite.user.id] = invite.user;
						if (invite.accepted == 0){
							tmp.invited[invite.user.id] = invite;
							$scope.contacts.invited[invite.user.id] = invite.user;
						} else if (invite.accepted == 1){
							tmp.confirmed[invite.user.id] = invite;
							$scope.contacts.invited[invite.user.id] = invite.user;
						} else if (invite.accepted == 2){
							tmp.declined[invite.user.id] = invite;
							$scope.contacts.invited[invite.user.id] = invite.user;
						}

					}

				});

				$scope.invitations = tmp;
				JP($scope.contacts);

				$scope.getContacts();

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Invite Person
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.invitePerson = function(val){

			$scope.invite_class = 'invite-loading';
			$scope.invite_message = 'Loading...';

			$timeout(function(){
				
				if ($scope.invite){
					
					// Existing User
					this.options = {
						invitation: {
							event_id: $scope.params.id,
							user_id: current_user.id,
							invitee_id: $scope.invite.id
						}
					};

					var Invite = new ApiModel(this.options);

				} else if (!$scope.invite && val) {

					if (emailValidate.test(val)){

						$scope.invalidEmail = null;

						this.options = {
							invitation: {
								event_id: $scope.params.id,
								email: val
							}
						};

						var Invite = new ApiModel(this.options);

					} else {

						$scope.invite_class = 'invite-invalid';
						$scope.invite_message = 'Please use a valid email format.';

					}

				}

				if (Invite){

					Invite.$create({type: 'invitations'},function(data){

						if (!data.user.name){data.user.name = '--';}

						$scope.contacts.invited[data.user.id] = $scope.invite;
						delete $scope.contacts.uninvited[data.user.id];

						data.invitation.user = data.user;
						$scope.invitations.all[data.user.id] = data.invitation;
						$scope.invitations.invited[data.user.id] = data.invitation;

						$scope.invite = null;
						$scope.invite_display = null;
						$('#invite_display').val('');

						$scope.setAutocomplete();

						$scope.invite_class = 'invite-sent';
						$scope.invite_message = data.user.email+' has been invited!';

					});

				}

			},300);
			//$scope.atest = 'BYE';
			//JP(emailValidate.test($scope.invite_input));

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Un-Invite Person
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.uninvitePerson = function(invite){

			$scope.invite_class = 'invite-loading';
			$scope.invite_message = 'Loading...';

			this.options = {
				type: 'events',
				id: $scope.params.id,
				extend: 'invitations',
				second: invite.id
			};

			ApiModel.destroy(this.options,function(data){

				if ($scope.invitations.all[invite.user.id]){ delete $scope.invitations.all[invite.user.id]; }
				if ($scope.invitations.invited[invite.user.id]){ delete $scope.invitations.invited[invite.user.id]; }
				if ($scope.invitations.confirmed[invite.user.id]){ delete $scope.invitations.confirmed[invite.user.id]; }
				if ($scope.invitations.declined[invite.user.id]){ delete $scope.invitations.declined[invite.user.id]; }

				if ($scope.contacts.invited[invite.user.id]){
					delete $scope.contacts.invited[invite.user.id];
					$scope.contacts.uninvited[invite.user.id] = invite.user;
				}

				JP($scope.contacts);

				$scope.setAutocomplete();

				$scope.invite_class = 'invite-invalid';
				$scope.invite_message = invite.user.email+' has been un-invited.';

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Contacts
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getContacts = function(){

			this.options = {
				type: 'contacts'
			};

			ApiModel.query(this.options,function(data){

				$.each(data.contacts,function(i,user){

					if (!user.name){user.name = '--';}
					$scope.contacts.all[user.id] = user;

					if (!$scope.contacts.invited[user.id]){

						$scope.contacts.uninvited[user.id] = user;

					}

				});

				$scope.setAutocomplete();

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Set Autocomplete
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.setAutocomplete = function(){

			var tmp = [];

			$.each($scope.contacts.uninvited,function(i,user){

				tmp.push(user);

			});
			JP(tmp);

			$('#invite_display').autocomplete({
				source: function(request,response){

					var matcher = new RegExp(request.term.toLowerCase());

					var matching = $.grep(tmp,function(value){
						
						if (matcher.test((value.email+'').toLowerCase()) || matcher.test((value.name+'').toLowerCase())){

							value.value = '';
							if (value.name){
								value.value += value.name+' - ';
							}
							value.value += value.email;

							return value;

						}

					});

					response(matching);

				},
				select: function(event,value){

					$('#invite_display').trigger('input');

					$scope.invite = value.item;

				},
				focus: function(event,value){
					
					$scope.invite = null;

				}
			}).keyup(function(e){

				if (e.keyCode == 13){

					$('.ui-autocomplete').hide();

				}

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

}];