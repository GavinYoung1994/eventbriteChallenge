window.app = angular.module("EBApp",[]);

//linking google chart to the app
google.load('visualization', '1', {
  packages: ['corechart']
});

//binding the html file with the angular app
google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['EBApp']);
});

//A factory to request data of popular events from the backend
app.factory("dataFactory", function($http){
	return {
		getEvents: function(page){
			return $http.get('/data/'+page)
				.then(function(res){
					if(res){
						//If there is a response, format data in the way that can make a chart
						var data_array = [['ID', 'Date', 'Start Hour', 'Name']];
						for (var i = 0; i < res.data.length; i++) {
							var date = new Date(res.data[i].start.local.substring(0,10));
							var time = parseInt(res.data[i].start.local.substring(11,13));
							var current = new Date(new Date().toJSON().slice(0,10));
							if(date>current){
								//each bubble on the chart will have the url, name, date, and time of the event
								data_array.push([res.data[i].url,date,time,res.data[i].name.text])
							}
						};
						return data_array;
					}
				})
		}
	}
})

//the controller that draws the chart
app.controller('chartCtrl', function ($scope, dataFactory){
	//loading variable to determine if the web is loading or not
	$scope.loading = true;
	//page variable to determine which page the user is on right now
	$scope.currentPage = 1;
	function drawChart(page) {
		  dataFactory.getEvents(page)
		  .then(function(res){
			$scope.data_array = res;
			$scope.loading = false;
		  })
		  .then(function(){
	          var data = google.visualization.arrayToDataTable($scope.data_array);
	          //specifying several options of the chart
	          var options = {
	            colorAxis: {colors: ['yellow', 'red']},
	            bubble: {
	            	textStyle: {
	            		fontSize: 0.1
	            	}
	            },
	            legend: {
	            	position: 'none'
	            },
	            animation:{
	            	startup: true,
	            	duration: 800
	            },
	            title: "Popular events",
	            titleTextStyle: {
	            	fontSize: 20
	            },
	            hAxis:{
	            	title: "Date"
	            },
	            vAxis: {
	            	direction: -1,
	            	title: "Start Hour"
	            },
	            width: window.width,
	            height: window.height,
	            chartArea: {
	            	width: "80%",
	            	height: "80%"
	            }
	          };

	          var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
	          chart.draw(data, options);

	          //creating a click function so that when the user clicks on a bubble, it takes the user to
	          //the event page on Eventbrite
	          google.visualization.events.addListener(chart, 'select', selectEvent);
	          function selectEvent(){
				  var selectedItem = chart.getSelection()[0];
		          if (selectedItem) {
		            var topping = data.getValue(selectedItem.row, 0);
		            var win = window.open(topping, '_blank');
					win.focus();
		          }
	          }
		  })
      }
      drawChart(1);

      //functions for going to next page and previous page of popular events
      $scope.next = function(){
      	$scope.loading = true;
      	drawChart($scope.currentPage+1);
      	$scope.currentPage=$scope.currentPage+1;
      }
      $scope.previous = function(){
      	if($scope.currentPage!=1){
	      	$scope.loading = true;
	      	drawChart($scope.currentPage-1);
	      	$scope.currentPage=$scope.currentPage-1;
	      }
      }
})

