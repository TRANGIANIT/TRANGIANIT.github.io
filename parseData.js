const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, 'resource');
let allData = [];

// 1. Find all DayX files
const files = fs.readdirSync(resDir)
    .filter(f => /^DA?y\d+\.(txt|xtx)$/i.test(f))
    .sort((a, b) => {
        const da = parseInt(a.toLowerCase().replace(/day/i, '').replace(/\..+/, ''));
        const db = parseInt(b.toLowerCase().replace(/day/i, '').replace(/\..+/, ''));
        return da - db;
    });

files.forEach(file => {
    const dayMatch = file.match(/^DA?y(\d+)/i);
    if (!dayMatch) return;
    const dayNum = parseInt(dayMatch[1]);
    
    const content = fs.readFileSync(path.join(resDir, file), 'utf-8');
    
    // Split by line break markers '---' or '. ' or just look for 'Ngữ pháp:'
    const blocks = content.split(/---|\n\.\n|\n\.(\s|$)/).filter(b => b && b.includes('Ngữ pháp:'));
    
    blocks.forEach((block, index) => {
        const item = {
            id: `day${dayNum}_${index}`,
            day: dayNum,
            grammar: "",
            meaning: "",
            usage: "",
            note: "",
            ex_it: "",
            ex_daily: "",
            learned: false,
            examples: []
        };
        
        let inIT = false;
        let inDaily = false;
        let curITJp = "", curITFuri = "", curITVi = "";
        let curDailyJp = "", curDailyFuri = "", curDailyVi = "";

        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        
        lines.forEach(line => {
            if (line.startsWith('Ngữ pháp:')) {
                item.grammar = line.replace('Ngữ pháp:', '').trim();
            } else if (line.startsWith('Ý nghĩa:')) {
                item.meaning = line.replace('Ý nghĩa:', '').trim();
            } else if (line.startsWith('Cách dùng:')) {
                item.usage = line.replace('Cách dùng:', '').trim();
            } else if (line.startsWith('👉')) {
                item.note = line.trim();
            } else if (line.startsWith('Ví dụ (IT):')) {
                inIT = true;
                inDaily = false;
            } else if (line.startsWith('Ví dụ (Hằng ngày):')) {
                inDaily = true;
                inIT = false;
            } else if (line.startsWith('Dịch:')) {
                if (inIT) curITVi = line;
                else if (inDaily) curDailyVi = line;
            } else {
                // Determine if it's furigana (hiragana/katakana) or kanji
                // Typically the original line has kanji, the furigana line has only hiragana.
                // But a simpler approach is: the first line after "Ví dụ" is JP, second is Furi.
                if (inIT && !curITVi) {
                    if (!curITJp) curITJp = line;
                    else curITFuri = line;
                } else if (inDaily && !curDailyVi) {
                    if (!curDailyJp) curDailyJp = line;
                    else curDailyFuri = line;
                }
            }
        });
        
        if (curITJp || curITVi) {
            item.examples.push({
                type: 'Ví dụ (IT)',
                jp: curITJp,
                furi: curITFuri || curITJp,
                vi: curITVi || ""
            });
        }
        if (curDailyJp || curDailyVi) {
            item.examples.push({
                type: 'Ví dụ (Hằng ngày)',
                jp: curDailyJp,
                furi: curDailyFuri || curDailyJp,
                vi: curDailyVi || ""
            });
        }
        
        if (item.grammar) {
            allData.push(item);
        }
    });
});

const outPath = path.join(__dirname, 'data.js');
const jsCode = `const flashcardsData = ${JSON.stringify(allData, null, 4)};\n`;
fs.writeFileSync(outPath, jsCode, 'utf-8');
console.log(`Parsed ${allData.length} grammar items across ${files.length} days.`);
