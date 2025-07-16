// Tablet Detail Pages - Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tablet-specific features
    initTabletSpecsTable();
    initTabletImageHandling();
    initTabletNavigationEnhancements();
    initTabletAccessibilityFeatures();
    initTabletOrientationHandling();
});

/**
 * Initialize mobile-friendly specs table for tablet pages
 */
function initTabletSpecsTable() {
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

    // Add smooth scrolling to specs table on tablet
    specsTable.style.scrollBehavior = 'smooth';

    // Add tablet-specific table enhancements
    addTableSortingCapability(specsTable);
    addTableSearchFunctionality(specsTable);
}

/**
 * Add sorting capability to specs table
 */
function addTableSortingCapability(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        if (index === 0) return; // Skip first column (specification names)
        
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.title = 'Click to sort';
        
        header.addEventListener('click', function() {
            sortTableByColumn(table, index);
        });
    });
}

/**
 * Sort table by column
 */
function sortTableByColumn(table, columnIndex) {
    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    if (rows.length === 0) return;
    
    const isNumeric = rows.every(row => {
        const cell = row.cells[columnIndex];
        return cell && !isNaN(parseFloat(cell.textContent.trim()));
    });
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex]?.textContent.trim() || '';
        const bText = b.cells[columnIndex]?.textContent.trim() || '';
        
        if (isNumeric) {
            return parseFloat(aText) - parseFloat(bText);
        } else {
            return aText.localeCompare(bText);
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
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
 * Handle tablet image interactions and loading
 */
function initTabletImageHandling() {
    const tabletImages = document.querySelectorAll('.gadget-image-placeholder img');
    
    tabletImages.forEach(img => {
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

        // Add enhanced click to zoom functionality for tablets
        img.addEventListener('click', function() {
            toggleImageZoom(this);
        });

        // Add double-tap zoom for touch devices
        let lastTap = 0;
        img.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                toggleImageZoom(this);
            }
            lastTap = currentTime;
        });

        // Add error handling with retry functionality
        img.addEventListener('error', function() {
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry Loading Image';
            retryButton.style.cssText = `
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            `;
            
            retryButton.addEventListener('click', () => {
                this.src = this.src + '?retry=' + new Date().getTime();
                retryButton.remove();
            });
            
            this.parentNode.appendChild(retryButton);
        });
    });
}

/**
 * Toggle image zoom functionality
 */
function toggleImageZoom(img) {
    if (img.classList.contains('zoomed')) {
        img.classList.remove('zoomed');
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
        img.style.position = 'relative';
        img.style.zIndex = '1';
    } else {
        img.classList.add('zoomed');
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.position = 'relative';
        img.style.zIndex = '1000';
    }
}

/**
 * Enhance navigation for tablet pages
 */
function initTabletNavigationEnhancements() {
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

    // Add breadcrumb functionality with tablet-specific enhancements
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

    // Add tablet-specific navigation gestures
    initTabletSwipeNavigation();
}

/**
 * Initialize swipe navigation for tablets
 */
function initTabletSwipeNavigation() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next page
                navigateToNextTablet();
            } else {
                // Swipe right - previous page
                navigateToPreviousTablet();
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

/**
 * Navigate to next tablet in sequence
 */
function navigateToNextTablet() {
    const currentPage = window.location.pathname;
    const tabletPages = [
        'galaxy-tab-s10-ultra',
        'iPad-11th-generation',
        'redmagic-nubia-nova'
    ];
    
    const currentIndex = tabletPages.findIndex(page => currentPage.includes(page));
    if (currentIndex !== -1 && currentIndex < tabletPages.length - 1) {
        const nextPage = tabletPages[currentIndex + 1];
        window.location.href = `../${nextPage}/index.html`;
    }
}

/**
 * Navigate to previous tablet in sequence
 */
function navigateToPreviousTablet() {
    const currentPage = window.location.pathname;
    const tabletPages = [
        'galaxy-tab-s10-ultra',
        'iPad-11th-generation',
        'redmagic-nubia-nova'
    ];
    
    const currentIndex = tabletPages.findIndex(page => currentPage.includes(page));
    if (currentIndex > 0) {
        const previousPage = tabletPages[currentIndex - 1];
        window.location.href = `../${previousPage}/index.html`;
    }
}

/**
 * Initialize accessibility features for tablet pages
 */
function initTabletAccessibilityFeatures() {
    // Add keyboard navigation for specs table
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.setAttribute('tabindex', '0');
        specsTable.setAttribute('role', 'table');
        specsTable.setAttribute('aria-label', 'Tablet specifications table');

        // Add keyboard navigation
        specsTable.addEventListener('keydown', function(e) {
            handleTableKeyNavigation(e, this);
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
 * Handle keyboard navigation in table
 */
function handleTableKeyNavigation(e, table) {
    const rows = table.querySelectorAll('tr');
    const currentRow = document.activeElement.closest('tr');
    
    if (!currentRow) return;
    
    const currentIndex = Array.from(rows).indexOf(currentRow);
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, rows.length - 1);
            rows[nextIndex].focus();
            break;
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            rows[prevIndex].focus();
            break;
        case 'Home':
            e.preventDefault();
            rows[0].focus();
            break;
        case 'End':
            e.preventDefault();
            rows[rows.length - 1].focus();
            break;
    }
}

/**
 * Handle tablet orientation changes
 */
function initTabletOrientationHandling() {
    function handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);
        
        // Adjust layout for orientation
        const specsTable = document.querySelector('.specs-table');
        if (specsTable && isLandscape) {
            specsTable.style.fontSize = '0.9rem';
        } else if (specsTable) {
            specsTable.style.fontSize = '';
        }
    }
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(handleOrientationChange, 100);
    });
    
    window.addEventListener('resize', handleOrientationChange);
    
    // Initial check
    handleOrientationChange();
}

/**
 * Add tablet-specific performance optimizations
 */
function optimizeTabletPerformance() {
    // Optimize for tablet hardware
    if (window.devicePixelRatio > 1) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.imageRendering = 'crisp-edges';
        });
    }
    
    // Optimize table rendering for large datasets
    const specsTable = document.querySelector('.specs-table');
    if (specsTable && specsTable.rows.length > 15) {
        specsTable.style.contain = 'layout style paint';
        specsTable.style.willChange = 'transform';
    }
    
    // Add tablet-specific lazy loading
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize additional features when page is fully loaded
window.addEventListener('load', function() {
    optimizeTabletPerformance();
});

// Export functions for potential external use
window.TabletPageUtils = {
    initTabletSpecsTable,
    initTabletImageHandling,
    initTabletNavigationEnhancements,
    initTabletAccessibilityFeatures,
    initTabletOrientationHandling,
    toggleImageZoom
};
