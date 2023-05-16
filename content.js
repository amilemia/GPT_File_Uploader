// Create the button
const button = document.createElement("button");
button.textContent = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Create the progress element
const progress = document.createElement("progress");
progress.style.width = "99%";
progress.style.height = "5px";
progress.style.backgroundColor = "grey";

// Create the progress bar
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

// Append the progress bar to the progress element
progress.appendChild(progressBar);

// Find the element to insert before
const targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");

// Insert the button and progress element before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// Function to submit each chunk of text to the conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}

// Function to check if chatgpt is ready
async function checkChatGPTReady() {
  let chatGPTReady = false;
  while (!chatGPTReady) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    chatGPTReady = !document.querySelector(".text-2xl > span:not(.invisible)");
  }
}

// Event listener for the button click
button.addEventListener("click", async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt, .js, .py, .html, .css, .json, .csv, .h, .c";

  // Event listener for file selection
  input.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const filename = file.name;
    const reader = new FileReader();

    // Read the file as text
    reader.readAsText(file);

    reader.onload = async () => {
      const fileText = reader.result;
      const chunkSize = 15000;
      const numChunks = Math.ceil(fileText.length / chunkSize);

      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = fileText.substring(start, end);

        await submitConversation(chunk, i + 1, filename);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = "blue";
      await checkChatGPTReady();
    };
  });

  // Trigger file selection
  input.click();
});