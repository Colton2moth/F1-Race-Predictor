import { wait, circuitSectionVisable } from "./shared.js";
import { addCircuitSection } from "./circuit-section.js";

let newRaceButton = null;

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
      console.log("New race button is now visible.");

      newRaceButton.addEventListener("click", async () => {
        newRaceButton.disabled = true;
        newRaceButton.classList.add("hidden");
        await wait(200);
        newRaceButton.remove();
        addCircuitSection();
      });
    });
});

export async function newRaceButtonVisibility() {
  const circuitSectionExists = document.querySelector(".circuit-section") !== null;

  if (!newRaceButton) {
    console.warn("⚠️ newRaceButton is not initialized.");
    return;
  }

  if (circuitSectionExists) {
    newRaceButton.classList.add("hidden");
    await wait(200);
      newRaceButton.remove();
  } else {
    // If button was removed, recreate it
    if (!document.body.contains(newRaceButton)) {
      const container = document.getElementById("new-race-button-container");
      container.appendChild(newRaceButton);
    }

    await wait(300);
    newRaceButton.classList.remove("hidden");
    newRaceButton.disabled = false;
  }
}

