document.addEventListener('DOMContentLoaded', () => {
    // ─── UI ELEMENTS ──────────────────────────────────────────────────────
    const whatsappLauncher = document.getElementById('whatsapp-launcher');
    const chatTeaser = document.getElementById('chat-teaser');
    const teaserCloseBtn = document.getElementById('teaser-close-btn');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const heroChatTrigger = document.getElementById('hero-chat-trigger');

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // ─── WIDGET COLLAPSE/EXPAND INTERACTION ──────────────────────────────
    
    // Toggle chat widget visibility when clicking the launcher
    function openChatWidget() {
        chatWidget.classList.remove('hidden');
        chatTeaser.classList.add('hidden'); // Hide teaser once chat is open
        userInput.focus();
        
        // Remove the notification dot if present
        const notificationDot = whatsappLauncher.querySelector('.notification-dot');
        if (notificationDot) {
            notificationDot.style.display = 'none';
        }
    }

    function toggleChatWidget() {
        if (chatWidget.classList.contains('hidden')) {
            openChatWidget();
        } else {
            chatWidget.classList.add('hidden');
        }
    }

    whatsappLauncher.addEventListener('click', (e) => {
        // Prevent click events if triggered by clicking internal nodes
        toggleChatWidget();
    });

    // Close chat widget
    closeChat.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent trigger to reopen
        chatWidget.classList.add('hidden');
    });

    // Landing page CTA directly opens chat
    if (heroChatTrigger) {
        heroChatTrigger.addEventListener('click', () => {
            openChatWidget();
        });
    }

    // Teaser Bubble interactions
    if (teaserCloseBtn) {
        teaserCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering open
            chatTeaser.classList.add('hidden');
        });
    }

    if (chatTeaser) {
        chatTeaser.addEventListener('click', () => {
            openChatWidget();
        });
    }

    // Auto-engage: Automatically show teaser bubble after 2 seconds
    setTimeout(() => {
        if (chatWidget.classList.contains('hidden') && chatTeaser) {
            chatTeaser.classList.remove('hidden');
        }
    }, 2000);

    // ─── CHATBOT LOGIC & API COMMUNICATIONS ───────────────────────────────

    function addMessage(text, type, sources = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        let content = text;
        if (sources.length > 0) {
            content += '<div class="sources"><strong>المصادر المرجعية:</strong>';
            sources.forEach(source => {
                // Ensure proper display name for source title
                const title = source.title || 'وثيقة مرجعية';
                content += `<a href="${source.link}" target="_blank" class="source-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-left:4px;">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>${title}</a>`;
            });
            content += '</div>';
        }
        
        messageDiv.innerHTML = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSend() {
        const query = userInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        userInput.value = '';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.textContent = 'حورس يفكر...';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: query })
            });

            const data = await response.json();
            chatMessages.removeChild(typingIndicator);

            if (data.error) {
                addMessage(`خطأ: ${data.error}`, 'ai');
            } else {
                addMessage(data.answer, 'ai', data.sources);
            }
        } catch (error) {
            chatMessages.removeChild(typingIndicator);
            addMessage(`عذراً، فشل الاتصال بالدليل السياحي: ${error.message}`, 'ai');
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
