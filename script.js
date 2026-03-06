// flashcardsData is now loaded globally from data.js

document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentCardSpan = document.getElementById('currentCard');
    const totalCardsSpan = document.getElementById('totalCards');
    const statusFilter = document.getElementById('statusFilter');
    const dayFilter = document.getElementById('dayFilter');
    const toggleLearnedBtn = document.getElementById('toggleLearnedBtn');
    const cardBadge = document.getElementById('cardBadge');

    // Quiz DOM Elements
    const quizDayFilter = document.getElementById('quizDayFilter');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextQuizBtn = document.getElementById('nextQuizBtn');

    const navTabs = document.querySelectorAll('.nav-tab');
    const viewSections = document.querySelectorAll('.view-section');

    let isFlipped = false;
    let filteredCards = [...flashcardsData];
    let currentIndex = 0;

    // Firebase Syncing Reference
    const progressRef = database.ref('users/my_progress');

    // Load saved preferences from Firebase
    progressRef.once('value', (snapshot) => {
        const savedData = snapshot.val();
        if (savedData) {
            // Merge learned status to memory
            flashcardsData = flashcardsData.map(card => {
                const isLearned = savedData[card.id] || false;
                return { ...card, learned: isLearned };
            });
        }

        // Initialize UI Filters & Tabs
        initDayFilters();
        filterCards();
        generateQuiz();
    });

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

            // Reflow fix for CSS animation
            void targetView.offsetWidth;
            targetView.classList.add('active');
        });
    });

    // Flip card logic
    // Add event listener to elements inside the flashcard instead, so clicking buttons outside doesn't flip it
    flashcard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        if (isFlipped) {
            flashcard.classList.add('flipped');
        } else {
            flashcard.classList.remove('flipped');
        }
    });

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

    // Filtering logic
    statusFilter.addEventListener('change', () => {
        filterCards();
        resetFlip();
    });

    dayFilter.addEventListener('change', () => {
        filterCards();
        resetFlip();
    });

    function initDayFilters() {
        const quizDayFilter = document.getElementById('quizDayFilter');
        const uniqueDays = [...new Set(flashcardsData.map(item => item.day))].sort((a, b) => a - b);

        uniqueDays.forEach(day => {
            const opt1 = document.createElement('option');
            opt1.value = day;
            opt1.textContent = `Ngày ${day}`;
            dayFilter.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = day;
            opt2.textContent = `Ngày ${day}`;
            quizDayFilter.appendChild(opt2);
        });
    }

    function filterCards() {
        const statusVal = statusFilter.value;
        const dayVal = dayFilter.value;

        filteredCards = flashcardsData.filter(c => {
            let statusMatch = true;
            if (statusVal === 'not_learned') statusMatch = !c.learned;
            else if (statusVal === 'learned') statusMatch = c.learned;

            let dayMatch = true;
            if (dayVal !== 'all') dayMatch = (c.day === parseInt(dayVal));

            return statusMatch && dayMatch;
        });

        currentIndex = 0;
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

            // Save state to Firebase Cloud (just boolean key-value mapping to save data space)
            const payload = {};
            flashcardsData.forEach(c => {
                if (c.learned) {
                    payload[c.id] = true;
                }
            });
            progressRef.set(payload);

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
        const exportGrammar = document.getElementById('exportGrammar');
        if (exportGrammar) exportGrammar.textContent = data.grammar;
        const exportMeaning = document.getElementById('exportMeaning');
        if (exportMeaning) exportMeaning.textContent = data.meaning;
        const exportUsage = document.getElementById('exportUsage');
        if (exportUsage) exportUsage.textContent = data.usage;

        if (data.examples && data.examples.length > 0) {
            const exportExJp = document.getElementById('exportExJp');
            if (exportExJp) exportExJp.textContent = data.examples[0].jp;
            const exportExVi = document.getElementById('exportExVi');
            if (exportExVi) exportExVi.textContent = data.examples[0].vi;
        }

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
    const exportImageBtn = document.getElementById('exportImageBtn');
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

        } catch (e) {
            console.error("Export failed:", e);
            alert("Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại!");
        } finally {
            exportImageBtn.disabled = false;
            exportImageBtn.innerHTML = originalHTML;
        }
    });

    // --- Quiz Logic ---
    let currentQuizAnswer = null;

    quizDayFilter.addEventListener('change', generateQuiz);
    nextQuizBtn.addEventListener('click', generateQuiz);

    function generateQuiz() {
        // Reset UI
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.style.display = 'none';
        nextQuizBtn.style.display = 'none';
        quizOptions.innerHTML = '';

        const qDayVal = quizDayFilter.value;
        let pool = flashcardsData;
        if (qDayVal !== 'all') {
            pool = flashcardsData.filter(c => c.day === parseInt(qDayVal));
        }

        if (pool.length < 4) {
            quizQuestion.textContent = "Không đủ dữ liệu bộ từ vựng để tạo bài Trắc nghiệm. Hãy chọn Ngày khác hoặc Tất cả.";
            return;
        }

        // Pick 1 random correct grammar
        const correctCard = pool[Math.floor(Math.random() * pool.length)];

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
            questionText = `Cấu trúc nào phù hợp với câu sau: "<br><i>${correctCard.examples[0].jp}</i>" ?`;
            correctOptionText = correctCard.grammar;
            currentQuizAnswer = correctOptionText;
            explanationText = `<strong>${correctCard.grammar}</strong><br>Dịch nghĩa câu ví dụ: ${correctCard.examples[0].vi}`;
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

            if (!options.includes(wrongText)) {
                options.push(wrongText);
            }
        }

        // Shuffle
        options.sort(() => Math.random() - 0.5);

        // Render options
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleQuizAnswer(btn, opt, correctOptionText, explanationText));
            quizOptions.appendChild(btn);
        });
    }

    function handleQuizAnswer(clickedBtn, selectedText, correctText, explanation) {
        // Prevent multiple clicks
        if (nextQuizBtn.style.display === 'block') return;

        const allButtons = quizOptions.querySelectorAll('.quiz-option');

        if (selectedText === correctText) {
            clickedBtn.classList.add('correct');
            quizFeedback.innerHTML = `✅ <strong>Chính xác!</strong><br><br>${explanation}`;
            quizFeedback.className = 'quiz-feedback success';
        } else {
            clickedBtn.classList.add('wrong');
            quizFeedback.innerHTML = `❌ <strong>Sai rồi!</strong><br><br>${explanation}`;
            quizFeedback.className = 'quiz-feedback error';

            // Highlight the correct one
            allButtons.forEach(b => {
                if (b.textContent === correctText) {
                    b.classList.add('correct');
                }
            });
        }

        nextQuizBtn.style.display = 'block';
    }
});
