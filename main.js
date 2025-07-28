// Comfort & Pondlike - Main JavaScript File

// Global variables
let currentSlide = 0;
let slideInterval;
let productsCurrentIndex = 0;
let videosCurrentIndex = 0;
const slidesData = [
    {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        title: 'Welcome to Comfort & Pondlike',
        description: 'Discover premium health and wellness products for a better lifestyle'
    },
    {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        title: 'Natural Wellness Solutions',
        description: 'Organic and natural products for your health journey'
    },
    {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        title: 'Transform Your Lifestyle',
        description: 'Join thousands who trust Comfort & Pondlike for their wellness needs'
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeHeroSlider();
    initializeLogo();
    initializeNavigation();
    initializeProductsSlider();
    initializeVideosSlider();
    initializeChatWidget();
    initializeComments();
    initializeVideoModal();
    initializeSmoothScrolling();
    
    // Speak welcome message on page load
    speakWelcomeMessage();
}

// Logo Animation and Speech Synthesis
function initializeLogo() {
    const logo = document.getElementById('animated-logo');
    
    // Add click event for manual speech trigger
    logo.addEventListener('click', function() {
        speakWelcomeMessage();
    });
    
    // Add hover effect
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Speech Synthesis Function
function speakWelcomeMessage() {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance('Welcome to Comfort and Pondlike');
        
        // Configure speech settings
        utterance.rate = 0.8; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher pitch for friendliness
        utterance.volume = 0.8; // Comfortable volume
        
        // Try to use a more natural voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') || 
            voice.lang.includes('en-US')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Add event listeners
        utterance.onstart = function() {
            console.log('Speech started');
            const logo = document.getElementById('animated-logo');
            logo.style.animation = 'logoGlow 0.5s ease-in-out infinite alternate';
        };
        
        utterance.onend = function() {
            console.log('Speech ended');
            const logo = document.getElementById('animated-logo');
            logo.style.animation = 'logoGlow 2s ease-in-out infinite alternate';
        };
        
        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event.error);
        };
        
        // Speak the message
        speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech synthesis not supported in this browser');
    }
}

// Load voices when available (some browsers load voices asynchronously)
speechSynthesis.onvoiceschanged = function() {
    console.log('Voices loaded:', speechSynthesis.getVoices().length);
};

// Hero Slider Functions
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    // Set background images for slides
    slides.forEach((slide, index) => {
        slide.style.background = slidesData[index].background;
    });
    
    // Start autoplay
    startSlideshow();
    
    // Navigation event listeners
    prevBtn.addEventListener('click', () => {
        stopSlideshow();
        previousSlide();
        startSlideshow();
    });
    
    nextBtn.addEventListener('click', () => {
        stopSlideshow();
        nextSlide();
        startSlideshow();
    });
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            goToSlide(index);
            startSlideshow();
        });
    });
    
    // Pause on hover
    const sliderContainer = document.querySelector('.hero-slider');
    sliderContainer.addEventListener('mouseenter', stopSlideshow);
    sliderContainer.addEventListener('mouseleave', startSlideshow);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
}

function previousSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
}

function updateSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Navigation Functions
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navigation.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Products Slider Functions
function initializeProductsSlider() {
    const prevBtn = document.querySelector('.products-nav.prev');
    const nextBtn = document.querySelector('.products-nav.next');
    
    prevBtn.addEventListener('click', () => moveProductsSlider(-1));
    nextBtn.addEventListener('click', () => moveProductsSlider(1));
    
    // Auto-scroll products
    setInterval(() => {
        moveProductsSlider(1);
    }, 8000);
}

function moveProductsSlider(direction) {
    const slider = document.querySelector('.products-slider .slider-wrapper');
    const slides = document.querySelectorAll('.product-slide');
    const slideWidth = slides[0].offsetWidth + 20; // Include gap
    const maxIndex = slides.length - Math.floor(slider.parentElement.offsetWidth / slideWidth);
    
    productsCurrentIndex += direction;
    
    if (productsCurrentIndex < 0) {
        productsCurrentIndex = maxIndex;
    } else if (productsCurrentIndex > maxIndex) {
        productsCurrentIndex = 0;
    }
    
    slider.style.transform = `translateX(-${productsCurrentIndex * slideWidth}px)`;
}

// Videos Slider Functions
function initializeVideosSlider() {
    const prevBtn = document.querySelector('.videos-nav.prev');
    const nextBtn = document.querySelector('.videos-nav.next');
    
    prevBtn.addEventListener('click', () => moveVideosSlider(-1));
    nextBtn.addEventListener('click', () => moveVideosSlider(1));
    
    // Video thumbnail click events
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video');
            openVideoModal(videoId);
        });
    });
}

function moveVideosSlider(direction) {
    const slider = document.querySelector('.videos-slider .slider-wrapper');
    const slides = document.querySelectorAll('.video-slide');
    const slideWidth = slides[0].offsetWidth + 20; // Include gap
    const maxIndex = slides.length - Math.floor(slider.parentElement.offsetWidth / slideWidth);
    
    videosCurrentIndex += direction;
    
    if (videosCurrentIndex < 0) {
        videosCurrentIndex = maxIndex;
    } else if (videosCurrentIndex > maxIndex) {
        videosCurrentIndex = 0;
    }
    
    slider.style.transform = `translateX(-${videosCurrentIndex * slideWidth}px)`;
}

// Video Modal Functions
function initializeVideoModal() {
    const modal = document.getElementById('video-modal');
    const closeBtn = document.getElementById('modal-close');
    
    closeBtn.addEventListener('click', closeVideoModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    
    // Create YouTube iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    container.innerHTML = '';
    container.appendChild(iframe);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    
    container.innerHTML = '';
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Chat Widget Functions
function initializeChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input-field');
    const chatMessages = document.getElementById('chat-messages');
    
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });
    
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    chatSend.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function sendChatMessage() {
    const input = document.getElementById('chat-input-field');
    const messages = document.getElementById('chat-messages');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addChatMessage(botResponse, 'bot');
        }, 1000);
    }
}

function addChatMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! Welcome to Comfort & Pondlike. How can I help you today?',
        'products': 'We offer a wide range of health and wellness products. Would you like to know about any specific category?',
        'price': 'Our products range from $24.99 to $99.99. Check out our featured products section for current pricing.',
        'shipping': 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.',
        'return': 'We have a 30-day return policy. All products can be returned in their original condition.',
        'default': 'Thank you for your message. Our team will get back to you shortly. Is there anything specific I can help you with?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

// Comments Functions
function initializeComments() {
    const submitBtn = document.getElementById('submit-comment');
    const commentText = document.getElementById('comment-text');
    
    submitBtn.addEventListener('click', submitComment);
    
    // Initialize existing upvote buttons
    const upvoteButtons = document.querySelectorAll('.upvote-btn');
    upvoteButtons.forEach(btn => {
        btn.addEventListener('click', handleUpvote);
    });
}

function submitComment() {
    const textarea = document.getElementById('comment-text');
    const commentsList = document.getElementById('comments-list');
    const text = textarea.value.trim();
    
    if (text) {
        const comment = createCommentElement(text, 'Anonymous User', 'Just now');
        commentsList.insertBefore(comment, commentsList.firstChild);
        textarea.value = '';
        
        // Show success message
        showNotification('Comment submitted successfully!');
    }
}

function createCommentElement(text, author, date) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${author}</span>
            <span class="comment-date">${date}</span>
        </div>
        <p class="comment-text">${text}</p>
        <div class="comment-actions">
            <button class="upvote-btn" data-votes="0">
                <i class="fas fa-thumbs-up"></i>
                <span class="vote-count">0</span>
            </button>
            <button class="moderate-btn" style="display: none;">
                <i class="fas fa-flag"></i>
            </button>
        </div>
    `;
    
    // Add event listener to new upvote button
    const upvoteBtn = commentDiv.querySelector('.upvote-btn');
    upvoteBtn.addEventListener('click', handleUpvote);
    
    return commentDiv;
}

function handleUpvote(e) {
    const button = e.currentTarget;
    const voteCount = button.querySelector('.vote-count');
    const currentVotes = parseInt(button.getAttribute('data-votes'));
    
    if (!button.classList.contains('voted')) {
        const newVotes = currentVotes + 1;
        button.setAttribute('data-votes', newVotes);
        voteCount.textContent = newVotes;
        button.classList.add('voted');
        
        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
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
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling for speech synthesis
window.addEventListener('error', function(e) {
    if (e.message.includes('speechSynthesis')) {
        console.warn('Speech synthesis error handled gracefully');
    }
});

// Export functions for potential external use
window.ComfortPondlike = {
    speakWelcomeMessage,
    nextSlide,
    previousSlide,
    openVideoModal,
    closeVideoModal
};

