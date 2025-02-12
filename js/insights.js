// AI Insights Module
const insightsContainer = document.getElementById('insights');

// Add tabs container
const tabsContainer = document.createElement('div');
tabsContainer.className = 'border-b border-gray-700';
tabsContainer.innerHTML = `
    <div class="flex">
        <button class="tab-button active px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500" data-tab="all">
            All Insights
        </button>
        <button class="tab-button px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors" data-tab="whale">
            Whale Activity
        </button>
        <button class="tab-button px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors" data-tab="trading">
            Trading Signals
        </button>
    </div>
`;

// Insert tabs before insights container
insightsContainer.parentNode.insertBefore(tabsContainer, insightsContainer);

// Remove old tab styles since we're using direct classes
// Add tab click handlers
let activeTab = 'all';
tabsContainer.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // If clicking Whale or Trading, show wallet popup instead of switching tabs
        if (tab === 'whale' || tab === 'trading') {
            window.showWalletPopup();
            return;
        }
        
        // Only proceed with tab switching for 'all' tab
        activeTab = tab;
        
        // Update button states
        tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'border-b-2', 'border-blue-500', 'text-white');
            btn.classList.add('text-gray-400');
        });
        button.classList.remove('text-gray-400');
        button.classList.add('active', 'border-b-2', 'border-blue-500', 'text-white');
        
        // Update insights display
        updateInsights();
    });
});

// Function to determine insight category
function getInsightCategory(insight) {
    const trend = insight.trend.toLowerCase();
    
    if (trend.includes('whale') || trend.includes('wallet') || trend.includes('accumulated')) {
        return 'whale';
    }
    if (trend.includes('long/short') || trend.includes('funding') || trend.includes('volume') || 
        trend.includes('interest') || trend.includes('price') || trend.includes('liquidity') || 
        trend.includes('depth') || trend.includes('resistance') || trend.includes('support') || 
        trend.includes('rsi') || trend.includes('volatility')) {
        return 'trading';
    }
    
    return 'all';
}

// Sample insights data (mocked data)
const mockInsights = [
    {
        source: 'Social',
        trend: 'Large wallet accumulation detected for $BONK',
        prediction: { coin: 'BONK', action: 'bullish', confidence: 0.88 },
        timestamp: new Date()
    },
    {
        source: 'News',
        trend: 'Significant token unlock event for $JUP in next 24h',
        prediction: { coin: 'JUP', action: 'bearish', confidence: 0.85 },
        timestamp: new Date()
    },
    {
        source: 'Social',
        trend: 'Unusual options activity detected on $PYTH',
        prediction: { coin: 'PYTH', action: 'neutral', confidence: 0.82 },
        timestamp: new Date()
    },
    {
        source: 'Twitter',
        trend: '$TENSOR buy pressure increasing on multiple DEXs',
        prediction: { coin: 'TENSOR', action: 'bullish', confidence: 0.91 },
        timestamp: new Date()
    },
    {
        source: 'News',
        trend: '$ORCA liquidity depth down 35% in 30min',
        prediction: { coin: 'ORCA', action: 'bearish', confidence: 0.87 },
        timestamp: new Date()
    }
];

// Larger pool of realistic insights for random selection
const insightPool = {
    trends: [
        // Price action signals
        '$COIN price up {n}% in last hour on {x}x volume',
        '$COIN seeing {n}% sell-side pressure increase',
        'Large buy wall ({n}K) placed for $COIN at {price}',
        '$COIN liquidity depth down {n}% in 30min',
        
        // Whale activity
        'Whale wallet bought {n}K $COIN at {price}',
        'Whale wallet moved ${n}M of $COIN to DEX',
        'Top {n} wallets accumulated {x}% of $COIN supply',
        'Whale wallet staked {n}K $COIN tokens',
        
        // Trading signals
        '$COIN long/short ratio at {n}:{x}',
        '$COIN funding rate at {n}% (24h high)',
        '$COIN open interest up {n}% in 1h',
        'DEX volume for $COIN up {n}% vs 24h avg',
        
        // Market structure
        '$COIN breaking {n}-day resistance level',
        '$COIN RSI divergence detected at {n}',
        '$COIN market depth ratio at {n}:{x}',
        '$COIN volatility up {n}% vs 24h avg'
    ],
    coins: ['BONK', 'JUP', 'PYTH', 'TENSOR', 'RAY', 'ORCA', 'MSOL', 'SHDW', 'DUST', 'MEAN', 'HADES', 'CROWN'],
    sources: ['Twitter', 'News', 'Social']
};

// Source icons mapping
const sourceIcons = {
    Twitter: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>`,
    News: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
    </svg>`,
    Social: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
    </svg>`
};

// Action colors mapping
const actionColors = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-yellow-400'
};

function createInsightCard(insight) {
    const card = document.createElement('div');
    
    // Define gradient colors based on action
    const gradientColors = {
        bullish: {
            from: '#132516',
            to: '#0f1c12',
            text: '#34d399' // green
        },
        bearish: {
            from: '#251313',
            to: '#1c0f0f',
            text: '#ef4444' // red
        },
        neutral: {
            from: '#252313',
            to: '#1c1a0f',
            text: '#fbbf24' // yellow
        }
    };
    
    const colors = gradientColors[insight.prediction.action];
    
    card.className = 'mb-2 p-3 flex flex-col relative overflow-hidden transition-all duration-300 rounded-lg cursor-pointer group';
    card.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%);
    `;
    
    // Add styles for hover effect
    const style = document.createElement('style');
    style.textContent = `
        .insight-card-${Date.now()} {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .insight-card-${Date.now()}:hover {
            transform: translateY(-2px);
            border-color: ${colors.text}40;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .insight-card-${Date.now()}::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, transparent, ${colors.text}10, transparent);
            transform: skewX(-15deg);
            transition: transform 0.8s ease;
        }
        .insight-card-${Date.now()}:hover::after {
            transform: translateX(100%) skewX(-15deg);
        }
    `;
    document.head.appendChild(style);
    
    // Add unique class for the hover effect
    card.classList.add(`insight-card-${Date.now()}`);
    
    const actionClass = insight.prediction.action === 'bullish' ? 'bg-green-400' :
                       insight.prediction.action === 'bearish' ? 'bg-red-400' : 'bg-yellow-400';
    
    card.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800/80">
                    <span class="text-gray-400">${sourceIcons[insight.source]}</span>
                </div>
                <span class="text-xs font-medium text-gray-400">${insight.source}</span>
            </div>
            <div class="flex items-center">
                <div class="${actionClass} w-1.5 h-1.5 rounded-full"></div>
            </div>
        </div>
        <div class="mt-2 mb-3">
            <span class="text-sm font-medium" style="color: ${colors.text}">${insight.trend}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5">
                <span class="font-semibold tracking-wide" style="color: ${colors.text}">${insight.prediction.coin}</span>
                <span class="${actionColors[insight.prediction.action]} font-medium">
                    ${insight.prediction.action === 'bullish' ? `
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    ` : insight.prediction.action === 'bearish' ? `
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/>
                        </svg>
                    ` : `
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h10"/>
                        </svg>
                    `}
                </span>
            </div>
            <span class="text-gray-500 font-medium">
                ${new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    `;

    // Add click handler to show wallet popup
    card.addEventListener('click', () => {
        // Find the popup in the DOM (created in app.js)
        const popup = document.querySelector('[data-wallet-popup]');
        if (popup) {
            // Call the showPopup function from app.js
            window.showWalletPopup();
        }
    });
    
    return card;
}

function updateInsights() {
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    // Filter insights based on active tab
    const filteredInsights = mockInsights.filter(insight => {
        if (activeTab === 'all') return true;
        return getInsightCategory(insight) === activeTab;
    });
    
    // Create and append insight cards
    filteredInsights.forEach(insight => {
        const card = createInsightCard(insight);
        insightsContainer.appendChild(card);
    });
}

// Initialize insights
document.addEventListener('DOMContentLoaded', () => {
    updateInsights();
    
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        const newInsight = {
            source: ['Social', 'News', 'Twitter'][Math.floor(Math.random() * 3)],
            trend: `${['$BONK', '$JUP', '$PYTH', '$TENSOR', '$ORCA'][Math.floor(Math.random() * 5)]} ${['volume spike', 'price movement', 'social sentiment change'][Math.floor(Math.random() * 3)]}`,
            prediction: {
                coin: ['BONK', 'JUP', 'PYTH', 'TENSOR', 'ORCA'][Math.floor(Math.random() * 5)],
                action: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
                confidence: (0.75 + Math.random() * 0.2).toFixed(2)
            },
            timestamp: new Date()
        };
        
        mockInsights.unshift(newInsight);
        if (mockInsights.length > 10) mockInsights.pop();
        updateInsights();
    }, 30000);
});

// Helper function to generate realistic numbers
function getRandomMetric(type) {
    switch(type) {
        case 'percentage':
            return Math.floor(Math.random() * 80 + 20); // 20-100%
        case 'small_percentage':
            return (Math.random() * 4 + 1).toFixed(2); // 1-5%
        case 'price':
            return (Math.random() * 10).toFixed(3); // 0-10 with 3 decimals
        case 'volume_multiple':
            return Math.floor(Math.random() * 8 + 2); // 2-10x
        case 'wallet_amount':
            return Math.floor(Math.random() * 900 + 100); // 100-1000K
        case 'ratio':
            return Math.floor(Math.random() * 3 + 1); // 1-4
        default:
            return 0;
    }
}