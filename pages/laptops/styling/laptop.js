/* Laptop-specific JavaScript functionality */

// Add data labels to table cells for mobile stacking (laptop specs tables)
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Add search functionality to each specs table
        addTableSearchFunctionality(table);
    });
});

// Performance optimization: debounce function for laptop pages
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

// Laptop-specific image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const laptopImages = document.querySelectorAll('.gadget-image-placeholder img[data-src]');
    
    if ('IntersectionObserver' in window && laptopImages.length > 0) {
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

        laptopImages.forEach(img => imageObserver.observe(img));
    } else if (laptopImages.length > 0) {
        // Fallback for older browsers
        laptopImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }
});

// Laptop specs table enhancement for better mobile experience
document.addEventListener('DOMContentLoaded', function() {
    const specsSection = document.getElementById('gadget-specs-content');
    if (specsSection) {
        // Add smooth scrolling to specifications section when linked from cards
        const hash = window.location.hash;
        if (hash === '#specs' || hash === '#specifications') {
            setTimeout(() => {
                specsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
    
    // Enhance specs table accessibility
    const specsTables = document.querySelectorAll('.specs-table');
    specsTables.forEach(table => {
        // Add table caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Device Specifications';
            caption.style.clip = 'rect(0 0 0 0)';
            caption.style.clipPath = 'inset(50%)';
            caption.style.height = '1px';
            caption.style.overflow = 'hidden';
            caption.style.position = 'absolute';
            caption.style.whiteSpace = 'nowrap';
            caption.style.width = '1px';
            table.appendChild(caption);
        }
        
        // Add scope attributes to headers for better accessibility
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.hasAttribute('scope')) {
                header.setAttribute('scope', 'row');
            }
        });
    });
});

// Handle orientation changes for laptop pages
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Force viewport height recalculation
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Recalculate table layouts on orientation change
        const specsTables = document.querySelectorAll('.specs-table');
        specsTables.forEach(table => {
            if (window.innerWidth <= 768) {
                table.style.overflowX = 'auto';
                table.style.webkitOverflowScrolling = 'touch';
            } else {
                table.style.overflowX = '';
                table.style.webkitOverflowScrolling = '';
            }
        });
    }, 100);
});

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
