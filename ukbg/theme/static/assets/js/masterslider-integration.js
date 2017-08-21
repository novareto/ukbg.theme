var slider = new MasterSlider();
     
slider.control('arrows');  
slider.control('circletimer' , {color:"#FFFFFF" , stroke:9});
slider.control('thumblist' , {autohide:false ,dir:'v',type:'tabs', align:'right', arrows: true, margin:-12, space:0, width:229, height:100, hideUnder:550});
 
slider.setup('masterslider' , {
    width:941,
    height:430,
    space:0,
    view:'wave'
});
     
