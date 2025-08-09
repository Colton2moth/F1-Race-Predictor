import { showError } from "./shared.js";
import { addNewRaceButton } from "./new-race-button.js";

// To check that all the container divs are in the DOM + add the first newRaceButton
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        let errorMsg = "⚠️ Error: main-content div cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg);
        return;
    } else {
        console.log("📢 Update: main-content div was found.")
    }

    const newRaceButtonContainer = document.getElementById("new-race-button-container");
    if (!newRaceButtonContainer) {
        let errorMsg = "⚠️ Error: new-race-button-container cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg);
        return;
    } else {
        console.log("📢 Update: new-race-button-container was found.");
    }
    
    const allDrivers = document.getElementById("all-drivers");
    if (!allDrivers) {
        let errorMsg = "⚠️ Error: all-drivers div cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg);
        return;
    } else {
        console.log("📢 Update: all-drivers div was found.")
    }

    const predictButtonContainer = document.getElementById("predict-button-container");
    if (!predictButtonContainer) {
        let errorMsg = "⚠️ Error: predict-button-container div cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg);
        return;
    } else {
        console.log("📢 Update: predict-button-container div was found.")
    }

    const predictionsContainer = document.getElementById("predictions-container");
    if (!predictionsContainer) {
        let errorMsg = "⚠️ Error: predictions-container div cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg);
        return;
    } else {
        console.log("📢 Update: predictions-container div was found.")
    }

    const errorToastContainer = document.getElementById("error-toast-container");
    if (!errorToastContainer) {
        let errorMsg = "⚠️ Error: error-toast-container div cannot be found.";
        showError(errorMsg);
        
        console.log(errorMsg)
        return;
    } else {
        console.log("📢 Update: predictions-container div was found.")
    }

    addNewRaceButton();
})