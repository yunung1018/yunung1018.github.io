// 獲取元素
var imageModal1 = document.getElementById('imageModal1');
var showImage1 = document.getElementById('showImage1');
var imageModal2 = document.getElementById('imageModal2');
var showImage2 = document.getElementById('showImage2');
var closeButtons = document.getElementsByClassName('close');
var videoModal = document.getElementById('videoModal');
var showVideo = document.getElementById('showVideo');
var videoIframe = document.getElementById('modalVideo');
// 獲取模態窗口元素
var modal = document.getElementById("gameModal");
// 獲取打開模態窗口的按鈕
var btn = document.getElementById("playGame");
// 獲取關閉按鈕元素
var span = document.getElementsByClassName("close")[0];
var showImage3 = document.getElementById("showImage3");
var imageModal3 = document.getElementById("imageModal3");




// 點擊顯示圖片鏈接時顯示模態窗口
showImage1.onclick = function(event) {
    event.preventDefault();
    imageModal1.style.display = 'flex'; // 使用 flex 顯示模態窗口
}

showImage2.onclick = function(event) {
    event.preventDefault();
    imageModal2.style.display = 'flex'; // 使用 flex 顯示模態窗口
}
// 第三個模態的處理 (成績優異獎)
showImage3.onclick = function(event) {
    event.preventDefault();
    imageModal3.style.display = "flex";
};

showVideo.onclick = function(event) {
    event.preventDefault();
    videoIframe.src = 'https://www.youtube.com/embed/cWeq5U0fi5k'; // YouTube 影片 URL
    videoModal.style.display = 'flex'; // 使用 flex 顯示模態窗口
}



// 點擊窗口外部隱藏模態窗口並清除影片 URL
window.onclick = function(event) {
    if (event.target == imageModal1) {
        imageModal1.style.display = 'none';
    }
    if (event.target == imageModal2) {
        imageModal2.style.display = 'none';
    }
    if (event.target == imageModal3) {
        imageModal3.style.display = 'none';
    }
    if (event.target == videoModal) {
        videoModal.style.display = 'none';
        videoIframe.src = ''; // 清除影片 URL 以停止播放
    }
}

// function handleEscapePress(event) {
//     if (event.key === 'Escape') {
//         if (imageModal1) imageModal1.style.display = 'none';
//         if (imageModal2) imageModal2.style.display = 'none';
//         if (imageModal3) imageModal3.style.display = 'none';
//         if (videoModal) {
//             videoModal.style.display = 'none';
//             videoIframe.src = '';
//         }
//     }
// };

// document.addEventListener('DOMContentLoaded', function() {
//     window.addEventListener('keydown', handleEscapePress);
    
// });

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('keydown', function(event) {
        console.log(event.target); // 輸出 event.target
        if (event.key === 'Escape') {
            if (event.target == imageModal1) {
                imageModal1.style.display = 'none';
            }
            if (event.target == imageModal2) {
                imageModal2.style.display = 'none';
            }
            if (event.target == showImage3) {
                imageModal3.style.display = 'none';
            }
            if (event.target == showVideo) {
                videoModal.style.display = 'none';
                videoIframe.src = ''; // 清除影片 URL 以停止播放
            }
        }
    });
});




