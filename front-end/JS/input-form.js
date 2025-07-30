document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");

    if (mainContent) {
        const inputFormContainer = document.getElementById("input-form-container");
        const newRaceButton = document.getElementById("new-race-button");

        let inputFormHTML = "";

        // Fetch the form template once
        fetch("/front-end/HTML/input-form.html")
            .then(res => res.text())
            .then(html => {
                inputFormHTML = html;

                // NEW RACE button listener
                newRaceButton.addEventListener("click", () => {
                    console.log("new race button was clicked");
                    appendNewForm();
                });

                // Global click listener for add-driver-button inside any form
                document.addEventListener("click", function (event) {
    const clickedAddBtn = event.target.closest(".add-driver-button");
    if (clickedAddBtn) {
        appendNewForm();
    }
});
            });

       function appendNewForm() {
    if (!inputFormHTML) return;

    const temp = document.createElement("div");
    temp.innerHTML = inputFormHTML;

    const inputForm = temp.querySelector("#input-form");
    if (!inputForm) return;

    inputForm.style.display = "block"; // override display: none;
    inputFormContainer.appendChild(inputForm);

    setupFormLogic(inputForm);
}


        function setupFormLogic(wrapper) {
            const form = wrapper.querySelector("form");
            const circuitBoxes = wrapper.querySelectorAll(".circuit-box");
            const selectedInput = wrapper.querySelector("#selected-circuit");

            const resultBox = document.createElement("div");
            resultBox.className = "results-text";
            wrapper.appendChild(resultBox);

            circuitBoxes.forEach(box => {
                box.addEventListener("click", () => {
                    circuitBoxes.forEach(b => b.classList.remove("selected-circuit"));
                    box.classList.add("selected-circuit");
                    selectedInput.value = box.dataset.value;
                });
            });

            form.addEventListener("submit", async function (e) {
                e.preventDefault();

                const circuit = wrapper.querySelector('.selected-circuit')?.dataset.value;
                const fp1 = parseFloat(this.fp1.value);
                const fp2 = parseFloat(this.fp2.value);
                const fp3 = parseFloat(this.fp3.value);
                const quali = parseFloat(this.quali.value);

                const res = await fetch("http://127.0.0.1:5000/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ circuit, fp1, fp2, fp3, quali })
                });

                if (!res.ok) {
                    resultBox.textContent = "Error occurred.";
                    return;
                }

                const data = await res.json();
                resultBox.textContent = data.prediction === 1 ? "Will Podium 🏆" : "Will Not Podium ❌";
            });
        }
    }
});
