// Hardcoded data parsed from Flashcard.txt
let flashcardsData = [
    {
        id: 1,
        learned: false,
        grammar: "〜っこない",
        meaning: "Tuyệt đối không…, chắc chắn không…",
        usage: "Vます bỏ ます + っこない",
        note: "👉 Khẳng định mạnh khả năng = 0 (văn nói)",
        examples: [
            {
                type: "Ví dụ (IT)",
                jp: "そんな短期間でシステムが完成できっこない。",
                furi: "そんなたんきかんでしすてむがかんせいできっこない。",
                vi: "Dịch: Thời gian ngắn vậy thì hệ thống chắc chắn không thể hoàn thành."
            },
            {
                type: "Ví dụ (Hằng ngày)",
                jp: "あの人が嘘をつくっこない。",
                furi: "あのひとがうそをつくっこない。",
                vi: "Dịch: Người đó tuyệt đối không nói dối đâu."
            }
        ]
    },
    {
        id: 2,
        learned: false,
        grammar: "〜つつある",
        meaning: "Đang dần…, đang trong quá trình thay đổi",
        usage: "Vます bỏ ます + つつある",
        note: "👉 Diễn tả sự thay đổi đang tiến triển (văn viết, trang trọng)",
        examples: [
            {
                type: "Ví dụ (IT)",
                jp: "AI技術は急速に進化しつつある。",
                furi: "えーあいぎじゅつはきゅうそくにしんかしつつある。",
                vi: "Dịch: Công nghệ AI đang dần phát triển nhanh chóng."
            },
            {
                type: "Ví dụ (Hằng ngày)",
                jp: "景気は少しずつ回復しつつある。",
                furi: "けいきはすこしずつかいふくしつつある。",
                vi: "Dịch: Kinh tế đang dần hồi phục."
            }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentCardSpan = document.getElementById('currentCard');
    const totalCardsSpan = document.getElementById('totalCards');
    const statusFilter = document.getElementById('statusFilter');
    const toggleLearnedBtn = document.getElementById('toggleLearnedBtn');
    const cardBadge = document.getElementById('cardBadge');

    let isFlipped = false;
    let filteredCards = [...flashcardsData];
    let currentIndex = 0;

    // Load saved preferences if available in localStorage
    const savedData = localStorage.getItem('japaneseFlashcardsData');
    if (savedData) {
        flashcardsData = JSON.parse(savedData);
        filterCards();
    }

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

    function filterCards() {
        const filterVal = statusFilter.value;
        if (filterVal === 'not_learned') {
            filteredCards = flashcardsData.filter(c => !c.learned);
        } else if (filterVal === 'learned') {
            filteredCards = flashcardsData.filter(c => c.learned);
        } else {
            filteredCards = [...flashcardsData];
        }

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
            flashcardsData[originalIndex].learned = !flashcardsData[originalIndex].learned;

            // Save state
            localStorage.setItem('japaneseFlashcardsData', JSON.stringify(flashcardsData));

            // Only update badge and button to maintain normal UX
            currentRef.learned = flashcardsData[originalIndex].learned;
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

        // Update Nav State
        currentCardSpan.textContent = (index + 1).toString();
        totalCardsSpan.textContent = filteredCards.length.toString();

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === filteredCards.length - 1;

        // Update Status States
        toggleLearnedBtn.disabled = false;
        if (data.learned) {
            cardBadge.textContent = "✅ Đã thuộc";
            cardBadge.className = "status-badge learned";
            toggleLearnedBtn.textContent = "Hủy dấu Đã thuộc 🔄";
            toggleLearnedBtn.className = "btn btn-status btn-unlearned";
        } else {
            cardBadge.textContent = "🔴 Chưa thuộc";
            cardBadge.className = "status-badge";
            toggleLearnedBtn.textContent = "Đánh dấu Đã thuộc ✅";
            toggleLearnedBtn.className = "btn btn-status";
        }
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
        document.getElementById('exportGrammar').textContent = data.grammar;
        document.getElementById('exportMeaning').textContent = data.meaning;
        document.getElementById('exportUsage').textContent = data.usage;
        document.getElementById('exportExJp').textContent = data.examples[0].jp; // Only picking 1 example for cleaner export
        document.getElementById('exportExVi').textContent = data.examples[0].vi;

        // Update Nav State
        currentCardSpan.textContent = (index + 1).toString();
        totalCardsSpan.textContent = filteredCards.length.toString();

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === filteredCards.length - 1;

        // Update Status States
        toggleLearnedBtn.disabled = false;
        if (data.learned) {
            cardBadge.textContent = "✅ Đã thuộc";
            cardBadge.className = "status-badge learned";
            toggleLearnedBtn.textContent = "Hủy dấu Đã thuộc 🔄";
            toggleLearnedBtn.className = "btn btn-status btn-unlearned";
        } else {
            cardBadge.textContent = "🔴 Chưa thuộc";
            cardBadge.className = "status-badge";
            toggleLearnedBtn.textContent = "Đánh dấu Đã thuộc ✅";
            toggleLearnedBtn.className = "btn btn-status";
        }
    }

    // Export Logic
    const exportImageBtn = document.getElementById('exportImageBtn');
    const exportTemplate = document.getElementById('exportTemplate');

    exportImageBtn.addEventListener('click', async () => {
        if (filteredCards.length === 0) return;

        exportImageBtn.disabled = true;
        const originalText = exportImageBtn.textContent;
        exportImageBtn.textContent = "Đang tải...";

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
            exportImageBtn.textContent = originalText;
        }
    });

    // Init first layout sync
    filterCards();
});
