// start slingin' some d3 here.

var width = 600;
var height = 600;

var drag = d3.behavior.drag()
  .on("drag", function(d,i) {
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    d3.select(this).attr("cx", function(d){
        return d.x;
      })
    .attr("cy", function(d){
        return d.y;
      });
});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var hero = svg.append("circle")
  .data([{"x":width/2 ,"y":height/2}])
  .attr("class", "hero")
  .attr("fill", "orange")
  .attr("cx", function(d){return d.x;})
  .attr("cy", function(d){return d.y;})
  .attr("r", 10)
  .call(drag);


var randomLocations = function(n){
  var locArr = [];
  for (var i=0; i<n; i++){
    locArr.push({
      x: Math.random()*width,
      y: Math.random()*height,
      id: i
    });
  }
  return locArr;
};

var checkCollisions = function(){
  var enemies = svg.selectAll(".enemy");
  for (var i=0; i<enemies[0].length; i++){
    var enemyX = parseInt(enemies[0][i].getAttribute("cx"));
    var enemyY = parseInt(enemies[0][i].getAttribute("cy"));
    var heroX = parseInt(hero.attr("cx"));
    var heroY = parseInt(hero.attr("cy"));
    var enemyRadius = parseInt(enemies[0][i].getAttribute("r"));
    var heroRadius = parseInt(hero.attr("r"));
    if ( Math.abs(heroX-enemyX) < (enemyRadius+heroRadius) &&
      Math.abs(heroY-enemyY) < (enemyRadius+heroRadius)){
        //score resets or something happens
      console.log("collision detected!");
    }
  }
};

var update = function(enemydata){
  //datajoin
  var enemy = svg.selectAll(".enemy")
    .data(enemydata, function(d){return d.id;});

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

};


update(randomLocations(5));

setInterval(function(){
  update(randomLocations(5));
}, 2000);

setInterval(checkCollisions, 100);


































