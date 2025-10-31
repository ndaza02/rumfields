// Blog Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all category cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            card.classList.add('active');
            
            const category = card.dataset.category;
            
            // Filter blog cards
            blogCards.forEach(blogCard => {
                if (category === 'all' || blogCard.dataset.category === category) {
                    blogCard.style.display = 'block';
                    blogCard.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    blogCard.style.display = 'none';
                }
            });
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('blogSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Pagination
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    pageNumbers.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            pageNumbers.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Scroll to top of blog grid
            document.querySelector('.blog-grid-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const activePage = document.querySelector('.page-number.active');
            const prevPage = activePage.previousElementSibling;
            
            if (prevPage && prevPage.classList.contains('page-number')) {
                pageNumbers.forEach(b => b.classList.remove('active'));
                prevPage.classList.add('active');
                
                document.querySelector('.blog-grid-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const activePage = document.querySelector('.page-number.active');
            const nextPage = activePage.nextElementSibling;
            
            if (nextPage && nextPage.classList.contains('page-number')) {
                pageNumbers.forEach(b => b.classList.remove('active'));
                nextPage.classList.add('active');
                
                document.querySelector('.blog-grid-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Subscribe form
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = subscribeForm.querySelector('input[type="email"]').value;
            
            // Show success message
            alert(`Thank you for subscribing! We'll send blog updates to ${email}`);
            subscribeForm.reset();
        });
    }
    
    // Blog card click to read article
    blogCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on author or other interactive elements
            if (!e.target.closest('.author-mini')) {
                // Navigate to article (you can customize this)
                console.log('Navigate to article');
                // window.location.href = 'article.html?id=' + card.dataset.id;
            }
        });
    });
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
