var EventCtrl = ['$scope','$routeParams','$location','$route','ApiModel','$timeout',
	function($scope,$routeParams,$location,$route,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.current_user = current_user;

		$scope.map;
		$scope.mapOptions;
		$scope.marker;
		$scope.geocoder = new google.maps.Geocoder();
		$scope.directionsService = new google.maps.DirectionsService();
		$scope.directionsDisplay;
		$scope.geoLocation;
		$scope.locationFound = false;
		$scope.etab = {};
		$scope.etab.people = 'selected';
		$scope.instagrams = [];

		$scope.changeTab = function(tab){

			$scope.etab = {};
			$scope.etab[tab] = 'selected';

		};

		$scope.showMap = function(){

			$timeout(function(){$scope.geocode($scope.event.location);},0);

		};

		$scope.getEvent = function(){

			this.options = {
				type: 'events',
				id: $scope.params.id
			};

			ApiModel.get(this.options,function(data){

				$scope.event = data.event;
				$scope.event.from = new Date(Date.parse(data.event.start_date));
				$scope.event.to = new Date(Date.parse(data.event.end_date));
				$scope.event.hashtag = 'wambl';
				$scope.geocode(data.event.location);
				$scope.getInstagram($scope.event.hashtag);

			});

		};
		$scope.getEvent();


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
				//$scope.getRoute();
				//$scope.locationFound = true;   
			}

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////



		// Get Instagram Tag
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$scope.getInstagram = function(tag){

			this.options = {
				type: 'instagram',
				extend: tag
			};

			ApiModel.query(this.options,function(data){

				$scope.instagrams = data.body.data;

			});

		};
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////

}];