const EXAMPLE_ECHART = `<!DOCTYPE html>
<html>
<head>
  <title>ECharts Example</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.2.2/dist/echarts.min.js"></script>
</head>
<body>
  <div id="chartContainer" style="width: 600px; height: 400px;"></div>

  <script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartContainer'));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts Example'
      },
      tooltip: {},
      xAxis: {
        data: ['A', 'B', 'C', 'D', 'E', 'F']
      },
      yAxis: {},
      series: [{
        name: 'Sample Data',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  </script>
</body>
</html>`
const EXAMPLE_抽奖 = `


<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Lottery Grid</title>

    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

    <style>

        .lottery-grid {

            display: grid;

            grid-template-columns: repeat(3, 1fr);

            gap: 0.5rem;

            max-width: 300px;

            margin: 2rem auto;

            padding: 1rem;

            background-color: #FFFAF0;

            border-radius: 1rem;

            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        }

        .lottery-item {

            display: flex;

            align-items: center;

            justify-content: center;

            height: 80px;

            background-color: #FEFCE8;

            border-radius: 0.5rem;

            font-weight: bold;

            cursor: pointer;

            transition: background-color 0.5s;

        }

        .lottery-button {

            grid-column: 2;

            background-color: #FDBA74;

            color: white;

            border-radius: 9999px;

            height: 80px;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

        }

        .active {

            background-color: #FDE68A;

            animation: marquee 0.5s infinite alternate;

        }

        @keyframes marquee {

            from {

                background-color: #FEF3C7;

            }

            to {

                background-color: #FDE68A;

            }

        }

    </style>

</head>

<body class="bg-white">
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<p>
  <i class="fa fa-shopping-cart"></i>
</p>

<p>
  <i class="fa fa-leaf fa-2x style1 "></i>
</p>
<!-- Sizes:  lg 2x 5x-->
    <div class="lottery-grid">

        <div class="lottery-item">¥10</div>

        <div class="lottery-item">¥5</div>

        <div class="lottery-item">¥50</div>

        <div class="lottery-item">¥30</div>

        <div class="lottery-button">抽奖</div>

        <div class="lottery-item">¥100</div>

        <div class="lottery-item">感谢参与</div>

        <div class="lottery-item">谢谢参与</div>

        <div class="lottery-item">再试一次</div>
        <img src="https://images.wondershare.com/images-2024/home/online-pro-virtulook.png" class="img-fluid" alt="virtulook">

    </div>

    <script>

        const lotteryButton = document.querySelector('.lottery-button');

        const lotteryItems = document.querySelectorAll('.lottery-item');

        let activeIndex = 0;

        let interval;

        lotteryButton.addEventListener('click', () => {

            clearInterval(interval);

            activeIndex = 0;

            interval = setInterval(() => {

                lotteryItems.forEach(item => item.classList.remove('active'));

                lotteryItems[activeIndex].classList.add('active');

                activeIndex = (activeIndex + 1) % lotteryItems.length;

            }, 500);

            setTimeout(() => {

                clearInterval(interval);

                const resultIndex = Math.floor(Math.random() * lotteryItems.length);

                lotteryItems.forEach(item => item.classList.remove('active'));

                lotteryItems[resultIndex].classList.add('active');

            }, 5000);

        });

    </script>

</body>

</html>
`
const EXAMPLE_HIT = `
<!DOCTYPE html>
<html>
<head>
  <title>Heatmap Example</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <svg id="heatmapChart" width="400" height="300"></svg>

  <script>
    var data = [
      [0, 0, 5], [1, 0, 10], [2, 0, 15],
      [0, 1, 20], [1, 1, 25], [2, 1, 30],
      [0, 2, 35], [1, 2, 40], [2, 2, 45]
    ];

    var width = 400;
    var height = 300;

    var colorScale = d3.scaleSequential()
      .domain(d3.extent(data, function(d) { return d[2]; }))
      .interpolator(d3.interpolateViridis);

    var svg = d3.select("#heatmapChart");

    var rects = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return d[0] * (width / 3); })
      .attr("y", function(d) { return d[1] * (height / 3); })
      .attr("width", width / 3)
      .attr("height", height / 3)
      .style("fill", function(d) { return colorScale(d[2]); });

  </script>
</body>
</html>
`
export {
  EXAMPLE_抽奖,
  EXAMPLE_ECHART,
  EXAMPLE_HIT
}
