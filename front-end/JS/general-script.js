import { addNewRaceButton } from "./new-race-button.js";

// To make sure all the basic divs are actually in the page
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        console.log("⚠️ Error: main-content div cannot be found.")
        return;
    } else {
        console.log("📢 Update: main-content div was found.")
    }

    const newRaceButtonContainer = document.getElementById("new-race-button-container");
    if (!newRaceButtonContainer) {
        console.log("⚠️ Error: new-race-button-container cannot be found.");
        return;
    } else {
        console.log("📢 Update: new-race-button-container was found.");
    }
    
    const allDrivers = document.getElementById("all-drivers");
    if (!allDrivers) {
        console.log("⚠️ Error: all-drivers div cannot be found.")
        return;
    } else {
        console.log("📢 Update: all-drivers div was found.")
    }

    const predictButtonContainer = document.getElementById("predict-button-container");
    if (!predictButtonContainer) {
        console.log("⚠️ Error: predict-button-container div cannot be found.")
        return;
    } else {
        console.log("📢 Update: predict-button-container div was found.")
    }

    const predictionsContainer = document.getElementById("predictions-container");
    if (!predictionsContainer) {
        console.log("⚠️ Error: predictions-container div cannot be found.")
        return;
    } else {
        console.log("📢 Update: predictions-container div was found.")
    }

    addNewRaceButton();
})