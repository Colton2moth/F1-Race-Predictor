import { wait, deleteRace, showError } from "./shared.js"
import { resultsAreOut, getDriverPredictions, getRaceCircuit } from "./submit-race.js"

// To show the podium
export async function showPodium() {
    await deleteRace();
    
    const res = await fetch("/front-end/HTML/prediction-section.html");
    const html = await res.text();

    const predictionsContainer = document.getElementById("predictions-container");
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const predictionSection = temp.querySelector("#prediction-section");
    if (!predictionSection) {
        let errorMsg = "⚠️ Error: prediction-section cannot be found.";
        showError(errorMsg);

        console.log(errorMsg);
        return;
    }
    
    predictionsContainer.appendChild(predictionSection);
    putWinningDriversOnPodium();

    requestAnimationFrame(async() => {
    predictionSection.classList.remove("hidden");
    await wait(1500);
    await showPodiumDrivers();
    })
}

// To find the top 3 prediction probabilities from the ML model
function organizedDrivers() {
    const driverPredictions = getDriverPredictions();
    let remainingDrivers = [...driverPredictions];
    let podiumDrivers = [];

    while (podiumDrivers.length < 3) {
        let mostLikelyDriver = null;
        let mostLikelyDriverIndex = 0;

        for (let i = 0; i < remainingDrivers.length; i++) {
            if (!mostLikelyDriver || remainingDrivers[i]["Podium Probability"] > mostLikelyDriver["Podium Probability"]) {
                mostLikelyDriver = remainingDrivers[i];
                mostLikelyDriverIndex = i;
            }
        }

        podiumDrivers.push(mostLikelyDriver);
        remainingDrivers.splice(mostLikelyDriverIndex, 1);
    }

    return podiumDrivers;
}

// To populate the podium with the values of the top podium predicitons 
function putWinningDriversOnPodium() {
    if (!resultsAreOut) return;

    document.querySelector(".race-circuit").innerHTML =` <span>Circuit: ${getRaceCircuit()}</span> `;

    let driversInOrder = organizedDrivers();

    document.querySelector("#first-place-driver .podium-driver-text").textContent = driversInOrder[0]["Driver Name"];
    document.querySelector("#second-place-driver .podium-driver-text").textContent = driversInOrder[1]["Driver Name"];
    document.querySelector("#third-place-driver .podium-driver-text").textContent = driversInOrder[2]["Driver Name"];

    document.querySelector("#first-place-driver .podium-percent-text").textContent = driversInOrder[0]["Podium Probability"] + "%";
    document.querySelector("#second-place-driver .podium-percent-text").textContent = driversInOrder[1]["Podium Probability"] + "%";
    document.querySelector("#third-place-driver .podium-percent-text").textContent = driversInOrder[2]["Podium Probability"] + "%";
}


// To play the animations for the drivers
async function showPodiumDrivers() {
    let firstPlace = document.querySelector("#first-place-driver");
    let secondPlace = document.querySelector("#second-place-driver");
    let thirdPlace = document.querySelector("#third-place-driver");

    requestAnimationFrame(() => thirdPlace.classList.remove("hidden"));

    await wait(3000);
    requestAnimationFrame(() => secondPlace.classList.remove("hidden"));

    await wait(3000);
    requestAnimationFrame(() => firstPlace.classList.remove("hidden"));
}

// To delete the current podium when starting a new race
export function removePodium() {
    const predictionSection = document.querySelector("#prediction-section");
    predictionSection.classList.add("hidden");

    predictionSection.addEventListener("transitionend", () => {
        predictionSection.remove();
        console.log("📢 Update: Podium section has been removed.");
    }, { once: true });
}
