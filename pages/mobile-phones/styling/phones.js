// Mobile Phone Detail Pages - Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize phone-specific features
    initPhoneSpecsTable();
    initPhoneImageHandling();
    initPhoneNavigationEnhancements();
    initPhoneAccessibilityFeatures();
});

/**
 * Initialize mobile-friendly specs table for phone pages
 */
function initPhoneSpecsTable() {
    const specsTable = document.querySelector('.specs-table');
    if (!specsTable) return;

    // Add mobile data labels for better mobile display
    const rows = specsTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const headerCell = row.querySelector('th');
        const dataCell = row.querySelector('td');
        
        if (headerCell && dataCell) {
            dataCell.setAttribute('data-label', headerCell.textContent.trim());
        }
    });

    // Add smooth scrolling to specs table on mobile
    if (window.innerWidth <= 768) {
        specsTable.style.scrollBehavior = 'smooth';
    }

    // Add search functionality to specs table
    addTableSearchFunctionality(specsTable);
}

/**
 * Add search functionality to specs table
 */
function addTableSearchFunctionality(table) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'table-search-container';
    searchContainer.style.cssText = `
        margin: 1rem 0;
        text-align: right;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search specifications...';
    searchInput.className = 'table-search-input';
    searchInput.style.cssText = `
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 250px;
        font-size: 0.9rem;
    `;
    
    searchInput.addEventListener('input', function() {
        filterTableRows(table, this.value);
    });
    
    searchContainer.appendChild(searchInput);
    table.parentNode.insertBefore(searchContainer, table);
}

/**
 * Filter table rows based on search term
 */
function filterTableRows(table, searchTerm) {
    const rows = table.querySelectorAll('tbody tr, tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

/**
 * Handle phone image interactions and loading
 */
function initPhoneImageHandling() {
    const phoneImages = document.querySelectorAll('.gadget-image-placeholder img');
    
    phoneImages.forEach(img => {
        // Add loading animation
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });

        // Add click to zoom functionality
        img.addEventListener('click', function() {
            if (this.style.transform === 'scale(1.5)') {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
        });

        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik03MCA3MEwxMzAgMTMwTTEzMCA3MEw3MCAxMzAiIHN0cm9rZT0iI0NDQyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
            this.alt = 'Image not found';
        });
    });
}

/**
 * Enhance navigation for phone pages
 */
function initPhoneNavigationEnhancements() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('current-page');
        }
    });

    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add breadcrumb functionality
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading state for navigation
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 300);
        });
    });
}

/**
 * Initialize accessibility features for phone pages
 */
function initPhoneAccessibilityFeatures() {
    // Add keyboard navigation for specs table
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.setAttribute('tabindex', '0');
        specsTable.setAttribute('role', 'table');
        specsTable.setAttribute('aria-label', 'Phone specifications table');

        // Add keyboard navigation
        specsTable.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const rows = this.querySelectorAll('tr');
                const currentRow = document.activeElement.closest('tr');
                if (currentRow) {
                    const currentIndex = Array.from(rows).indexOf(currentRow);
                    const nextIndex = e.key === 'ArrowDown' 
                        ? Math.min(currentIndex + 1, rows.length - 1)
                        : Math.max(currentIndex - 1, 0);
                    rows[nextIndex].focus();
                }
            }
        });
    }

    // Add focus indicators for better accessibility
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Add screen reader support for specs
    const specRows = document.querySelectorAll('.specs-table tr');
    specRows.forEach(row => {
        const th = row.querySelector('th');
        const td = row.querySelector('td');
        if (th && td) {
            td.setAttribute('aria-describedby', th.textContent.trim().replace(/\s+/g, '-').toLowerCase());
        }
    });
}

/**
 * Add print functionality for phone specs
 */
function addPrintFunctionality() {
    // Create print button if it doesn't exist
    const specsContent = document.querySelector('#gadget-specs-content');
    if (specsContent && !document.querySelector('.print-specs-btn')) {
        const printButton = document.createElement('button');
        printButton.className = 'print-specs-btn';
        printButton.textContent = 'Print Specifications';
        printButton.style.cssText = `
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 1rem 0;
            transition: background-color 0.3s ease;
        `;
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        printButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'var(--secondary-color)';
        });
        
        printButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'var(--primary-color)';
        });
        
        specsContent.appendChild(printButton);
    }
}

/**
 * Initialize phone-specific touch gestures for mobile devices
 */
function initTouchGestures() {
    if ('ontouchstart' in window) {
        const specsTable = document.querySelector('.specs-table');
        if (specsTable) {
            let isScrolling = false;
            
            specsTable.addEventListener('touchstart', function() {
                isScrolling = true;
            });
            
            specsTable.addEventListener('touchend', function() {
                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            });
            
            // Prevent unwanted scroll behaviors
            specsTable.addEventListener('touchmove', function(e) {
                if (isScrolling) {
                    e.stopPropagation();
                }
            });
        }
    }
}

/**
 * Add performance optimizations for phone pages
 */
function optimizePerformance() {
    // Lazy load images that are not immediately visible
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
    
    // Optimize table rendering for large specs tables
    const specsTable = document.querySelector('.specs-table');
    if (specsTable && specsTable.rows.length > 20) {
        specsTable.style.contain = 'layout style paint';
    }
}

// Initialize additional features when page is fully loaded
window.addEventListener('load', function() {
    addPrintFunctionality();
    initTouchGestures();
    optimizePerformance();
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause any animations or timers when page is hidden
        const animatedElements = document.querySelectorAll('[style*="transition"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const animatedElements = document.querySelectorAll('[style*="transition"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Export functions for potential external use
window.PhonePageUtils = {
    initPhoneSpecsTable,
    initPhoneImageHandling,
    initPhoneNavigationEnhancements,
    initPhoneAccessibilityFeatures
};
