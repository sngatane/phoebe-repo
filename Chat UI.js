class DisaChatUI {
    constructor() {
        this.chatBox = document.getElementById('chat-box');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.fileUpload = document.getElementById('file-upload');
        this.fileInfo = document.getElementById('file-info');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.fileInfo.textContent = `Selected: ${e.target.files[0].name}`;
                this.fileInfo.style.color = '#9B59B6';
            }
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        const file = this.fileUpload.files[0];
        
        if (!message && !file) return;

        // Display user message
        if (message) {
            this.displayMessage(message, 'user-message');
            this.chatInput.value = '';
        }

        // Display file upload notification
        if (file) {
            this.displayMessage(`Uploaded: ${file.name}`, 'user-message');
        }

        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            if (message) formData.append('text', message);

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            this.displayMessage(data.response, 'bot-message');
            
            // Reset file upload
            if (file) {
                this.fileUpload.value = '';
                this.fileInfo.textContent = '';
            }
        } catch (error) {
            console.error('Error:', error);
            this.displayMessage("Sorry, I'm having trouble responding. Please try again.", 'bot-message');
        }
    }

    displayMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', className);
        messageElement.textContent = text;
        this.chatBox.appendChild(messageElement);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
}

// Initialize chat when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new DisaChatUI();
});
