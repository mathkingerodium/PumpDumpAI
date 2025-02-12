// Token Insights Module
console.log('Loading Token Insights Module...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing Token Insights...');
    
    const insightsContainer = document.getElementById('projects');
    console.log('Insights container found:', insightsContainer);

    // Create the search input UI
    function createSearchUI() {
        if (!insightsContainer) {
            console.error('Token insights container not found');
            return;
        }

        console.log('Creating search UI...');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'p-4 border-b border-gray-700';
        searchContainer.innerHTML = `
            <div class="flex gap-2">
                <input type="text" 
                       id="mintAddressInput" 
                       placeholder="Enter token mint address..." 
                       class="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500">
                <button id="searchButton" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    Search
                </button>
            </div>
        `;
        
        // Clear and add search container
        insightsContainer.innerHTML = '';
        insightsContainer.appendChild(searchContainer);
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'tokenInsightsResults';
        resultsContainer.className = 'p-4';
        
        // Add initial welcome message
        resultsContainer.innerHTML = `
            <div class="text-center p-8">
                <div class="text-gray-400 mb-4">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p class="text-lg mb-2">Enter a Token Mint Address</p>
                    <p class="text-sm text-gray-500">Get detailed insights about any Solana token</p>
                </div>
            </div>
        `;
        
        insightsContainer.appendChild(resultsContainer);
        console.log('Search UI created successfully');
        
        // Add event listeners
        const input = document.getElementById('mintAddressInput');
        const button = document.getElementById('searchButton');
        
        if (input && button) {
            console.log('Input and button elements found, adding event listeners...');
            const handleSearch = () => {
                const mintAddress = input.value.trim();
                if (mintAddress) {
                    fetchTokenInsights(mintAddress);
                }
            };
            
            button.addEventListener('click', handleSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }
    }

    // Mock token data
    const mockTokenData = {
        'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
            name: 'BONK',
            symbol: 'BONK',
            price: 0.000001234,
            change24h: 15.6,
            volume24h: 1234567,
            marketCap: 45678901,
            holders: 12345,
            risk: 65,
            imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
            metrics: {
                socialScore: 85,
                liquidityScore: 92,
                communityScore: 78,
                developerScore: 70
            }
        },
        'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': {
            name: 'Jupiter',
            symbol: 'JUP',
            price: 0.456,
            change24h: -5.2,
            volume24h: 9876543,
            marketCap: 98765432,
            holders: 54321,
            risk: 45,
            imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png',
            metrics: {
                socialScore: 95,
                liquidityScore: 88,
                communityScore: 92,
                developerScore: 85
            }
        }
    };

    // Fetch and display token insights
    async function fetchTokenInsights(mintAddress) {
        const resultsContainer = document.getElementById('tokenInsightsResults');
        
        try {
            // Show loading state
            resultsContainer.innerHTML = `
                <div class="flex justify-center items-center p-8">
                    <div class="token-feed-spinner"></div>
                </div>
            `;
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if token exists in mock data
            const token = mockTokenData[mintAddress];
            if (!token) {
                throw new Error('Token not found');
            }
            
            // Display token insights
            displayTokenInsights(token);
            
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="text-center p-8">
                    <div class="text-red-500 mb-4">
                        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-lg mb-2">Token Not Found</p>
                        <p class="text-sm text-gray-400">Please check the mint address and try again</p>
                    </div>
                </div>
            `;
        }
    }

    // Function to get dominant color from image
    function getColorFromImage(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                
                // Get pixel data from the center of the image
                const imageData = ctx.getImageData(
                    Math.floor(canvas.width / 2),
                    Math.floor(canvas.height / 2),
                    1,
                    1
                ).data;
                
                resolve({
                    r: imageData[0],
                    g: imageData[1],
                    b: imageData[2]
                });
            };
            
            img.onerror = () => {
                resolve({ r: 96, g: 165, b: 250 }); // Default to blue if image fails
            };
            
            img.src = imageUrl;
        });
    }

    // Display token insights
    async function displayTokenInsights(token) {
        const resultsContainer = document.getElementById('tokenInsightsResults');
        
        // Get color from image if available
        let gradientColor = { r: 96, g: 165, b: 250 }; // Default blue
        if (token.imageUrl) {
            try {
                gradientColor = await getColorFromImage(token.imageUrl);
            } catch (error) {
                console.error('Error getting image color:', error);
            }
        }
        
        // Add gradient background style with extracted color
        const gradientStyle = token.imageUrl ? 
            `style="background: linear-gradient(to bottom right, rgba(24, 31, 46, 0.9), rgba(17, 24, 39, 0.95)), 
             linear-gradient(45deg, rgba(${gradientColor.r}, ${gradientColor.g}, ${gradientColor.b}, 0.15), 
             rgba(${Math.max(0, gradientColor.r - 50)}, ${Math.max(0, gradientColor.g - 50)}, ${Math.max(0, gradientColor.b - 50)}, 0.25)); 
             background-blend-mode: overlay;"` :
            '';
        
        const formatNumber = (num) => {
            if (!num) return 'N/A';
            if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
            return num.toFixed(2);
        };
        
        const formatTimestamp = (timestamp) => {
            if (!timestamp) return 'N/A';
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        };
        
        const socialLinks = [];
        if (token.twitter) socialLinks.push(`
            <a href="${token.twitter}" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors" title="Twitter">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </a>`);
        if (token.telegram) socialLinks.push(`
            <a href="${token.telegram}" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors" title="Telegram">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.314-.346-.116l-6.406 4.02-2.773-.916c-.598-.183-.608-.6.136-.89l10.833-4.18c.503-.176.943.112.79.89z"/>
                </svg>
            </a>`);
        if (token.website) socialLinks.push(`
            <a href="${token.website}" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors" title="Website">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
            </a>`);
        
        resultsContainer.innerHTML = `
            <div class="glass p-6 rounded-lg transition-all duration-300" ${gradientStyle}>
                <div class="flex items-start justify-between mb-6 relative z-10">
                    <div class="flex items-center gap-4">
                        ${token.imageUrl ? 
                            `<img src="${token.imageUrl}" alt="${token.name}" class="w-16 h-16 rounded-lg shadow-lg ring-1 ring-white/10">` :
                            `<div class="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-white/10">
                                <span class="text-2xl text-gray-400">${token.symbol?.charAt(0) || '?'}</span>
                             </div>`
                        }
                        <div>
                            <h2 class="text-xl font-bold text-white">${token.name || 'Unknown'}</h2>
                            <div class="text-sm text-gray-400 mt-1">${token.symbol || 'Unknown'}</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        ${socialLinks.join('')}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 relative z-10">
                    <div class="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm">
                        <div class="text-sm text-gray-400 mb-1">Market Cap</div>
                        <div class="text-lg font-semibold text-white">$${formatNumber(token.marketCap)}</div>
                    </div>
                    <div class="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm">
                        <div class="text-sm text-gray-400 mb-1">Created</div>
                        <div class="text-lg font-semibold text-white whitespace-nowrap">${formatTimestamp(token.createdTimestamp)}</div>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <button id="analyzeButton" 
                        class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium">
                    Analyze Token
                </button>
            </div>

            <div id="analysisLoading" class="hidden mt-6 text-center">
                <div class="token-feed-spinner mx-auto mb-3"></div>
                <div class="relative h-8 mb-1">
                    <div id="analysisText" class="text-lg font-semibold text-white absolute w-full transition-all duration-300 opacity-0 transform translate-y-2">
                        Analyzing for Bundles
                    </div>
                </div>
                <div class="text-sm text-gray-400">This might take a moment</div>
            </div>
        `;

        // Add click handler for analyze button
        const analyzeButton = document.getElementById('analyzeButton');
        const analysisLoading = document.getElementById('analysisLoading');
        
        analyzeButton.addEventListener('click', () => {
            analyzeButton.classList.add('hidden');
            analysisLoading.classList.remove('hidden');
            startAnalysisAnimation();
        });

        // Analysis animation
        function startAnalysisAnimation() {
            const analysisStates = [
                'Analyzing for Bundles',
                'Analyzing Risk',
                'Analyzing Social Sentiment',
                "Analyzing Dev's Wallet",
                'Analyzing Potential'
            ];
            
            const analysisText = document.getElementById('analysisText');
            let currentIndex = 0;
            
            // Show initial state
            analysisText.style.opacity = '1';
            analysisText.style.transform = 'translateY(0)';
            
            setInterval(() => {
                // Start exit animation
                analysisText.style.opacity = '0';
                analysisText.style.transform = 'translateY(-1rem)';
                
                setTimeout(() => {
                    // Update text
                    currentIndex = (currentIndex + 1) % analysisStates.length;
                    analysisText.textContent = analysisStates[currentIndex];
                    
                    // Start entrance animation
                    analysisText.style.transform = 'translateY(1rem)';
                    requestAnimationFrame(() => {
                        analysisText.style.opacity = '1';
                        analysisText.style.transform = 'translateY(0)';
                    });
                }, 300); // Half of the transition duration
            }, 2000); // Change text every 2 seconds
        }
    }

    // Initialize Token Insights
    try {
        console.log('Attempting to create search UI...');
        createSearchUI();
        console.log('Search UI initialization complete');
    } catch (error) {
        console.error('Error initializing token insights:', error);
        if (insightsContainer) {
            insightsContainer.innerHTML = `
                <div class="text-center p-8">
                    <div class="text-red-400 mb-2">❌ Error</div>
                    <div class="text-sm text-gray-400">Failed to initialize token insights</div>
                </div>
            `;
        }
    }
}); 