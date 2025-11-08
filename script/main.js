// Application State
var slideIndex = 1;
var works_loaded = false;
var presentations_loaded = false;
var toast_is_shown = false;
var events_loaded = false;
var first_event_page_downloaded = false;

// Mobile Toggle Functionality
function initMobileToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const timelineSection = document.getElementById('timelineSection');
    const contentSection = document.getElementById('contentSection');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Toggle sections
            if (section === 'timeline') {
                timelineSection.classList.add('active');
                contentSection.classList.add('hidden');
            } else {
                timelineSection.classList.remove('active');
                contentSection.classList.remove('hidden');
            }
        });
    });
    
    // Optional: Swipe gesture support
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleSwipe() {
        if (window.innerWidth <= 992) { // Only on mobile
            if (touchEndX < touchStartX - 50) {
                // Swipe left - show timeline
                document.querySelector('[data-section="timeline"]').click();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - show content
                document.querySelector('[data-section="content"]').click();
            }
        }
    }
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

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
        loadProjects();
    }

    if (y >= 2000 && works_loaded && !presentations_loaded) {
        presentations_loaded = true;
    }

    if (y > 800 && !events_loaded && first_event_page_downloaded) {
        events_loaded = true;
    }
}
window.onscroll = yHandler;

// Projects Load More Functionality
var allProjects = [];
var currentProjectIndex = 0;
var projectsPerPage = 6;

function loadProjects() {
    $.getJSON("projects.json", function(data) {
        allProjects = data;
        currentProjectIndex = 0;
        
        // Add load more button after project container
        var loadMoreHtml = '<div id="load-more-projects-container" style="text-align: center; margin: 30px 0;">';
        loadMoreHtml += '<button id="load-more-projects-btn" class="load-more-button">';
        loadMoreHtml += 'Load More';
        loadMoreHtml += '<i class="material-icons" style="vertical-align: middle; margin-left: 5px;">expand_more</i>';
        loadMoreHtml += '</button></div>';
        
        $('#project_container').after(loadMoreHtml);
        
        // Load first batch
        loadMoreProjects();
        
        // Attach click handler
        $('#load-more-projects-btn').click(function() {
            loadMoreProjects();
        });
    });
}

function loadMoreProjects() {
    var projectsToShow = allProjects.slice(currentProjectIndex, currentProjectIndex + projectsPerPage);
    var projectsHtml = '';
    var projectCount = 0;
    var startIndex = currentProjectIndex;

    $.each(projectsToShow, function(key, project) {
        if (projectCount % 3 === 0) {
            if (projectCount !== 0) {
                projectsHtml += '</div>';
            }
            projectsHtml += '<div class="uk-grid project-batch">';
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

    // Append new projects
    $('#project_container').append(projectsHtml);
    
    currentProjectIndex += projectsToShow.length;
    
    // Update button
    var remaining = allProjects.length - currentProjectIndex;
    if (remaining > 0) {
        $('#load-more-projects-btn').show();
    } else {
        $('#load-more-projects-container').hide();
    }
    
    // Attach click handlers to new projects
    $('.more_info').off('click').on('click', function() {
        var project_id = $(this).find('#project_id').html();
        var type = $(this).find('#url').attr("type");
        var url = $(this).find('#url').html();

        if (type == 1) {
            window.open(url);
        } else {
            console.log("Project ID: " + project_id);
            var project = allProjects.find(p => p.id == project_id);
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
}


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

// Token Stream Animation in Header
function initTokenStream() {
    const canvas = document.getElementById('tokenStreamCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Set canvas size to match parent
    function resizeCanvas() {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // AI/GenAI related tokens - expanded list
    const tokens = [
        'transformer', 'attention', 'embedding', 'latent', 'diffusion',
        'neural', 'generative', 'GPT', 'LLM', 'token', 'prompt',
        'context', 'fine-tune', 'BERT', 'model', 'inference',
        'training', 'dataset', 'weights', 'layer', 'activation',
        'backprop', 'gradient', 'loss', 'epoch', 'batch',
        'Gemini', 'Claude', 'GPT-5', 'Copilot', 'Agents', 'ADK'
    ];
    
    const activeTokens = [];
    
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            bronze: isDark ? '#B8935F' : '#8B6F47',
            teal: isDark ? '#3DBAA8' : '#2A9D8F'
        };
    }
    
    // Check if token would overlap with existing tokens
    function wouldOverlap(newToken) {
        for (let i = 0; i < activeTokens.length; i++) {
            const token = activeTokens[i];
            const dx = Math.abs(newToken.x - token.x);
            const dy = Math.abs(newToken.y - token.y);
            const minDistance = 80; // Minimum distance between tokens
            
            if (dx < minDistance && dy < minDistance) {
                return true;
            }
        }
        return false;
    }
    
    function createToken() {
        if (activeTokens.length < 18) { // Increased from 15
            const colors = getThemeColors();
            let attempts = 0;
            let newToken;
            
            // Try to find a non-overlapping position
            do {
                newToken = {
                    text: tokens[Math.floor(Math.random() * tokens.length)],
                    x: Math.random() * canvas.width,
                    y: canvas.height * 0.5 + 20, // Start from middle of canvas (ABOUT ME area)
                    speed: 0.35 + Math.random() * 0.45, // Slightly faster
                    opacity: 0,
                    maxOpacity: 0.18 + Math.random() * 0.15, // Increased opacity: 0.18-0.33
                    color: Math.random() < 0.5 ? colors.bronze : colors.teal,
                    size: 13 + Math.random() * 7 // Slightly larger: 13-20px
                };
                attempts++;
            } while (wouldOverlap(newToken) && attempts < 10);
            
            if (attempts < 10) {
                activeTokens.push(newToken);
            }
        }
    }
    
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create new tokens occasionally
        if (Math.random() < 0.04) createToken(); // Slightly more frequent
        
        // Update and draw tokens
        for (let i = activeTokens.length - 1; i >= 0; i--) {
            const token = activeTokens[i];
            
            token.y -= token.speed;
            
            // Fade in and out - adjusted for starting from middle
            if (token.y > canvas.height * 0.4) {
                token.opacity = Math.min(token.opacity + 0.01, token.maxOpacity);
            } else if (token.y < canvas.height * 0.15) {
                token.opacity = Math.max(token.opacity - 0.01, 0);
            }
            
            // Draw token
            ctx.font = `${token.size}px Quicksand, sans-serif`;
            ctx.fillStyle = token.color + Math.floor(token.opacity * 255).toString(16).padStart(2, '0');
            ctx.fillText(token.text, token.x, token.y);
            
            // Remove if off screen
            if (token.y < -50 || token.opacity <= 0) {
                activeTokens.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Perlin Noise Class (simplified)
class PerlinNoise {
    constructor() {
        this.gradients = {};
        this.memory = {};
    }

    rand_vect() {
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }

    dot_prod_grid(x, y, vx, vy) {
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        let grid_key = `${vx},${vy}`;
        
        if (this.gradients[grid_key]) {
            g_vect = this.gradients[grid_key];
        } else {
            g_vect = this.rand_vect();
            this.gradients[grid_key] = g_vect;
        }
        
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherstep(x) {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    interp(x, a, b) {
        return a + this.smootherstep(x) * (b-a);
    }

    get(x, y) {
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        
        let tl = this.dot_prod_grid(x, y, xf, yf);
        let tr = this.dot_prod_grid(x, y, xf+1, yf);
        let bl = this.dot_prod_grid(x, y, xf, yf+1);
        let br = this.dot_prod_grid(x, y, xf+1, yf+1);
        
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        
        return v;
    }
}

// Perlin Wave Background Animation
function initPerlinWave() {
    const canvas = document.getElementById('perlinWaveCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Set canvas size to match parent (full main-content-area)
    function resizeCanvas() {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Update canvas size when content changes
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(parent);
    
    const noise = new PerlinNoise();
    let time = 0;
    
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            bronze: isDark ? '#B8935F' : '#8B6F47',
            teal: isDark ? '#3DBAA8' : '#2A9D8F',
            bg: isDark ? '#1F1B17' : '#DFE4EA'
        };
    }
    
    function animate() {
        const colors = getThemeColors();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gridSize = 30;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const value = noise.get(x * 0.004, y * 0.004 + time);
                const angle = value * Math.PI * 2;
                const length = (Math.abs(value) + 0.5) * 14;
                
                const endX = x + Math.cos(angle) * length;
                const endY = y + Math.sin(angle) * length;
                
                const opacity = (Math.abs(value) + 0.3) * 0.22;
                const color = value > 0 ? colors.teal : colors.bronze;
                
                ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                ctx.lineWidth = 1.8;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
        
        time += 0.003;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Perlin Wave for Header
function initPerlinWaveHeader() {
    const canvas = document.getElementById('perlinWaveHeaderCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    function resizeCanvas() {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const noise = new PerlinNoise();
    let time = 0;
    
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            bronze: isDark ? '#B8935F' : '#8B6F47',
            teal: isDark ? '#3DBAA8' : '#2A9D8F'
        };
    }
    
    function animate() {
        const colors = getThemeColors();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gridSize = 30;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const value = noise.get(x * 0.004, y * 0.004 + time);
                const angle = value * Math.PI * 2;
                const length = (Math.abs(value) + 0.5) * 14;
                
                const endX = x + Math.cos(angle) * length;
                const endY = y + Math.sin(angle) * length;
                
                const opacity = (Math.abs(value) + 0.3) * 0.22;
                const color = value > 0 ? colors.teal : colors.bronze;
                
                ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                ctx.lineWidth = 1.8;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
        
        time += 0.003;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize Token Stream and Perlin Waves when DOM is ready
$(document).ready(function() {
    initPerlinWave();
    initPerlinWaveHeader();
    initTokenStream();
    initMobileToggle();
});


























// Work Experience Load More Functionality
$(document).ready(function() {
    const itemsPerPage = 6;
    let currentlyShown = 0;
    const workItems = $('.work-item');
    const totalItems = workItems.length;
    const loadMoreBtn = $('#load-more-btn');
    const loadMoreContainer = $('#load-more-container');
    const remainingCount = $('#remaining-count');

    // Initially hide all items
    workItems.addClass('hidden');

    // Function to show next batch of items
    function showMoreItems() {
        const itemsToShow = workItems.slice(currentlyShown, currentlyShown + itemsPerPage);
        
        itemsToShow.each(function(index) {
            const item = $(this);
            setTimeout(function() {
                item.removeClass('hidden').addClass('fade-in-work');
            }, index * 100); // Stagger animation
        });

        currentlyShown += itemsToShow.length;
        updateLoadMoreButton();
    }

    // Update button text and visibility
    function updateLoadMoreButton() {
        const remaining = totalItems - currentlyShown;
        
        if (remaining > 0) {
            remainingCount.text(`(${remaining} more)`);
            loadMoreBtn.show();
        } else {
            loadMoreContainer.hide();
        }
    }

    // Load More button click handler
    loadMoreBtn.on('click', function() {
        showMoreItems();
    });

    // Show first batch on page load
    showMoreItems();
});

// Neural Network Animation
function initNeuralNetwork() {
    const canvas = document.getElementById('neuralNetworkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Node class
    class Node {
        constructor(x, y, layer) {
            this.x = x;
            this.y = y;
            this.layer = layer;
            this.radius = 4;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
            this.active = false;
            this.activation = 0;
        }
        
        update() {
            this.pulse += this.pulseSpeed;
            
            // Random activation pulses
            if (Math.random() < 0.002) {
                this.active = true;
                this.activation = 1;
            }
            
            if (this.active) {
                this.activation *= 0.95;
                if (this.activation < 0.05) {
                    this.active = false;
                    this.activation = 0;
                }
            }
        }
        
        draw(isDark) {
            const pulseSize = Math.sin(this.pulse) * 1.5;
            const size = this.radius + pulseSize;
            
            // Get theme colors
            const nodeColor = isDark ? 
                `rgba(184, 147, 95, ${0.3 + this.activation * 0.7})` : 
                `rgba(139, 111, 71, ${0.3 + this.activation * 0.7})`;
            
            const glowColor = isDark ? 
                `rgba(61, 186, 168, ${this.activation * 0.5})` : 
                `rgba(42, 157, 143, ${this.activation * 0.5})`;
            
            // Draw glow when active
            if (this.activation > 0.1) {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 4);
                gradient.addColorStop(0, glowColor);
                gradient.addColorStop(1, 'rgba(42, 157, 143, 0)');
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw node
            ctx.beginPath();
            ctx.fillStyle = nodeColor;
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw core
            if (this.activation > 0.3) {
                ctx.beginPath();
                ctx.fillStyle = isDark ? 'rgba(61, 186, 168, 0.8)' : 'rgba(42, 157, 143, 0.8)';
                ctx.arc(this.x, this.y, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Connection class
    class Connection {
        constructor(from, to) {
            this.from = from;
            this.to = to;
            this.strength = 0;
        }
        
        update() {
            // Propagate activation through connections
            if (this.from.active && Math.random() < 0.3) {
                this.to.active = true;
                this.to.activation = Math.max(this.to.activation, this.from.activation * 0.8);
            }
            
            this.strength = (this.from.activation + this.to.activation) / 2;
        }
        
        draw(isDark) {
            const baseOpacity = 0.08;
            const activeOpacity = 0.4;
            const opacity = baseOpacity + (this.strength * activeOpacity);
            
            const gradient = ctx.createLinearGradient(
                this.from.x, this.from.y,
                this.to.x, this.to.y
            );
            
            if (isDark) {
                gradient.addColorStop(0, `rgba(184, 147, 95, ${opacity * this.from.activation || opacity})`);
                gradient.addColorStop(0.5, `rgba(42, 157, 143, ${opacity})`);
                gradient.addColorStop(1, `rgba(184, 147, 95, ${opacity * this.to.activation || opacity})`);
            } else {
                gradient.addColorStop(0, `rgba(139, 111, 71, ${opacity * this.from.activation || opacity})`);
                gradient.addColorStop(0.5, `rgba(42, 157, 143, ${opacity})`);
                gradient.addColorStop(1, `rgba(139, 111, 71, ${opacity * this.to.activation || opacity})`);
            }
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + this.strength * 1.5;
            ctx.moveTo(this.from.x, this.from.y);
            ctx.lineTo(this.to.x, this.to.y);
            ctx.stroke();
        }
    }
    
    let nodes = [];
    let connections = [];
    let animationFrame;
    
    function resize() {
        const container = canvas.parentElement;
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        
        initNetwork();
    }
    
    function initNetwork() {
        nodes = [];
        connections = [];
        
        // Create network structure: 4 layers
        const layers = [5, 8, 8, 5]; // nodes per layer
        const layerSpacing = width / (layers.length + 1);
        
        layers.forEach((nodeCount, layerIndex) => {
            const layerNodes = [];
            const nodeSpacing = height / (nodeCount + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                const x = layerSpacing * (layerIndex + 1);
                const y = nodeSpacing * (i + 1);
                const node = new Node(x, y, layerIndex);
                nodes.push(node);
                layerNodes.push(node);
            }
            
            // Connect to previous layer
            if (layerIndex > 0) {
                const prevLayerStart = nodes.length - nodeCount - layers[layerIndex - 1];
                const prevLayerEnd = nodes.length - nodeCount;
                
                layerNodes.forEach(node => {
                    for (let j = prevLayerStart; j < prevLayerEnd; j++) {
                        // Not all connections - make it sparse and interesting
                        if (Math.random() < 0.6) {
                            connections.push(new Connection(nodes[j], node));
                        }
                    }
                });
            }
        });
    }
    
    function animate() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw connections
        connections.forEach(conn => {
            conn.update();
            conn.draw(isDark);
        });
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw(isDark);
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Initialize
    resize();
    animate();
    
    // Handle resize
    window.addEventListener('resize', resize);
    
    // Cleanup
    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        window.removeEventListener('resize', resize);
    };
}

// Initialize neural network when DOM is ready
$(document).ready(function() {
    initNeuralNetwork();
});
