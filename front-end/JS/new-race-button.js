import { wait, circuitSectionVisable, driverFormCount } from "./shared.js";
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

        export function newRaceButtonVisibility() {
        if (circuitSectionVisable) {
            newRaceButton.classList.add("hidden");
            setTimeout(() => {
                newRaceButton.remove();
            }, 200);
        } else if (!circuitSectionVisable) {
            newRaceButton.classList.remove("hidden");
            newRaceButton.style.display = "flex";
        }
    }
