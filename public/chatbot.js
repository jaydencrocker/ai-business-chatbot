async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  document.getElementById('userInput').value = '';

  const chat = document.getElementById('chat');
  chat.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput })
  });

  const data = await response.json();
  chat.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
}