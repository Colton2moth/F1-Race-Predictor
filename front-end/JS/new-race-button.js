import { wait, showError } from "./shared.js";
import { addCircuitSection } from "./circuit-section.js";
import { addSubmitRaceButton } from "./submit-race.js";
import { removePodium } from "./show-podium.js";

// To add the New Race button 
export async function addNewRaceButton () {
  const res = await fetch("./HTML/new-race-button.html");
  const html = await res.text();

  const newRaceButtonContainer = document.getElementById("new-race-button-container");
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const newRaceButton = temp.querySelector(".new-race-button");
  if (!newRaceButton) {
    let errorMsg = "⚠️ Error: new-race-button cannot be found.";
    showError(errorMsg);

    console.log(errorMsg);
    return;
  }

  newRaceButtonContainer.appendChild(newRaceButton);
  
  requestAnimationFrame(() => {
    newRaceButton.classList.remove("hidden");
  });

  newRaceButtonClicked(newRaceButton);
  console.log("📢 Update: New Race button is now visible.");
}

// When the New Race button is clicked...
function newRaceButtonClicked(newRaceButton) {
  newRaceButton.addEventListener("click", async () => {
    if (document.contains(document.querySelector("#prediction-section"))) {
      removePodium();
    }

    newRaceButton.disabled = true;
    newRaceButton.classList.add("hidden");

    await wait(200);

    newRaceButton.remove();
    addCircuitSection();
    addSubmitRaceButton();
    
    console.log("📢 Update: New race button was clicked.")
  });
}