import { wait, deleteRace } from "./shared.js"
import { resultsAreOut, getDriverPredictions } from "./submit-race.js"

export async function showPodium() {
    await deleteRace();
    
    const res = await fetch("/front-end/HTML/prediction-section.html");
    const html = await res.text();

    const predictionsContainer = document.getElementById("predictions-container");
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const predictionSection = temp.querySelector("#prediction-section");
    if (!predictionSection) {
        console.log("⚠️ Error: prediction-section cannot be found.");
        return;
    }
    
    predictionsContainer.appendChild(predictionSection);
    putWinningDriversOnPodium();

    requestAnimationFrame(async() => {
    predictionSection.classList.remove("hidden");
    await wait(500);
    })
}

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


function putWinningDriversOnPodium() {
    if (!resultsAreOut) return;

    let driversInOrder = organizedDrivers();

    document.querySelector("#first-place-driver .podium-driver-text").textContent = driversInOrder[0]["Driver Name"];
    document.querySelector("#second-place-driver .podium-driver-text").textContent = driversInOrder[1]["Driver Name"];
    document.querySelector("#third-place-driver .podium-driver-text").textContent = driversInOrder[2]["Driver Name"];

    document.querySelector("#first-place-driver .podium-percent-text").textContent = driversInOrder[0]["Podium Probability"] + "%";
    document.querySelector("#second-place-driver .podium-percent-text").textContent = driversInOrder[1]["Podium Probability"] + "%";
    document.querySelector("#third-place-driver .podium-percent-text").textContent = driversInOrder[2]["Podium Probability"] + "%";
}

export function resetPodium() {
    const predictionSection = document.querySelector("#prediction-section");
    predictionSection.classList.add("hidden");

    predictionSection.addEventListener("transitionend", () => {
        predictionSection.remove();
        console.log("📢 Update: Podium section has been removed.");
    }, { once: true });
}
