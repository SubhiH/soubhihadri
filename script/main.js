// Application State
var slideIndex = 1;
var works_loaded = false;
var presentations_loaded = false;
var toast_is_shown = false;
var events_loaded = false;
var first_event_page_downloaded = false;

// Slideshow Functions
function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var x = document.getElementsByClassName("focused_img");
    if (n > x.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = x.length; }
    
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.display = "block";
}

// Scroll Handler
function yHandler() {
    var wrap = document.getElementById('skillss');
    var contentHeight = wrap.offsetHeight;
    var yOffset = window.pageYOffset;
    var y = yOffset + window.innerHeight;
    
    if (y >= contentHeight && !works_loaded) {
        works_loaded = true;

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

                    projectsHtml += '<img src="./work/' + project.img_url + '" width="100%" style="height:250px;object-fit: contain;">';

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
                                modalContent += '<img class="focused_img" src="./work/' + project.folder_name + '/' + image + '" style="width:100%">';
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

    if (y >= 2000 && works_loaded && !presentations_loaded) {
        presentations_loaded = true;
    }

    if (y > 800 && !events_loaded && first_event_page_downloaded) {
        events_loaded = true;
    }
}
window.onscroll = yHandler;


// Utility Functions
function smoothScrollTo(target) {
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 'slow');
}

// Document Ready
$(document).ready(function() {
    // Close news banner
    $("#close").click(function() {
        $("#news").fadeOut();
    });

    // Navigation buttons
    $('#work_btn').click(function() {
        smoothScrollTo("#project_container");
    });

    $('#contact_btn').click(function() {
        if (!toast_is_shown) {
            toast_is_shown = true;
            M.toast({
                html: '<span>Excited to hear from you ^_^</span><br>' +
                      '<span style="font-size: 13px;"><a href="mailto:soubhi.hadri@gmail.com">soubhi.hadri@gmail.com</a></span><br>' +
                      '<span style="font-size: 13px;">Find Me</span><br>' +
                      '<i class="material-icons">arrow_downward</i>',
                classes: 'toast',
                completeCallback: function() {
                    toast_is_shown = false;
                }
            });
        }
    });

    $('#course_btn').click(function() {
        smoothScrollTo("#courses");
    });

    $('#presentation_btn').click(function() {
        smoothScrollTo("#presentation");
    });

    $('.carousel').carousel();

    // Floating menu hover effect
    $('.a').hover(
        function() {
            $('.a #ulEle').css({ display: 'block' });
            $('.a #ulEle').animate({ left: '20px' }, 100);
        },
        function() {
            $('.a #ulEle').animate({ left: '0' }, 100, function() {
                $('.a #ulEle').css({ display: 'none' });
            });
        }
    );

    // Load events timeline
    $.getJSON("events.json", function(data) {
        var eventsHtml = '';
        $.each(data, function(key, event) {
            var fontSize = event[1].length > 5 ? 'style="font-size: 9px;"' : '';
            eventsHtml += '<div class="event">' +
                         '<div class="event_block">' +
                         '<img class="event_img" src="./image/' + event[2] + '"><br/>' +
                         '<div class="event_title">' +
                         '<p style="color:#777D85;margin-left:10px;font-family:\'Roboto\',sans-serif;">' +
                         event[0] + '</p></div></div>' +
                         '<div class="event_arrow"></div>' +
                         '<div class="event_date" ' + fontSize + '>' + event[1] + '</div>' +
                         '</div>';
        });
        $('.events').append(eventsHtml);
        first_event_page_downloaded = true;
    });


    // Initialize floating menu animation
    animateDiv();

    // Skills word cloud
    $.getJSON("skills.json", function(skillsList) {
        WordCloud(document.getElementById('skills'), {
            list: skillsList,
            gridSize: 8,
            weightFactor: 3,
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: function(word, weight, fontSize) {
                return (weight > 10) ? 400 : 500;
            },
            color: function(word, weight) {
                if (weight > 12) return '#75272A';
                if (weight > 10) return '#B13938';
                if (weight > 8) return '#566270';
                return '#848FAA';
            },
            hover: window.drawBox,
            backgroundColor: '#ff000000'
        });
    });
});

// Animation Helper Functions
function makeNewPosition() {
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    return [nh, nw];
}

function calcSpeed(prev, next) {
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    var greatest = x > y ? x : y;
    var speedModifier = 0.1;
    return Math.ceil(greatest / speedModifier);
}

function animateDiv() {
    var hover = false;
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.a').animate({ top: newq[0], left: newq[1] }, speed, function() {
        if (!hover) {
            animateDiv();
        }
    });

    $('.a').hover(
        function() {
            hover = true;
            $('.a').stop();
        },
        function() {
            hover = false;
            animateDiv();
        }
    );
}





