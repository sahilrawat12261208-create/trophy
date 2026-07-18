// ========================================
// Historic Trophy Collection
// ========================================

// Get Trophy ID from URL
const params = new URLSearchParams(window.location.search);
const trophyId = params.get("id");

// ========================================
// DOM Elements
// ========================================

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const image = document.getElementById("trophyImage");
const summary = document.getElementById("summary");
const factsContainer = document.getElementById("factsContainer");

const playButton = document.getElementById("playButton");
const audioPlayer = document.getElementById("audioPlayer");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

const tapText = document.querySelector(".tap-text");

// ========================================
// Load Trophy Data
// ========================================

async function loadData() {

    try {

        const response = await fetch("data/trophies.json");

        if (!response.ok) {
            throw new Error("Unable to load trophy data.");
        }

        const trophies = await response.json();

        let trophy;

        if (trophyId) {

            trophy = trophies.find(item => item.id === trophyId);

        } else {

            trophy = trophies[0];

        }

        if (!trophy) {

            showNotFound();
            return;

        }

        displayTrophy(trophy);

    }

    catch (error) {

        console.error(error);
        showError();

    }

}

// ========================================
// Display Trophy
// ========================================

function displayTrophy(trophy) {

    document.title = trophy.title;

    title.textContent = trophy.title;

    subtitle.textContent = trophy.subtitle || "";

    // Reset

    image.style.display = "block";
    tapText.style.display = "block";
    playButton.style.display = "inline-block";

    // =====================================
    // IMAGE
    // =====================================

    if (trophy.image && trophy.image.trim() !== "") {

        image.src = `images/${trophy.image}`;

        image.alt = trophy.title;

        image.onerror = () => {

            image.style.display = "none";
            tapText.style.display = "none";

        };

    } else {

        image.style.display = "none";
        tapText.style.display = "none";

    }

    // =====================================
    // SUMMARY
    // =====================================

    summary.textContent = trophy.summary || "";

    // =====================================
    // KEY FACTS
    // =====================================

    factsContainer.innerHTML = "";

    if (trophy.facts) {

        Object.entries(trophy.facts).forEach(([key, value]) => {

            const item = document.createElement("div");

            item.className = "fact-item";

            item.innerHTML = `
                <div class="fact-label">${key}</div>
                <div class="fact-value">${value}</div>
            `;

            factsContainer.appendChild(item);

        });

    }

    // =====================================
    // AUDIO
    // =====================================

    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    playButton.textContent = "🎧 Audio Guide";

    if (trophy.audio && trophy.audio.trim() !== "") {

        audioPlayer.src = `audio/${trophy.audio}`;

    } else {

        playButton.style.display = "none";

    }

}

// ========================================
// Audio Guide
// ========================================

playButton.addEventListener("click", () => {

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "⏸ Pause Audio Guide";

    } else {

        audioPlayer.pause();

        playButton.textContent = "🎧 Audio Guide";

    }

});

audioPlayer.addEventListener("ended", () => {

    playButton.textContent = "🎧 Audio Guide";

});

// ========================================
// Image Popup
// ========================================

image.addEventListener("click", () => {

    if (!image.src) return;

    modal.style.display = "flex";

    modalImage.src = image.src;

});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        modal.style.display = "none";

    }

});

// ========================================
// Trophy Not Found
// ========================================

function showNotFound() {

    const card = document.querySelector(".museum-card");

    if (!card) return;

    card.innerHTML = `

        <div style="padding:60px;text-align:center;">

            <h2>🏆 Trophy Not Found</h2>

            <p style="margin-top:15px;">

                The requested trophy could not be found.

            </p>

        </div>

    `;

}

// ========================================
// General Error
// ========================================

function showError() {

    const card = document.querySelector(".museum-card");

    if (!card) return;

    card.innerHTML = `

        <div style="padding:60px;text-align:center;">

            <h2>⚠ Unable to Load</h2>

            <p style="margin-top:15px;">

                Please try again later.

            </p>

        </div>

    `;

}

// ========================================
// Start
// ========================================

loadData();