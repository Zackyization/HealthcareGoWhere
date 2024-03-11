<template>
    <!-- Your HTML goes here -->
    <div class="chat-window">
      <div class="message" v-for="(message,index) in messages" :key="index" :class="{ 'from-user': message.fromUser }">
        {{ message.text }}
      </div>
    </div>
    <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message...">
</template>

<script>
import axios from 'axios';

export default {
    name: 'ChatBot',
    data() {
        return {
            messages: [],
            userInput: ''
        }

    },
    methods: {
        sendMessage() {
            const text = this.userInput.trim();
            if (text) {
                this.messages.push({ text: text, fromUser: true });
                this.userInput = ''; // Clear input after sending

                // Send the message to the backend
                axios.post(`${process.env.VUE_APP_API_URL}/api/message`, { text: text })
                    .then(response => {
                        // The response from the server should be structured as { message: "text" }
                        const aiText = response.data.message;
                        this.messages.push({ text: aiText, fromUser: false }); // Display AI response
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        this.messages.push({ text: "AI is currently unavailable. Please try again later.", fromUser: false });
                        // You can also display error messages to the user by pushing them into the messages array
                    });
            }
        }
    }
};
</script>

<style scoped>
/* Chatbot Styles */
.chat-window {
    width: 100%;
    /* max-width: 600px; */
    height: 80%;
    border: 1px solid #ddd;
    background-color: white;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.message {
    margin: 5px;
    padding: 10px;
    border-radius: 20px;
    background-color: #e0e0e0;
    align-self: flex-start;
    max-width: 75%;
}

.from-user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
}

input[type="text"] {
    width: 100%;
    max-width: 600px;
    padding: 10px;
    margin-top: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
}
</style>