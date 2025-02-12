// Wallet Connection
const walletButton = document.getElementById('walletButton');
let wallet = null;

async function connectWallet() {
    try {
        // Check if Phantom is installed
        const isPhantomInstalled = window.solana && window.solana.isPhantom;
        
        if (!isPhantomInstalled) {
            // Show install prompt
            const message = document.createElement('div');
            message.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg';
            message.innerHTML = `
                Phantom wallet is not installed. 
                <a href="https://phantom.app/" target="_blank" class="underline">Click here to install</a>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 5000);
            return;
        }
        
        // Connect to wallet
        const resp = await window.solana.connect();
        wallet = resp.publicKey.toString();
        
        // Update button text
        walletButton.innerHTML = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
        walletButton.classList.add('connected');
        
        // Show access message
        const messageContainer = document.createElement('div');
        messageContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
        messageContainer.innerHTML = `
            <div class="bg-gray-900 p-8 rounded-lg max-w-lg mx-4 border border-gray-700 shadow-xl transform transition-transform duration-300 scale-95">
                <div class="flex flex-col items-center text-center gap-4">
                    <div class="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">Welcome to PumpDumpAI! 🚀</h3>
                    <p class="text-gray-300 mb-2">You're early! PumpDumpAI is currently in early access mode, collecting a community of dedicated traders and analysts.</p>
                    <p class="text-gray-300 mb-4">When the timer hits zero, we'll open full access to everyone - but $PumpDumpAI holders will retain special privileges and features.</p>
                    <div class="bg-blue-500/10 p-4 rounded-lg mb-4">
                        <p class="text-blue-400 text-sm">Your wallet has been recorded for $PumpDumpAI token verification. In the meantime, explore our demo features to see what's coming!</p>
                    </div>
                    <button class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium hover:shadow-lg hover:-translate-y-0.5">
                        Continue to Demo
                    </button>
                </div>
            </div>
        `;
        messageContainer.setAttribute('data-modal-overlay', '');
        
        // Add click outside to close
        messageContainer.addEventListener('click', (e) => {
            if (e.target === messageContainer) {
                closeModal(messageContainer);
            }
        });
        
        document.body.appendChild(messageContainer);
        
        // Trigger animation after a brief delay
        setTimeout(() => {
            messageContainer.classList.add('opacity-100');
            messageContainer.querySelector('.transform').classList.remove('scale-95');
        }, 50);
        
        // Add keyboard support
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(messageContainer);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Update the close button
        const closeButton = messageContainer.querySelector('button');
        closeButton.onclick = () => closeModal(messageContainer);
        
    } catch (err) {
        console.error('Error connecting wallet:', err);
        
        // Show error message with improved styling
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-2';
        message.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Failed to connect wallet. Please try again.</span>
            </div>
        `;
        document.body.appendChild(message);
        
        // Trigger animation
        setTimeout(() => {
            message.classList.remove('opacity-0', 'translate-y-2');
        }, 50);
        
        setTimeout(() => {
            message.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Helper function for closing modal with animation
function closeModal(modal) {
    modal.classList.remove('opacity-100');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => modal.remove(), 300);
}

// Handle wallet button click
walletButton.addEventListener('click', connectWallet);

// Handle wallet events
if (window.solana) {
    window.solana.on('connect', () => {
        console.log('Wallet connected!');
    });
    
    window.solana.on('disconnect', () => {
        console.log('Wallet disconnected!');
        wallet = null;
        walletButton.textContent = 'Connect Wallet';
        walletButton.classList.remove('connected');
    });
}

// Check if wallet was previously connected
window.addEventListener('load', async () => {
    try {
        if (window.solana && window.solana.isPhantom) {
            const resp = await window.solana.connect({ onlyIfTrusted: true });
            wallet = resp.publicKey.toString();
            walletButton.innerHTML = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
            walletButton.classList.add('connected');
        }
    } catch (err) {
        // User hasn't connected to the app yet or has explicitly disconnected
        console.log('No pre-existing connection:', err);
    }
}); 