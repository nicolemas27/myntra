let voteCount = 0;

function vote() {
    voteCount++;
    document.getElementById('vote-count').innerText = `Votes: ${voteCount}`;
    alert('Thank you for voting!');
}

function swipe() {
    alert('You swiped to the next fashion!');
}

function addComment() {
    const messageInput = document.getElementById('chat-message');
    const message = messageInput.value.trim();
    if (message) {
        const chatBody = document.getElementById('chat-body');
        const newComment = document.createElement('p');
        newComment.innerHTML = `<strong>You</strong>: ${message}`;
        chatBody.appendChild(newComment);
        messageInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
    } else {
        alert('Please enter a comment.');
    }
}
