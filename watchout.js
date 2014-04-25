// start slingin' some d3 here.

var width = 600;
var height = 600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");


function updateEnemies(data){
  //datajoin
  var enemy = svg.selectAll(".enemy")
    .data(data, function(d){return d.id;});

  //update
  enemy.transition()
    .duration(500)
    .attr("cx", function(d){ return d.x;})
    .attr("cy", function(d){ return d.y;})
    .attr("r", 10);

  //enter
  enemy.enter().append("svg:circle")
    .attr("class", "enemy")
    .attr("cx", function(d){ return d.x;})
    .attr("cy", function(d){ return d.y;})
    .attr("r", 10);

  //exit

}

function randomLocations(n){
  var locArr = [];
  for (var i=0; i<n; i++){
    locArr.push({
      x: Math.random()*width,
      y: Math.random()*height,
      id: i
    });
  }
  return locArr;
}

setInterval(function(){
  updateEnemies(randomLocations(5));
}, 2000);




































