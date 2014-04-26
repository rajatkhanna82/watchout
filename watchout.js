// start slingin' some d3 here.

var width = 600;
var height = 600;
var scoreBoard = [{id:"high", text: "High score: ", score: 0},
            {id:"current", text: "Current score: ", score: 0},
            {id :"collisions", text: "Collisions: ", score: 0}];

var throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

var handleCollision = throttle(function(){
  //increase collision count
  //reset the current score
  //if (currentscore > highscore), set highscore
  scoreBoard[2]["score"] += 1;
  if (scoreBoard[1]["score"] > scoreBoard[0]["score"]){
    scoreBoard[0]["score"] = scoreBoard[1]["score"];
  }
  scoreBoard[1]["score"] = 0;
}, 400, {leading:false});

var drag = d3.behavior.drag()
  .on("drag", function(d,i) {
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    d3.select(this).attr("x", function(d){
        return d.x;
      })
    .attr("y", function(d){
        return d.y;
      });
});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var hero = svg.append("image")
  .data([{"x":width/2 ,"y":height/2}])
  .attr("class", "hero")
  .attr("x", function(d){return d.x;})
  .attr("y", function(d){return d.y;})
  .attr("xlink:href", "snowman.png")
  .attr("width", 50)
  .attr("height",40)
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
    var enemyX = parseInt(enemies[0][i].getAttribute("x"))+parseInt(enemies[0][i].getAttribute("width")/2);
    var enemyY = parseInt(enemies[0][i].getAttribute("y"))+parseInt(enemies[0][i].getAttribute("height")/2);
    var heroX = parseInt(hero.attr("x"))+parseInt(hero.attr("width")/2);
    var heroY = parseInt(hero.attr("y"))+parseInt(hero.attr("height")/2);
    var enemyRadius = parseInt(enemies[0][i].getAttribute("width"))/2;
    var heroRadius = parseInt(hero.attr("width"))/2;
    if ( Math.abs(heroX-enemyX) < (enemyRadius+heroRadius) &&
      Math.abs(heroY-enemyY) < (enemyRadius+heroRadius)){
        //score resets or something happens
      handleCollision();
      console.log("collision detected!", i);
    }
  }
  scoreBoard[1]["score"] += 1;
};

var deg = 0;
var update = function(enemydata){
  //datajoin
  deg += 180;
  var enemy = svg.selectAll(".enemy")
    .data(enemydata, function(d){return d.id;});

  //update
  enemy.classed("rotate", true).transition()
    .duration(1000)
    .attr("x", function(d){ return d.x;})
    .attr("y", function(d){ return d.y;})
    .each("end", function(){
      d3.select(this).classed("rotate", false);
    });

  //enter
  enemy.enter().append("svg:image")
    .attr("class", "enemy")
    .attr("x", function(d){ return d.x;})
    .attr("y", function(d){ return d.y;})
    .attr("xlink:href", "shuriken.png")
    .attr("width", 60)
    .attr("height",60);

  //exit

};

var updateScoreBoard = function(){
  var scoreBoardSelector = d3.selectAll(".scoreboard").selectAll("div")
    .data(scoreBoard, function(d){return (d && d.id)|| d3.select(this).attr("id") ;});

  scoreBoardSelector.attr("id", function(d){ return d.id;})
    .text( function(d){ return d["text"];})
    .append("span")
    .text( function(d){ return d["score"];});
}

//initial setup
update(randomLocations(10));

//interval after initial
setInterval(function(){
  update(randomLocations(10));
}, 2000);

setInterval(function(){
  updateScoreBoard();
}, 100);

setInterval(checkCollisions, 50);
