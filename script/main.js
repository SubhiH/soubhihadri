var slideIndex = 1;
function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("focused_img");
  if (n > x.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = x.length}
          for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";  
       }

       x[slideIndex-1].style.display = "block";  
   }

   var works_loaded = false;
   var presentations_loaded = false;
   var toast_is_shown = false;
   var events_loaded=false;
   var first_event_page_downloaded = false;

   function yHandler(){

    var wrap = document.getElementById('skillss');
    var contentHeight = wrap.offsetHeight;
    var yOffset = window.pageYOffset; 
    var y = yOffset + window.innerHeight;
        // console.log(y);
        if(y >= contentHeight && !works_loaded){
            works_loaded=true;

            $.getJSON("projects.json", function(data) {
                var projectsHtml = '';
                var projectCount = 0;

                $.each(data, function(key, project) {
                    if (projectCount % 3 === 0) {
                        if (projectCount !== 0) {
                            projectsHtml += '</div>';
                        }
                        projectsHtml += '<div class="uk-grid">';
                    }

                    projectsHtml += '<div class="uk-width-medium-1-3" style="display: flex;justify-content:center; margin-top:10px;">';
                    projectsHtml += '<div class="project" >';

                    if (project.type_title.length < 18) {
                        projectsHtml += '<p class="font_2" style="font-size: 20px;margin-bottom: 2px;">';
                    } else {
                        projectsHtml += '<p class="font_2" style="font-size: 16px;margin-bottom: 2px;">';
                    }
                    projectsHtml += '#' + project.type_title;
                    projectsHtml += '</p>';

                    projectsHtml += '<img src="work/' + project.img_url + '" width="100%" style="height:250px;object-fit: contain;">';

                    projectsHtml += '<p class="font_3" style="font-size: 13px;margin-top: 5px;font-weight: 500;">';
                    projectsHtml += project.title;
                    projectsHtml += '</p>';

                    if (project.detail.length < 80) {
                        projectsHtml += '<p class="font_3" style="font-size: 11px;margin-top: -15px;padding-left: 1px;padding-right: 1px;">';
                    } else {
                        projectsHtml += '<p class="font_3" style="font-size: 9px;margin-top: -15px;padding-left: 1px;padding-right: 1px;">';
                    }
                    projectsHtml += project.detail;
                    projectsHtml += '</p>';

                    projectsHtml += '<a><div class="more_info" >';
                    projectsHtml += '<p>More</p>';
                    projectsHtml += '<span id="project_id" hidden>' + project.id + '</span>';
                    projectsHtml += '<span id="url" type="' + project.type + '"hidden>' + project.url + '</span>';
                    projectsHtml += '</div></a>';

                    projectsHtml += '</div></div>';

                    projectCount++;
                });

                if (projectCount > 0) {
                    projectsHtml += '</div>';
                }

                $('#project_container').html(projectsHtml);

                $('.more_info').click(function() {
                    var project_id = $(this).find('#project_id').html();
                    var type = $(this).find('#url').attr("type");
                    var url = $(this).find('#url').html();

                    if (type == 1) {
                        window.open(url);
                    } else {
                        // Since we can't get project info from the controller, we'll just log to console for now.
                        // A more complete solution would involve a separate JSON file for each project's details.
                        console.log("Project ID: " + project_id);
                        var project = data.find(p => p.id == project_id);
                        if (project) {
                            var modalContent = '<div style="text-align: center;font-size: 16px;color: #b13938;font-family: \'Quicksand\', sans-serif;font-weight: 500;">' + project.title + '</div>';
                            modalContent += '<div class="w3-content w3-display-container" style="max-width:800px">';
                            project.images.forEach(function(image) {
                                modalContent += '<img class="focused_img" src="work/' + project.folder_name + '/' + image + '" style="width:100%">';
                            });
                            modalContent += '</div>';
                            modalContent += '<div class="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle" style="width:100%">';
                            modalContent += '<div class="w3-left w3-hover-text-khaki" onclick="plusDivs(-1)">&#10094;</div>';
                            modalContent += '<div class="w3-right w3-hover-text-khaki" onclick="plusDivs(1)">&#10095;</div>';
                            modalContent += '</div>';
                            $('.modal-content').html(modalContent);
                            var elem = document.querySelector('.modal');
                            var instance = M.Modal.init(elem, {
                                opacity: 0.5
                            });
                            instance.open();
                            showDivs(slideIndex);
                        }
                    }
                });
            });
        }

        if(y >= 2000 && works_loaded && !presentations_loaded){
            presentations_loaded=true;
        // Ajax call to get more dynamic data goes here
        // This section is now obsolete as we are not using a backend.
        // Presentation data can be loaded from a static file in the future if needed.
        
    }

    if(y>800 && !events_loaded && first_event_page_downloaded){
        events_loaded=true;
        // This section is now obsolete as we are not using a backend.
        // Event data can be loaded from a static file in the future if needed.
    }
}
window.onscroll = yHandler;


$(document).ready(function(){

    $("#close").click(function(){
      $("#news").fadeOut();
    });


    $('#work_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#project_container").offset().top},
            'slow');
    });

    $('#contact_btn').click(function(){
        if(!toast_is_shown){
            toast_is_shown=true;
            M.toast({html: '<span>Excited to hear from you ^_^</span><br><span style="font-size: 13px;"><a href="mailto:soubhi.hadri@gmail.com">soubhi.hadri@gmail.com</a></span> <br><span style="font-size: 13px;"><a href="mailto:soubhi.hadri@gmail.com">s.hadri@ou.edu</a></span><br><span style="font-size: 13px;">Find Me</span><br><i class="material-icons">arrow_downward</i>',
               classes: 'toast',
               completeCallback:function(){
                toast_is_shown=false;
            }
        });
        }
    });

    $('#course_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#courses").offset().top},
            'slow');
    });

    $('#presentation_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#presentation").offset().top},
            'slow');
    });  

   // $('.modal').modal();
   $('.carousel').carousel();

   $('.a').hover(

     function () {
         $('.a #ulEle').css({
             display: 'block'
         });
         $('.a #ulEle').animate({
             left: '20px',
             background: '#ccc'
         }, 100);
     },

     function () {
         $('.a #ulEle').animate({
             left: '0',
             background: '#ccc'
         }, 100, function () {
             $('.a #ulEle').css({
                 display: 'none'
             });
         });
     });

   $.getJSON("events.json", function(data) {
       var eventsHtml = '';
       $.each(data, function(key, event) {
           eventsHtml += '<div class="event">';
           eventsHtml += '<div class="event_block">';
           eventsHtml += '<img class="event_img" src="image/' + event[2] + '">';
           eventsHtml += '<br/>';
           eventsHtml += '<div class="event_title">';
           eventsHtml += '<p style="color:#777D85;margin-left: 10px;font-family: \'Roboto\', sans-serif;">';
           eventsHtml += event[0];
           eventsHtml += '</p>';
           eventsHtml += '</div>';
           eventsHtml += '</div>';
           eventsHtml += '<div class="event_arrow"></div>';

           if (event[1].length > 5) {
               eventsHtml += '<div class="event_date" style="font-size: 9px;">';
           } else {
               eventsHtml += '<div class="event_date">';
           }
           eventsHtml += event[1];
           eventsHtml += '</div>';
           eventsHtml += '</div>';
       });
       $('.events').append(eventsHtml);
       first_event_page_downloaded = true;
   });


   animateDiv();

   list = [['HTML', 8],
   ['Javascript', 8],
   ['PHP', 9],
   ['Python', 10],
   ['C++', 12],
   ['OpenCV', 13],
   ['Point Cloud Library', 8],
   ['Computer Vision', 13],
   ['Deep Learning', 11],
   ['Machine Learning', 11],
   ['Drone Software Development', 9],
   ['Ardupilot', 12],
   ['PX4', 12],
   ['iOS', 13],
   ['Android', 13],
   ['React Native', 12],
   ['OpenGL', 13],
   ['WebGL', 13],
   ['Mavlink', 12],
   ['Keras', 10],
   ['Tensorflow', 10],
   ['Threejs', 9],
   ['Web Dev', 12],
   ['Mobile Dev', 12],
   ['OpenCVJS', 12],
   ['C#', 7],
   ['Swift', 8],
   ['Git', 8],
   ['Java', 8],
   ['Joomla', 7],
   ['ROS', 11],
   ['Qt', 13]]
   WordCloud(document.getElementById('skills'), { list: list,
      gridSize: 8,
      weightFactor: 3,
      fontFamily: 'Quicksand, sans-serif',
      fontWeight:function (word, weight,fontSize) {
        if (weight > 12){
            return 400;
        }else if(weight > 10){
         return 400;
     }else{
        return 500;
    }
},
color: function (word, weight) {
    if (weight > 12){
        return '#75272A';
    }else if(weight > 10){
     return '#B13938';
 }else if(weight > 8){
     return '#566270';
 }else if(weight > 7){
     return '#848FAA';
 }else{
    return '#848FAA';
}
},
hover: window.drawBox,
backgroundColor: '#ff000000' } );


});

function makeNewPosition(){

    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
    var hover = false;
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.a').animate({ top: newq[0], left: newq[1] }, speed, function(){
        if(!hover){
            animateDiv();        
        }
    });

    $('.a').hover(function() {
        hover = true;
        $('.a').stop();
    }, function(){
        hover = false;
        animateDiv();
    });


};

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.1;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}





