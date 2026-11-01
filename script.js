
const themeToggle = document.getElementById("themeToggle");
const ingredientsInput = document.getElementById("ingredients");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");

// Load the saved theme when the website opens
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

// Switch between dark mode and light mode
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});

// Check the ingredients before generating a recipe
generateBtn.addEventListener("click", function () {
    const ingredients = ingredientsInput.value.trim();

    if (ingredients === "") {
        message.textContent = "Please enter your ingredients first.";
        message.style.color = "red";
        ingredientsInput.focus();
        return;
    }

    message.textContent = "Ingredients added! AI recipe generation is our next step.";
    message.style.color = "green";
});

// API Key Settings
const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const keyMessage = document.getElementById("keyMessage");

// Load the saved API key when the website opens
apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";

// Save the API key
saveKeyBtn.addEventListener("click", function () {
    const apiKey = apiKeyInput.value.trim();

    if (apiKey === "") {
        keyMessage.textContent = "Please enter your API key.";
        keyMessage.style.color = "red";
        return;
    }

    localStorage.setItem("geminiApiKey", apiKey);

    keyMessage.textContent = "API key saved successfully!";
    keyMessage.style.color = "green";
});