var margin = {
    top: 50,
    right: 0,
    bottom: 100,
    left: 30
  },
  width1 = 960 - margin.left - margin.right,
  height1 = 650 - margin.top - margin.bottom,
  gridSize = Math.floor(width1 / 18),
  legendElementWidth = gridSize,
  buckets = 9,
  colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
  days = ["Benedetti", "Besaile", "Cepeda", "Duque", "Gaviria", "Navarro", "Robledo", "Uribe", "Valencia"],
  times = ["Benedetti", "Besaile", "Cepeda", "Duque", "Gaviria", "Navarro", "Robledo", "Uribe", "Valencia"];
datasets = ["data.tsv"];

var svg1 = d3.select("#chart1").append("svg")
  .attr("width", width1 + margin.left + margin.right)
  .attr("height", height1 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg1.selectAll(".dayLabel")
  .data(days)
  .enter().append("text")
  .text(function(d) {
    return d;
  })
  .attr("x", 25)
  .attr("y", function(d, i) {
    return i * gridSize;
  })
  .style("text-anchor", "end")
  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
  .attr("class", function(d, i) {
    return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
  });

var timeLabels = svg1.selectAll(".timeLabel")
  .data(times)
  .enter().append("text")
  .text(function(d) {
    return d;
  })
  .attr("x", function(d, i) {
    return (i * gridSize) + 50;
  })
  .attr("y", 0)
  .style("text-anchor", "middle")
  .attr("transform", "translate(" + gridSize / 2 + ", -6)")
  .attr("class", function(d, i) {
    return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
  });

var heatmapChart = function(tsvFile) {
  d3.tsv(tsvFile,
    function(d) {
      return {
        day: +d.day,
        hour: +d.hour,
        value: +d.value
      };
    },
    function(error, data) {
      var colorScale = d3.scale.quantile()
        .domain([22, buckets - 1, d3.max(data, function(d) {
          return d.value;
        })])
        .range(colors);

      var cards = svg1.selectAll(".hour")
        .data(data, function(d) {
          return d.day + ':' + d.hour;
        });

      cards.append("title");

      cards.enter().append("rect")
        .attr("x", function(d) {
          return (d.hour) * gridSize;
        })
        .attr("y", function(d) {
          return (d.day - 1) * gridSize;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

      cards.transition().duration(1000)
        .style("fill", function(d) {
          return colorScale(d.value);
        });

      cards.select("title").text(function(d) {
        return d.value;
      });

      cards.exit().remove();

      var legend = svg1.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) {
          return d;
        });

      legend.enter().append("g")
        .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) {
          return legendElementWidth * i;
        })
        .attr("y", height1)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) {
          return colors[i];
        });

      legend.append("text")
        .attr("class", "mono")
        .text(function(d) {
          return "≥ " + Math.round(d);
        })
        .attr("x", function(d, i) {
          return legendElementWidth * i;
        })
        .attr("y", height1 + gridSize);

      legend.exit().remove();

    });
};

heatmapChart(datasets[0]);
