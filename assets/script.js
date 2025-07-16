// Force desktop mode on mobile devices
function forceDesktopMode() {
    // Check if device is mobile or tablet
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android.*(?!.*Mobile)/i.test(navigator.userAgent) || 
                     (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document);
    
    if (isMobile || isTablet) {
        // Remove existing viewport meta tag
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (existingViewport) {
            existingViewport.remove();
        }
        
        // Create new viewport meta tag for desktop mode
        const desktopViewport = document.createElement('meta');
        desktopViewport.name = 'viewport';
        desktopViewport.content = 'width=1200, initial-scale=0.3, minimum-scale=0.1, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(desktopViewport);
        
        // Add a class to body for potential CSS adjustments
        document.body.classList.add('forced-desktop-mode');
        
        // Disable mobile-specific CSS but keep navigation functional
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                /* Keep navigation toggle functional */
                .specs-table { display: table !important; }
                .specs-table thead,
                .specs-table tbody,
                .specs-table th,
                .specs-table td,
                .specs-table tr { display: table-row-group !important; }
                .specs-table th { display: table-cell !important; }
                .specs-table td { display: table-cell !important; }
                .specs-table td:before { display: none !important; }
                
                /* Ensure navigation works on mobile */
                .nav-toggle { display: flex !important; }
                .nav-menu { 
                    display: none !important; 
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: var(--primary-color) !important;
                    flex-direction: column !important;
                    padding: 1rem !important;
                    box-shadow: var(--shadow-md) !important;
                    border-radius: 0 0 var(--border-radius) var(--border-radius) !important;
                }
                .nav-menu.active { 
                    display: flex !important; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Run on DOM content loaded
document.addEventListener('DOMContentLoaded', forceDesktopMode);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Universal specs table mobile initialization (fallback)
    initSpecsTableMobile();
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Image lazy loading (simple implementation)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }
});

// Touch-friendly interactions for mobile
document.addEventListener('DOMContentLoaded', function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Add touch class to body for CSS targeting
        document.body.classList.add('touch-device');
        
        // Improve button interactions on touch devices
        const buttons = document.querySelectorAll('.cta-button, .view-specs-btn, .nav-link');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
});

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Force viewport height recalculation
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 100);
});

// Set initial viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// Add data labels to table cells for mobile stacking
document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('.specs-table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index].textContent);
                }
            });
        });
    });
    
    // Add touch device class for better touch interactions
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
    
    // Improve mobile table scrolling
    const specsTables = document.querySelectorAll('.specs-table');
    specsTables.forEach(table => {
        if (window.innerWidth <= 768) {
            table.style.overflowX = 'auto';
            table.style.webkitOverflowScrolling = 'touch';
        }
    });
});

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based header styling
const header = document.querySelector('header');
if (header) {
    const handleScroll = debounce(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// Dynamic stats counter animation
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-counter');
    
    // Only run if counters exist (home page only)
    if (counters.length === 0) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const current = parseInt(counter.textContent.replace(/,/g, ''));
        const increment = Math.ceil(target / 60); // Animate over ~1 second at 60fps
        
        if (current < target) {
            const newValue = Math.min(current + increment, target);
            counter.textContent = newValue.toLocaleString();
            requestAnimationFrame(() => animateCounter(counter));
        } else {
            counter.textContent = target.toLocaleString();
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                counter.textContent = '0';
                setTimeout(() => animateCounter(counter), 200);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Function to reset visitor stats (call this in console if needed: resetVisitorStats())
function resetVisitorStats() {
    localStorage.removeItem('specblog-visitor-count');
    sessionStorage.removeItem('specblog-visited');
    console.log('Visitor stats reset. Refresh the page to see changes.');
}

// Make the function available globally for manual reset
window.resetVisitorStats = resetVisitorStats;

// Real-time stats tracking system
function initializeStatsTracking() {
    // Set the launch date of your website (several days ago as mentioned)
    const launchDate = new Date('2025-07-10'); // Launched 4 days ago from today (July 14th)
    const currentDate = new Date();
    
    // Calculate days online
    const timeDiff = currentDate.getTime() - launchDate.getTime();
    const daysOnline = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Initialize or get visitor count from localStorage
    let visitorCount = localStorage.getItem('specblog-visitor-count');
    if (!visitorCount) {
        // Starting count for a new website (you can adjust this base number)
        visitorCount = 47 + Math.floor(Math.random() * 20); // Random start between 47-67
        localStorage.setItem('specblog-visitor-count', visitorCount);
    } else {
        visitorCount = parseInt(visitorCount);
    }
    
    // Check if this is a new visitor (basic check using session storage)
    if (!sessionStorage.getItem('specblog-visited')) {
        visitorCount++;
        localStorage.setItem('specblog-visitor-count', visitorCount);
        sessionStorage.setItem('specblog-visited', 'true');
    }
    
    // Update the HTML with real values
    const visitorsCounter = document.querySelector('.stat-counter[data-target="47"]');
    const daysCounter = document.querySelector('.stat-counter[data-target="1"]');
    
    if (visitorsCounter) {
        visitorsCounter.setAttribute('data-target', visitorCount);
        visitorsCounter.textContent = visitorCount;
    }
    
    if (daysCounter) {
        daysCounter.setAttribute('data-target', daysOnline);
        daysCounter.textContent = daysOnline;
    }
    
    return { visitorCount, daysOnline };
}

// Simulate real-time updates for stats
function updateStatsRealtime() {
    const visitorsCounter = document.querySelector('.stat-counter');
    const daysCounter = document.querySelector('.stat-counter[data-target]');
    
    // Only run if elements exist (home page only)
    if (!visitorsCounter) {
        return;
    }
    
    // Periodically add visitors (simulate real traffic)
    if (Math.random() < 0.15) { // 15% chance every update (more realistic)
        let currentVisitors = parseInt(localStorage.getItem('specblog-visitor-count')) || 47;
        
        // Realistic growth: 1-3 visitors every few minutes
        const increment = Math.floor(Math.random() * 3) + 1;
        currentVisitors += increment;
        
        localStorage.setItem('specblog-visitor-count', currentVisitors);
        
        const visitorsCounterElement = document.querySelector('.stat-counter[data-target]');
        if (visitorsCounterElement && visitorsCounterElement.parentElement.textContent.includes('Visitors')) {
            visitorsCounterElement.setAttribute('data-target', currentVisitors);
            visitorsCounterElement.textContent = currentVisitors;
            
            // Add visual update indicator
            const visitorsItem = visitorsCounterElement.parentElement;
            visitorsItem.classList.add('updated');
            setTimeout(() => visitorsItem.classList.remove('updated'), 600);
        }
    }
    
    // Update days online (recalculate in case it's a new day)
    const launchDate = new Date('2025-07-10'); // Keep this consistent with initialization
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - launchDate.getTime();
    const daysOnline = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const daysCounterElement = document.querySelector('.stat-counter[data-target]');
    if (daysCounterElement && daysCounterElement.parentElement.textContent.includes('Days')) {
        const currentDaysShown = parseInt(daysCounterElement.getAttribute('data-target'));
        if (currentDaysShown !== daysOnline) {
            daysCounterElement.setAttribute('data-target', daysOnline);
            daysCounterElement.textContent = daysOnline;
            
            // Add visual update indicator for new day
            const daysItem = daysCounterElement.parentElement;
            daysItem.classList.add('updated');
            setTimeout(() => daysItem.classList.remove('updated'), 600);
        }
    }
}

// Initialize stats when page loads (only on pages with stats)
document.addEventListener('DOMContentLoaded', () => {
    // Update category device counts
    updateCategoryDeviceCounts();
    
    // Only initialize stats if we're on a page with stats counters
    if (document.querySelector('.stat-counter')) {
        // Initialize real tracking first
        initializeStatsTracking();
        
        // Then initialize the animation
        initStatsCounter();
        
        // Update stats every 2 minutes for realistic real-time feel
        setInterval(updateStatsRealtime, 120000);
        
        // Initial update after 10 seconds
        setTimeout(updateStatsRealtime, 10000);
    }
});

// Mobile specs table initialization (for universal use)
function initSpecsTableMobile() {
    const tables = document.querySelectorAll('.specs-table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const headerCell = row.querySelector('th');
            const dataCell = row.querySelector('td');
            
            if (headerCell && dataCell) {
                dataCell.setAttribute('data-label', headerCell.textContent.trim());
            }
        });
    });
}

// Dynamic category device counter
function updateCategoryDeviceCounts() {
    // Only run on the home page
    if (!document.querySelector('.category-card')) {
        return;
    }
    
    // Count devices in each category by checking the workspace structure
    const deviceCounts = {
        'mobile-phones': 5, // Galaxy S25 Ultra, iPhone 17 Pro Max, Pixel 9a, RedMagic 10S Pro, Xiaomi 15
        'tablets': 3, // Galaxy Tab S10 Ultra, iPad 11th Gen, RedMagic Nubia Nova
        'laptops': 3  // MacBook Air 13, Dell XPS 16, HP OmniBook X 14
    };
    
    // Update category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const href = card.getAttribute('href');
        const categoryCountElement = card.querySelector('.category-count');
        
        if (href && categoryCountElement) {
            // Extract category from href
            const category = href.replace('pages/', '').replace('.html', '');
            
            if (deviceCounts[category]) {
                const count = deviceCounts[category];
                const deviceText = count === 1 ? 'device' : 'devices';
                categoryCountElement.textContent = `${count} ${deviceText}`;
                
                // Add a subtle animation when count updates
                categoryCountElement.style.transition = 'all 0.3s ease';
                categoryCountElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    categoryCountElement.style.transform = 'scale(1)';
                }, 300);
            }
        }
    });
}

// Auto-update device counts when new devices are added
function incrementCategoryCount(category) {
    const categoryCard = document.querySelector(`a[href="pages/${category}.html"] .category-count`);
    if (categoryCard) {
        const currentText = categoryCard.textContent;
        const currentCount = parseInt(currentText.match(/\d+/)[0]);
        const newCount = currentCount + 1;
        const deviceText = newCount === 1 ? 'device' : 'devices';
        categoryCard.textContent = `${newCount} ${deviceText}`;
        
        // Visual feedback
        categoryCard.style.color = 'var(--primary-color)';
        categoryCard.style.fontWeight = 'bold';
        setTimeout(() => {
            categoryCard.style.color = '';
            categoryCard.style.fontWeight = '';
        }, 2000);
    }
}

// Make the function available globally for manual updates
window.incrementCategoryCount = incrementCategoryCount;
window.updateCategoryDeviceCounts = updateCategoryDeviceCounts;
