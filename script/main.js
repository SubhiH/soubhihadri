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
                         '<p class="event-title-text">' +
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

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Toggle icons with animation
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });
    
    // Scroll Animations with Intersection Observer
    initScrollAnimations();
    
    // Interactive Drone and Scroll Progress
    initInteractiveDrone();
});

// Interactive Drone Animation
function initInteractiveDrone() {
    const drone = document.querySelector('div.a');
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (!drone || !scrollProgress) return;
    
    window.addEventListener('scroll', function() {
        // Update scroll progress bar
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
        
        // Update drone position based on scroll
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = window.pageYOffset / maxScroll;
        
        // Calculate drone position (moves vertically with scroll)
        // Keep it visible within viewport, range from 10% to 70% of viewport height
        const minTop = window.innerHeight * 0.1;
        const maxTop = window.innerHeight * 0.7;
        const droneTop = minTop + (scrollPercent * (maxTop - minTop));
        
        drone.style.top = droneTop + 'px';
    });
    
    // Set initial position
    const initialTop = window.innerHeight * 0.1;
    drone.style.top = initialTop + 'px';
}

// Scroll Animation Function
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to improve performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe info containers
    const infoContainers = document.querySelectorAll('.info_container');
    infoContainers.forEach(function(container, index) {
        container.classList.add('fade-in-right');
        if (index < 6) {
            container.classList.add('stagger-' + (index + 1));
        }
        observer.observe(container);
    });
    
    // Observe event blocks (timeline cards)
    const observeEvents = function() {
        const eventBlocks = document.querySelectorAll('.event');
        eventBlocks.forEach(function(event, index) {
            if (!event.classList.contains('fade-in-left')) {
                event.classList.add('fade-in-left');
                if (index < 6) {
                    event.classList.add('stagger-' + ((index % 3) + 1));
                }
                observer.observe(event);
            }
        });
    };
    
    // Observe initially and after new events load
    setTimeout(observeEvents, 500);
    setInterval(observeEvents, 2000);
    
    // Observe project cards
    const observeProjects = function() {
        const projectCards = document.querySelectorAll('.project');
        projectCards.forEach(function(project, index) {
            if (!project.classList.contains('scale-in')) {
                project.classList.add('scale-in');
                if (index < 6) {
                    project.classList.add('stagger-' + ((index % 3) + 1));
                }
                observer.observe(project);
            }
        });
    };
    
    // Check for projects periodically
    setInterval(observeProjects, 2000);
    
    // Observe work sections
    const workSections = document.querySelectorAll('.work_section');
    workSections.forEach(function(section, index) {
        section.classList.add('fade-in');
        if (index < 6) {
            section.classList.add('stagger-' + ((index % 2) + 1));
        }
        observer.observe(section);
    });
}

























