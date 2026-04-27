"use client";

import { useEffect } from "react";

export default function ChatbotWidget() {
    useEffect(() => {
        // Mencegah widget ganda
        if (document.getElementById('redforge-widget-container')) return;

        const botId = "4baee5b6-cb6d-4f82-938a-334eb40413b7";
        const baseUrl = "https://red-forge.vercel.app";

        const styles = `
            #redforge-widget-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #redforge-bubble {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #7C3AED;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s;
            }
            #redforge-bubble:hover {
            transform: scale(1.05);
            }
            #redforge-bubble svg { width: 30px; height: 30px; }

            #redforge-chat-window {
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            }
            #redforge-chat-window.open {
            display: flex;
            }

            #redforge-header {
            background: #7C3AED;
            color: white;
            padding: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            }
            #redforge-close {
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            }

            #redforge-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #f9fafb;
            }

            .rf-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            }
            .rf-msg-user {
            background: #7C3AED;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            }
            .rf-msg-ai {
            background: white;
            color: #111827;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #e5e7eb;
            }

            #redforge-input-area {
            padding: 12px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
            }
            #redforge-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            }
            #redforge-input:focus {
            border-color: #7C3AED;
            }
            #redforge-send {
            background: #7C3AED;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = styles;
        document.head.appendChild(styleTag);

        const container = document.createElement('div');
        container.id = 'redforge-widget-container';
        container.innerHTML = `
            <div id="redforge-chat-window">
            <div id="redforge-header">
                <span>Asisten Virtual</span>
                <button id="redforge-close">&times;</button>
            </div>
            <div id="redforge-messages">
                <div class="rf-msg rf-msg-ai">Halo! Ada yang bisa saya bantu hari ini?</div>
            </div>
            <form id="redforge-input-area">
                <input type="text" id="redforge-input" placeholder="Ketik pertanyaan Anda..." autocomplete="off" />
                <button type="submit" id="redforge-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
            </div>
            <div id="redforge-bubble">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
        `;
        document.body.appendChild(container);

        const bubble = document.getElementById('redforge-bubble');
        const chatWindow = document.getElementById('redforge-chat-window');
        const closeBtn = document.getElementById('redforge-close');
        const form = document.getElementById('redforge-input-area');
        const input = document.getElementById('redforge-input') as HTMLInputElement;
        const messagesDiv = document.getElementById('redforge-messages');

        let chatHistory: any[] = [];

        bubble?.addEventListener('click', () => {
            chatWindow?.classList.add('open');
            if (bubble) bubble.style.display = 'none';
        });

        closeBtn?.addEventListener('click', () => {
            chatWindow?.classList.remove('open');
            if (bubble) bubble.style.display = 'flex';
        });

        function appendMessage(role: string, text: string) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `rf-msg rf-msg-${role === 'user' ? 'user' : 'ai'}`;
            msgDiv.textContent = text;
            messagesDiv?.appendChild(msgDiv);
            if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return msgDiv;
        }

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input?.value?.trim();
            if (!text) return;

            appendMessage('user', text);
            if (input) input.value = '';

            chatHistory.push({ role: 'user', content: text });

            const aiMsgDiv = appendMessage('ai', 'Mengetik...');

            try {
                const response = await fetch(`${baseUrl}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    chatbotId: botId,
                    messages: chatHistory
                    })
                });

                if (!response.ok) throw new Error('API Error');

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let aiText = '';
                aiMsgDiv.textContent = ''; 

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        aiText += chunk;
                        aiMsgDiv.textContent = aiText;
                        if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    }
                }

                chatHistory.push({ role: 'assistant', content: aiText });

            } catch (err) {
                console.error(err);
                aiMsgDiv.textContent = 'Maaf, terjadi kesalahan pada koneksi server.';
            }
        });

        return () => {
            // Cleanup
        };
    }, []);

    return null; // Komponen ini tidak me-render UI bawaan Next.js, hanya script di background
}
