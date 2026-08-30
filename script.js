// Google Apps Script Backend Link
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFE7Hvuw5tUuitkReeNH4DIwJqDGEfIxCwpGt2TF45ZV3hQOv1Eb8S_qqm14_NCZzP/exec";
const LIKE_STORAGE_KEY = "movie_box_likes_";

document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
    injectSocialBar();
});

// সোশ্যাল বার অ্যাড ইনজেকশন
function injectSocialBar() {
    const script = document.createElement("script");
    script.src = "https://pl31090742.profitableratecpmnetwork.com/29/72/79/297279fb120de6254b603629a521f59c.js";
    script.async = true;
    document.body.appendChild(script);
}

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

// ইউনিক ভিউ এবং লাইক জেনারেটর
function getPseudoRandomStats(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);
    const views = (positiveHash % 900000) + 45000;
    const likes = (positiveHash % 75000) + 1500;
    return { views, likes };
}

// সংখ্যা ফরম্যাটিং
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// থাম্বনেইল এবং রেস্পন্সিভ ভিডিও রেন্ডার করার ফাংশন
function renderVideos(videos) {
    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (!videos || videos.length === 0) {
        container.innerHTML = '<div class="status-msg">কোনো ভিডিও পাওয়া যায়নি। ফোল্ডারে ভিডিও আপলোড করুন!</div>';
        return;
    }

    videos.forEach((video, index) => {
        // প্রতি ৪টি ভিডিওর পর ভিটমেট স্টাইল নেটিভ অ্যাড ইনজেক্ট করা
        if (index > 0 && index % 4 === 0) {
            const nativeAdCard = document.createElement("div");
            nativeAdCard.className = "video-card native-ad-card";
            nativeAdCard.style.cssText = "background: #1f1f26; border-radius: 15px; padding: 10px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 1px solid #333; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 380px;";
            
            const adDiv = document.createElement("div");
            adDiv.id = "container-2ac039b86eb14a98f23d5820729446aa";
            nativeAdCard.appendChild(adDiv);
            
            const scriptTag = document.createElement("script");
            scriptTag.async = true;
            scriptTag.dataset.cfasync = "false";
            scriptTag.src = "https://pl31094026.profitableratecpmnetwork.com/2ac039b86eb14a98f23d5820729446aa/invoke.js";
            nativeAdCard.appendChild(scriptTag);

            container.appendChild(nativeAdCard);
        }

        const cleanTitle = video.title.replace(/\.(mp4|mkv|mov|avi|webm)$/i, "");
        const hasLiked = localStorage.getItem(LIKE_STORAGE_KEY + video.id);
        const stats = getPseudoRandomStats(video.id);
        const storedLikes = localStorage.getItem(LIKE_STORAGE_KEY + video.id + "_count");
        const totalLikes = storedLikes ? parseInt(storedLikes) : stats.likes;
        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${video.driveId}&sz=w1000`;

        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="video-player-wrapper" style="position: relative; width: 100%; height: 390px; background: #000; border-radius: 12px; overflow: hidden; cursor: pointer;" onclick="playVideo(this, '${video.driveId}')">
                <img src="${thumbnailUrl}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop'">
                
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 65px; height: 65px; background: rgba(255, 0, 80, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
                    <div style="width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 22px solid #fff; margin-left: 4px;"></div>
                </div>
            </div>
            <div class="video-info">
                <div class="video-title">${cleanTitle}</div>
                <div class="video-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span class="view-count" style="color: #aaa; font-size: 13px;">👁️ ${formatNumber(stats.views)} Views</span>
                    <button class="like-btn ${hasLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${video.id}', this)">
                        ❤️ <span class="like-count">${formatNumber(totalLikes)}</span> Like
                    </button>
                </div>
            </div>
            <div class="ad-banner-wrapper" style="margin-top: 12px; text-align: center; min-height: 50px;"></div>
        `;

        // ব্যানার অ্যাড ইনজেকশন
        const adWrapper = card.querySelector('.ad-banner-wrapper');
        const adIframe = document.createElement('iframe');
        adIframe.style.cssText = 'width: 320px; height: 50px; border: none; overflow: hidden; background: transparent;';
        adIframe.scrolling = 'no';
        adIframe.srcdoc = `<html><body style="margin:0;padding:0;background:transparent;text-align:center;"><script>atOptions = {'key' : '1519cc1e96aca6e61289dafed23cfc54', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {}};<\/script><script src="https://www.highrevenueformat.com/1519cc1e96aca6e61289dafed23cfc54/invoke.js"><\/script></body></html>`;
        adWrapper.appendChild(adIframe);

        container.appendChild(card);
    });

    setupVideoScrollControl();
}

// গুগল ড্রাইভের পপ-আউট বাটন এবং ওভারল্যাপ চিরতরে ব্লক করার পারফেক্ট ফাংশন
window.playVideo = function(wrapperElement, driveId) {
    wrapperElement.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <!-- ড্রাইভের পপ-আউট বাটন ব্লক করার জন্য সিকিউরিটি শিল্ড -->
            <div style="position: absolute; top: 0; right: 0; width: 90px; height: 90px; z-index: 50; background: transparent; pointer-events: auto;" onclick="event.stopPropagation();"></div>
            
            <iframe class="drive-iframe" src="https://drive.google.com/file/d/${driveId}/preview?autoplay=1" 
                    allow="autoplay; fullscreen" 
                    allowfullscreen="true" 
                    frameborder="0" 
                    style="width: 100%; height: 100%; border: none;">
            </iframe>
        </div>
        <div class="custom-video-controls" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 45px; background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%); z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; pointer-events: auto;" onclick="event.stopPropagation();">
            <span style="color: #ff3366; font-size: 13px; font-weight: bold;">▶ Playing Stream</span>
            <button class="custom-fullscreen-btn" style="background: rgba(255,255,255,0.12); border: none; color: #fff; font-size: 12px; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;" onclick="toggleInternalFullscreen(this.closest('.video-player-wrapper'))">⛶ Fullscreen</button>
        </div>
    `;
    wrapperElement.onclick = null;
};

window.toggleInternalFullscreen = function(wrapper) {
    if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
    } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
    } else if (wrapper.mozRequestFullscreen) {
        wrapper.mozRequestFullscreen();
    } else if (wrapper.msRequestFullscreen) {
        wrapper.msRequestFullscreen();
    }
};

// স্ক্রিন থেকে ভিডিও সরে গেলে বা ফিরে আসলে অটো পজ/প্লে কন্ট্রোল
function setupVideoScrollControl() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('.drive-iframe');
            if (iframe) {
                if (!entry.isIntersecting) {
                    if (iframe.src) {
                        iframe.dataset.currentSrc = iframe.src;
                        iframe.src = "";
                    }
                } else {
                    if (!iframe.src && iframe.dataset.currentSrc) {
                        iframe.src = iframe.dataset.currentSrc;
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
}

// সার্চ বক্সের পরিবর্তে বাংলা ভাইরাল টেক্সট হেডার আপডেট
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.outerHTML = '<div style="text-align: center; color: #ff3366; font-size: 18px; font-weight: bold; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 15px;">বাংলা ভাইরাল ভিডিও 🔥🍆💦</div>';
    }
});

// লাইক টগল ও লোকাল স্টোরেজ আপডেট
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
