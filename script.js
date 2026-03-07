// flashcardsData is now loaded globally from data.js

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



    const navTabs = document.querySelectorAll('.nav-tab');
    const viewSections = document.querySelectorAll('.view-section');

    var currentQuizAnswer = null;
    let isFlipped = false;
    let filteredCards = [...flashcardsData];
    let currentIndex = 0;

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
        reloadAppBtn.addEventListener('click', () => {
            reloadAppBtn.textContent = 'Đang tải...';
            window.location.reload(true);
        });
    }

    // Mặc định load filter ngày 1 (Cho Guest Mode)
    if (!isFirebaseLoaded) {
        initDayFilters();
        filterCards();
        if (quizWeekFilter) generateQuiz();
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
                if (quizWeekFilter) generateQuiz();
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

            // User is signed out (Guest Mode)
            authHeaderBtn.textContent = "Đăng Nhập";
            guestWarning.style.display = 'block';
            adminNavTab.style.display = 'none';
            exportImageBtn.style.display = 'inline-block'; // Guest cho phép tải ảnh bài 1
            requestDownloadBtn.style.display = 'none';
            if (bulkDownloadBtn) bulkDownloadBtn.style.display = 'none';
            progressRef = null;

            initDayFilters(); // Update filters (only day 1 available)
            filterCards();
            if (quizWeekFilter) generateQuiz();
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

        if (swipeStampLeft) swipeStampLeft.textContent = unlearnedMessages[Math.floor(Math.random() * unlearnedMessages.length)];
        if (swipeStampRight) swipeStampRight.textContent = learnedMessages[Math.floor(Math.random() * learnedMessages.length)];
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
        generateQuiz();
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
            alert("Đã gửi yêu cầu cấp quyền tải ảnh cho Admin!");
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
        generateQuiz();
    });
    quizDayFilter.addEventListener('change', generateQuiz);
    nextQuizBtn.addEventListener('click', generateQuiz);

    function generateQuiz() {
        // Reset UI
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.style.display = 'none';
        nextQuizBtn.style.display = 'none';
        quizOptions.innerHTML = '';

        const qWeekVal = quizWeekFilter.value;
        const qDayVal = quizDayFilter.value;

        let pool = flashcardsData.filter(c => {
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
            // Safe fallback if card has no examples
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
    adminNavTab.addEventListener('click', () => {
        if (currentRole !== 'admin') return;
        const adminTbody = document.getElementById('adminUsersTableBody');
        adminTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 1rem;">Đang tải...</td></tr>';

        database.ref('users').once('value').then(snapshot => {
            const allUsers = snapshot.val();
            adminTbody.innerHTML = '';

            if (!allUsers) {
                adminTbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chưa có người dùng nào.</td></tr>';
                return;
            }

            Object.keys(allUsers).forEach(uid => {
                const uData = allUsers[uid];
                const p = uData.profile || {};
                const userEmail = p.email || uid;
                const dName = p.displayName || "";
                const avatar = p.photoURL ? `<img src="${p.photoURL}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px;">` : '';
                const emailTitle = dName ? `<div style="display:flex; align-items:center; font-weight:bold;">${avatar}${dName}</div><div style="font-size:0.75rem; color:var(--text-light); margin-top:2px;">${userEmail}</div>` : `<div>${userEmail}</div>`;
                const role = p.role || 'user';
                const dStatus = p.downloadStatus || 'none';
                const loginCount = p.loginCount || 0;
                const dCount = p.downloadCount || 0;

                let lastLoginStr = "Chưa có";
                let isActive = false;
                if (p.lastLogin) {
                    const d = new Date(p.lastLogin);
                    lastLoginStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // Nếu thời gian login cách hiện tại nhỏ hơn 24 giờ (86400000 ms) 
                    if (Date.now() - p.lastLogin < 86400000) {
                        isActive = true;
                    }
                }
                const activeUI = isActive ? '<span style="color: #38a169; font-weight:bold; font-size: 0.8rem;">🟢 Đang H.Động</span>' : '<span style="color: #a0aec0; font-weight:bold; font-size: 0.8rem;">🔴 Ngoại tuyến</span>';
                lastLoginStr = `<div>${lastLoginStr}</div><div style="margin-top: 4px;">${activeUI}</div>`;

                // Đếm số từ đã học
                let learnedCount = 0;
                if (uData.my_progress) {
                    learnedCount = Object.values(uData.my_progress).filter(val => val === true).length;
                }

                let dStatusUI = "<span style='color: #718096;'>Chưa xin</span>";
                let actionsUI = "";

                if (dStatus === 'pending') {
                    dStatusUI = "<span style='color: #dd6b20; font-weight:bold;'>Chờ duyệt</span>";
                    actionsUI += `<button class='btn-admin-action btn-approve' onclick="window.adminSetDownload('${uid}', 'approved')">Duyệt</button>`;
                } else if (dStatus === 'approved') {
                    dStatusUI = "<span style='color: #38a169; font-weight:bold;'>Đã Duyệt</span>";
                    if (role !== 'admin') actionsUI += `<button class='btn-admin-action btn-revoke' onclick="window.adminSetDownload('${uid}', 'none')">Tước Quyền</button>`;
                }

                if (role !== 'admin') {
                    actionsUI += `<div style='margin-top: 5px;'><button class='btn-admin-action btn-delete' onclick="window.adminDeleteUser('${uid}')">Xóa DL Người Dùng</button></div>`;
                }

                const roleBage = role === 'admin'
                    ? '<span class="status-badge learned" style="position:static; font-size: 0.7rem; padding: 2px 6px;">Admin</span>'
                    : '<span class="status-badge" style="position:static; font-size: 0.7rem; padding: 2px 6px;">User</span>';

                const statsUI = `<div style="font-size: 0.8rem; line-height: 1.4;">
                    <div>Đã học: <b>${learnedCount}</b> từ</div>
                    <div>Sign-in: <b>${loginCount}</b> lần</div>
                    <div>Tải ảnh: <b>${dCount}</b> ảnh</div>
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
        }).catch(err => {
            adminTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
        });
    });

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
});
