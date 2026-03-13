// ===== SPACED REPETITION ENGINE (Kiểu Anki) =====
// Được thêm vào cuối script.js, trước dấu đóng cuối cùng

// Spaced Repetition Config
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
    // Load card progress from Firebase
    if (currentUser) {
        database.ref(`users/${currentUser.uid}/card_progress`).on('value', snap => {
            const cardProgress = snap.val() || {};
            console.log('📚 Loaded card progress:', Object.keys(cardProgress).length, 'cards');
        });
    }

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
    document.getElementById('spacedRepNote').textContent = card.note || '';
    
    // Render examples
    if (card.examples && card.examples.length >= 2) {
        document.getElementById('spacedRepExItJp').textContent = card.examples[0].jp;
        document.getElementById('spacedRepExItFuri').textContent = card.examples[0].furi;
        document.getElementById('spacedRepExItVi').textContent = card.examples[0].vi;

        document.getElementById('spacedRepExDayJp').textContent = card.examples[1].jp;
        document.getElementById('spacedRepExDayFuri').textContent = card.examples[1].furi;
        document.getElementById('spacedRepExDayVi').textContent = card.examples[1].vi;
    }

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

        // New ease factor
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Existing code...
    
    // Initialize Spaced Repetition after Firebase is ready
    if (currentRole === 'admin') {
        setTimeout(initSpacedRepetition, 1000);
    }
});
