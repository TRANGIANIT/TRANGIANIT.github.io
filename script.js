// flashcardsData is now loaded globally from data.js

// ===== YOUTUBE MUSIC PLAYER (MOBILE OPTIMIZED) =====
let youtubePlayer = null;
let isMusicPlaying = false;
let playerReady = false;
const YOUTUBE_VIDEO_ID = 'GzoiBgr7zeY'; // Video ID từ https://www.youtube.com/watch?v=GzoiBgr7zeY

// Detect mobile
const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Khởi tạo YouTube Player sau khi API sẵn sàng
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        },
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'modestbranding': 1,
            'rel': 0,
            'fs': 0,
            'iv_load_policy': 3
        }
    });
}

function onPlayerReady(event) {
    console.log('✅ YouTube Player ready!');
    playerReady = true;
}

function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data == YT.PlayerState.ENDED) {
        console.log('🔁 Video hết, lặp lại...');
        setTimeout(() => {
            if (youtubePlayer && playerReady) {
                youtubePlayer.playVideo();
            }
        }, 500);
    } else if (event.data == YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        updateMusicButton();
    } else if (event.data == YT.PlayerState.PAUSED) {
        isMusicPlaying = false;
        updateMusicButton();
    }
}

function onPlayerError(event) {
    console.error('❌ YouTube Player Error:', event.data);
    // Error codes: 2, 5, 100, 101, 150
}

function updateMusicButton() {
    const musicBtn = document.getElementById('musicToggleBtn');
    if (!musicBtn) return;
    
    if (isMusicPlaying) {
        musicBtn.textContent = '⏸️ Tắt Nhạc';
        musicBtn.style.background = '#fecaca';
        musicBtn.style.color = '#dc2626';
    } else {
        musicBtn.textContent = '🎵 Bật Nhạc';
        musicBtn.style.background = '#fef3c7';
        musicBtn.style.color = '#d97706';
    }
}

// Hàm toggle nhạc - Optimized cho mobile
function toggleMusic() {
    if (!youtubePlayer || !playerReady) {
        console.warn('⚠️ Player chưa sẵn sàng');
        return;
    }
    
    try {
        const currentState = youtubePlayer.getPlayerState();
        
        if (currentState === YT.PlayerState.PLAYING || isMusicPlaying) {
            youtubePlayer.pauseVideo();
            isMusicPlaying = false;
            localStorage.setItem('music_playing', 'false');
            console.log('⏸️ Nhạc tắt');
        } else {
            // Mobile yêu cầu user gesture, nên cần call playVideo() từ click handler
            youtubePlayer.playVideo();
            isMusicPlaying = true;
            localStorage.setItem('music_playing', 'true');
            console.log('▶️ Nhạc bật');
        }
        updateMusicButton();
    } catch (e) {
        console.error('Lỗi khi toggle music:', e);
    }
}

// Không auto-play trên load (mobile blocks autoplay)
// Chỉ restore state khi user click nút

// ================================

// ===== AUTO CACHE CLEAR ON DATA UPDATE (AGGRESSIVE) =====
// Check version khi page load - xóa toàn bộ cache & localStorage cũ
function checkAndClearOldData() {
    const lastDataVersion = localStorage.getItem('data_version');
    
    console.log('📊 Current Version:', DATA_VERSION);
    console.log('📊 Stored Version:', lastDataVersion);
    
    if (lastDataVersion !== DATA_VERSION) {
        console.log('🔄 Phát hiện data mới! Xóa cache + localStorage cũ...');
        
        // 1. Xóa Service Worker cache
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(cacheName => {
                    caches.delete(cacheName).then(() => {
                        console.log('✅ Xóa cache:', cacheName);
                    });
                });
            });
        }
        
        // 2. Xóa localStorage items (nhưng giữ auth + user settings)
        const keysToKeep = ['music_playing', 'guest_quiz_scores', 'data_version'];
        const keysToDelete = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            localStorage.removeItem(key);
            console.log('🗑️ Xóa localStorage:', key);
        });
        
        // 3. Update version
        localStorage.setItem('data_version', DATA_VERSION);
        console.log('✅ Cập nhật data_version:', DATA_VERSION);
        
        // 4. Hard reload sau 500ms
        setTimeout(() => {
            console.log('🔄 Hard reload trang...');
            location.reload(true);
        }, 500);
    } else {
        console.log('✅ Data đã là version mới nhất');
    }
}

// Gọi ngay khi page bắt đầu load
checkAndClearOldData();

window.addEventListener('load', () => {
    console.log('Page loaded, waiting for user interaction for music');
});

document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentCardSpan = document.getElementById('currentCard');
    const totalCardsSpan = document.getElementById('totalCards');
    const statusFilter = document.getElementById('statusFilter');
    const dayFilter = document.getElementById('dayFilter');
    const weekFilter = document.getElementById('weekFilter');
    const toggleLearnedBtn = document.getElementById('toggleLearnedBtn');
    const cardBadge = document.getElementById('cardBadge');

    // Quiz DOM Elements
    const quizDayFilter = document.getElementById('quizDayFilter');
    const quizWeekFilter = document.getElementById('quizWeekFilter');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextQuizBtn = document.getElementById('nextQuizBtn');

    // Summary Quiz DOM Elements
    const quizContainer = document.getElementById('quizContainer');
    const quizSummaryContainer = document.getElementById('quizSummaryContainer');
    const quizScoreContainer = document.getElementById('quizScoreContainer');
    const quizHighScore = document.getElementById('quizHighScore');
    const quizFinalScoreDisplay = document.getElementById('quizFinalScoreDisplay');
    const quizFinalMessage = document.getElementById('quizFinalMessage');
    const reviewWrongBtn = document.getElementById('reviewWrongBtn');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    // ===== EXAM MODE VARIABLES =====
    let examQuestions = [];
    let examCurrentIndex = 0;
    let examAnswers = {}; // { questionId: optionIndex }
    let examStartTime = null;
    let examTimeLimit = 60 * 60; // 60 phút (seconds)
    let examTimerInterval = null;
    let examWrongCards = [];
    // ================================

    const navTabs = document.querySelectorAll('.nav-tab');
    const viewSections = document.querySelectorAll('.view-section');
    
    // Music Toggle Button
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', toggleMusic);
    }

    var currentQuizAnswer = null;
    let isFlipped = false;
    let filteredCards = [...flashcardsData];
    let currentIndex = 0;

    // --- Quiz States ---
    let quizPool = [];
    let currentQuizIndex = 0;
    let quizScoreCorrect = 0;
    let wrongCards = [];
    let isReviewSession = false;
    let currentQuizDayFilter = 'all';

    // --- Auth & Firebase States ---
    let progressRef = null;
    let isFirebaseLoaded = false;
    let currentUser = null;
    let currentRole = 'user'; // 'admin' or 'user'

    const authHeaderBtn = document.getElementById('authHeaderBtn');
    const guestWarning = document.getElementById('guestWarning');
    const adminNavTab = document.getElementById('adminNavTab');
    const requestDownloadBtn = document.getElementById('requestDownloadBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const bulkDownloadBtn = document.getElementById('bulkDownloadBtn');

    const userInfoContainer = document.getElementById('userInfoContainer');
    const userAvatar = document.getElementById('userAvatar');
    const userNameText = document.getElementById('userNameText');
    const reloadAppBtn = document.getElementById('reloadAppBtn');

    if (reloadAppBtn) {
        reloadAppBtn.addEventListener('click', async () => {
            reloadAppBtn.disabled = true;
            reloadAppBtn.textContent = 'Đang xóa cache...';
            
            try {
                // Xóa toàn bộ cache
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.includes('jp-flashcards')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
                
                // Xóa version storage
                localStorage.removeItem('data_version');
                
                console.log('✅ Cache đã xóa sạch, đang reload...');
                reloadAppBtn.textContent = 'Đang tải dữ liệu mới...';
                
                // Hard reload
                setTimeout(() => location.reload(true), 800);
            } catch (e) {
                console.error('Lỗi xóa cache:', e);
                reloadAppBtn.textContent = '🔄 Tải lại dữ liệu';
                reloadAppBtn.disabled = false;
            }
        });
    }

    // Mặc định load filter ngày 1 (Cho Guest Mode)
    if (!isFirebaseLoaded) {
        initDayFilters();
        filterCards();
        if (quizWeekFilter) startQuizSession();
        isFirebaseLoaded = true;
    }

    firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;

        // Reset learned status
        flashcardsData.forEach(card => card.learned = false);

        if (user) {
            // User is signed in
            authHeaderBtn.textContent = "Đăng Xuất";
            guestWarning.style.display = 'none';
            authModal.style.display = 'none'; // Force close modal here

            // Check role and load progress
            database.ref('users/' + user.uid + '/profile').once('value').then(snapshot => {
                const profile = snapshot.val() || {};

                if (userInfoContainer && userNameText) {
                    userInfoContainer.style.display = 'flex';
                    userNameText.textContent = "Xin chào, " + (profile.displayName || (user.email ? user.email.split('@')[0] : 'bạn'));
                    if (profile.photoURL && userAvatar) {
                        userAvatar.src = profile.photoURL;
                        userAvatar.style.display = 'block';
                    } else if (userAvatar) {
                        userAvatar.style.display = 'none';
                    }
                }

                currentRole = profile.role || 'user';
                const downloadStatus = profile.downloadStatus || 'none';

                if (currentRole === 'admin') {
                    adminNavTab.style.display = 'flex';
                    exportImageBtn.style.display = 'inline-block'; // admin luôn có quyền tải
                    requestDownloadBtn.style.display = 'none';
                    if (bulkDownloadBtn) bulkDownloadBtn.style.display = 'inline-block';
                } else {
                    adminNavTab.style.display = 'none';
                    if (bulkDownloadBtn) bulkDownloadBtn.style.display = 'none';
                    if (downloadStatus === 'approved') {
                        exportImageBtn.style.display = 'inline-block';
                        requestDownloadBtn.style.display = 'none';
                    } else {
                        exportImageBtn.style.display = 'none';
                        requestDownloadBtn.style.display = 'inline-block';
                        if (downloadStatus === 'pending') {
                            requestDownloadBtn.innerHTML = "<span class='btn-icon'>⏳</span> <span class='btn-text'>Đang chờ duyệt tải...</span>";
                            requestDownloadBtn.disabled = true;
                        } else {
                            requestDownloadBtn.innerHTML = "<span class='btn-icon'>🖐️</span> <span class='btn-text'>Xin Tải Ảnh</span>";
                            requestDownloadBtn.disabled = false;
                        }
                    }
                }

                initDayFilters(); // Update filters (all days available)
                filterCards();
                // generateQuiz() removed - use startQuizSession() instead
            });

            progressRef = database.ref('users/' + user.uid + '/my_progress');
            progressRef.on('value', (snapshot) => {
                const savedData = snapshot.val();
                if (savedData) {
                    flashcardsData.forEach(card => {
                        card.learned = savedData[card.id] || false;
                    });
                } else {
                    flashcardsData.forEach(card => card.learned = false);
                }
                filterCards(true);
            });
        } else {
            // User is signed out (Guest Mode)
            authHeaderBtn.textContent = "Đăng Nhập";
            if (userInfoContainer) userInfoContainer.style.display = 'none';
            guestWarning.style.display = 'block';
            adminNavTab.style.display = 'none';
            exportImageBtn.style.display = 'inline-block'; // Guest cho phép tải ảnh bài 1
            requestDownloadBtn.style.display = 'none';
            if (bulkDownloadBtn) bulkDownloadBtn.style.display = 'none';
            progressRef = null;

            initDayFilters(); // Update filters (only day 1 available)
            // The instruction had a malformed line here, assuming it meant to add updateAuthUI()
            // and keep the comment for initDayFilters()
            // updateAuthUI(); // Assuming this was intended to be added here
            filterCards();
            if (quizWeekFilter) startQuizSession();
        }
    });

    // --- Sakura Animation Logic ---
    function createSakura() {
        const sakuraContainer = document.getElementById('sakuraContainer');
        if (!sakuraContainer) return;

        const sakura = document.createElement('div');
        sakura.className = 'sakura';

        // Random properties
        const size = Math.random() * 12 + 8; // 8px to 20px
        const left = Math.random() * 100; // 0vw to 100vw
        const animationDuration = Math.random() * 5 + 4; // 4s to 9s
        const colorVariation = Math.random() > 0.5 ? '#ffd1dc' : '#ffb7c5';

        // Optional: random drift direction
        const drift = Math.random() * 150 - 75; // -75px to +75px

        sakura.style.width = `${size}px`;
        sakura.style.height = `${size}px`;
        sakura.style.left = `${left}vw`;
        sakura.style.animationDuration = `${animationDuration}s`;
        sakura.style.backgroundColor = colorVariation;
        sakura.style.setProperty('--drift', `${drift}px`);

        sakuraContainer.appendChild(sakura);

        // Remove element after animation finishes
        setTimeout(() => {
            sakura.remove();
        }, animationDuration * 1000);
    }

    // Spawn sakura petals every 300ms
    setInterval(createSakura, 300);

    // Initial burst
    for (let i = 0; i < 15; i++) {
        setTimeout(createSakura, Math.random() * 2000);
    }

    // Tab Navigation Logic
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            viewSections.forEach(v => {
                v.style.display = 'none';
                v.classList.remove('active');
            });

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            targetView.style.display = 'block';

            // Mở rộng Layout khi vào Admin View
            const mainContainer = document.getElementById('mainAppContainer');
            if (mainContainer) {
                if (targetId === 'admin-view') {
                    mainContainer.classList.add('admin-mode');
                } else {
                    mainContainer.classList.remove('admin-mode');
                }
            }

            // Reflow fix for CSS animation
            void targetView.offsetWidth;
            targetView.classList.add('active');
        });
    });

    // Swipe & Flip logic
    let touchStartX = 0;
    let currentDragX = 0;
    let isDragging = false;
    let isSwiping = false;

    const swipeStampLeft = document.getElementById('swipeStampLeft');
    const swipeStampRight = document.getElementById('swipeStampRight');

    flashcard.addEventListener('click', (e) => {
        if (isSwiping) {
            isSwiping = false;
            return;
        }
        isFlipped = !isFlipped;
        if (isFlipped) {
            flashcard.classList.add('flipped');
        } else {
            flashcard.classList.remove('flipped');
        }
    });

    let hasMoved = false;

    const learnedMessages = ["QUÁ ĐỈNH!", "TUYỆT VỜI!", "XUẤT SẮC!", "ĐỈNH CỦA CHÓP!", "THIÊN TÀI!", "RẤT TỐT!", "QUÁ DỮ!", "ĐÃ THUỘC LÒNG!", "KHÔNG AI BẰNG!", "10 ĐIỂM!"];
    const unlearnedMessages = ["CỐ LÊN!", "THỬ LẠI NHÉ!", "ĐỪNG NẢN!", "CHƯA THUỘC RỒI", "HỌC LẠI NÀO!", "SẮP NHỚ RỒI!", "ĐỌC KỸ LẠI!", "KIÊN NHẪN NHÉ!", "GẦN ĐƯỢC RỒI!", "TẬP TRUNG NÀO!"];

    function dragStart(clientX) {
        touchStartX = clientX;
        isDragging = true;
        isSwiping = false;
        hasMoved = false;

        const currGrammar = filteredCards[currentIndex] ? filteredCards[currentIndex].grammar : '';
        if (swipeStampLeft) {
            swipeStampLeft.innerHTML = `<div style="font-size: 1.2rem; margin-bottom: 5px; text-transform: none; opacity: 0.9;">${currGrammar}</div>${unlearnedMessages[Math.floor(Math.random() * unlearnedMessages.length)]}`;
        }
        if (swipeStampRight) {
            swipeStampRight.innerHTML = `<div style="font-size: 1.2rem; margin-bottom: 5px; text-transform: none; opacity: 0.9;">${currGrammar}</div>${learnedMessages[Math.floor(Math.random() * learnedMessages.length)]}`;
        }
    }

    function dragMove(clientX) {
        if (!isDragging) return;
        currentDragX = clientX - touchStartX;

        if (Math.abs(currentDragX) > 10) {
            isSwiping = true;
            if (!hasMoved) {
                hasMoved = true;
                flashcard.style.transition = 'none'; // Only attach 'none' when actually dragged
            }
        }

        if (hasMoved) {
            flashcard.style.transform = `translateX(${currentDragX}px) rotate(${currentDragX * 0.05}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`;

            // Show stamps based on direction
            if (currentDragX > 15) {
                if (swipeStampRight) swipeStampRight.style.opacity = Math.min(currentDragX / 80, 1);
                if (swipeStampLeft) swipeStampLeft.style.opacity = 0;
            } else if (currentDragX < -15) {
                if (swipeStampLeft) swipeStampLeft.style.opacity = Math.min(Math.abs(currentDragX) / 80, 1);
                if (swipeStampRight) swipeStampRight.style.opacity = 0;
            } else {
                if (swipeStampLeft) swipeStampLeft.style.opacity = 0;
                if (swipeStampRight) swipeStampRight.style.opacity = 0;
            }
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        const threshold = 80;

        if (Math.abs(currentDragX) > threshold) {
            const isRightSwipe = currentDragX > 0;

            // Slide out
            flashcard.style.transition = 'all 0.3s ease-out';
            flashcard.style.transform = `translateX(${isRightSwipe ? 150 : -150}%) rotate(${isRightSwipe ? 20 : -20}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`;
            flashcard.style.opacity = '0';

            setTimeout(() => {
                // Update DB logic
                if (filteredCards.length > 0) {
                    const cardRef = filteredCards[currentIndex];
                    const originalIndex = flashcardsData.findIndex(c => c.id === cardRef.id);
                    if (originalIndex !== -1) {
                        flashcardsData[originalIndex].learned = isRightSwipe;
                        cardRef.learned = isRightSwipe;

                        if (progressRef) {
                            const payload = {};
                            flashcardsData.forEach(c => {
                                if (c.learned) payload[c.id] = true;
                            });
                            progressRef.set(payload);
                        }
                    }
                }

                // Advance to next available card smoothly
                if (currentIndex < filteredCards.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Wrap around if logic dictates
                }

                resetFlip();
                renderCard(currentIndex);

                // Prepare drop-in
                flashcard.style.transition = 'none';
                flashcard.style.transform = `scale(0.8) translateY(50px) ${isFlipped ? 'rotateY(180deg)' : ''}`;
                if (swipeStampLeft) swipeStampLeft.style.opacity = 0;
                if (swipeStampRight) swipeStampRight.style.opacity = 0;

                void flashcard.offsetWidth; // Reflow

                // Animate drop-in
                flashcard.style.transition = 'all 0.4s cubic-bezier(0.4, 0.2, 0.2, 1)';
                flashcard.style.transform = '';
                flashcard.style.opacity = '1';
                setTimeout(() => isSwiping = false, 450); // Clear click state
            }, 300);

        } else {
            // Revert bounce if threshold not met
            if (hasMoved) {
                flashcard.style.transition = 'all 0.3s cubic-bezier(0.4, 0.2, 0.2, 1)';
                flashcard.style.transform = '';
            }
            if (swipeStampLeft) swipeStampLeft.style.opacity = 0;
            if (swipeStampRight) swipeStampRight.style.opacity = 0;
            setTimeout(() => {
                if (!isDragging && hasMoved) {
                    flashcard.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)';
                    isSwiping = false;
                }
            }, 300);
        }

        currentDragX = 0;
        hasMoved = false;
    }

    flashcard.addEventListener('touchstart', e => dragStart(e.changedTouches[0].screenX), { passive: true });
    flashcard.addEventListener('touchmove', e => dragMove(e.changedTouches[0].screenX), { passive: false });
    flashcard.addEventListener('touchend', e => dragEnd(), { passive: true });

    flashcard.addEventListener('mousedown', e => dragStart(e.screenX));
    window.addEventListener('mousemove', e => dragMove(e.screenX));
    window.addEventListener('mouseup', e => dragEnd());

    // Navigation logic
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderCard(currentIndex);
            resetFlip();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < filteredCards.length - 1) {
            currentIndex++;
            renderCard(currentIndex);
            resetFlip();
        }
    });

    // --- Quiz Logic ---
    quizWeekFilter.addEventListener('change', () => {
        // This filter should trigger a new quiz generation, not filter flashcards
        // NOTE: Also handled in Quiz Logic section
    });

    // Filtering logic
    statusFilter.addEventListener('change', () => {
        filterCards();
        resetFlip();
    });

    weekFilter.addEventListener('change', () => {
        updateDayOptions('flashcard');
        filterCards();
        resetFlip();
    });

    dayFilter.addEventListener('change', () => {
        filterCards();
        resetFlip();
    });

    function updateDayOptions(mode) {
        let wFilter, dFilter;
        if (mode === 'flashcard') {
            wFilter = weekFilter.value;
            dFilter = dayFilter;
        } else {
            wFilter = quizWeekFilter.value;
            dFilter = quizDayFilter;
        }

        const currentDaySelection = dFilter.value;
        dFilter.innerHTML = '<option value="all">Tất cả</option>';

        const uniqueDays = [...new Set(flashcardsData.map(item => item.day))].sort((a, b) => a - b);

        uniqueDays.forEach(day => {
            // Auth Check: Guest chỉ thấy Day 1
            if (!currentUser && day !== 1) return;

            const weekOfThisDay = Math.ceil(day / 7);
            if (wFilter === 'all' || parseInt(wFilter) === weekOfThisDay) {
                const opt = document.createElement('option');
                opt.value = day;
                opt.textContent = `Ngày ${day}`;
                dFilter.appendChild(opt);
            }
        });

        // Try to keep the previous day selection if it's still available
        let optionExists = false;
        for (let i = 0; i < dFilter.options.length; i++) {
            if (dFilter.options[i].value === currentDaySelection) {
                optionExists = true; break;
            }
        }

        if (optionExists) {
            dFilter.value = currentDaySelection;
        } else {
            dFilter.value = 'all';
        }
    }

    function initDayFilters() {
        updateDayOptions('flashcard');
        updateDayOptions('quiz');
    }

    function filterCards(preserveId = false) {
        const statusVal = statusFilter.value;
        const weekVal = weekFilter.value;
        const dayVal = dayFilter.value;

        // Remember which card we are deeply observing
        const currentCardId = filteredCards[currentIndex]?.id;

        filteredCards = flashcardsData.filter(c => {
            // Auth check: Guest chỉ được xem bài của Day 1
            if (!currentUser && c.day !== 1) return false;

            let statusMatch = true;
            if (statusVal === 'not_learned') statusMatch = !c.learned;
            else if (statusVal === 'learned') statusMatch = c.learned;

            let weekMatch = true;
            if (weekVal !== 'all') {
                const w = parseInt(weekVal);
                weekMatch = Math.ceil(c.day / 7) === w;
            }

            let dayMatch = true;
            if (dayVal !== 'all') dayMatch = (c.day === parseInt(dayVal));

            return statusMatch && weekMatch && dayMatch;
        });

        if (preserveId && currentCardId) {
            // Try to reconnect to the exact same card in the new filtered array
            let nextIndex = filteredCards.findIndex(c => c.id === currentCardId);
            if (nextIndex === -1 && filteredCards.length > 0) {
                // If it faded out due to filter logic, clamp down nicely 
                nextIndex = Math.min(currentIndex, filteredCards.length - 1);
            }
            currentIndex = Math.max(0, nextIndex);
        } else {
            currentIndex = 0;
        }

        renderCard(currentIndex);
    }

    // Learned Toggle Logic
    toggleLearnedBtn.addEventListener('click', () => {
        if (filteredCards.length === 0) return;

        const currentRef = filteredCards[currentIndex];

        // Find the index in the original array to mutate
        const originalIndex = flashcardsData.findIndex(c => c.id === currentRef.id);
        if (originalIndex !== -1) {
            const newState = !flashcardsData[originalIndex].learned;
            flashcardsData[originalIndex].learned = newState;

            // Save state to Firebase Cloud if logged in
            if (progressRef) {
                const payload = {};
                flashcardsData.forEach(c => {
                    if (c.learned) {
                        payload[c.id] = true;
                    }
                });
                progressRef.set(payload);
            }

            // Only update badge and button to maintain normal UX
            currentRef.learned = newState;
            renderCard(currentIndex, true);
        }
    });


    function resetFlip() {
        isFlipped = false;
        flashcard.classList.remove('flipped');
    }

    function renderCard(index, keepFlipState = false) {
        if (filteredCards.length === 0) {
            document.getElementById('grammarTitle').textContent = "Không có thẻ nào";
            document.getElementById('meaning').textContent = "Hãy thử đổi bộ lọc";
            cardBadge.style.display = 'none';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            toggleLearnedBtn.disabled = true;
            currentCardSpan.textContent = "0";
            totalCardsSpan.textContent = "0";
            return;
        }

        const data = filteredCards[index];
        cardBadge.style.display = 'block';

        // Update DOM Elements
        document.getElementById('grammarTitle').textContent = data.grammar;
        document.getElementById('meaning').textContent = data.meaning;
        document.getElementById('usage').textContent = data.usage;
        document.getElementById('note').textContent = data.note;

        document.getElementById('exItJp').textContent = data.examples[0].jp;
        document.getElementById('exItFuri').textContent = data.examples[0].furi;
        document.getElementById('exItVi').textContent = data.examples[0].vi;

        document.getElementById('exDayJp').textContent = data.examples[1].jp;
        document.getElementById('exDayFuri').textContent = data.examples[1].furi;
        document.getElementById('exDayVi').textContent = data.examples[1].vi;

        // Sync to Export Template
        const exportMeta = document.getElementById('exportMeta');
        if (exportMeta) {
            const patternNum = parseInt(data.id.split('_')[1], 10) + 1;
            exportMeta.textContent = `JLPT N2 | Day ${data.day} | Mẫu ${patternNum}`;
        }

        const exportGrammar = document.getElementById('exportGrammar');
        if (exportGrammar) exportGrammar.textContent = data.grammar;

        const exportMeaningVal = document.getElementById('exportMeaningVal');
        if (exportMeaningVal) exportMeaningVal.textContent = data.meaning;
        const exportUsageVal = document.getElementById('exportUsageVal');
        if (exportUsageVal) exportUsageVal.textContent = data.usage;

        const exportNote = document.getElementById('exportNote');
        const exportNoteVal = document.getElementById('exportNoteVal');

        if (exportNote && exportNoteVal) {
            if (data.note) {
                exportNote.style.display = 'block';
                exportNoteVal.style.display = 'block';
                exportNoteVal.textContent = data.note.replace(/^👉\s*/i, '');
            } else {
                exportNote.style.display = 'none';
                exportNoteVal.style.display = 'none';
            }
        }

        [1, 2].forEach(num => {
            const exIndex = num - 1;
            const exGroup = [
                document.getElementById(`exportExJp${num}`),
                document.getElementById(`exportExJpVal${num}`),
                document.getElementById(`exportExFuri${num}`),
                document.getElementById(`exportExFuriVal${num}`),
                document.getElementById(`exportExVi${num}`),
                document.getElementById(`exportExViVal${num}`)
            ];

            if (data.examples && data.examples[exIndex]) {
                const ex = data.examples[exIndex];
                exGroup.forEach(el => { if (el) el.style.display = 'block'; });

                if (exGroup[1]) exGroup[1].textContent = ex.jp;
                if (exGroup[3]) exGroup[3].textContent = ex.furi || '';
                if (exGroup[5]) {
                    let cleanVi = (ex.vi || '').replace(/^Dịch:\s*/i, '');
                    exGroup[5].textContent = cleanVi;
                }
            } else {
                exGroup.forEach(el => { if (el) el.style.display = 'none'; });
            }
        });

        // Update Nav State
        if (currentCardSpan) currentCardSpan.textContent = (index + 1).toString();
        if (totalCardsSpan) totalCardsSpan.textContent = filteredCards.length.toString();

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === filteredCards.length - 1;

        // Update Status States
        if (toggleLearnedBtn) {
            toggleLearnedBtn.disabled = false;
            if (data.learned) {
                cardBadge.textContent = "✅ Đã thuộc";
                cardBadge.className = "status-badge learned";
                toggleLearnedBtn.innerHTML = "<span class='btn-text'>Hủy dấu Đã thuộc</span> <span class='btn-icon'>🔄</span>";
                toggleLearnedBtn.className = "btn btn-status btn-unlearned";
            } else {
                cardBadge.textContent = "🔴 Chưa thuộc";
                cardBadge.className = "status-badge";
                toggleLearnedBtn.innerHTML = "<span class='btn-text'>Đánh dấu Đã thuộc</span> <span class='btn-icon'>✅</span>";
                toggleLearnedBtn.className = "btn btn-status";
            }
        }
    }

    // Export Logic
    requestDownloadBtn.addEventListener('click', () => {
        if (!currentUser) return;
        requestDownloadBtn.disabled = true;
        requestDownloadBtn.innerHTML = "<span class='btn-icon'>⏳</span> <span class='btn-text'>Đang gửi yêu cầu...</span>";
        database.ref('users/' + currentUser.uid + '/profile/downloadStatus').set('pending').then(() => {
            const followModal = document.getElementById('followModal');
            if (followModal) {
                followModal.style.display = 'flex';
            } else {
                alert("Đã gửi yêu cầu cấp quyền tải ảnh cho Admin!");
            }
            requestDownloadBtn.innerHTML = "<span class='btn-icon'>⏳</span> <span class='btn-text'>Đang chờ duyệt tải...</span>";
        });
    });

    const exportTemplate = document.getElementById('exportTemplate');

    exportImageBtn.addEventListener('click', async () => {
        if (filteredCards.length === 0) return;

        exportImageBtn.disabled = true;
        const originalHTML = exportImageBtn.innerHTML;
        exportImageBtn.innerHTML = "<span class='btn-icon'>⏳</span> <span class='btn-text'>Đang tải...</span>";

        try {
            // Need to temporarily bring it into viewport to render properly with html2canvas (sometimes fails if left=-9999px depending on browser)
            exportTemplate.style.left = '0';
            exportTemplate.style.top = '0';
            exportTemplate.style.zIndex = '-100';
            exportTemplate.style.opacity = '1';

            // Wait a tiny bit for the browser to apply styles before shooting
            await new Promise(r => setTimeout(r, 50));

            const canvas = await html2canvas(exportTemplate, {
                scale: 2, // High resolution
                backgroundColor: null,
                useCORS: true
            });

            // Put it back
            exportTemplate.style.left = '-9999px';
            exportTemplate.style.top = '-9999px';
            exportTemplate.style.opacity = '1';

            // Download
            const dataUrl = canvas.toDataURL("image/png");

            // Generate valid filename
            const grammarTitle = filteredCards[currentIndex].grammar.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '').trim() || 'flashcard';

            const link = document.createElement('a');
            link.download = `TuVung_${grammarTitle}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Tăng biến đếm số lượng tải về
            if (currentUser) {
                const countRef = database.ref('users/' + currentUser.uid + '/profile/downloadCount');
                countRef.once('value').then(snap => {
                    let dCount = snap.val() || 0;
                    countRef.set(dCount + 1);
                });
            }

        } catch (e) {
            console.error("Export failed:", e);
            alert("Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại!");
        } finally {
            exportImageBtn.disabled = false;
            exportImageBtn.innerHTML = originalHTML;
            exportTemplate.style.left = '-9999px';
            exportTemplate.style.top = '-9999px';
        }
    });

    if (bulkDownloadBtn) {
        bulkDownloadBtn.addEventListener('click', async () => {
            if (filteredCards.length === 0) return;
            if (dayFilter && dayFilter.value === 'all') {
                alert("Xin vui lòng chọn một Bài cụ thể trong Tuần để Tải Toàn Bộ (không chọn Tất Cả).");
                return;
            }

            bulkDownloadBtn.disabled = true;
            const originalHTML = bulkDownloadBtn.innerHTML;
            const originalIndex = currentIndex;

            try {
                // Tạm thời đưa Template về tầm nhìn trình duyệt
                exportTemplate.style.left = '0';
                exportTemplate.style.top = '0';
                exportTemplate.style.zIndex = '-100';
                exportTemplate.style.opacity = '1';

                for (let i = 0; i < filteredCards.length; i++) {
                    bulkDownloadBtn.innerHTML = `<span class='btn-icon'>⏳</span> <span class='btn-text'>Đang tải ${i + 1}/${filteredCards.length}...</span>`;

                    // Render DOM cho card thứ i
                    renderCard(i);
                    await new Promise(r => setTimeout(r, 600)); // Đợi DOM cập nhật ổn định & tránh Trình duyệt rate-limit Downloads

                    const canvas = await html2canvas(exportTemplate, {
                        scale: 2,
                        backgroundColor: null,
                        useCORS: true
                    });

                    const dataUrl = canvas.toDataURL("image/png");
                    const patternNum = parseInt(filteredCards[i].id.split('_')[1], 10) + 1;
                    const grammarTitle = filteredCards[i].grammar.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '').trim() || 'NoName';

                    const link = document.createElement('a');
                    link.download = `Day${filteredCards[i].day}_${patternNum}_${grammarTitle}.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                alert(`Tuyệt vời! Đã tải thành công file ảnh của \${filteredCards.length} từ vựng!`);

                // Tăng số lượng tải
                if (currentUser) {
                    const countRef = database.ref('users/' + currentUser.uid + '/profile/downloadCount');
                    countRef.once('value').then(snap => {
                        let dCount = snap.val() || 0;
                        countRef.set(dCount + filteredCards.length);
                    });
                }

            } catch (e) {
                console.error("Bulk export failed:", e);
                alert("Có lỗi xảy ra trong tiến trình tải tập ảnh. Vui lòng thử lại!");
            } finally {
                currentIndex = originalIndex;
                renderCard(currentIndex);
                exportTemplate.style.left = '-9999px';
                exportTemplate.style.top = '-9999px';
                bulkDownloadBtn.disabled = false;
                bulkDownloadBtn.innerHTML = originalHTML;
            }
        });
    }

    // --- Quiz Logic ---

    quizWeekFilter.addEventListener('change', () => {
        updateDayOptions('quiz');
        startQuizSession(false);
    });
    quizDayFilter.addEventListener('change', () => startQuizSession(false));

    // Khởi tạo các event listeners cho Quiz
    nextQuizBtn.addEventListener('click', () => {
        currentQuizIndex++;
        if (currentQuizIndex < quizPool.length) {
            renderQuizQuestion(quizPool[currentQuizIndex]);
        } else {
            showQuizSummary();
        }
    });

    reviewWrongBtn.addEventListener('click', () => {
        startQuizSession(true);
    });

    restartQuizBtn.addEventListener('click', () => {
        startQuizSession(false);
    });

    function startQuizSession(isReview = false) {
        // Hide summary, show quiz
        if (quizSummaryContainer) quizSummaryContainer.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';

        // Reset Stats
        currentQuizIndex = 0;
        quizScoreCorrect = 0;
        isReviewSession = isReview;
        currentQuizDayFilter = quizDayFilter.value;

        if (isReview) {
            quizPool = [...wrongCards];
        } else {
            const qWeekVal = quizWeekFilter.value;
            const qDayVal = quizDayFilter.value;

            quizPool = flashcardsData.filter(c => {
                // Auth check cho pool question
                if (!currentUser && c.day !== 1) return false;

                let wMatch = true;
                if (qWeekVal !== 'all') {
                    wMatch = Math.ceil(c.day / 7) === parseInt(qWeekVal);
                }
                let dMatch = true;
                if (qDayVal !== 'all') {
                    dMatch = c.day === parseInt(qDayVal);
                }
                return wMatch && dMatch;
            });
            // Shuffle pool
            quizPool.sort(() => Math.random() - 0.5);
        }

        wrongCards = []; // Reset wrong cards array for this session

        if (quizPool.length < 4 && !isReview) {
            quizQuestion.textContent = "Không đủ dữ liệu bộ từ vựng để tạo bài Trắc nghiệm. Hãy chọn Ngày khác hoặc Tất cả.";
            const progressText = document.getElementById('quizProgressText');
            if (progressText) progressText.textContent = "Câu hỏi: 0 / 0";
            quizOptions.innerHTML = '';
            quizFeedback.style.display = 'none';
            nextQuizBtn.style.display = 'none';
            return;
        }

        if (quizPool.length === 0 && isReview) {
            return;
        }

        // Display High Score when starting
        if (!isReviewSession && currentQuizDayFilter !== 'all') {
            loadHighScoreForDay(currentQuizDayFilter);
        } else {
            if (quizScoreContainer) quizScoreContainer.style.display = 'none';
        }

        renderQuizQuestion(quizPool[currentQuizIndex]);
    }

    function renderQuizQuestion(correctCard) {
        // Reset UI for the question
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.style.display = 'none';
        nextQuizBtn.style.display = 'none';
        quizOptions.innerHTML = '';

        const progressText = document.getElementById('quizProgressText');
        if (progressText) {
            progressText.textContent = `Câu hỏi: ${currentQuizIndex + 1} / ${quizPool.length}`;
        }

        // Random question type: 0 = meaning, 1 = usage, 2 = example
        const qType = Math.floor(Math.random() * 3);

        let questionText = "";
        let correctOptionText = "";
        let explanationText = `<strong>${correctCard.grammar}</strong><br>Ý nghĩa: ${correctCard.meaning}<br>Cách dùng: ${correctCard.usage}`;

        if (qType === 0) {
            questionText = `Ý nghĩa của cấu trúc "<strong>${correctCard.grammar}</strong>" là gì?`;
            correctOptionText = correctCard.meaning;
            currentQuizAnswer = correctOptionText;
        } else if (qType === 1) {
            questionText = `Cách dùng của cấu trúc "<strong>${correctCard.grammar}</strong>" là gì?`;
            correctOptionText = correctCard.usage;
            currentQuizAnswer = correctOptionText;
        } else {
            if (correctCard.examples && correctCard.examples.length > 0) {
                questionText = `Cấu trúc nào phù hợp với câu sau: "<br><i>${correctCard.examples[0].jp}</i>" ?`;
                explanationText = `<strong>${correctCard.grammar}</strong><br>Dịch nghĩa câu ví dụ: ${correctCard.examples[0].vi}`;
            } else {
                questionText = `Cấu trúc nào có ý nghĩa sau: "<br><i>${correctCard.meaning}</i>" ?`;
                explanationText = `<strong>${correctCard.grammar}</strong><br>Ý nghĩa: ${correctCard.meaning}`;
            }
            correctOptionText = correctCard.grammar;
            currentQuizAnswer = correctOptionText;
        }

        quizQuestion.innerHTML = questionText;

        // Generate 3 random wrong options
        let options = [correctOptionText];
        while (options.length < 4) {
            const randomWrong = flashcardsData[Math.floor(Math.random() * flashcardsData.length)];
            let wrongText = "";
            if (qType === 0) wrongText = randomWrong.meaning;
            else if (qType === 1) wrongText = randomWrong.usage;
            else wrongText = randomWrong.grammar;

            if (wrongText && !options.includes(wrongText)) {
                options.push(wrongText);
            }
        }

        // Shuffle
        options.sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleQuizAnswer(btn, opt, correctOptionText, explanationText, correctCard));
            quizOptions.appendChild(btn);
        });
    }

    function handleQuizAnswer(clickedBtn, selectedText, correctText, explanation, correctCard) {
        if (nextQuizBtn.style.display === 'block') return;

        const allButtons = quizOptions.querySelectorAll('.quiz-option');

        if (selectedText === correctText) {
            quizScoreCorrect++;
            clickedBtn.classList.add('correct');
            quizFeedback.innerHTML = `✅ <strong>Chính xác!</strong><br><br>${explanation}`;
            quizFeedback.className = 'quiz-feedback success';
        } else {
            if (!wrongCards.some(card => card.id === correctCard.id)) {
                wrongCards.push(correctCard);
            }
            clickedBtn.classList.add('wrong');
            quizFeedback.innerHTML = `❌ <strong>Sai rồi!</strong><br><br>${explanation}`;
            quizFeedback.className = 'quiz-feedback error';

            allButtons.forEach(b => {
                if (b.textContent === correctText) {
                    b.classList.add('correct');
                }
            });
        }

        nextQuizBtn.style.display = 'block';
    }

    function showQuizSummary() {
        if (quizContainer) quizContainer.style.display = 'none';
        if (quizSummaryContainer) quizSummaryContainer.style.display = 'block';

        if (quizFinalScoreDisplay) {
            quizFinalScoreDisplay.innerHTML = `${quizScoreCorrect}<span style="font-size: 2rem; color: #a0aec0;">/${quizPool.length}</span>`;
        }

        const ratio = quizScoreCorrect / quizPool.length;
        if (quizFinalMessage) {
            if (ratio === 1) {
                quizFinalMessage.textContent = "Hoàn hảo! Bạn đã nắm vững các cấu trúc trong phần này.";
            } else if (ratio >= 0.7) {
                quizFinalMessage.textContent = "Làm tốt lắm! Nhưng vẫn còn vài chỗ bạn có thể cải thiện.";
            } else {
                quizFinalMessage.textContent = "Cố gắng hơn nữa nhé! Ôn tập lại sẽ giúp bạn nhớ lâu hơn.";
            }
        }

        if (reviewWrongBtn) {
            if (wrongCards.length > 0) {
                reviewWrongBtn.style.display = 'block';
                reviewWrongBtn.textContent = `Học lại ${wrongCards.length} câu sai ↻`;
            } else {
                reviewWrongBtn.style.display = 'none';
            }
        }

        if (!isReviewSession && currentQuizDayFilter !== 'all') {
            saveHighScoreForDay(currentQuizDayFilter, quizScoreCorrect);
        }
    }

    function loadHighScoreForDay(day) {
        if (quizScoreContainer) quizScoreContainer.style.display = 'none';

        if (currentUser) {
            firebase.database().ref(`users/${currentUser.uid}/quiz_scores/day_${day}`).once('value')
                .then(snapshot => {
                    if (snapshot.exists() && quizHighScore && quizScoreContainer) {
                        quizHighScore.textContent = `${snapshot.val()} điểm`;
                        quizScoreContainer.style.display = 'block';
                    }
                })
                .catch(err => console.error("Error loading high score", err));
        } else {
            const scores = JSON.parse(localStorage.getItem('guest_quiz_scores') || "{}");
            if (scores[`day_${day}`] && quizHighScore && quizScoreContainer) {
                quizHighScore.textContent = `${scores[`day_${day}`]} điểm`;
                quizScoreContainer.style.display = 'block';
            }
        }
    }

    function saveHighScoreForDay(day, score) {
        const key = `day_${day}`;

        if (currentUser) {
            firebase.database().ref(`users/${currentUser.uid}/quiz_scores/${key}`).once('value')
                .then(snapshot => {
                    const currentHighScore = snapshot.exists() ? snapshot.val() : 0;
                    if (score > currentHighScore) {
                        firebase.database().ref(`users/${currentUser.uid}/quiz_scores/${key}`).set(score);
                        if (quizHighScore && quizScoreContainer) {
                            quizHighScore.textContent = `${score} điểm`;
                            quizScoreContainer.style.display = 'block';
                        }
                    }
                });
        } else {
            const scores = JSON.parse(localStorage.getItem('guest_quiz_scores') || "{}");
            const currentHighScore = scores[key] || 0;
            if (score > currentHighScore) {
                scores[key] = score;
                localStorage.setItem('guest_quiz_scores', JSON.stringify(scores));
                if (quizHighScore && quizScoreContainer) {
                    quizHighScore.textContent = `${score} điểm`;
                    quizScoreContainer.style.display = 'block';
                }
            }
        }
    }

    // --- AUTH UI & LOGIC ---
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authForm = document.getElementById('authForm');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const authModalTitle = document.getElementById('authModalTitle');
    const submitAuthBtn = document.getElementById('submitAuthBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authToggleLink = document.getElementById('authToggleLink');

    let isRegisterMode = false;

    authHeaderBtn.addEventListener('click', () => {
        if (currentUser) {
            firebase.auth().signOut().then(() => {
                alert("Đăng xuất thành công!");
            });
        } else {
            authModal.style.display = 'flex';
        }
    });

    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
        authForm.reset();
    });

    const followModal = document.getElementById('followModal');
    const closeFollowModal = document.getElementById('closeFollowModal');
    const skipFollowBtn = document.getElementById('skipFollowBtn');

    if (closeFollowModal) {
        closeFollowModal.addEventListener('click', () => {
            if (followModal) followModal.style.display = 'none';
        });
    }

    if (skipFollowBtn) {
        skipFollowBtn.addEventListener('click', () => {
            if (followModal) followModal.style.display = 'none';
        });
    }

    // Đóng Modal khi click ra ngoài overlay
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            authForm.reset();
        }
        if (followModal && e.target === followModal) {
            followModal.style.display = 'none';
        }
    });

    authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            authModalTitle.textContent = "Đăng Ký";
            submitAuthBtn.textContent = "Đăng Ký Tài Khoản";
            confirmPasswordGroup.style.display = 'block';
            document.getElementById('authConfirmPassword').setAttribute('required', 'true');
            if (document.getElementById('forgotPasswordContainer')) document.getElementById('forgotPasswordContainer').style.display = 'none';
            authToggleText.textContent = "Đã có tài khoản?";
            authToggleLink.textContent = "Đăng Nhập";
        } else {
            authModalTitle.textContent = "Đăng Nhập";
            submitAuthBtn.textContent = "Đăng Nhập";
            confirmPasswordGroup.style.display = 'none';
            document.getElementById('authConfirmPassword').removeAttribute('required');
            if (document.getElementById('forgotPasswordContainer')) document.getElementById('forgotPasswordContainer').style.display = 'block';
            authToggleText.textContent = "Chưa có tài khoản?";
            authToggleLink.textContent = "Đăng Ký Ngay";
        }
    });

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            if (!email) {
                alert("Bạn cần nhập TRƯỚC Email của mình vào ô 'Email' bên trên, sau đó bấm nút này để gửi đường cung cấp lại mật khẩu!");
                return;
            }
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                alert("✅ Đã gửi đường dẫn Đặt lại Mật Khẩu thành công!\n\nLƯU Ý QUAN TRỌNG: Vui lòng kiểm tra kỹ HỘP THƯ RÁC (Spam) hoặc mục Quảng Cáo của Email vừa nhập vì thư của Firebase thường bị lọc nhầm vào đó.");
            }).catch(error => {
                let msg = error.message;
                if (error.code === 'auth/user-not-found') msg = "Tài khoản Email này chưa được đăng ký trên hệ thống.";
                if (error.code === 'auth/invalid-email') msg = "Định dạng Email không hợp lệ!";
                alert("Lỗi Gửi Email: " + msg);
            });
        });
    }

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;

        submitAuthBtn.disabled = true;

        if (isRegisterMode) {
            const confirm = document.getElementById('authConfirmPassword').value;
            if (password !== confirm) {
                alert("Mật khẩu xác nhận không khớp!");
                submitAuthBtn.disabled = false;
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;
                    updateLoginStats(uid, true, email).then(() => {
                        alert("Đăng ký thành công! Bạn đã có quyền học toàn bộ nội dung.");
                        authModal.style.display = 'none';
                        authForm.reset();
                    });
                })
                .catch((error) => {
                    alert("Lỗi đăng ký: " + error.message);
                })
                .finally(() => submitAuthBtn.disabled = false);

        } else {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((res) => {
                    updateLoginStats(res.user.uid, false, email).then(() => {
                        alert("Đăng nhập thành công!");
                        authModal.style.display = 'none';
                        authForm.reset();
                    });
                })
                .catch((error) => {
                    let msg = "Email hoặc Mật khẩu không đúng.";
                    if (error.code === 'auth/user-not-found') msg = "Tài khoản không tồn tại.";
                    if (error.code === 'auth/too-many-requests') msg = "Thử sai quá nhiều lần. Vui lòng thử lại sau.";
                    alert("Lỗi: " + msg);
                })
                .finally(() => submitAuthBtn.disabled = false);
        }
    });

    // Helper for auth updates
    function updateLoginStats(uid, isNew = false, email = '', displayName = '', photoURL = '') {
        const profileRef = database.ref('users/' + uid + '/profile');
        return profileRef.once('value').then(snap => {
            let profile = snap.val() || {};
            profile.lastLogin = Date.now();
            profile.loginCount = (profile.loginCount || 0) + 1;
            if (isNew) {
                profile.role = 'user';
                profile.downloadStatus = 'none';
                profile.registeredAt = Date.now();
                profile.downloadCount = 0;
            }
            if (email) profile.email = profile.email || email;
            if (displayName) profile.displayName = profile.displayName || displayName;
            else if (email && !profile.displayName) profile.displayName = email.split('@')[0];
            if (photoURL) profile.photoURL = profile.photoURL || photoURL;
            return profileRef.set(profile);
        });
    }

    // Social Auth Listeners
    document.getElementById('googleLoginBtn').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((res) => {
            const isNew = res.additionalUserInfo ? res.additionalUserInfo.isNewUser : false;
            updateLoginStats(res.user.uid, isNew, res.user.email || 'Google User', res.user.displayName, res.user.photoURL).then(() => {
                authModal.style.display = 'none'; authForm.reset();
            }).catch(e => console.error("DB Write Error:", e));
        }).catch(err => {
            if (err.code === 'auth/account-exists-with-different-credential') {
                alert("Lỗi: Email của tài khoản Google này đã được dùng để Đăng ký bằng Mật khẩu (hoặc Facebook) trước đó. Hãy Đăng nhập bằng Mật khẩu nhé!");
            } else if (err.code !== 'auth/popup-closed-by-user') {
                alert("Lỗi đăng nhập Google: " + err.message + "\n(Đảm bảo bạn đã bật Google Sign-in trong Firebase Console)");
            }
        });
    });

    document.getElementById('facebookLoginBtn').addEventListener('click', () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then((res) => {
            const isNew = res.additionalUserInfo ? res.additionalUserInfo.isNewUser : false;
            updateLoginStats(res.user.uid, isNew, res.user.email || 'Facebook User', res.user.displayName, res.user.photoURL).then(() => {
                authModal.style.display = 'none'; authForm.reset();
            }).catch(e => console.error("DB Write Error:", e));
        }).catch(err => {
            if (err.code === 'auth/account-exists-with-different-credential') {
                alert("Lỗi: Email của tài khoản Facebook này đã được dùng để Đăng ký bằng Mật khẩu (hoặc Google) trước đó. Hãy Đăng nhập bằng bằng Mật khẩu nhé!");
            } else if (err.code !== 'auth/popup-closed-by-user') {
                alert("Lỗi đăng nhập Facebook: " + err.message + "\n(Đảm bảo bạn đã thiết lập Authorized Domains và Facebook App ID/Secret trên Firebase)");
            }
        });
    });

    // --- ADMIN PANEL UI LOGIC ---
    let adminUsersData = [];

    const adminStatusFilter = document.getElementById('adminStatusFilter');
    const adminSortFilter = document.getElementById('adminSortFilter');

    if (adminStatusFilter) adminStatusFilter.addEventListener('change', renderAdminTable);
    if (adminSortFilter) adminSortFilter.addEventListener('change', renderAdminTable);

    adminNavTab.addEventListener('click', () => {
        if (currentRole !== 'admin') return;
        const adminTbody = document.getElementById('adminUsersTableBody');
        adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem;">Đang tải...</td></tr>';

        database.ref('users').once('value').then(snapshot => {
            const allUsers = snapshot.val();

            if (!allUsers) {
                adminUsersData = [];
                adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có người dùng nào.</td></tr>';
                return;
            }

            // Transform nested object into Array for easy sorting and filtering
            adminUsersData = Object.keys(allUsers).map(uid => {
                const uData = allUsers[uid];
                const p = uData.profile || {};

                let learnedCount = 0;
                if (uData.my_progress) {
                    learnedCount = Object.values(uData.my_progress).filter(val => val === true).length;
                }

                return {
                    uid: uid,
                    email: p.email || uid,
                    displayName: p.displayName || "",
                    photoURL: p.photoURL || "",
                    role: p.role || 'user',
                    downloadStatus: p.downloadStatus || 'none',
                    loginCount: p.loginCount || 0,
                    downloadCount: p.downloadCount || 0,
                    lastLogin: p.lastLogin || 0,
                    learnedCount: learnedCount,
                    isActive: p.lastLogin ? (Date.now() - p.lastLogin < 86400000) : false
                };
            });

            renderAdminTable();
        }).catch(err => {
            const adminTbody = document.getElementById('adminUsersTableBody');
            if (adminTbody) adminTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
        });
    });

    function renderAdminTable() {
        const adminTbody = document.getElementById('adminUsersTableBody');
        if (!adminTbody) return;

        let filteredList = [...adminUsersData];

        // Apply Status Filter
        if (adminStatusFilter) {
            const stVal = adminStatusFilter.value;
            if (stVal !== 'all') {
                filteredList = filteredList.filter(u => u.downloadStatus === stVal);
            }
        }

        // Apply Sort
        if (adminSortFilter) {
            const sortVal = adminSortFilter.value;
            if (sortVal === 'logins') {
                filteredList.sort((a, b) => b.loginCount - a.loginCount);
            } else if (sortVal === 'downloads') {
                filteredList.sort((a, b) => b.downloadCount - a.downloadCount);
            } else if (sortVal === 'learned') {
                filteredList.sort((a, b) => b.learnedCount - a.learnedCount);
            } else {
                // 'latest' default descending by lastLogin
                filteredList.sort((a, b) => b.lastLogin - a.lastLogin);
            }
        }

        adminTbody.innerHTML = '';

        if (filteredList.length === 0) {
            adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy người dùng phù hợp.</td></tr>';
            return;
        }

        filteredList.forEach(u => {
            const avatar = u.photoURL ? `<img src="${u.photoURL}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px;">` : '';
            const emailTitle = u.displayName ? `<div style="display:flex; align-items:center; font-weight:bold;">${avatar}${u.displayName}</div><div style="font-size:0.75rem; color:var(--text-light); margin-top:2px;">${u.email}</div>` : `<div>${u.email}</div>`;

            let lastLoginStr = "Chưa có";
            if (u.lastLogin) {
                const d = new Date(u.lastLogin);
                lastLoginStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            const activeUI = u.isActive ? '<span style="color: #38a169; font-weight:bold; font-size: 0.8rem;">🟢 Đang H.Động</span>' : '<span style="color: #a0aec0; font-weight:bold; font-size: 0.8rem;">🔴 Ngoại tuyến</span>';
            lastLoginStr = `<div>${lastLoginStr}</div><div style="margin-top: 4px;">${activeUI}</div>`;

            let dStatusUI = "<span style='color: #718096;'>Chưa xin</span>";
            let actionsUI = "";

            if (u.downloadStatus === 'pending') {
                dStatusUI = "<span style='color: #dd6b20; font-weight:bold;'>Chờ duyệt</span>";
                actionsUI += `<button class='btn-admin-action btn-approve' onclick="window.adminSetDownload('${u.uid}', 'approved')">Duyệt</button>`;
            } else if (u.downloadStatus === 'approved') {
                dStatusUI = "<span style='color: #38a169; font-weight:bold;'>Đã Duyệt</span>";
                if (u.role !== 'admin') actionsUI += `<button class='btn-admin-action btn-revoke' onclick="window.adminSetDownload('${u.uid}', 'none')">Tước Quyền</button>`;
            }

            if (u.role !== 'admin') {
                actionsUI += `<div style='margin-top: 5px;'><button class='btn-admin-action btn-delete' onclick="window.adminDeleteUser('${u.uid}')">Xóa DL Người Dùng</button></div>`;
            }

            const roleBage = u.role === 'admin'
                ? '<span class="status-badge learned" style="position:static; font-size: 0.7rem; padding: 2px 6px;">Admin</span>'
                : '<span class="status-badge" style="position:static; font-size: 0.7rem; padding: 2px 6px;">User</span>';

            const statsUI = `<div style="font-size: 0.8rem; line-height: 1.4;">
                <div>Đã học: <b>${u.learnedCount}</b> từ</div>
                <div>Sign-in: <b>${u.loginCount}</b> lần</div>
                <div>Tải ảnh: <b>${u.downloadCount}</b> ảnh</div>
            </div>`;

            adminTbody.innerHTML += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px; font-weight: 500;">${emailTitle}<div style="margin-top:4px;">${roleBage}</div></td>
                    <td style="padding: 10px; text-align: center;">${dStatusUI}</td>
                    <td style="padding: 10px; text-align: left;">${statsUI}</td>
                    <td style="padding: 10px; font-size: 0.8rem;">${lastLoginStr}</td>
                    <td style="padding: 10px; text-align: right;">${actionsUI}</td>
                </tr>
            `;
        });
    }

    // --- ADMIN GLOBAL ACTIONS ---
    window.adminSetDownload = function (uid, status) {
        if (confirm(`Xác nhận cập nhật quyền tải ảnh: ${status}?`)) {
            database.ref('users/' + uid + '/profile/downloadStatus').set(status).then(() => {
                alert("Đã cập nhật!");
                document.getElementById('adminNavTab').click(); // refresh
            });
        }
    };

    window.adminDeleteUser = function (uid) {
        if (confirm(`Nguy hiểm: Bạn có chắc xóa TOÀN BỘ tiến trình và dữ liệu của người dùng này khỏi Database?`)) {
            database.ref('users/' + uid).remove().then(() => {
                alert("Đã xóa dữ liệu thành công!");
                document.getElementById('adminNavTab').click(); // refresh
            });
        }
    };

    // ===== EXAM MODE ENGINE (Thi Thử) =====
    
    // Generate 20 random exam questions từ flashcards
    function generateExamQuestions() {
        examQuestions = [];
        examWrongCards = [];
        
        // Lấy 20 ngữ pháp random
        const randomGrammars = flashcardsData
            .filter(c => !currentUser || c.day === 1 || currentUser) // Guest chỉ Day 1
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);

        randomGrammars.forEach((grammar, index) => {
            const questionType = ['meaning', 'usage', 'example'][Math.floor(Math.random() * 3)];
            let question = '';
            let correctOption = '';
            let wrongOptions = [];

            if (questionType === 'meaning') {
                question = `Ý nghĩa của cấu trúc "<strong>${grammar.grammar}</strong>" là gì?`;
                correctOption = grammar.meaning;
                // Lấy 3 ý nghĩa sai từ các ngữ pháp khác
                wrongOptions = flashcardsData
                    .filter(c => c.id !== grammar.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map(c => c.meaning);
            } else if (questionType === 'usage') {
                question = `Cách dùng của cấu trúc "<strong>${grammar.grammar}</strong>" là gì?`;
                correctOption = grammar.usage;
                wrongOptions = flashcardsData
                    .filter(c => c.id !== grammar.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map(c => c.usage);
            } else {
                if (grammar.examples && grammar.examples[0]) {
                    question = `Câu nào sử dụng ngữ pháp "<strong>${grammar.grammar}</strong>" đúng nhất?<br><i>"${grammar.examples[0].jp}"</i>`;
                    correctOption = grammar.grammar;
                    wrongOptions = flashcardsData
                        .filter(c => c.id !== grammar.id)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map(c => c.grammar);
                } else {
                    question = `Ngữ pháp nào có ý nghĩa: "<strong>${grammar.meaning}</strong>"?`;
                    correctOption = grammar.grammar;
                    wrongOptions = flashcardsData
                        .filter(c => c.id !== grammar.id)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map(c => c.grammar);
                }
            }

            // Shuffle options
            let options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);

            examQuestions.push({
                id: `exam_q_${index}`,
                grammarId: grammar.id,
                grammarName: grammar.grammar,
                questionType,
                question,
                options,
                correctOptionIndex: options.indexOf(correctOption),
                hint: grammar.note,
                meaning: grammar.meaning,
                usage: grammar.usage,
                examples: grammar.examples || []
            });
        });

        return examQuestions;
    }

    // Start exam
    const startExamBtn = document.getElementById('startExamBtn');
    if (startExamBtn) {
        startExamBtn.addEventListener('click', () => {
            // Check if user is logged in
            if (!currentUser) {
                // Guest user - check if they already took 1 exam
                const guestExamAttempts = localStorage.getItem('guest_exam_attempts') || '0';
                
                if (parseInt(guestExamAttempts) >= 1) {
                    alert('⚠️ Bạn đã dùng hết lượt thử thi! Vui lòng đăng nhập để tiếp tục học.');
                    return;
                }
                
                // Allow 1st attempt, increment counter
                localStorage.setItem('guest_exam_attempts', '1');
            }
            
            generateExamQuestions();
            examCurrentIndex = 0;
            examAnswers = {};
            examStartTime = Date.now();
            
            document.getElementById('exam-setup').style.display = 'none';
            document.getElementById('exam-screen').style.display = 'block';
            document.getElementById('exam-result').style.display = 'none';
            document.getElementById('exam-review').style.display = 'none';
            
            startExamTimer();
            renderExamQuestion();
        });
    }

    // Timer
    function startExamTimer() {
        const timerEl = document.getElementById('examTimer');
        let remainingSeconds = examTimeLimit;

        examTimerInterval = setInterval(() => {
            remainingSeconds--;
            const mins = Math.floor(remainingSeconds / 60);
            const secs = remainingSeconds % 60;
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

            if (remainingSeconds <= 0) {
                clearInterval(examTimerInterval);
                submitExam();
            }
        }, 1000);
    }

    // Render question
    function renderExamQuestion() {
        if (examCurrentIndex >= examQuestions.length) return;

        const q = examQuestions[examCurrentIndex];
        document.getElementById('currentQuestionNum').textContent = examCurrentIndex + 1;
        document.getElementById('questionText').innerHTML = q.question;
        document.getElementById('examProgressBar').style.width = ((examCurrentIndex + 1) / 20 * 100) + '%';

        // Count answered questions
        const answeredCount = Object.keys(examAnswers).length;
        const remainingCount = 20 - answeredCount;
        document.getElementById('answeredCount').textContent = answeredCount;
        document.getElementById('remainingCount').textContent = remainingCount;

        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, idx) => {
            const isSelected = examAnswers[q.id] === idx;
            const optBtn = document.createElement('button');
            optBtn.className = 'quiz-option';
            if (isSelected) optBtn.classList.add('selected');
            optBtn.textContent = opt;
            optBtn.onclick = () => {
                examAnswers[q.id] = idx;
                document.querySelectorAll('#optionsContainer .quiz-option').forEach(b => b.classList.remove('selected'));
                optBtn.classList.add('selected');
                // Auto save
                localStorage.setItem('exam_answers', JSON.stringify(examAnswers));
                // Update counters
                const newAnsweredCount = Object.keys(examAnswers).length;
                const newRemainingCount = 20 - newAnsweredCount;
                document.getElementById('answeredCount').textContent = newAnsweredCount;
                document.getElementById('remainingCount').textContent = newRemainingCount;
            };
            optionsContainer.appendChild(optBtn);
        });

        // Update navigation
        document.getElementById('examPrevBtn').disabled = examCurrentIndex === 0;
        document.getElementById('examPrevBtn').style.opacity = examCurrentIndex === 0 ? '0.5' : '1';
        document.getElementById('examPrevBtn').style.cursor = examCurrentIndex === 0 ? 'not-allowed' : 'pointer';

        // Disable next button on last question
        const examNextBtn = document.getElementById('examNextBtn');
        const isLastQuestion = examCurrentIndex === examQuestions.length - 1;
        examNextBtn.disabled = isLastQuestion;
        examNextBtn.style.opacity = isLastQuestion ? '0.5' : '1';
        examNextBtn.style.cursor = isLastQuestion ? 'not-allowed' : 'pointer';
    }

    // Navigation
    const examPrevBtn = document.getElementById('examPrevBtn');
    const examNextBtn = document.getElementById('examNextBtn');
    const submitExamBtn = document.getElementById('submitExamBtn');

    if (examPrevBtn) {
        examPrevBtn.addEventListener('click', () => {
            if (examCurrentIndex > 0) {
                examCurrentIndex--;
                renderExamQuestion();
            }
        });
    }

    if (examNextBtn) {
        examNextBtn.addEventListener('click', () => {
            if (examCurrentIndex < examQuestions.length - 1) {
                examCurrentIndex++;
                renderExamQuestion();
            }
        });
    }

    if (submitExamBtn) {
        submitExamBtn.addEventListener('click', submitExam);
    }

    // Submit exam
    function submitExam() {
        clearInterval(examTimerInterval);
        
        // Calculate score
        let correctCount = 0;
        let wrongGrammars = {};

        examQuestions.forEach(q => {
            const userAnswerIndex = examAnswers[q.id];
            if (userAnswerIndex === q.correctOptionIndex) {
                correctCount++;
            } else {
                examWrongCards.push(q);
                wrongGrammars[q.grammarName] = (wrongGrammars[q.grammarName] || 0) + 1;
            }
        });

        const score = correctCount;
        const percentage = Math.round((correctCount / 20) * 100);

        // Show result
        document.getElementById('exam-screen').style.display = 'none';
        document.getElementById('exam-result').style.display = 'block';
        document.getElementById('examScore').textContent = score;
        document.getElementById('examCorrect').textContent = score;
        document.getElementById('examWrong').textContent = 20 - score;
        document.getElementById('examPercentage').textContent = percentage + '%';

        // Weak grammars
        const weakGrammarsDiv = document.getElementById('weakGrammars');
        weakGrammarsDiv.innerHTML = '';
        const sortedWeak = Object.entries(wrongGrammars)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (sortedWeak.length === 0) {
            weakGrammarsDiv.innerHTML = '<p style="color: #10b981;">✅ Bạn làm rất tốt! Không có điểm yếu đáng kể.</p>';
        } else {
            sortedWeak.forEach(([grammar, count]) => {
                const bar = document.createElement('div');
                bar.style.cssText = 'background: #fee2e2; padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem;';
                bar.innerHTML = `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${grammar}</strong>
                    <span style="color: #ef4444;">${count} lỗi</span>
                </div>
                <div style="background: #e2e8f0; height: 4px; border-radius: 2px; overflow: hidden;">
                    <div style="background: #ef4444; height: 100%; width: ${(count / 5) * 100}%;"></div>
                </div>`;
                weakGrammarsDiv.appendChild(bar);
            });
        }

        // Save to Firebase
        if (currentUser) {
            const attemptRef = database.ref(`users/${currentUser.uid}/exam_attempts`).push();
            attemptRef.set({
                created_at: Date.now(),
                score,
                total: 20,
                percentage,
                answers: examAnswers
            });
        }
    }

    // Review wrong answers
    const reviewWrongExamBtn = document.getElementById('reviewWrongExamBtn');
    if (reviewWrongExamBtn) {
        reviewWrongExamBtn.addEventListener('click', () => {
            document.getElementById('exam-result').style.display = 'none';
            document.getElementById('exam-review').style.display = 'block';

            const reviewContainer = document.getElementById('reviewContainer');
            reviewContainer.innerHTML = '';

            examWrongCards.forEach((q, index) => {
                const userAnswerIndex = examAnswers[q.id];
                const userAnswer = q.options[userAnswerIndex] || 'Không trả lời';
                const correctAnswer = q.options[q.correctOptionIndex];
                const cardId = `review-card-${index}`;
                const contentId = `review-content-${index}`;

                const card = document.createElement('div');
                card.id = cardId;
                card.style.cssText = 'background: #fff; border: 2px solid #fee2e2; border-radius: 10px; margin-bottom: 1rem; overflow: hidden;';
                
                // Header (click để expand)
                const header = document.createElement('div');
                header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; cursor: pointer; background: #fef3c7; transition: all 0.3s;';
                header.onmouseover = () => header.style.background = '#fde047';
                header.onmouseout = () => header.style.background = '#fef3c7';
                
                const titleDiv = document.createElement('div');
                titleDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%;';
                
                const grammarSpan = document.createElement('span');
                grammarSpan.style.cssText = 'color: var(--text-main); font-weight: 600; font-size: 1rem;';
                grammarSpan.textContent = q.grammarName;
                
                const statusSpan = document.createElement('span');
                statusSpan.style.cssText = 'background: #fee2e2; color: #ef4444; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;';
                statusSpan.textContent = '❌ SAI';
                
                const expandIcon = document.createElement('span');
                expandIcon.style.cssText = 'font-size: 1.2rem; transition: transform 0.3s; color: #d97706;';
                expandIcon.textContent = '▼';
                expandIcon.id = `expand-icon-${index}`;
                
                titleDiv.appendChild(grammarSpan);
                titleDiv.appendChild(statusSpan);
                titleDiv.appendChild(expandIcon);
                header.appendChild(titleDiv);
                
                card.appendChild(header);
                
                // Content (collapse by default)
                const content = document.createElement('div');
                content.id = contentId;
                content.style.cssText = 'max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: #fff;';
                
                const innerContent = document.createElement('div');
                innerContent.style.cssText = 'padding: 1.5rem;';
                innerContent.innerHTML = `
                    <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.5rem;">📝 Câu Hỏi:</div>
                        <div style="color: var(--text-main);">${q.question}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div style="background: #fee2e2; padding: 1rem; border-radius: 8px;">
                            <div style="font-size: 0.8rem; color: #dc2626; font-weight: 600; margin-bottom: 0.5rem;">👎 Câu Trả Lời</div>
                            <div style="color: var(--text-main);">${userAnswer}</div>
                        </div>
                        <div style="background: #d1fae5; padding: 1rem; border-radius: 8px;">
                            <div style="font-size: 0.8rem; color: #10b981; font-weight: 600; margin-bottom: 0.5rem;">👍 Đáp Án Đúng</div>
                            <div style="color: var(--text-main);">${correctAnswer}</div>
                        </div>
                    </div>
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: #d97706; margin-bottom: 0.5rem;">💡 Mẹo Ghi Nhớ:</div>
                        <div style="color: var(--text-main);">${q.hint || 'N/A'}</div>
                    </div>
                `;
                content.appendChild(innerContent);
                card.appendChild(content);
                
                // Toggle functionality
                let isExpanded = false;
                header.addEventListener('click', () => {
                    isExpanded = !isExpanded;
                    if (isExpanded) {
                        content.style.maxHeight = innerContent.scrollHeight + 'px';
                        expandIcon.style.transform = 'rotate(180deg)';
                    } else {
                        content.style.maxHeight = '0';
                        expandIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                reviewContainer.appendChild(card);
            });

            const backBtn = document.createElement('button');
            backBtn.className = 'btn btn-status';
            backBtn.textContent = '← Quay Lại Kết Quả';
            backBtn.onclick = () => {
                document.getElementById('exam-review').style.display = 'none';
                document.getElementById('exam-result').style.display = 'block';
            };
            reviewContainer.appendChild(backBtn);
        });
    }

    // Retake exam
    const retakeExamBtn = document.getElementById('retakeExamBtn');
    if (retakeExamBtn) {
        retakeExamBtn.addEventListener('click', () => {
            document.getElementById('exam-setup').style.display = 'block';
            document.getElementById('exam-screen').style.display = 'none';
            document.getElementById('exam-result').style.display = 'none';
            document.getElementById('exam-review').style.display = 'none';
        });
    }

    // ===== SPACED REPETITION ENGINE (Kiểu Anki) =====
    // Configuration
    const SPACED_REP_CONFIG = {
        intervals: {
            again: 1,      // 1 ngày
            hard: 3,       // 3 ngày
            good: 7,       // 7 ngày
            easy: 21       // 21 ngày
        },
        initialEaseFactor: 2.5,
        minEaseFactor: 1.3
    };

    // State variables
    let spacedRepCards = [];
    let spacedRepCurrentIndex = 0;
    let spacedRepCurrentDay = 'all';
    let spacedRepFlipped = false;

    // Initialize Spaced Repetition
    function initSpacedRepetition() {
        // Setup UI event listeners
        const adminModeUsers = document.getElementById('adminModeUsers');
        const adminModeSpacedRep = document.getElementById('adminModeSpacedRep');
        const adminUsersTab = document.getElementById('adminUsersTab');
        const adminSpacedRepTab = document.getElementById('adminSpacedRepTab');

        if (adminModeUsers) {
            adminModeUsers.addEventListener('click', () => {
                adminUsersTab.style.display = 'block';
                adminSpacedRepTab.style.display = 'none';
                adminModeUsers.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
                adminModeUsers.style.color = 'white';
                adminModeSpacedRep.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                adminModeSpacedRep.style.color = 'white';
            });
        }

        if (adminModeSpacedRep) {
            adminModeSpacedRep.addEventListener('click', () => {
                adminUsersTab.style.display = 'none';
                adminSpacedRepTab.style.display = 'block';
                adminModeSpacedRep.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                adminModeSpacedRep.style.color = 'white';
                adminModeUsers.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
                adminModeUsers.style.color = 'white';
                loadSpacedRepDashboard();
            });
        }

        // Event listeners for study mode
        const startSpacedRepBtn = document.getElementById('startSpacedRepBtn');
        if (startSpacedRepBtn) {
            startSpacedRepBtn.addEventListener('click', startSpacedRepStudy);
        }

        const exitSpacedRepBtn = document.getElementById('exitSpacedRepBtn');
        if (exitSpacedRepBtn) {
            exitSpacedRepBtn.addEventListener('click', exitSpacedRepStudy);
        }

        // Flashcard flip
        const spacedRepFlashcard = document.getElementById('spacedRepFlashcard');
        if (spacedRepFlashcard) {
            spacedRepFlashcard.addEventListener('click', () => {
                spacedRepFlipped = !spacedRepFlipped;
                if (spacedRepFlipped) {
                    spacedRepFlashcard.classList.add('flipped');
                } else {
                    spacedRepFlashcard.classList.remove('flipped');
                }
            });
        }

        // Response buttons
        document.getElementById('spacedRepAgain')?.addEventListener('click', () => recordResponse('again'));
        document.getElementById('spacedRepHard')?.addEventListener('click', () => recordResponse('hard'));
        document.getElementById('spacedRepGood')?.addEventListener('click', () => recordResponse('good'));
        document.getElementById('spacedRepEasy')?.addEventListener('click', () => recordResponse('easy'));

        // Load dashboard
        loadSpacedRepDashboard();
    }

    // Load dashboard stats
    function loadSpacedRepDashboard() {
        if (!currentUser) return;

        database.ref(`users/${currentUser.uid}/card_progress`).once('value', snap => {
            const cardProgress = snap.val() || {};
            
            let newCount = 0, dueCount = 0, learningCount = 0, reviewCount = 0;
            const today = new Date().setHours(0, 0, 0, 0);

            Object.values(cardProgress).forEach(progress => {
                if (progress.status === 'new') newCount++;
                else if (progress.status === 'learning') learningCount++;
                else if (progress.status === 'review') {
                    reviewCount++;
                    if (progress.due_date <= today) dueCount++;
                }
            });

            document.getElementById('spacedRepNew').textContent = newCount;
            document.getElementById('spacedRepDue').textContent = dueCount;
            document.getElementById('spacedRepLearning').textContent = learningCount;
            document.getElementById('spacedRepReview').textContent = reviewCount;

            // Load day filter
            loadSpacedRepDayFilter();
        });
    }

    // Load day filter for spaced repetition
    function loadSpacedRepDayFilter() {
        const filter = document.getElementById('spacedRepDayFilter');
        if (!filter) return;

        const uniqueDays = [...new Set(flashcardsData.map(item => item.day))].sort((a, b) => a - b);
        filter.innerHTML = '<option value="all">📅 Tất cả Bài</option>';

        uniqueDays.forEach(day => {
            const opt = document.createElement('option');
            opt.value = day;
            opt.textContent = `Ngày ${day}`;
            filter.appendChild(opt);
        });

        filter.addEventListener('change', e => {
            spacedRepCurrentDay = e.target.value;
        });
    }

    // Start spaced repetition study
    function startSpacedRepStudy() {
        if (!currentUser) {
            alert('⚠️ Vui lòng đăng nhập để sử dụng Ôn Tập Ngắt Quãng');
            return;
        }

        database.ref(`users/${currentUser.uid}/card_progress`).once('value', snap => {
            const cardProgress = snap.val() || {};
            const today = new Date().setHours(0, 0, 0, 0);

            // Filter cards to review
            spacedRepCards = flashcardsData.filter(card => {
                if (spacedRepCurrentDay !== 'all' && card.day !== parseInt(spacedRepCurrentDay)) {
                    return false;
                }

                const progress = cardProgress[card.id];
                
                // New cards
                if (!progress) return true;

                // Cards that need review today
                if (progress.status === 'learning' || 
                    (progress.status === 'review' && progress.due_date <= today)) {
                    return true;
                }

                return false;
            });

            if (spacedRepCards.length === 0) {
                alert('✨ Tuyệt vời! Không có thẻ nào cần ôn hôm nay.');
                return;
            }

            spacedRepCurrentIndex = 0;
            spacedRepFlipped = false;

            document.getElementById('spacedRepDashboard').style.display = 'none';
            document.getElementById('spacedRepStudy').style.display = 'block';

            renderSpacedRepCard();
        });
    }

    // Render current spaced repetition card
    function renderSpacedRepCard() {
        const card = spacedRepCards[spacedRepCurrentIndex];
        
        document.getElementById('spacedRepCardNum').textContent = 
            `${spacedRepCurrentIndex + 1}/${spacedRepCards.length}`;
        
        document.getElementById('spacedRepGrammarHint').textContent = `Ngày ${card.day} - Mẫu ${parseInt(card.id.split('_')[1]) + 1}`;
        document.getElementById('spacedRepGrammarFront').textContent = card.grammar;
        document.getElementById('spacedRepMeaning').textContent = card.meaning;
        document.getElementById('spacedRepUsage').textContent = card.usage;
        
        let exampleText = '';
        if (card.examples && card.examples.length > 0) {
            exampleText = `${card.examples[0].jp}<br/>
                          (${card.examples[0].furi})<br/>
                          Dịch: ${card.examples[0].vi}`;
        }
        document.getElementById('spacedRepExample').innerHTML = exampleText;

        // Reset flip state
        spacedRepFlipped = false;
        document.getElementById('spacedRepFlashcard').classList.remove('flipped');
    }

    // Record response and calculate next interval
    function recordResponse(quality) {
        if (!currentUser) return;

        const card = spacedRepCards[spacedRepCurrentIndex];
        const userRef = database.ref(`users/${currentUser.uid}`);

        userRef.child('card_progress').once('value', snap => {
            const cardProgress = snap.val() || {};
            const progress = cardProgress[card.id] || {
                status: 'new',
                interval: 0,
                ease_factor: SPACED_REP_CONFIG.initialEaseFactor,
                review_count: 0,
                created_at: Date.now()
            };

            // Calculate new interval and ease factor
            const qualityMap = { again: 0, hard: 1, good: 3, easy: 4 };
            const q = qualityMap[quality];

            // New ease factor (SM-2 algorithm)
            const newEF = Math.max(
                SPACED_REP_CONFIG.minEaseFactor,
                progress.ease_factor + (0.1 - (5 - q) * 0.08)
            );

            // New interval
            let newInterval;
            if (quality === 'again') {
                newInterval = SPACED_REP_CONFIG.intervals.again;
                progress.status = 'learning';
            } else if (quality === 'hard') {
                newInterval = SPACED_REP_CONFIG.intervals.hard;
                progress.status = 'learning';
            } else if (quality === 'good') {
                newInterval = Math.max(7, Math.round(progress.interval * newEF));
                progress.status = 'review';
            } else { // easy
                newInterval = Math.max(21, Math.round(progress.interval * newEF));
                progress.status = 'review';
            }

            // Calculate due date (in milliseconds)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + newInterval);
            const dueDate = tomorrow.setHours(0, 0, 0, 0);

            // Update progress
            progress.interval = newInterval;
            progress.ease_factor = newEF;
            progress.due_date = dueDate;
            progress.last_reviewed = Date.now();
            progress.review_count = (progress.review_count || 0) + 1;

            // Save to Firebase
            const updates = {};
            updates[`card_progress/${card.id}`] = progress;

            // Log review history
            const reviewRef = userRef.child('review_history').push();
            reviewRef.set({
                card_id: card.id,
                response: quality,
                interval: newInterval,
                ease_factor: newEF,
                timestamp: Date.now()
            });

            userRef.update(updates).then(() => {
                // Move to next card
                spacedRepCurrentIndex++;
                if (spacedRepCurrentIndex < spacedRepCards.length) {
                    spacedRepFlipped = false;
                    document.getElementById('spacedRepFlashcard').classList.remove('flipped');
                    renderSpacedRepCard();
                } else {
                    // Study complete
                    completeSpacedRepStudy();
                }
            });
        });
    }

    // Complete spaced repetition study
    function completeSpacedRepStudy() {
        alert(`✨ Hoàn thành! Bạn đã ôn tập ${spacedRepCards.length} thẻ.`);
        exitSpacedRepStudy();
    }

    // Exit spaced repetition study
    function exitSpacedRepStudy() {
        document.getElementById('spacedRepStudy').style.display = 'none';
        document.getElementById('spacedRepDashboard').style.display = 'block';
        loadSpacedRepDashboard();
    }

    // Initialize Spaced Repetition if admin
    if (currentRole === 'admin') {
        initSpacedRepetition();
    }

    // ========================================
});
