window.app = angular.module("EBApp",[]);

google.load('visualization', '1', {
  packages: ['corechart']
});

google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['EBApp']);
});

app.factory("dataFactory", function($http){
	return {
		getEvents: function(page){
			return $http.get('/data/'+page)
				.then(function(res){
					if(res){
						var data_array = [['ID', 'Date', 'Start Hour', 'Name']];
						for (var i = 0; i < res.data.length; i++) {
							var date = new Date(res.data[i].start.local.substring(0,10));
							var time = parseInt(res.data[i].start.local.substring(11,13));
							var current = new Date(new Date().toJSON().slice(0,10));
							if(date>current){
								data_array.push([res.data[i].url,date,time,res.data[i].name.text])
							}
						};
						return data_array;
					}
				})
		}
	}
})

app.controller('chartCtrl', function ($scope, dataFactory){
	$scope.loading = true;
	$scope.currentPage = 1;
	function drawChart(page) {
		  dataFactory.getEvents(page)
		  .then(function(res){
			$scope.data_array = res;
			$scope.loading = false;
		  })
		  .then(function(){
	          var data = google.visualization.arrayToDataTable($scope.data_array);
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

