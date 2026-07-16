/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const workerUrl = 'https://loral-chatbot.andrewevera63.workers.dev/';


/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show message
  chatWindow.innerHTML = "Creating your personalized beauty recommendation...";
});


// Conversation history
const messages = [
  {
    role: "system",
    content:
      "You are the L'Oréal Beauty Assistant. Only answer questions about L'Oréal makeup, skincare, haircare, fragrances, beauty routines, and beauty recommendations. If asked anything unrelated, politely explain that you only answer beauty-related questions."
  }
];

// Initial greeting
addMessage("assistant", "👋 Hi! I'm the L'Oréal Beauty Assistant. Ask me about skincare, makeup, haircare, fragrances, or beauty routines.");

// Submit form
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();

  if (!question) return;

  addMessage("user", question);

  messages.push({
    role: "user",
    content: question
  });

  userInput.value = "";

  try {

    const response = await fetch(workerUrl, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        messages: messages
      })

    });

    const data = await response.json();

    const reply = data.choices[0].message.content;

    addMessage("assistant", reply);

    messages.push({
      role: "assistant",
      content: reply
    });

  } catch (error) {

    console.error(error);

    addMessage(
      "assistant",
      "Sorry! I couldn't connect to the AI."
    );

  }

});

// Display messages
function addMessage(sender, text) {

  const message = document.createElement("div");

  message.classList.add("msg", sender);

  if (sender === "user") {

    message.innerHTML = `<strong>You:</strong><br>${text}`;

  } else {

    message.innerHTML = `<strong>L'Oréal Assistant:</strong><br>${text}`;

  }

  chatWindow.appendChild(message);

  chatWindow.scrollTop = chatWindow.scrollHeight;

}