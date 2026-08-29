// Google Apps Script Endpoint (Step 4-এ লিংক বসানো হবে)
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
const LIKE_STORAGE_KEY = "movie_box_likes_";

document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
});

// ভিডিও ডেটা লোড করার ফাংশন
async function fetchVideos() {
    const container = document.getElementById("videoContainer");

    // ডেমো ভিডিও ডেটা (Step 4-এ গুগল ড্রাইভ থেকে স্বয়ংক্রিয়ভাবে আসবে)
    const sampleVideos = [
        {
            id: "1",
            title: "Spider-Man No Way Home.mp4",
            driveId: "SAMPLE_DRIVE_FILE_ID",
            likes: 0
        }
    ];

    renderVideos(sampleVideos);
}

// ওয়েবসাইটে ভিডিও কার্ড রেন্ডার করা
function renderVideos(videos) {
    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (!videos || videos.length === 0) {
        container.innerHTML = '<div class="status-msg">কোনো ভিডিও পাওয়া যায়নি।</div>';
        return;
    }

    videos.forEach(video => {
        // টাইটেল থেকে এক্সটেনশন বাদ দেওয়া (.mp4, .mkv ইত্যাদি)
        const cleanTitle = video.title.replace(/\.(mp4|mkv|mov|avi|flv)$/i, "");
        const hasLiked = localStorage.getItem(LIKE_STORAGE_KEY + video.id);

        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="video-player-wrapper">
                <video controls controlslist="nodownload" preload="metadata">
                    <source src="https://drive.google.com/uc?export=download&id=${video.driveId}" type="video/mp4">
                    আপনার ব্রাউজারে ভিডিও সাপোর্ট করছে না।
                </video>
            </div>
            <div class="video-info">
                <div class="video-title">${cleanTitle}</div>
                <button class="like-btn ${hasLiked ? 'liked' : ''}" onclick="toggleLike('${video.id}', this)">
                    ❤️ <span class="like-count">${video.likes || 0}</span> Like
                </button>
            </div>
            <div class="ad-banner-wrapper">
                <!-- PASTE_ADSTERRA_BANNER_CODE_HERE -->
            </div>
        `;
        container.appendChild(card);
    });
}

// ভিডিও সার্চ সিস্টেম
function filterVideos() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".video-card");

    cards.forEach(card => {
        const title = card.querySelector(".video-title").textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// এক ডিভাইস থেকে একবার লাইক দেওয়ার লজিক
function toggleLike(videoId, btnElement) {
    const hasLiked = localStorage.getItem(LIKE_STORAGE_KEY + videoId);
    const countSpan = btnElement.querySelector(".like-count");
    let currentLikes = parseInt(countSpan.textContent) || 0;

    if (hasLiked) {
        localStorage.removeItem(LIKE_STORAGE_KEY + videoId);
        btnElement.classList.remove("liked");
        countSpan.textContent = Math.max(0, currentLikes - 1);
    } else {
        localStorage.setItem(LIKE_STORAGE_KEY + videoId, "true");
        btnElement.classList.add("liked");
        countSpan.textContent = currentLikes + 1;
    }
                                          }
