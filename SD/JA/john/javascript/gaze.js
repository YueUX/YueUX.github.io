var childActions = ["child_ball", "child_ex_face", "child_book", "child_ex_hands"];
var examinerActions = ["examiner_ball", "examiner_book", "examiner_c_face"];
var arr = ["RA024_complete_edited.json",
  "RA043_complete_edited.json", "RA038_FU_complete_edited.json", "RA054_complete_edited.json",
  "RA052_complete_edited.json", "RA057_complete_edited.json"];

var blue = "#6F99C2";
var orange = "#EA9153";
var pink = "#E686A1";
var grey = "#BEBEBE";

var green_ball = "#B8D44B"; //"#42BC8F";
var pink_eye = "#AB64A8"; //"#E964A6";
var purple_book = "#4BC2C4"; //"#775DA8";
var blue_hand = "#F26B6C"; //"#5869B1";

var yellow_speech = "#fff24a";

var background_color = "#E5E7E5";
var line_color = "#b4b0b6";
var text_color_light = "#989399";
var text_color_dark = "#626363";

//audio
$('#audioCheckBox').click(function() {
    var $this = $(this);
    // $this will contain a reference to the checkbox
    if (this.checked) {
      d3.selectAll(".audio").attr("opacity", 0).transition()
        .duration(function(d, i){ return i * 30;})
        .attr("opacity", 1);
    } else {
      d3.selectAll(".audio").attr("opacity", 1).transition()
        .duration(function(d, i){ return i * 30;})
        .attr("opacity", 0);
    }
});


$('#jointAttentionCheckbox').click(function() {
    if (this.checked) { // make checked
      rangeUpdate( rangeInput.value );
      $('.normal').fadeTo( 500, 0.2 );
      $('.jointAttention').css({"opacity":1});
    } else { // now empty
      $('.normal').fadeTo( 1000 , 1 );
      $('.jointAttention').css({"opacity":0});
    }
});

function render(){
  $('.visualization').empty();
  $.each( arr, function( index, val ) {

    var className = "viz_" + index.toString();
    var viz = d3.select(".visualization").append("svg")
          .attr("class", className)
          .attr("width", "100%")
          .attr("height", 200);
    var file = "data" + "/" + val;
    d3.json( file , function(error, data) {

      var childData = data.child;
      var examinerData = data.examiner;
      var aggregateData = data.aggregate;
      var examinerSpeech = data.filled;
      var childVocal = data.red;

      var child_book = data.child_book;
      var child_ball = data.child_ball;
      var child_ex = data.child_ex;

      var examiner_ball = data.examiner_ball
      var examiner_book = data.examiner_book
      var examiner_child = data.examiner_child

      examinerSpeech.push.apply(examinerSpeech, data.unfilled);

      var joint = data.joint;
      var start = data.duration[0].start;
      var end = data.duration[0].end;

      drawGrid( viz, data.info[0].child );
      renderChild( viz, childData, start );
      renderExaminer( viz, examinerData, start );
      renderExaminerSpeech( viz, examinerSpeech, start);
      renderChildSpeech( viz, childVocal, start);
      renderJointAttention(viz, child_ex, examiner_child, start, rangeInput.value);

    });
  });
}

render();






