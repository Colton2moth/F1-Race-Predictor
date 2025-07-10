document.getElementById("predict-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const circuit = this.circuit.value;
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
        document.getElementById("result").textContent = "Error occurred.";
        return;
    }

    const data = await res.json();
    document.getElementById("result").textContent =
        data.prediction === 1 ? "Will Podium 🏆" : "Will Not Podium ❌";
});