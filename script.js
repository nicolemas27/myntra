function subscribe() {
    // Simulate subscription process
    setTimeout(() => {
        // Display confirmation message and hide subscription section
        document.getElementById('confirmation').style.display = 'block';
        document.querySelector('.subscription').style.display = 'none';
        document.getElementById('confirmation').scrollIntoView({ behavior: 'smooth' });
    }, 1500); // Simulating a delay for demonstration

    // You can add error handling here if needed
}

const optionsButton = document.querySelector('.options-button');
optionsButton.addEventListener('click', () => {
    // Add your options menu logic here
    // For example, open a dropdown menu with options
});
