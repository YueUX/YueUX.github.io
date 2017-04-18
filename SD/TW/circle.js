//Data processing
var totalMessageCount = 0;
var totalStageNo = data.totalStageCount;
for(var i = 0;i < data.days.length;i ++)
{ 
	var thisDay = data.days[i];
	for(var j = 0;j < thisDay.messages.length;j ++)
	{
		thisDay.messages[j].messagesNo = totalMessageCount;
		thisDay.messages[j].key = thisDay.totalDayNo + "_" + j;
		thisDay.messages[j].stageNo = thisDay.stageNo;
		totalMessageCount ++;
	}
}


//Constants
var totalHeight = 450, totalWidth = 1000;
var margin = {top: 20, right:10, left:10, bottom:20};
var radius = 5,svgWidth = totalWidth - margin.left - margin.right, svgHeight = totalHeight - margin.top - margin.bottom;
var tickNum = 12;
var transitionTime = 300, defaultTransitionTime = 300;
var scaleRatio = 0.3;
var singleViewMargin = getSingleViewMargin();





//Set up svg
var svg = d3.select("svg")
.attr("height",totalHeight)
.attr("width",totalWidth)
.append("g")
.attr("id","backCanvas")
.attr("transform","translate("+margin.left+","+margin.top+")");

//Set Scale
var x = d3.scale.linear()
.range([0,svgWidth-2*radius - 2*singleViewMargin.left])
.domain([0,tickNum]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(tickNum)
.tickFormat(function(d){return d*2 + ":00";});

var radiusScale = d3.scale.linear()
.range([1,2*radius])
.domain([0,200]);

//create canvas for each stage
for(var createAxisIndex = 0;createAxisIndex < totalStageNo;createAxisIndex ++)
{
	var axisCanvas = svg.append("g")
	.attr("class","axisCanvas")
	.attr("transform","translate("+singleViewMargin.left+",0)");

	//create Background white
	axisCanvas.append("rect")
	.attr("class","backgroundRect")
	.attr("height",svgHeight)
	.attr("width",x(tickNum));


	//create Axis
	axisCanvas.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0,"+svgHeight+")")
	.call(xAxis);

	for(var i = 0 ;i < tickNum+1;i ++)
	{
		var thisLine = axisCanvas.append("line")
		.attr("x1",x(i))
		.attr("x2",x(i))				
		.attr("y2",svgHeight);				

		if(i == 0 || i == tickNum)
		{
			thisLine.attr("class","verticalLine edge");
			thisLine.attr("y1",0);
		}
		else
		{
			thisLine.attr("class","verticalLine middle");	
			thisLine.attr("y1",100);
		}
	}

}					


//Create the tooltip

// var toolTipG = svg.append("g");	
// 	toolTipG
// 	.attr("opacity",1);

// 	//var pos  = d3.mouse(document.getElementById("backCanvas"));	
	
// 	//toolTipG.attr("transform","translate("+pos[0]+","+pos[1]+")");
// 	var toolTipContainer = toolTipG
// 	.append("foreignObject")
// 	.attr("width",300)
// 	.attr("height",300)
// 	.append("xhtml:body")
// 	.append("div");

// 	toolTipContainer
// 	.attr("class","tooltip")
// 	.append("div")
// 	.attr("class","toolTipTime")
// 	.text("Time Goes here");

// 	toolTipContainer.append("div")
// 	.attr("class","toolTipContent")
// 	.text("Lorem non ullamcorper. Nulla non ligula lorem. Praesent porttitor, tellus nec suscipit aliquam, enim elit posuere lorem, at");
	






function displayNodes(messagesInput, isExpandLayout, positionDelay){
	positionDelay = positionDelay || 0; //make it 0 by default


	var a = 1;

	var messages = messagesInput;

	// messages.sort(function(a,b){
	// 	return a.time-b.time;
	// })

	messages = messages.map(function(d){
		var resradius = Math.min(radiusScale((d.length)),radiusScale(200));
		if(!isCulmulative)
		{
			resradius *= 2.6;
		}
		return {
			name:d.name, 
			x:x(d.time*tickNum),
			y:svgHeight - radiusScale(d.length), 
			radius: resradius,
			key:d.key,
			stageNo:d.stageNo,
			messagesNo:d.messagesNo,
			content:d.content,
			timeStamp:d.timeStamp
		};
	});

	// if(messages.length > 1)
	// {
	// 	messages = setLayout(messages);
	// }

	//Create Stages

	var stages = getStages(messages.slice(0));

	if(!isExpandLayout)
	{
		messages = setLayout2(messages,0);
	}
	else
	{
		var newMessages = [];
		for(var i = 0;i < stages.length;i ++)
			newMessages.push(setLayout2(stages[i].messages,0));
		messages = newMessages;
	}

	var stageGs = svg.selectAll(".stage")
	.data(stages,function(d){return d.key;});
	
	stageGs.exit()
	.attr("opacity",1) //Why I must set opacity equals 1 here?
	.transition()
	.duration(transitionTime)
	.attr("opacity",0)
	.remove();

	stageGs.enter()
	.append("g")
	.attr("class",function(d){return "stage stage"+d.key;}) // the class of stage1 will be "stage stage1"
	.attr("transform",function(d,i){
		if(isExpandLayout)				//This will support expand during the animation
		{
			return getExpanedTranslation(d.key);
		}
		else
		{
			return "translate("+singleViewMargin.left+",0)scale(1)";
		}
	});


	//stageGs = svg.selectAll(".stage");

	//Create circles
	var circles = stageGs.selectAll("circle")
	.data(function(d){return d.messages},function(d){return d.key});

	circles.exit()
	.transition()
	.duration(transitionTime)
	.attr("opacity",0)
	.remove();

	var newCircles = circles.enter()
	.append("circle")
	.attr("opacity",0);

	circles//stageGs.selectAll("circle")
	.attr("class",function(d){return d.name})
	.on("mouseover",mouseoverHandler)
	.on("mouseleave",mouseleaveHandler)
	.transition()
	.duration(1000)
	.attr("r",function(d){
			return d.radius;
	})
	.delay(function(d){return positionDelay;})
	.attr("cx",function(d){return d.x;})
	.attr("cy",function(d){return svgHeight - d.y;})
	.attr("opacity",1);
	

}







function updateText(day){
	d3.select("#stageCount")
	.text(day.stageNo);

	d3.select("#dayCount")
	.text(day.stageDayNo);

	d3.select("#totalDayCount")
	.text(day.totalDayNo);

	resetTopClassAttr();
	if(day.topM.length > 0)
	{
		addClassAttr(".sampleCircle."+day.topM,"topM");
	}
	if(day.topA.length > 0)
	{
		addClassAttr(".sampleCircle."+day.topA,"topA");
	}
}

function addClassAttr(oldClass,appendClass)
{
	var classAttr = d3.selectAll(oldClass).attr("class");
	classAttr = classAttr + " " + appendClass;
	d3.selectAll(oldClass).attr("class", classAttr);
}

function resetTopClassAttr()
{
	d3.selectAll(".sampleCircle")
	.each(function(){
		var thisElement = d3.select(this);
		var classAttr = thisElement.attr("class");
		classAttr = classAttr.replace(" topM","");
		classAttr = classAttr.replace(" topA","");
		thisElement.attr("class",classAttr);
	})
}


function removeAllNodes()
{
	d3.selectAll("circle")
	.transition()
	.duration(transitionTime)
	.attr("opacity",0)
	.remove();
}


var toolTipG = null;
//Events
function mouseoverHandler()
{
	toolTipG = svg.append("g")
	.style("pointer-events","none");	
	toolTipG
	.attr("opacity",0)
	.transition()
	.duration(transitionTime)
	.attr("opacity",1);

	var pos  = d3.mouse(document.getElementById("backCanvas"));	
	
	pos[0] = Math.min(svgWidth - 300,pos[0]);
	pos[1] = Math.min(svgHeight - 100,pos[1]);

	toolTipG.attr("transform","translate("+pos[0]+","+(pos[1])+")");
	var toolTipContainer = toolTipG
	.append("foreignObject")
	.attr("width",300)
	.attr("height",300)
	.append("xhtml:body")
	.append("div")
	
	var d = this.__data__;
	
	toolTipContainer
	.attr("class","tooltip")
	.append("div")
	.attr("class","toolTipTime")
	.text(d.timeStamp);
	
	toolTipContainer.append("div")
	.attr("class","toolTipContent")
	.text(d.content);
	

}

function mouseleaveHandler()
{
	if(toolTipG != null)
	{
		toolTipG
		.transition()
		.duration(transitionTime)
		.attr("opacity",0)
		.remove();
	}
}


//Layout

function setLayout(Data)
{
	for(var i = 1;i < Data.length;i ++)
		{
			var c = Data[i], p = Data[i - 1];
			if((c.x - p.x) < c.radius+p.radius)
			{
				c.y = p.y - (c.radius+p.radius);
			}
			else
			{
				c.y = svgHeight-c.radius;
			}
		}
	return Data;
}

function setLayout2(allNodes, startpoint)
{
	if(allNodes.length == 0)
		return allNodes;

	//sort by key so the sort is stable
	allNodes.sort(function(a,b){
		return a.messagesNo - b.messagesNo;
	})


	var previousNodes = null;
	for(var i = startpoint;i < allNodes.length;i ++)
	{
		var point = allNodes[i];
		previousNodes = allNodes.slice(0,i);
		
		var possibleConflicts = getPossibleConflicts(point,previousNodes);
		setLayoutForOne(point,possibleConflicts);		
	}
	return allNodes;
}

// var point = {x:0,y:0,radius:5}, conflicts=[{x:2,y:3,radius:3},{x:-1,y:7,radius:0.5},{x:-5,y:7,radius:0.5}];

// setLayoutForOne(point,getPossibleConflicts(point,conflicts));

// var a = point.y;

// console.log(point.y);

function getPossibleConflicts(point, previousNodes)
{
	var possibleConflicts = [];
	for(var i = 0;i < previousNodes.length;i ++)
	{
		var p = previousNodes[i];
		var xDistance = Math.abs(p.x-point.x);
		if(xDistance < p.radius + point.radius)
			possibleConflicts.push(p);
	}
	return possibleConflicts;
}


function setLayoutForOne(point, conflicts)
{
	conflicts.sort(function(a,b){return a.y - b.y});

	point.y = point.radius;
	while(1)
	{
		var conflictPoint = getConflictPoint(point,conflicts);
		if(conflictPoint == null)
		{
			break;
		}

		var targetDistance = point.radius + conflictPoint.radius;
		point.y = conflictPoint.y + Math.sqrt(Math.pow(targetDistance,2) - Math.pow((conflictPoint.x - point.x),2));
	}
}

function getConflictPoint(point, conflicts)
{
	for(var i =0;i<conflicts.length;i ++)
	{
		if(getDistance(point,conflicts[i]) < point.radius + conflicts[i].radius - 1)
		{
			return conflicts[i];
		}
	}
	return null;
}

function getDistance(a,b)
{
	var res = Math.sqrt(Math.pow((a.x - b.x),2) + Math.pow((a.y-b.y),2));
	return res;
}










function getStages(messages)
{
	var stages = [];
	if(messages.length == 0)
		return stages;
	messages.sort(function(a,b){
		return a.stageNo - b.stageNo;
	})

	var curStageNo = messages[0].stageNo, curMessageArray = [];
	for(var i = 0;i < messages.length;i ++)
	{
		var m = messages[i];
		if(m.stageNo != curStageNo)
		{
			var newStage = {messages: curMessageArray, key: curStageNo};
			stages.push(newStage);
			curStageNo = m.stageNo;
			curMessageArray=[];	
		}
		curMessageArray.push(m);
	}
	var newStage = {messages: curMessageArray, key: curStageNo};
	stages.push(newStage);
	return stages;
}



//Expand Control
var isExpanded=false;

function expandView()
{
	// var graphWidth = svgWidth / totalStageNo;
	// var graphHeight = svgHeight * scaleRatio;
	// var translatePos = [];
	// for(var i = 0;i < totalStageNo;i ++)
	// {
	// 	translatePos.push({x: i*graphWidth,y:(svgHeight - graphHeight)/2});
	// }

	var axisCanvases = d3.selectAll(".axisCanvas")
	.transition()
	.duration(1000)
	.attr("transform",function(d,i){
		return getExpanedTranslation(i + 1); // var pos = translatePos[i];
		// return "translate("+pos.x+","+pos.y+")scale("+scaleRatio+")";
	});

	var stageGs = d3.selectAll(".stage")
	.transition()
	.duration(1000)
	.attr("transform",function(d,i){
		return getExpanedTranslation(d.key);
		// var stageNo = d.key;
		// var pos = translatePos[stageNo-1];
		// return "translate("+pos.x+","+pos.y+")scale("+scaleRatio+")";
	})

	displayNodes(messagesPool,true,1000);
}

function collapseView()
{
	d3.selectAll(".axisCanvas")
	.transition()
	.duration(1000)
	.attr("transform","translate("+singleViewMargin.left+",0)scale(1)");
	
	d3.selectAll(".stage")
	.transition()
	.duration(1000)
	.attr("transform","translate("+singleViewMargin.left+",0)scale(1)");

	displayNodes(messagesPool,false);
}

function getExpanedTranslation(stageNo)
{
	var graphWidth = svgWidth / totalStageNo;
	var graphHeight = svgHeight * scaleRatio;
	var pos = {x: (stageNo-1)*graphWidth,y:(svgHeight - graphHeight)/2};
	return "translate("+pos.x+","+pos.y+")scale("+scaleRatio+")";
	
}

function getSingleViewMargin()
{
	var graphWidth = (svgWidth / totalStageNo) / scaleRatio;
	var res = (svgWidth - graphWidth)/2;
	return {left:res};
}



//AnimatinControl
var currentDayIndex = -1;
function prevDay(){
	if(currentDayIndex >= 0)
	{
		currentDayIndex --;
		updateDay();
	}
}

function nextDay(){
	if(currentDayIndex < data.days.length)
	{
		currentDayIndex ++;
		updateDay();
	}
}

var messagesPool = [], isCulmulative=true;

function updateDay(){
	if(currentDayIndex < data.days.length && currentDayIndex >= -1)
	{
		messagesPool = [];
		if(currentDayIndex >= 0)
		{
			if(isCulmulative)
			{
				var tDays = data.days.slice(0,currentDayIndex+1);
				for(var i = 0;i < tDays.length;i ++)
					messagesPool = messagesPool.concat(data.days[i].messages);
			}
			else
			{
				messagesPool = messagesPool.concat(data.days[currentDayIndex].messages);
			}
		}
		displayNodes(messagesPool,isExpanded);
		updateText(data.days[currentDayIndex]);
	}
}














var defaultTotalTimerCount = 60, totalTimerCount = defaultTotalTimerCount, currentTimerCount = 0;
var stopNow = false;

function globalAnimation()
{
	if(currentDayIndex >= data.days.length || stopNow)
	{
		stopNow = false;
		isPlaying = false;
		setPlayIcon(true);
		return true;
	}

	if(currentTimerCount < totalTimerCount)
	{
		currentTimerCount ++;
	}
	else
	{
		nextDay();
		currentTimerCount = 0;
	}

	d3.select("#timerCount").text(currentTimerCount);

}

function startAnimation()
{
	d3.timer(globalAnimation);
}

function stopAnimation()
{
	stopNow = true;
}

function resetAnimation()
{
	stopAnimation();
	removeAllNodes();
	currentTimerCount = 0;
	stopNow = false;
	currentDayIndex = -1;

	d3.select("#stageCount")
	.text(0);

	d3.select("#dayCount")
	.text(0);

	d3.select("#totalDayCount")
	.text(0);

	resetTopClassAttr();
}

var isPlaying = false;
function toggleStartStop(){
	setPlayIcon(isPlaying);
	if(isPlaying)
	{
		stopAnimation();
		
	}
	else
	{
		startAnimation();
		
	}
	isPlaying = !isPlaying;
}

function setPlayIcon(play)
{
	var thisElement = d3.select("#playButton img");
	if(play)
	{
		thisElement
		.attr("src","resources/play.png")
	}
	else
	{
		thisElement
		.attr("src","resources/pause.png")
	}
}

function changeSpeed(delta_ratio)
{
	transitionTime = defaultTransitionTime * (1-(+delta_ratio));
	totalTimerCount = defaultTotalTimerCount * (1-(+delta_ratio));
}


function setCumulative(newValue)
{
	isCulmulative = newValue;
	if(isCulmulative)
	{
		d3.select("#accumulativeButton")
		.attr("class","toggleButton modeButton highlighted");
		d3.select("#separateButton")
		.attr("class","toggleButton modeButton");
	}
	else
	{
		d3.select("#accumulativeButton")
		.attr("class","toggleButton modeButton");
		d3.select("#separateButton")
		.attr("class","toggleButton modeButton highlighted");
	}
	updateDay();
}
function toggleCumulative(){
	isCulmulative = !isCulmulative;
	if(isCulmulative)
	{
		d3.select("#accumulativeButton")
		.text("Accumulative");
	}
	else
	{
		d3.select("#accumulativeButton")
		.text("Separated");
	}
}


function toggleExpand(){
	isExpanded = !isExpanded;
	if(isExpanded)
	{
		expandView();
		d3.select("#expandButton")
		.text("Collapse");
	}
	else
	{
		collapseView();
		d3.select("#expandButton")
		.text("Expand");
	}
	
}











