RavenNG.directive('calendar',function(){
    return function(scope,element,attrs){

    	



    };
});
RavenNG.service('dataShare',function(){

	var tmp;

	var sendData = function(data){
		tmp = data;
	};
	var getData = function(){
		return tmp;
	};

});