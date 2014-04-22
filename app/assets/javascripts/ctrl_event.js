var EventCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.current_user = current_user;

		$scope.tabs = {
			info: 'selected'
		};
		$scope.users = {};
		$scope.eTotals = {};
		$scope.contacts = [];
		$scope.map;
		$scope.mapOptions;
		$scope.marker;
		$scope.geocoder = new google.maps.Geocoder();
		$scope.directionsService = new google.maps.DirectionsService();
		$scope.directionsDisplay;
		$scope.geoLocation;
		$scope.locationFound = false;
		/*$scope.dates = [];
		$scope.contacts = {};
		$scope.expenses = [];
		$scope.eTotals = {};
		$scope.invitees = [];
		$scope.myInvitation;
		$scope.options = [];*/



		$scope.start = function(map){$scope.getUsers(map);};



		// Get Users
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getUsers = function(map){

			this.options = {type: 'events',id: $scope.params.id,extend: 'users'};

			ApiModel.query(this.options,function(data){

				angular.forEach(data.users,function(user){

					$scope.users[user.id] = user;

				});

				$scope.getEvent(map);

			});

		};
		$scope.start(true);
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Event
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getEvent = function(map){

			ApiModel.get({type: 'events',id: $scope.params.id},function(data){

				$scope.event = data.event;

				$scope.getInvitations(map);
				$scope.getDays();
				$scope.commentsLoop();

				/*$.each(data.event.invitations,function(key,val){
					if (val.invitee_id == current_user.id){
						$scope.myInvitation = val;
						$scope.start_location = val.start_location;
					} else {
						var temp_user = $scope.getUser(val.invitee_id);
						temp_user.accepted = val.accepted;
						$scope.invitees.push(temp_user);
					}
				});
				
				$scope.getDays();
				$scope.getComments();*/

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Invitations
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getInvitations = function(map){

			this.options = {type: 'events',id: $scope.params.id,extend: 'invitations'};

			$scope.invitations = [];

			ApiModel.query(this.options,function(data){

				angular.forEach(data.invitations,function(val,i){

					if (val.invitee_id == current_user.id){
						$scope.myInvitation = val;
						$scope.start_location = val.start_location;
					} else {
						$scope.invitations.push(val);
					}

				});

				$scope.getContacts();
				if (map){$scope.geocode($scope.event.location);}

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Comments
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.commentsLoop = function(){

			$scope.getComments();

			$timeout(function(){

				$scope.commentsLoop();

			},500);

		};
		$scope.getComments = function(){

			ApiModel.query({type: 'events',id: $scope.params.id,extend: 'comments'},function(data){

				$scope.comments = data.comments;

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Contacts
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getContacts = function(){

			$scope.contacts = [];

			ApiModel.query({type: 'users',id: current_user.id,extend: 'contacts'},function(data){

				this.temp = {};

				angular.forEach($scope.invitations,function(val,i){

					this.temp[val.invitee_id] = true;

					if (val.invitee_id == current_user.id){
						//$scope.invitations.splice(i,1);
					}

				});

				angular.forEach(data.contacts,function(val,i){

					if (!this.temp[val.id]){

						$scope.contacts.push(val);

					}

				});

				$scope.setAutoComplete();

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Expenses
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getExepenses = function(){

			$scope.event.cost = 0;

			this.options = {type: 'events',extend: 'expenses',id: $scope.params.id};

			ApiModel.get(this.options,function(data){

				$scope.expenses = data.expenses;

				angular.forEach(data.expenses,function(val){
					
					if (val.frequency == 'per_day'){
						
						$scope.event.cost += (val.price*$scope.event.days);
						$scope.eTotals[val.id] = (val.price*$scope.event.days);

					} else if (val.frequency == 'per_night'){
						
						$scope.event.cost += (val.price*$scope.event.nights);
						$scope.eTotals[val.id] = (val.price*$scope.event.nights);

					} else if (val.frequency == 'one_time'){
						
						$scope.event.cost += val.price;
						$scope.eTotals[val.id] = val.price;

					}

				});

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Geocode
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.geocode = function(location){

			$scope.geocoder.geocode({address: location},function(results,status){

				if (status == google.maps.GeocoderStatus.OK){
					
					$scope.geoLocation = results;
					$scope.setMap();

				} else {

					JP('Location not Found');

				}

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Set Map
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.setMap = function(){

			$scope.directionsDisplay = new google.maps.DirectionsRenderer();
			$scope.directionsDisplay.setPanel(document.getElementById('directions-panel'));

			$scope.mapOptions = {
				zoom: 8,
				center: $scope.geoLocation[0].geometry.location
			};

			$scope.map = new google.maps.Map(document.getElementById('map-canvas'),$scope.mapOptions);

			$scope.marker = new google.maps.Marker({
			    map: $scope.map,
			    position: $scope.mapOptions.center,
			    title: $scope.event.location,
			    animation: google.maps.Animation.DROP,
			});

			if ($scope.start_location){
				$scope.getRoute();
				$scope.locationFound = true;   
			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Display Days
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.displayDates = function(){

			$scope.dates = [];

			var a = new Date($scope.event.start_date+' 00:00:00');
			var n = a;

			for (var i=0,limit=$scope.event.days;i<limit;i++){

				if (i < 1){

				} else {
					n.setDate(a.getDate()+1);
				}

				var newdate = {
					m: n.getMonth(),
					M: months[n.getMonth()].short,
					MM: months[n.getMonth()].long,
					y: n.getFullYear(),
					d: n.getDate(),
					D: days[n.getDay()].short,
					DD: days[n.getDay()].long
				};
				
				$scope.dates.push(newdate);

			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Days Diff
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getDays = function(){

			var days = dateDiff($scope.event.start_date,$scope.event.end_date);

			$scope.event.days = days;
			$scope.event.nights = (days-1);

			$scope.displayDates();
			$scope.getExepenses();

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get User
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getUser = function(id){

			if ($scope.users[id]){
				
				if (!$scope.users[id].name){
					$scope.users[id].name = '--&nbsp;--';
				}

				return $scope.users[id];

			} else {

				return {name: 'Removed User',email: 'gone@wambl.com'};

			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Is Current User
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.isCurrentUser = function(user){

			if (user.invitee_id == current_user.id){
				return false;
			} else {
				return true;
			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Route
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getRoute = function(){
			JP('Get Route');

			var request = {
			  origin: $scope.start_location,
			  destination: $scope.event.location,
			  travelMode: google.maps.TravelMode.DRIVING
			};
			JP(1);

			$scope.directionsService.route(request,function(data,status){
				if (status == google.maps.DirectionsStatus.OK){
					$scope.directionsDisplay.setDirections(data);
				} else {
					$scope.directionsDisplay.setDirections(data);
				}
			});
			JP(2);
			$scope.directionsDisplay.setMap($scope.map);
			JP(3);
			var Invitation = new ApiModel({invitation: {start_location: $scope.start_location}});
			JP(4);
			Invitation.$save({type: 'invitations',id: $scope.myInvitation.id},function(data){
				JP('Invitation');
				JP({ttt: data});
			},function(data){
				JP('Invitation Error');
				JP({error: data});
			});
			JP(5);

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Submit Comment
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.submitComment = function(){

			var Comment = new ApiModel({comment: {body: $scope.newComment}});

			Comment.$create({type: 'events',id: $scope.params.id,extend: 'comments'},function(data){

				JP(data);
				$scope.newComment = null;
				//$scope.getComments();
				$scope.comments.unshift(data.comment);

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Set Autocomplete
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.setAutoComplete = function(){

			$('#invite_input').autocomplete({
				source: function(request,response){

					var matcher = new RegExp(request.term.toLowerCase());

					var matching = $.grep($scope.contacts,function(value){
						
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

					$('#invite_input').trigger('input');

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



		// Add Invitee
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.addInvitee = function(){
			$timeout(function(){

				if ($scope.invite){

					this.options = {
						invitation: {
							event_id: $scope.params.id,
							user_id: current_user.id,
							invitee_id: $scope.invite.id
						}
					};

					var Invite = new ApiModel(this.options);

				} else if (!$scope.invite && $scope.inviteDisplay) {

					if (emailValidate.test($scope.inviteDisplay)){

						$scope.invalidEmail = null;

						this.options = {
							invitation: {
								event_id: $scope.params.id,
								email: $scope.inviteDisplay
							}
						};

						var Invite = new ApiModel(this.options);

						$scope.newInvitee = null;
						$scope.invitee = null;

					} else {

						$scope.invalidEmail = 'Please use a valid email format';

					}

					$('#invite_input').trigger('input');

				}

				if (Invite){

					Invite.$create({type: 'invitations'},function(data){
						
						$scope.users[data.user.id] = data.user;
						$scope.invitations.unshift(data.invitation);
						angular.forEach($scope.contacts,function(val,i){

							if (val.id == data.user.id){
								$scope.contacts.splice(i,1);
							}

						});

						$scope.invite = null;
						$scope.inviteDisplay = null;

					},function(data){

						JP({error: data});
						$scope.invite = null;
						$scope.inviteDisplay = null;

					});

				}

			},10);
		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

}];