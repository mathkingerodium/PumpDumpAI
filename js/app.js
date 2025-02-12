// Initialize token feed
const tokenFeed = document.getElementById('tokenFeed');
const loadingOverlay = document.getElementById('loadingOverlay');
const maxTokens = 10; // Maximum number of tokens to display

// Loading screen handler
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Show loading screen for 2 seconds
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.remove();
            }, 300); // Match the CSS transition duration
        }, 2000); // 2 second delay
    }
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    document.body.style.overflow = 'hidden';
    
    // Start loading sequence
    window.addEventListener('load', () => {
        hideLoadingScreen();
        document.body.style.overflow = '';
    });

    const tabButtons = document.querySelectorAll('.glass .flex button');
    
    // Create popup element
    const popup = document.createElement('div');
    popup.setAttribute('data-wallet-popup', '');
    // Add base styles directly
    popup.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="
            background-color: rgb(17 24 39 / 0.95);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 28rem;
            width: 100%;
            margin: 1rem;
            transform: scale(0.95);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        ">
            <div class="text-center">
                <div class="mb-4">
                    <div class="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto ring-1 ring-blue-500/20">
                        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p class="text-gray-400 mb-6 text-sm">You need to connect your wallet to access this feature.</p>
                <div class="flex gap-3 justify-center">
                    <button id="popupConnectWallet" class="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                        Connect Wallet
                    </button>
                    <button id="popupClose" class="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium border border-white/10 hover:border-white/20">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    // Popup show/hide functions
    function showPopup() {
        popup.style.opacity = '1';
        popup.style.pointerEvents = 'auto';
        popup.querySelector('div').style.transform = 'scale(1)';
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popup.style.opacity = '0';
        popup.style.pointerEvents = 'none';
        popup.querySelector('div').style.transform = 'scale(0.95)';
        document.body.style.overflow = '';
    }

    // Expose popup functionality globally
    window.showWalletPopup = showPopup;
    window.hideWalletPopup = hidePopup;

    // Add popup event listeners
    popup.querySelector('#popupClose').addEventListener('click', hidePopup);
    popup.querySelector('#popupConnectWallet').addEventListener('click', () => {
        hidePopup();
        document.getElementById('walletButton').click();
    });
    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Latest Tokens') {
                // Remove active state from all tabs
                tabButtons.forEach(btn => {
                    btn.classList.remove('bg-gray-800/50', 'border-b-2', 'border-blue-500', 'text-white');
                    btn.classList.add('text-gray-400');
                });
                
                // Add active state to clicked tab
                button.classList.remove('text-gray-400');
                button.classList.add('bg-gray-800/50', 'border-b-2', 'border-blue-500', 'text-white');
                
                // Clear token feed when switching tabs
                tokenFeed.innerHTML = '';
                
                // Show loading spinner
                spinnerContainer.style.display = 'flex';
            } else {
                // Show login popup for restricted tabs
                showPopup();
            }
        });
    });
});

// Add loading spinner container
const spinnerContainer = document.createElement('div');
spinnerContainer.className = 'flex flex-col items-center justify-center p-8';

// Add spinner animation styles
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    @keyframes spinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .token-feed-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(96, 165, 250, 0.1);
        border-left-color: #60a5fa;
        border-radius: 50%;
        animation: spinner 1s linear infinite;
    }
`;
document.head.appendChild(spinnerStyles);

spinnerContainer.innerHTML = `
    <div class="token-feed-spinner"></div>
    <p class="mt-4 text-blue-400 text-sm">Waiting for new tokens...</p>
`;
spinnerContainer.style.display = 'none';
tokenFeed.appendChild(spinnerContainer);

// Function to check and update spinner visibility
function updateSpinnerVisibility() {
    const hasTokens = tokenFeed.children.length > 1; // > 1 because spinner itself is a child
    spinnerContainer.style.display = hasTokens ? 'none' : 'flex';
}

// Call on initial load
updateSpinnerVisibility();

// Countdown Timer
const countdownElement = document.getElementById('countdown');

function updateCountdown() {
    if (!countdownElement) return;

    // Set target time to 19:55 UTC
    const targetTime = new Date();
    targetTime.setUTCHours(19, 55, 0, 0);
    
    // If current time is past today's target, set target to tomorrow
    if (Date.now() > targetTime.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const now = Date.now();
    const timeLeft = targetTime.getTime() - now;
    
    // If countdown has ended, show 00:00
    if (timeLeft <= 0) {
        countdownElement.innerHTML = `
            <div class="text-sm text-gray-400 mb-1">Time Remaining</div>
            <div class="text-2xl font-bold text-white">00:00:00</div>
        `;
        return;
    }
    
    // Calculate remaining time
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Format time with leading zeros
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    countdownElement.innerHTML = `
        <div class="text-sm text-gray-400 mb-1">Time Remaining</div>
        <div class="text-2xl font-bold text-white">${timeString}</div>
    `;
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial update

// Mock data for tokens
const mockTokens = [
    {
        name: 'BONK',
        symbol: 'BONK',
        price: 0.000001234,
        change24h: 15.6,
        volume24h: 1234567,
        marketCap: 45678901,
        holders: 12345,
        risk: 65,
        imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
    },
    {
        name: 'Jupiter',
        symbol: 'JUP',
        price: 0.456,
        change24h: -5.2,
        volume24h: 9876543,
        marketCap: 98765432,
        holders: 54321,
        risk: 45,
        imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png'
    },
    // Add more mock tokens as needed
];

// Initialize token feed with mock data
function initializeMockData() {
    mockTokens.forEach(token => {
        const tokenCard = createTokenCard(token);
        tokenFeed.appendChild(tokenCard);
    });
    hideLoading();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMockData();
});

// Token Feed
function createTokenCard(token) {
    const card = document.createElement('div');
    card.className = 'token-card glass flex items-center p-3 gap-3 cursor-pointer hover:no-underline';
    
    // Generate random rug risk percentage
    const rugRisk = token.risk;
    const riskColor = getRiskColor(rugRisk);
    
    // Get risk description based on percentage
    const getRiskDescription = (risk) => {
        if (risk <= 20) return "Low risk - Token appears stable";
        if (risk <= 50) return "Medium risk - Exercise caution";
        if (risk <= 80) return "High risk - Trade with extreme caution";
        return "Very high risk - Potential rug pull";
    };

    // Create unique ID for this card's risk elements
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    // Generate mock social sentiment (in real app, this would come from API)
    const sentiment = {
        score: Math.random(),
        mentions: Math.random() < 0.1 ? 
            Math.floor(Math.random() * 900 + 600) : 
            Math.floor(Math.random() * 100 + 50),
        trend: Math.random() > 0.5 ? 'up' : 'down'
    };

    // Get sentiment class and icon
    const getSentimentInfo = (score) => {
        if (score > 0.66) return {
            class: 'sentiment-positive',
            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>`,
            text: 'Bullish'
        };
        if (score > 0.33) return {
            class: 'sentiment-neutral',
            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M7 12h10M7 17h10M7 7h10"/>
                  </svg>`,
            text: 'Neutral'
        };
        return {
            class: 'sentiment-negative',
            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/>
                  </svg>`,
            text: 'Bearish'
        };
    };

    const sentimentInfo = getSentimentInfo(sentiment.score);
    
    // Handle image display with loading state
    const imageHtml = token.imageUrl 
        ? `<div class="relative w-12 h-12 flex-shrink-0">
             <div class="token-image-square absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                 <div class="spinner"></div>
             </div>
             <img src="${token.imageUrl}" 
                  alt="${token.name}" 
                  class="w-12 h-12 object-cover relative z-10 token-image-square" 
                  onload="this.previousElementSibling.style.display='none'"
                  onerror="this.parentElement.innerHTML='<div class=\'w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center token-image-square\'><span class=\'text-xs text-gray-500\'>${token.symbol?.charAt(0) || '?'}</span></div>'">
           </div>`
        : `<div class="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 token-image-square">
             <span class="text-xs text-gray-500">${token.symbol?.charAt(0) || '?'}</span>
           </div>`;
    
    const copyButtonHtml = `
        <button class="copy-button-icon tooltip" onclick="event.preventDefault(); event.stopPropagation(); copyToClipboard('${token.mint}', this, event)" data-tooltip="Copy token address">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
        </button>
    `;
    
    card.innerHTML = `
        ${imageHtml}
        <div class="flex-grow min-w-0 w-full flex items-center">
            <div class="flex items-center justify-between w-full gap-4">
                <div class="flex flex-col min-w-0 flex-shrink-1 justify-center">
                    <h2 class="font-medium text-sm text-white truncate max-w-[200px] leading-tight">${token.name || 'Unknown'}</h2>
                    <span class="text-xs text-gray-400 truncate leading-tight mt-0.5">${token.symbol || 'Unknown'}</span>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                    <div id="risk-text-${uniqueId}" class="text-xs font-medium text-gray-400 tooltip" 
                         data-tooltip="Calculating risk...">
                        Analyzing...
                    </div>
                    <div class="w-16 h-1 mt-1 mb-2 bg-gray-700 rounded-full overflow-hidden">
                        <div id="risk-bar-${uniqueId}" 
                             class="h-full bg-gray-500 transition-all duration-1000 ease-in-out" 
                             style="width: 0%">
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="sentiment-indicator tooltip" data-tooltip="Social sentiment based on mentions and trends">
                            <div class="flex items-center gap-1.5">
                                <span class="${sentimentInfo.class}">
                                    ${sentimentInfo.icon}
                                </span>
                                <span class="${sentimentInfo.class} font-medium">
                                    ${sentimentInfo.text}
                                </span>
                            </div>
                            <span class="text-gray-400 ml-2 flex items-center gap-1">
                                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                                </svg>
                                ${formatNumber(sentiment.mentions)}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            ${copyButtonHtml}
                            <a href="https://pump.fun/coin/${token.mint}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="view-link-icon tooltip" 
                               data-tooltip="View on Pump.fun">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Animate the risk reveal after a delay
    setTimeout(() => {
        const riskText = card.querySelector(`#risk-text-${uniqueId}`);
        const riskBar = card.querySelector(`#risk-bar-${uniqueId}`);
        
        // Update text and classes
        riskText.textContent = `${rugRisk}% Risk`;
        riskText.className = `text-xs font-medium ${riskColor.text} tooltip`;
        riskText.setAttribute('data-tooltip', getRiskDescription(rugRisk));
        
        // Update progress bar
        riskBar.className = `h-full ${riskColor.bg} transition-all duration-300`;
        riskBar.style.width = `${rugRisk}%`;
    }, 1000);
    
    return card;
}

// Helper function to get risk colors based on percentage
function getRiskColor(percentage) {
    if (percentage <= 20) {
        return {
            text: 'risk-text-low',
            bg: 'risk-bg-low'
        };
    } else if (percentage <= 50) {
        return {
            text: 'risk-text-medium',
            bg: 'risk-bg-medium'
        };
    } else if (percentage <= 80) {
        return {
            text: 'risk-text-high',
            bg: 'risk-bg-high'
        };
    } else {
        return {
            text: 'risk-text-very-high',
            bg: 'risk-bg-very-high'
        };
    }
}

// Utility function to format numbers (e.g., 1234 -> 1.2k)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Show loading overlay
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Create settings popup
const settingsPopup = document.createElement('div');
settingsPopup.setAttribute('data-settings-popup', '');
settingsPopup.style.cssText = `
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
`;

settingsPopup.innerHTML = `
    <div style="
        background-color: rgb(17 24 39 / 0.95);
        padding: 1.5rem;
        border-radius: 1.25rem;
        max-width: 48rem;
        width: 100%;
        margin: 1rem;
        transform: scale(0.95);
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    ">
        <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center ring-1 ring-blue-500/30">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
            <div class="flex-grow">
                <h3 class="text-xl font-bold text-white">Settings</h3>
                <p class="text-gray-400 text-sm">Customize your experience</p>
            </div>
            <button id="settingsClose" class="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
            <!-- Price Alerts -->
            <div class="p-4 bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-xl relative overflow-hidden group hover:bg-blue-500/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">Price Alerts</h4>
                            <p class="text-xs text-gray-400">Get notified about price movements</p>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <span class="text-xs">Connect wallet to use</span>
                    </div>
                    <button class="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors">
                        Configure
                    </button>
                </div>
            </div>

            <!-- Watchlist -->
            <div class="p-4 bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-xl relative overflow-hidden group hover:bg-purple-500/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">Watchlist</h4>
                            <p class="text-xs text-gray-400">Track your favorite tokens</p>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <span class="text-xs">Connect wallet to use</span>
                    </div>
                    <button class="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-colors">
                        Manage
                    </button>
                </div>
            </div>

            <!-- Historical Data -->
            <div class="p-4 bg-gradient-to-br from-green-500/5 to-green-600/10 rounded-xl relative overflow-hidden group hover:bg-green-500/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">Historical Data</h4>
                            <p class="text-xs text-gray-400">View past insights and analysis</p>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <span class="text-xs">Connect wallet to use</span>
                    </div>
                    <button class="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors">
                        View
                    </button>
                </div>
            </div>

            <!-- Token Comparison -->
            <div class="p-4 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 rounded-xl relative overflow-hidden group hover:bg-yellow-500/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">Token Comparison</h4>
                            <p class="text-xs text-gray-400">Compare multiple tokens</p>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <span class="text-xs">Connect wallet to use</span>
                    </div>
                    <button class="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/20 transition-colors">
                        Compare
                    </button>
                </div>
            </div>

            <!-- Sentiment Analysis -->
            <div class="p-4 bg-gradient-to-br from-pink-500/5 to-pink-600/10 rounded-xl relative overflow-hidden group hover:bg-pink-500/10 transition-all duration-300 col-span-2">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-pink-500/10 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">Sentiment Analysis</h4>
                            <p class="text-xs text-gray-400">View social sentiment graphs</p>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <span class="text-xs">Connect wallet to use</span>
                    </div>
                    <button class="px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-medium hover:bg-pink-500/20 transition-colors">
                        Analyze
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

document.body.appendChild(settingsPopup);

// Settings popup show/hide functions
function showSettingsPopup() {
    settingsPopup.style.opacity = '1';
    settingsPopup.style.pointerEvents = 'auto';
    settingsPopup.querySelector('div').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}

function hideSettingsPopup() {
    settingsPopup.style.opacity = '0';
    settingsPopup.style.pointerEvents = 'none';
    settingsPopup.querySelector('div').style.transform = 'scale(0.95)';
    document.body.style.overflow = '';
}

// Add settings popup event listeners
document.getElementById('settingsButton').addEventListener('click', showSettingsPopup);
settingsPopup.querySelector('#settingsClose').addEventListener('click', hideSettingsPopup);
settingsPopup.addEventListener('click', (e) => {
    if (e.target === settingsPopup) hideSettingsPopup();
}); 

// Utility function to copy text to clipboard
async function copyToClipboard(text, button, event) {
    // Prevent the click from triggering the parent link
    event.preventDefault();
    event.stopPropagation();
    
    try {
        await navigator.clipboard.writeText(text);
        button.classList.add('copied');
        button.innerHTML = `
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
            `;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}