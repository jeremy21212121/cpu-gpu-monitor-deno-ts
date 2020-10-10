import getClientDependencies from "./getClientDependencies.ts";

const dependencies = await getClientDependencies();

const buildHtml = (
  labels: string[],
  chartData: number[][],
) =>
  `
<!doctype html>
<html>
<head>
	<title>CPU/GPU Temperature Graph</title>
	<script>
		${dependencies[0]}
	</script>
	<script>
		${dependencies[1]}
	</script>
	<style>
	canvas {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	</style>
</head>

<body>
	<div id="container" style="width: 75%;">
		<canvas id="canvas"></canvas>
	</div>

	<script>
		var color = Chart.helpers.color;
		var barChartData = {
			labels: ${JSON.stringify(labels)},
			datasets: [{
				label: 'CPU Temp',
				backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
				borderColor: window.chartColors.red,
				borderWidth: 1,
				data: ${JSON.stringify(chartData[0])}
			}, {
				label: 'GPU Temp',
				backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
				borderColor: window.chartColors.blue,
				borderWidth: 1,
				data: ${JSON.stringify(chartData[1])}
			}]

		};
		// returns HH:MM:SS string
		const getTime = (str) => { const d = new Date(str); return [d.getHours(),d.getMinutes(),d.getSeconds()].join(':'); }
    // parse date strings into date objects
    barChartData.labels = barChartData.labels.map(getTime);
		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myBar = new Chart(ctx, {
				type: 'bar',
				data: barChartData,
				options: {
					responsive: true,
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'CPU/GPU Temperatures'
					},
				}
			});

		};

	</script>
</body>

</html>

`;
export default buildHtml;
