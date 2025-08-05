import { wait } from "./shared.js";
import { addCircuitSection } from "./circuit-section.js";

let newRaceButton = null;

// To add the New Race button 
document.addEventListener("DOMContentLoaded", () => {
  const newRaceButtonContainer = document.getElementById("new-race-button-container");

  fetch("/front-end/HTML/new-race-button.html")
    .then(res => res.text())
    .then(html => {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      newRaceButton = temp.querySelector(".new-race-button");

      if (!newRaceButton) {
        console.log("⚠️ Error: new-race-button cannot be found.");
        return;
      }

      newRaceButtonContainer.appendChild(newRaceButton);
      console.log("📢 Update: New race button is now visible.");

      newRaceButtonClicked(newRaceButton);
    });
});

// When the New Race button is clicked...
function newRaceButtonClicked(newRaceButton) {
  newRaceButton.addEventListener("click", async () => {
    newRaceButton.disabled = true;
    newRaceButton.classList.add("hidden");

    await wait(200);

    newRaceButton.remove();
    addCircuitSection();
    console.log("📢 Update: New race button was clicked.")
  });
}

// To update the visibility of the New Race button
export async function newRaceButtonVisibility() {
  const circuitSectionExists = document.querySelector(".circuit-section") !== null;

  if (!newRaceButton) {
    console.warn("⚠️ Error: Cannot find newRaceButton.");
    return;
  }

  if (circuitSectionExists) {
    newRaceButton.classList.add("hidden");
    await wait(200);
      newRaceButton.remove();
  } else {
    if (!document.body.contains(newRaceButton)) {
      const container = document.getElementById("new-race-button-container");
      container.appendChild(newRaceButton);
      console.log("📢 Update: New race button is now visible.")
    }

    await wait(300);
    newRaceButton.classList.remove("hidden");
    newRaceButton.disabled = false;
  }
}

