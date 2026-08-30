// Google Apps Script Backend Link
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFE7Hvuw5tUuitkReeNH4DIwJqDGEfIxCwpGt2TF45ZV3hQOv1Eb8S_qqm14_NCZzP/exec";
const LIKE_STORAGE_KEY = "movie_box_likes_";

document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
});

// স্বয়ংক্রিয়ভাবে ভিডিও লোড করার ফাংশন (Lazy Loading সহ)
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

// ভিডিও আইডি থেকে ইউনিক ও আকর্ষণীয় ভিউ এবং লাইক জেনারেট করার ফাংশন
function getPseudoRandomStats(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);
    const views = (positiveHash % 900000) + 45000; // ৪৫ হাজার থেকে ৯.৪ লাখের মধ্যে ইউনিক ভিউ
    const likes = (positiveHash % 75000) + 1500;   // ১.৫ হাজার থেকে ৭৬ হাজারের মধ্যে ইউনিক লাইক
    return { views, likes };
}

// সংখ্যা সুন্দর ফরম্যাটে দেখানোর ফাংশন (যেমন: 45.2K)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

// ওয়েবসাইটে ভিডিও রেন্ডার করা (অটো ভিউজ, লাইক ও ফাস্ট লোডিং সহ)
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
        
        // অটো জেনারেটেড স্ট্যাটস
        const stats = getPseudoRandomStats(video.id);
        const storedLikes = localStorage.getItem(LIKE_STORAGE_KEY + video.id + "_count");
        const totalLikes = storedLikes ? parseInt(storedLikes) : stats.likes;

        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="video-player-wrapper" style="position: relative; width: 100%; height: 320px; background: #000; border-radius: 12px; overflow: hidden;">
                <!-- Google Drive Title & Pop-out Blocking Layer -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 50px; z-index: 20; background: linear-gradient(180deg, rgba(15,15,20,0.95) 0%, transparent 100%); pointer-events: auto;" onclick="event.stopPropagation(); event.preventDefault();"></div>
                
                <!-- Lazy Loading Enabled iframe to Save User Data & Speed Up Load Time -->
                <iframe src="https://drive.google.com/file/d/${video.driveId}/preview" 
                        loading="lazy"
                        allow="autoplay; fullscreen" 
                        allowfullscreen="true" 
                        frameborder="0" 
                        style="position: absolute; top: -50px; left: 0; width: 100%; height: calc(100% + 50px); border: none;">
                </iframe>
            </div>
            <div class="video-info">
                <div class="video-title">${cleanTitle}</div>
                <div class="video-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span class="view-count" style="color: #aaa; font-size: 13px;">👁️ ${formatNumber(stats.views)} Views</span>
                    <button class="like-btn ${hasLiked ? 'liked' : ''}" onclick="toggleLike('${video.id}', this)">
                        ❤️ <span class="like-count">${formatNumber(totalLikes)}</span> Like
                    </button>
                </div>
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

// লাইক টগল ও লোকাল স্টোরেজ আপডেট লজিক
function toggleLike(videoId, btnElement) {
    const hasLiked = localStorage.getItem(LIKE_STORAGE_KEY + videoId);
    const countSpan = btnElement.querySelector(".like-count");
    
    let stats = getPseudoRandomStats(videoId);
    let currentLikes = parseInt(localStorage.getItem(LIKE_STORAGE_KEY + videoId + "_count")) || stats.likes;

    if (hasLiked) {
        localStorage.removeItem(LIKE_STORAGE_KEY + videoId);
        localStorage.setItem(LIKE_STORAGE_KEY + videoId + "_count", currentLikes - 1);
        btnElement.classList.remove("liked");
        countSpan.textContent = formatNumber(currentLikes - 1);
    } else {
        localStorage.setItem(LIKE_STORAGE_KEY + videoId, "true");
        localStorage.setItem(LIKE_STORAGE_KEY + videoId + "_count", currentLikes + 1);
        btnElement.classList.add("liked");
        countSpan.textContent = formatNumber(currentLikes + 1);
    }
            }
