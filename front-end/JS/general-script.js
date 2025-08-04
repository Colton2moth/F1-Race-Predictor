// To add basic divs onto the page
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        console.log("⚠️ Error: main-content div cannot be found.")
        return;
    } else {
        console.log("📢 Update: main-content div was found.")
    }
    
    const allDrivers = document.getElementById("all-drivers");
    if (!allDrivers) {
        console.log("⚠️ Error: all-drivers div cannot be found.")
        return;
    } else {
        console.log("📢 Update: all-drivers div was found.")
    }
})