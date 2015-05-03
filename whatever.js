
var globalresults = 2;
var globalrank = 99;
var globalfile = 99;

function drawtitle(){
	var append = d3.select("#title")
				   .append("svg:text")
				   .attr("x",0)
				   .attr("y",0)
				   .text("Instructions: ")
				   .attr("fill", "black")
				   .attr("font-family","sans-serif")
				   .attr("font-size","40px")
				   ;
	var title = d3.select("#title")
				  .append("text")
				  .text("Click on a square to view the probability of moves of a knight from that square.  Click on any hi-lighted square to clear the selection.  Below the interactive board, you can see the move probabilities for two famous grandmasters.")
				  .attr("font-family","sans-serif")
				  .attr("font-size","40px");
}

// Data Loading etc.
var dataArray = new Array();
var carlsenArray = new Array();
var fischerArray = new Array();

var datareader = d3.csv("moves2.csv", function(d){
	return {
		'turn' : +d.turn,
		'from_rank' : +d.fromRank,
		'from_file' : +d.fromFile,
		'to_rank' : +d.toRank,
		'to_file' : +d.toFile,
		'timespent' : +d.timeSpent,
		'rating' : +d.ELO,
		'win' : +d.win
	};
}, function(error, rows) {
  dataArray = rows;});
// reads data for Magnussen's games
var carlsenreader = d3.csv("carlsen.csv", function(d){
	return {
		'turn' : +d.turn,
		'from_rank' : +d.fromRank,
		'from_file' : +d.fromFile,
		'to_rank' : +d.toRank,
		'to_file' : +d.toFile,
		'timespent' : +d.timeSpent,
		'win' : +d.win
	};
}, function(error, rows) {
  carlsenArray = rows;});
// reads data for Fischer's games
var fischerreader = d3.csv("fischer.csv", function(d){
	return {
		'turn' : +d.turn,
		'from_rank' : +d.fromRank,
		'from_file' : +d.fromFile,
		'to_rank' : +d.toRank,
		'to_file' : +d.toFile,
		'timespent' : +d.timeSpent,
		'win' : +d.win
	};
}, function(error, rows) {
  fischerArray = rows;});

 // compute empirical probabilities for given to_rank,to_file, from_rank,from_file, and data source.
function probability(trank,tfile,frank,ffile,thedata){
	var count = 0
	var total = 0
	for (i = 0; i < thedata.length; i++){
		if((thedata[i].from_rank == frank) && (thedata[i].from_file == ffile)){
			total += 1
			if((thedata[i].to_rank == trank) && (thedata[i].to_file == tfile)){
				count += 1
			}
		}
	}
	if (total > 0){
		return (count/total);
	}
	else{
		return 0;
	}
}
// checks for legal moves
function islegalmove(trank,tfile,frank,ffile){
	var v2h1 = (Math.abs(trank - frank) == 2 && Math.abs(tfile - ffile) == 1);
	var v1h2 = (Math.abs(trank - frank) == 1 && Math.abs(tfile - ffile) == 2);
	return (v2h1 || v1h2);
}

function filterbylegalmoves(dataArray,frank,ffile){
	return _.filter(dataArray, function(d){return islegalmove(d.to_rank,d.to_file,frank,ffile);});
}

function ranktolabel(rank){
	return (8 - rank);
}
// used to draw labels
var filetolabel = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f', 6:'g', 7:'h'};

// 

function updateData(newresults){
	globalresults = newresults;
	d3.selectAll("svg").remove();
	drawmainboard(globalrank,globalfile,globalresults);
	drawFischer(globalrank,globalfile);
	drawCarlsen(globalrank,globalfile);
}

// the main board function
function drawmainboard(from_rank,from_file,allowedresults){
	var boardData = processData(480, from_rank,from_file,allowedresults);

	var grid = d3.select("#chart").append("svg")
					.attr("width", 600)
					.attr("height", 600)
					.attr("x",0)
					.attr("y",0)
					.attr("class", "chart");

	var row = grid.selectAll(".row")
				  .data(boardData)
				.enter().append("svg:g")
				  .attr("class", "row");

	var col = row.selectAll(".cell")
				 .data(function (d) { return d; })
				.enter().append("svg:g")
				.append("rect")
				 .attr("class", "cell")
				 .attr("rank", function(d){ return d.rank})
				 .attr("file",function(d){return d.file})
				 .attr("x", function(d) { return d.x; })
				 .attr("y", function(d) { return d.y; })
				 .attr("width", function(d) { return d.width; })
				 .attr("height", function(d) { return d.height; })
				 .property("clicked",function(d){
				 						if((d.file === from_file) && (d.rank === from_rank) || 
				 						islegalmove(d.rank,d.file,from_rank,from_file)){
				 							return true}
				 						else{
				 							return false}
				 						})
				 .on('mouseover', function() {
					if(!(d3.select(this).property("clicked"))){
						d3.select(this)
						.style('fill', '#0FE6CA');
					}
				 })
				 .on('mouseout', function() {
				 	if(!(d3.select(this).property("clicked"))){
						d3.select(this)
							.style('fill', function(d){
									if((d.file%2===0) && (d.rank%2===0) ||
										(d.file%2===1) && (d.rank%2===1)){
										return "#E8DDCB";
									}
									else{
										return "#CDB380";
									}});}})
				 .on('click', function(d) {	globaltest = "THIS TEST SUCCEEDED"
				 							if(d3.select(this).property("clicked")){
				 								d3.selectAll("svg").remove();
				 								drawmainboard(99,99,globalresults);
				 								drawFischer(99,99);
												drawCarlsen(99,99);
				 							} else {
				 								d3.selectAll("svg").remove();
				 								globalrank = d.rank;
				 								globalfile = d.file;
				 								drawmainboard(globalrank,globalfile,globalresults);
				 								drawFischer(globalrank,globalfile);
												drawCarlsen(globalrank,globalfile);}})

				 .style("fill", function(d){
				 					if((d.file === from_file) && (d.rank === from_rank)){
				 						return "#036564";
				 					} else if(islegalmove(d.rank,d.file,from_rank,from_file)){
				 						return "#033649";
				 					} else {
									if((d.file%2===0) && (d.rank%2===0) ||
										(d.file%2===1) && (d.rank%2===1)){
										return "#E8DDCB";
									}
									else{
										return "#CDB380";
									} }
				 })
				 .style("stroke", '#555');
				 
	var labels = row.selectAll("g")
					.append("text")
					.attr("x",function(d){return d.x})
					.attr("y",function(d){return d.y})
					.attr("dy","1.5em")
					.attr("dx","0.3em")
					.text(function(d){
						if(islegalmove(d.rank,d.file,from_rank,from_file)){
							return ""+d.prob.toFixed(2);
						}
						})
					.attr("fill","white")
					.attr("font-family","sans-serif")
					.attr("font-size","25px");
	var Ranklabels = row.selectAll("g")
					  .append("text")
					  .attr("x",function(d){return d.x})
					  .attr("y",function(d){return d.y})
					  .attr("dy","2.25em")
					  .attr("dx","-2em")
					  .text(function(d){
					  	if(d.file == 0){
					  		return ""+ranktolabel(d.rank);
					  	} else {
					  		return "";
					  	}
					  })
					  .attr("font-family","sans-serif")
					  .attr("font-size","20px");
	var Filelabels = row.selectAll("g")
					  .append("text")
					  .attr("x",function(d){return d.x})
					  .attr("y",function(d){return d.y})
					  .attr("dy","4.5em")
					  .attr("dx","1.3em")
					  .text(function(d){
					  	if(d.rank == 7){
					  		return filetolabel[d.file];
					  	} else {
					  		return "";
					  	}
					  })
					  .attr("font-family","sans-serif")
					  .attr("font-size","20px")
	var Title = row.select("g")
						.append("text")
						.attr("x",0)
						.attr("y",30)
						.text(function(d){return "Move Probabilities for Knights"})
						.attr("font-family","sans-serif")
						.attr("font-size","30px");	
}
// Function to draw a board using either Carlsen or Fischer data
function drawFischer(from_rank,from_file){
	var fischerData = processGMData(230,0,50,fischerArray,from_rank,from_file);
	var fischerGrid = d3.select("#fischer").append("svg")
						.attr("width",30000)
						.attr("height",400)
						.attr("x",100)
						.attr("y",100)
						.attr("class","chart");

	var testRect = fischerGrid.select("body")
					.append("rect")
					.attr("width",800)
					.attr("height",800)
					.attr("x",200)
					.attr("y",200)
					.style("fill","black");
						

	var fischerRow = fischerGrid.selectAll(".row")
						.data(fischerData)
						.enter().append("svg:g")
						.attr("class","row");

	var fischercol = fischerRow.selectAll(".cell")
				 .data(function (d) { return d; })
				.enter().append("svg:g")
				.append("rect")
				 .attr("class", "cell")
				 .attr("rank", function(d){ return d.rank})
				 .attr("file",function(d){return d.file})
				 .attr("x", function(d) { return d.x; })
				 .attr("y", function(d) { return d.y; })
				 .attr("width", function(d) { return d.width; })
				 .attr("height", function(d) { return d.height; })
				 .property("clicked",function(d){
				 						if((d.file === from_file) && (d.rank === from_rank) || 
				 						islegalmove(d.rank,d.file,from_rank,from_file)){
				 							return true}
				 						else{
				 							return false}
				 						})
				 .style("fill", function(d){
				 					if((d.file === from_file) && (d.rank === from_rank)){
				 						return "#036564";
				 					} else if(islegalmove(d.rank,d.file,from_rank,from_file)){
				 						return "#033649";
				 					} else {
									if((d.file%2===0) && (d.rank%2===0) ||
										(d.file%2===1) && (d.rank%2===1)){
										return "#E8DDCB";
									}
									else{
										return "#CDB380";
									} }
				 })
				 .style("stroke", '#555');
				 
		var labels = fischerRow.selectAll("g")
					.append("text")
					.attr("x",function(d){return d.x})
					.attr("y",function(d){return d.y})
					.attr("dy","1.5em")
					.attr("dx","0.3em")
					.text(function(d){
						if(islegalmove(d.rank,d.file,from_rank,from_file)){
							return ""+d.prob.toFixed(2);
						}
						})
					.attr("fill","white")
					.attr("font-family","sans-serif")
					.attr("font-size","12px");

		var fischerTitle = fischerRow.selectAll("g")
								  .append("text")
								  .attr("x",0)
								  .attr("y",30)
								  .text(function(d){return "Bobby Fischer's Move Probabilities"})
								  .attr("font-family","sans-serif")
								  .attr("font-size","15px");
}

function drawCarlsen(from_rank,from_file){
	var carlsenData = processGMData(230,0,50,carlsenArray,from_rank,from_file);
	var carlsenGrid = d3.select("#carlsen").append("svg")
						.attr("width",30000)
						.attr("height",400)
						.attr("x",100)
						.attr("y",100)
						.attr("class","chart");
						
	var carlsenRow = carlsenGrid.selectAll(".row")
						.data(carlsenData)
						.enter().append("svg:g")
						.attr("class","row");

	var carlsencol = carlsenRow.selectAll(".cell")
				 .data(function (d) { return d; })
				.enter().append("svg:g")
				.append("rect")
				 .attr("class", "cell")
				 .attr("rank", function(d){ return d.rank})
				 .attr("file",function(d){return d.file})
				 .attr("x", function(d) { return d.x; })
				 .attr("y", function(d) { return d.y; })
				 .attr("width", function(d) { return d.width; })
				 .attr("height", function(d) { return d.height; })
				 .property("clicked",function(d){
				 						if((d.file === from_file) && (d.rank === from_rank) || 
				 						islegalmove(d.rank,d.file,from_rank,from_file)){
				 							return true}
				 						else{
				 							return false}
				 						})
				 .style("fill", function(d){
				 					if((d.file === from_file) && (d.rank === from_rank)){
				 						return "#036564";
				 					} else if(islegalmove(d.rank,d.file,from_rank,from_file)){
				 						return "#033649";
				 					} else {
									if((d.file%2===0) && (d.rank%2===0) ||
										(d.file%2===1) && (d.rank%2===1)){
										return "#E8DDCB";
									}
									else{
										return "#CDB380";
									} }
				 })
				 .style("stroke", '#555');
				 
		var labels = carlsenRow.selectAll("g")
					.append("text")
					.attr("x",function(d){return d.x})
					.attr("y",function(d){return d.y})
					.attr("dy","1.5em")
					.attr("dx","0.3em")
					.text(function(d){
						if(islegalmove(d.rank,d.file,from_rank,from_file)){
							return ""+d.prob.toFixed(2);
						}
						})
					.attr("fill","white")
					.attr("font-family","sans-serif")
					.attr("font-size","12px");

		var carlsenTitle = carlsenRow.selectAll("g")
								  .append("text")
								  .attr("x",0)
								  .attr("y",30)
								  .text(function(d){return "Magnus Carlsen's Move Probabilities"})
								  .attr("font-family","sans-serif")
								  .attr("font-size","15px");
}

function processData(gridWidth,from_rank,from_file,allowedresults){
	var data = new Array();
	var gridItemWidth = gridWidth/8;
	var gridItemHeight = gridWidth/8;
	var startX = gridWidth/8;
	var startY = gridWidth/8;
	var stepX = gridItemWidth;
	var stepY = gridItemHeight;
	var xpos = startX;
	var ypos = startY;
	var subset1 = filterbylegalmoves(dataArray,from_rank,from_file);
			var subset = new Array()
			if(allowedresults == 0){
				console.log("something works");
				subset = _.filter(subset1,function(d){return (d.win == 0);});
			} else if(allowedresults == 1){
				console.log("something else works");
				subset = _.filter(subset1,function(d){return (d.win == 1);});
			} else {
				subset = subset1;
			}
	for (var rank = 0; rank < 8; rank++){
		data.push(new Array());
		for(var file = 0; file < 8; file++){
/* 			 */
			if(rank == from_rank && file == from_file){
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos
								});
			} else if(islegalmove(rank,file,from_rank,from_file)){
				var tempprob = probability(rank,file,from_rank,from_file,subset);
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos,
								prob: tempprob
								});
			} else {
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos
								});}
			xpos += stepX;
		}
		xpos = startX;
		ypos += stepY;
	}
	return data;
}

function processGMData(gridWidth,xoffset,yoffset,datasource,from_rank,from_file){
	var data = new Array();
	var gridItemWidth = gridWidth/8;
	var gridItemHeight = gridWidth/8;
	var startX = xoffset;
	var startY = yoffset;
	var stepX = gridItemWidth;
	var stepY = gridItemHeight;
	var xpos = startX;
	var ypos = startY;

	for (var rank = 0; rank < 8; rank++){
		data.push(new Array());
		for(var file = 0; file < 8; file++){
			var subset1 = filterbylegalmoves(datasource,from_rank,from_file);
			var subset = _.filter(subset1,function(d){return (d.win == 0);})
			if(rank == from_rank && file == from_file){
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos
								});
			} else if(islegalmove(rank,file,from_rank,from_file)){
				var tempprob = probability(rank,file,from_rank,from_file,datasource);
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos,
								prob: tempprob
								});
			} else {
				data[rank].push({rank: rank,
								file: file,
								width: gridItemWidth,
								height: gridItemHeight,
								x: xpos,
								y: ypos
								});}
			xpos += stepX;
		}
		xpos = startX;
		ypos += stepY;
	}
	return data;
}