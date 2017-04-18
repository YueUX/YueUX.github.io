
//AJAX call for the json file
var ajax = new XMLHttpRequest();

ajax.open("GET", "history.json", false);
ajax.send(null);
var historyData = JSON.parse(ajax.responseText);

ajax.open("GET", "food.json", false);
ajax.send(null);
var foodData = JSON.parse(ajax.responseText);

ajax.open("GET", "political.json", false);
ajax.send(null);
var politicalData = JSON.parse(ajax.responseText);



function getPost(category, year, keyword) {
  categoryName = "";
  switch(category){
    case 'his':
      var result = $.grep(historyData, function(e){ return e.year == year; }); //find all matching years
      categoryName = 'History';
      break;
    case 'food':
      var result = $.grep(foodData, function(e){ return e.year == year; });
      categoryName = 'Food';
      break;
    case 'pol':
      var result = $.grep(politicalData, function(e){ return e.year == year; });
      categoryName = 'Politics';
      break;  
  }

  var innerHTML = ""

  innerHTML = "<div class=\"headerContainer\"><div class=\"headerContent "+category+"\"><p>" +categoryName + ": " + year + "</p></div></div>";
  innerHTML = innerHTML + "<div class=\"textContainer\">"
  $.each(result, function(index, value) {
      var sentence = value.content; 
      var sentenceLower = sentence.toLowerCase();
      var keywordLower = keyword.toLowerCase();
      var keywordIndex = sentenceLower.indexOf(keywordLower);
      if ( keywordIndex > -1){ //if the sentence contains the keyword
        var orginalKeyword = sentence.substr(keywordIndex,keyword.length);
        sentence = sentence.replace(orginalKeyword, "<span class=\"keyword "+category+"\"> " + orginalKeyword + "</span>")
        innerHTML = innerHTML + "<br/><br/>" + sentence;       
        // console.log(sentence);
      }
  });
  innerHTML = innerHTML + "</div>"
  document.getElementById('kwSentences').innerHTML = innerHTML;
}

 showKeywordText = function(name,year,keyword){
  d3.select(".visualContainer")
    .transition()
    .duration(500)  
    .style("opacity",0.2)

  d3.select(".keywordTextContainer")
    .style("visibility","visible")
    .style("opacity",0)
    .transition()
    .duration(500)
    .style("opacity",1)

  

  getPost(name,year,keyword)
}

hideKeywordText = function (){
  d3.select(".visualContainer")
    .transition()
    .duration(500)
    .style("opacity",1)

  d3.select(".keywordTextContainer")
    .style("opacity",1)
    .transition()
    .duration(500)
    .style("opacity",0)
    .call(function(){
      d3.select(".keywordTextContainer")    
      .style("visibility","hidden")
    })
    
}

KeywordContentClicked = function(event){
  event.stopPropagation();
}

function show(name){
  getPost(name, 1990, 'food');
}
