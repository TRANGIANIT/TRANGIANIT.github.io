const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="quizFeedback"></div></body></html>`);
const document = dom.window.document;

document.addEventListener = (ev, cb) => cb();

document.addEventListener('DOMContentLoaded', () => {
    const quizFeedback = document.getElementById('quizFeedback');
    
    // Simulating Firebase sync
    const progressRef = {
        once: (event, cb) => {
            // sync call
            cb({ val: () => null });
        }
    };

    progressRef.once('value', (snapshot) => {
        generateQuiz();
    });

    function generateQuiz() {
        quizFeedback.className = 'test';
        console.log("Success! " + quizFeedback.className);
    }
});
