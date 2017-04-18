var margin = {top: 20, right: 80, bottom: 30, left: 45},
    width = 1000 - margin.left - margin.right,
    height = 2300 - margin.top - margin.bottom;

var objectColor = "#9a6bad";
var exColor = "#71af54";
var chColor = "#64b1c3";
var jointColor = "#F05252";
var highlight = "#D1D1D4";
var normalColor = "#F3F2F4";

var header = [
    {"name":"OBJECT","group":1, "color" : objectColor, "x": 120, "y": 20},
    {"name":"EXAMINER","group":2, "color" : exColor, "x": 240, "y": 20},
    {"name":"CHILD","group":3, "color" : chColor, "x": 360, "y": 20},
    {"name":"OBJECT","group":4, "color" : objectColor, "x": 460, "y": 20}
  ];
var childNo = "24";
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);
var yMargin = 50;

var color = d3.scale.category10();
var lineHeight = 8;

var svg = d3.select(".info").append("svg")
      .attr("id", "childSvg")
      .attr("width", "90%")
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", "5%");


svgWidth = parseInt(svg.style("width").replace("px", ""));
gap1 = svgWidth * 0.05;
gap2 = svgWidth * 0.15; //wider gaps
lineMargin = parseInt(gap2 * 0.05);
barWidth = svgWidth * 0.11;

lineX2 = barWidth + gap2 - lineMargin;


header[0]["x"] = gap1 + (barWidth/2);
header[1]["x"] = gap1 + (3/2 * barWidth) + gap2;
header[2]["x"] = gap1 + (5/2 * barWidth) + 2 * gap2;
header[3]["x"] = gap1 + (7/2 * barWidth) + 3 * gap2;

function drawViz(childNo){
  //rect for the labels
  var labels = svg.append("g");
    labels.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", 50)
      .attr("fill", "black")
      .attr("id", "rectLabel");

    labels.selectAll(".text")
      .data(header)
      .enter().append("text")
      .attr("class", "text")
        .attr("dx", function(d){return d.x;})
        .attr("dy", function(d){return d.y;})
        .text(function(d){ return d.name })
        .style("fill", function(d){ return d.color})
        .style("font-weight", "bold")
        .style("font-size", "10pt")
        .style("text-anchor", "middle"); 

  //exObject
  var group = svg.append("g")
      .attr("transform", "translate(" + gap1 + ", 0)"); 
  //ex    
  var group2 = svg.append("g")
      .attr("transform", "translate(" + (gap1 + barWidth + gap2) + ", 0)"); 

  //ch
  var group3 = svg.append("g")
      .attr("transform", "translate(" + (gap1 + 2 * barWidth + 2 * gap2) + ", 0)"); 

  //chObject
  var group4 = svg.append("g")
      .attr("transform", "translate(" + (gap1 + 3 * barWidth + 3 * gap2) + ", 0)"); 



d3.json("json/test-modified-" + childNo + ".json", function(error, data) {
//d3.json("test-modified.json", function(error, data) {
  var realStart = data.duration[0].start;
  var realEnd = data.duration[0].end;
  var duration = parseInt(realEnd - realStart);

  var outline = svg.append("g")
    .attr("class", "outline");

  var newRect = outline.append("rect")
    .attr("x", 0)
    .attr("y", yMargin)
    .attr("width", "100%")
    .attr("height", duration * lineHeight)
    .attr("fill", "transparent")
    .attr("stroke-width", 0)
    .attr("stroke", "white")
    .attr("id", "rectLabel");


    var gaze = group.selectAll("gaze")
      .data(data.examiner)
      .enter().append("g")
          .attr("class", "gaze");

    var eObject = gaze.append("rect")
        .attr("class", "examiner-object")
        .attr("x", 0)
        .attr("y", function(d){return (d.start ) * lineHeight + yMargin;}) //starting y = normalized position
        .attr("width", barWidth)
        .attr("height", function(d){ return (d.end - d.start) * lineHeight;})
        .attr("fill", objectColor);

    var eObjectLine = gaze.append("line")
        .attr("x1", barWidth + lineMargin)
        .attr("y1", function(d){return arrowY(d);})
        .attr("x2", lineX2)
        .attr("y2", function(d){return arrowY(d);})
        .attr("stroke-width", 2)
        .attr("stroke", objectColor);

    var eObjectCircle = gaze.append("circle")
       .attr("cx", barWidth + lineMargin)
       .attr("cy", function(d){return arrowY(d);} )
       .attr("r", 4)
       .style("fill", objectColor);


    var eObjectJACircle = gaze.append("circle")
       .attr("cx", lineX2)
       .attr("cy", function(d){return arrowY(d);} )
       .attr("r", 4)
       .style("fill", objectColor);       

    normalObject(eObject);
    normalObject(eObjectLine);
    normalObject(eObjectCircle); 
    selectObject(eObjectJACircle); 

    var gaze2 = group2.selectAll("gaze")
      .data(data.examiner)
      .enter().append("g")
          .attr("class", "examiner");

    var exBar = gaze2.append("rect")
        .attr("class", "rect-gaze")
        .attr("x", 0)
        .attr("y", function(d){return d.start * lineHeight + yMargin;}) //starting y = normalized position
        .attr("width", barWidth)
        .attr("height", function(d){ return (d.end - d.start) * lineHeight;})
        .attr("fill", exColor);

    //examiner-child
    var ecLine = gaze2.append("line")
        .attr("x1", barWidth + lineMargin)
        .attr("y1", function(d){return arrowY(d);})
        .attr("x2", lineX2)
        .attr("y2", function(d){return arrowY(d);})
        .attr("stroke-width", 2)
        .attr("stroke", exColor);
        //.attr("stroke-dasharray", "6, 3");

    var ecCircle = gaze2.append("circle")
      .attr("cx", lineX2)
      .attr("cy", function(d){return arrowY(d);} )
      .attr("r", 4)
      .style("fill", function(d) {
        if (d.joint) {return jointColor}
        else {return exColor;} } );

     var gaze3 = group3.selectAll("gaze")
      .data(data.child)
      .enter().append("g")
          .attr("class", "child");

    var childBar = gaze3.append("rect")
        .attr("class", "rect-gaze")
        .attr("x", 0)
        .attr("y", function(d){return (d.start ) * lineHeight + yMargin;}) //starting y = normalized position
        .attr("width", barWidth)
        .attr("height", function(d){ return (d.end - d.start) * lineHeight;})
        .attr("fill",  chColor);

     //child-examiner
    var ceLine = gaze3.append("line")
        .attr("x1", -gap2 + lineMargin)
        .attr("y1", function(d){return arrowY(d);})
        .attr("x2", -lineMargin )
        .attr("y2", function(d){return arrowY(d);})
        .attr("stroke-width", 2)
        .attr("stroke", function(d){
          if (d.eye) {return jointColor} // for examiner
          else { return chColor};
        })

    var ceCircle = gaze3.append("circle")
      .attr("cx", "-14%")
      .attr("cy", function(d){return arrowY(d);} )
      .attr("r", 4)
      .style("fill", function(d) {
        if (d.joint) {return jointColor}
        else {return chColor;} } );


     //child-object
    var cObjectLine = gaze3.append("line")
        .attr("x1", barWidth + lineMargin)
        .attr("y1", function(d){return arrowY(d);})
        .attr("x2", lineX2)
        .attr("y2", function(d){return arrowY(d);})
        .attr("stroke-width", 2)
        .attr("stroke", objectColor);

    var cObjectCircle = gaze3.append("circle")
      .attr("cx", lineX2)
       .attr("cy", function(d){return arrowY(d);} )
       .attr("r", 5)
       .style("fill", objectColor);

     var cObjectJACircle = gaze3.append("circle")
       .attr("cx", barWidth + lineMargin)
       .attr("cy", function(d){return arrowY(d);} )
       .attr("r", 4)
       .style("fill", objectColor);      

     //child-object rect
     var gaze4 = group4.selectAll("gaze")
      .data(data.child)
      .enter().append("g")
          .attr("class", "child-object");

    var cObject = gaze4.append("rect")
        .attr("class", "rect-gaze")
        .attr("x", 0)
        .attr("y", function(d){return (d.start) * lineHeight + yMargin;}) //starting y = normalized position
        .attr("width", barWidth)
        .attr("height", function(d){ return (d.end - d.start) * lineHeight;})
        .attr("fill", objectColor);


    rectList = [childBar, exBar]
    list2 = [ecCircle, ecLine, ceCircle, ceLine];

    list3 = [cObject, cObjectLine, cObjectCircle, cObjectJACircle, eObject, eObjectLine, eObjectCircle, eObjectJACircle];

    setNormal();

  function setNormal(){
      for (i=0; i< rectList.length; i++){
        normalCERect(rectList[i]);
      }
      for (i=0; i< list2.length; i++){
        normalCE(list2[i]);
      }
      for (i=0; i< list3.length; i++){
        normalObject(list3[i]);
      }      
      selectObject(eObjectJACircle); 
      selectObject(cObjectJACircle);  
  }

  $("#normal").click(function(){
      $("a").removeClass('active').addClass('inactive');
      $(this).removeClass('inactive').addClass('active');
      setNormal(); 
    }); 

  $("#eye").click(function(){
      $("a").removeClass('active').addClass('inactive');
      $(this).removeClass('inactive').addClass('active');

      for (i=0; i< rectList.length; i++){
        selectEye(rectList[i]);
      }
      for (i=0; i< list2.length; i++){
        selectEye(list2[i]);
      }
      for (i=0; i< list3.length; i++){
        selectEyeObject(list3[i]);
      }           
  }); //end of eye

  $("#object").click(function(){
      $("a").removeClass('active').addClass('inactive');
      $(this).removeClass('inactive').addClass('active');


      for (i=0; i< rectList.length; i++){
        selectObject(rectList[i]);
      }      
      for (i=0; i< list2.length; i++){
        list2[i].transition().attr("opacity", 0);
      } 
      for (i=0; i< list3.length; i++){
        selectObject(list3[i]);
      }          
  });

  bafList1 = [childBar, exBar];
  bafList2 = [ecCircle, ecLine, eObject, eObjectLine, eObjectCircle, eObjectJACircle, cObjectJACircle];
  bafList3 = [cObject, cObjectLine, cObjectCircle];
  bafList4 = [ceCircle, ceLine];

  $("#baf").click(function(){
      $("a").removeClass('active').addClass('inactive');
      $(this).removeClass('inactive').addClass('active');
      //console.log(this.value);
      for (i=0; i< bafList1.length; i++){
        selectBAF(bafList1[i]);
      }      

      for (i=0; i< bafList2.length; i++){
        bafList2[i].transition().duration(function(d, i){ return i * 50;})
          .attr("opacity", 0); 
      }          
      for (i=0; i< bafList3.length; i++){
        selectBAFObject(bafList3[i]);
      } 

      for (i=0; i< bafList4.length; i++){
        selectBAFExaminer(bafList4[i]);
      }    
  });



});

}//end of function

function childClick(childNo){
  svg.selectAll("*").remove();
  drawViz(childNo);
  document.getElementById('chSelected').firstChild.nodeValue = "Child #" + childNo + " ";
  $("a").removeClass('active').addClass('inactive');
  $("#normal").removeClass('inactive').addClass('active');
}

$("#24").click(function(){
  childClick(24);
});
$("#38").click(function(){
  childClick(38);
});
$("#43").click(function(){
  childClick(43);
});
$("#52").click(function(){
  childClick(52);
});
$("#54").click(function(){
  childClick(54);
});
$("#57").click(function(){
  childClick(57);
});

drawViz(childNo);



