const recipeContent = document.getElementById("recipeContent");
const themeToggle = document.getElementById("themeToggle");
const ingredientsInput = document.getElementById("ingredients");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const keyMessage = document.getElementById("keyMessage");

// Recipe History
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Display saved recipes
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("recipeHistory")) || [];

    historyList.innerHTML = "";

    history.forEach(function (item, index) {
        const li = document.createElement("li");
        const button = document.createElement("button");

        button.textContent = item.ingredients + " - " + item.date;
        button.setAttribute("data-index", index);

        li.appendChild(button);
        historyList.appendChild(li);
    });
}

// Show a saved recipe when clicked
historyList.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        const index = event.target.getAttribute("data-index");
        const history = JSON.parse(localStorage.getItem("recipeHistory")) || [];

        recipeContent.textContent = history[index].recipe;
        message.textContent = "Previous recipe loaded.";
        message.style.color = "green";
    }
});

// Delete all saved recipes
clearHistoryBtn.addEventListener("click", function () {
    localStorage.removeItem("recipeHistory");
    displayHistory();
    message.textContent = "Recipe history cleared.";
    message.style.color = "green";
});

// Load history when the website opens
displayHistory();

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
// Generate a recipe using Gemini AI
generateBtn.addEventListener("click", async function () {

    const ingredients = ingredientsInput.value.trim();
    const apiKey = apiKeyInput.value.trim() ||
               localStorage.getItem("geminiApiKey") || "";
    const diet = document.getElementById("diet").value;
    const time = document.getElementById("time").value;
    

    // Check ingredients
    if (ingredients === "") {
        message.textContent = "Please enter your ingredients first.";
        message.style.color = "red";
        return;
    }

    // Check API key
    if (!apiKey) {
        message.textContent = "Please save your Gemini API key first.";
        message.style.color = "red";
        return;
    }

    message.textContent = "Generating your recipe...";
    generateBtn.disabled = true;
    generateBtn.textContent = "⏳ Generating...";
    message.style.color = "green";

    const prompt = `
Create one simple recipe using: ${ingredients}.

Diet: ${diet}
Maximum cooking time: ${time}

Include:
1. Recipe name
2. Ingredients with quantities
3. Five short cooking steps
4. Preparation and cooking time
5. One cooking tip

Use simple English. Keep it concise and complete.
`;

    try {
        
const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ],
          generationConfig: {
    maxOutputTokens: 800
}
        })
    }
);


        if (!response.ok) {
    const errorData = await response.json();

    console.log("Gemini API Error:", errorData);

    throw new Error(
        errorData.error?.message || "Gemini API request failed."
    );
}

        const data = await response.json();

        const recipe = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("\n")
            .trim();

        if (!recipe) {
            throw new Error("No recipe was generated. Please try again.");
        }

        // Display the generated recipe
recipeContent.textContent = recipe;

// Save recipe in history
const history = JSON.parse(localStorage.getItem("recipeHistory")) || [];

history.unshift({
    ingredients: ingredients,
    recipe: recipe,
    date: new Date().toLocaleDateString()
});

localStorage.setItem("recipeHistory", JSON.stringify(history));

// Update history section
displayHistory();

message.textContent = "Recipe generated successfully!";
message.style.color = "green";

    } catch(error) {
    message.textContent = error.message || "Something went wrong. Please try again.";
    message.style.color = "red";
} finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "✨ Generate Recipe";
}
});



// Load the saved API key when the website opens
apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";

// Save the API key
saveKeyBtn.addEventListener("click", function () {
    const apiKey = apiKeyInput.value.trim();

    if (apiKey === "") {
        localStorage.removeItem("geminiApiKey");
        keyMessage.textContent = "Please enter your API key.";
        keyMessage.style.color = "red";
        return;
    }

    try {
        localStorage.setItem("geminiApiKey", apiKey);

        if (localStorage.getItem("geminiApiKey") === apiKey) {
            keyMessage.textContent = "API key saved successfully!";
            keyMessage.style.color = "green";
        } else {
            throw new Error("Key verification failed");
        }
    } catch (error) {
        keyMessage.textContent = "Unable to save API key.";
        keyMessage.style.color = "red";
    }
});
// Copy the generated recipe
copyBtn.addEventListener("click", async function () {
    const recipe = recipeContent.innerText.trim();

    if (!recipe || recipe === "Your generated recipe will appear here.") {
        message.textContent = "Generate a recipe first.";
        message.style.color = "red";
        return;
    }

    try {
        await navigator.clipboard.writeText(recipe);
        message.textContent = "Recipe copied successfully!";
        message.style.color = "green";
    } catch (error) {
        message.textContent = "Unable to copy. Please try again.";
        message.style.color = "red";
    }
});
// Download the generated recipe
downloadBtn.addEventListener("click", function () {
    const recipe = recipeContent.innerText.trim();

    if (!recipe || recipe === "Your generated recipe will appear here.") {
        message.textContent = "Generate a recipe first.";
        message.style.color = "red";
        return;
    }

    const file = new Blob([recipe], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(file);
    link.download = "Pett-Pooja-Recipe.txt";
    link.click();

    URL.revokeObjectURL(link.href);

    message.textContent = "Recipe downloaded successfully!";
    message.style.color = "green";
});