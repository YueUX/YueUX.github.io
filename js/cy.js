//rotating text
$( document ).ready(function() {
    var mdps = $(".mdp");
    var mdpIndex = -1;
    function showNextMdp(){

          ++mdpIndex;
          mdps.eq(mdpIndex % (mdps.length-2))
          .velocity('transition.slideRightIn',1500)
            .velocity('transition.slideRightOut', 500, showNextMdp);
    }
    showNextMdp();


      //ScrollMagic

    //hero scene
    var controller = new ScrollMagic.Controller();

    var smscene1 = new ScrollMagic.Scene({duration: 1000})
      .setTween("#AIC", {y:600})
      .addTo(controller);

    var smscene1 = new ScrollMagic.Scene({duration: 800})
        .setTween("#yuechen", {y:400})
        .addTo(controller);


    $(window).scroll(function(){
      if($(document).scrollTop() > 300){
        $('#AIC').css({'display': 'none'});
      } else {
        $('#AIC').css({'display': 'inherit'});
      };


      if($(document).scrollTop() > 50){
        $('#yuechen').fadeOut("slow");
      } else {
        $('#yuechen').fadeIn("slow");
      };

    });


});


//Digital-branding title css tricks
// JS for content editable trick from Chris Coyier
var h1 = document.querySelector("#wrapper-h1");

h1.addEventListener("input", function() {
  this.setAttribute("data-heading", this.innerText);
});
// JS for content editable trick from Chris Coyier

// var h1 = document.querySelector("h1");
//
// h1.addEventListener("input", function() {
//   this.setAttribute("data-heading", this.innerText);
// });




//bounce portfolio
// var tweenPort = new TimelineMax ()
//   .add([
//     TweenMax.fromTo("#portfolio", 1, {y:0}, {y:100, ease: Linear.easeNone}),
//   ]);
// // build scene
// var smscene3 = new ScrollMagic.Scene({triggerElement: "#footer-container-placeholder", triggerHook: "onEnter", offset: -300, duration: 600})
//   .setTween(tweenPort)
//   .addTo(controller);




//portfolio section fade out onEnter about
// var Tw_fade = new TimelineMax ()
//   .add([
//   TweenMax.fromTo("#portfolio", 1, {autoAlpha: 1}, {autoAlpha: 0, ease: Linear.easeNone})
// ]);
// var smscene4= new ScrollMagic.Scene({triggerElement: "#footer-container-placeholder", offset: 20, duration: 100})
//   .setTween(Tw_fade)
//   .addTo(controller);
