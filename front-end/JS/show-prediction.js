// Helper: display predictions in #predictions-container
function showPredictions(predictions, drivers) {
    const container = document.getElementById("predictions-container");
    container.innerHTML = ""; // Clear old

    predictions.forEach((pred, index) => {
        const div = document.createElement("div");
        div.classList.add("predicted-driver");

        const driverLabel = document.createElement("h3");
        driverLabel.textContent = `Driver ${index + 1}`;

        const prediction = document.createElement("p");
        prediction.textContent = `Podium Prediction: ${pred === 1 ? "🏆 YES" : "❌ NO"}`;

        div.appendChild(driverLabel);
        div.appendChild(prediction);
        container.appendChild(div);
    });

    console.log("✅ Predictions rendered.");
}