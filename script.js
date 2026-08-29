// Google Apps Script Backend Link
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFE7Hvuw5tUuitkReeNH4DIwJqDGEfIxCwpGt2TF45ZV3hQOv1Eb8S_qqm14_NCZzP/exec";
const LIKE_STORAGE_KEY = "movie_box_likes_";

document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
});

// স্বয়ংক্রিয়ভাবে ভিডিও লোড করার ফাংশন
async function fetchVideos() {
    const container = document.getElementById("videoContainer");
    container.innerHTML = '<div class="status-msg">ভিডিও লোড হচ্ছে...</div>';

    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const videos = await response.json();
        renderVideos(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        container.innerHTML = '<div class="status-msg">ভিডিও লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজ রিফ্রেশ করুন।</div>';
    }
}

// ওয়েবসাইটে ভিডিও রেন্ডার করা (৩২০px টিভি ফ্রেম ও ড্রাইভ আইকন সম্পূর্ণ ক্রপ সহ)
function renderVideos(videos) {
    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (!videos || videos.length === 0) {
        container.innerHTML = '<div class="status-msg">কোনো ভিডিও পাওয়া যায়নি। ফোল্ডারে ভিডিও আপলোড করুন!</div>';
        return;
    }

    videos.forEach(video => {
        const cleanTitle = video.title.replace(/\.(mp4|mkv|mov|avi|webm)$/i, "");
        const hasLiked = localStorage.getItem(LIKE_STORAGE_KEY + video.id);

        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="video-player-wrapper" style="position: relative; width: 100%; height: 320px; background: #000; border-radius: 12px; overflow: hidden;">
                <!-- Moving GDrive Top Header -50px Upwards to Permanently Crop Drive Pop-out (↗) Icon -->
                <iframe src="https://drive.google.com/file/d/${video.driveId}/preview" 
                        allow="autoplay; fullscreen" 
                        allowfullscreen="true" 
                        frameborder="0" 
                        style="position: absolute; top: -50px; left: 0; width: 100%; height: calc(100% + 50px); border: none;">
                </iframe>
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

// ভিডিও সার্চ করার লজিক
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

// এক ডিভাইসে একবার লাইক দেওয়ার লজিক
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
