const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

async function exportToWord() {
  console.log('Starting export to Word...');

  const mdPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\09a1c1a8-0b96-4e39-af0e-941ad9b73290\\project_review_II.md';
  const imgPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\09a1c1a8-0b96-4e39-af0e-941ad9b73290\\er.png';
  const outPath = 'C:\\Users\\ADMIN\\Downloads\\Project_Review_II.doc';

  let base64Image = '';
  try {
    const imgBuf = fs.readFileSync(imgPath);
    base64Image = `data:image/png;base64,${imgBuf.toString('base64')}`;
  } catch (err) {
    console.error('Error reading er.png:', err);
    process.exit(1);
  }

  let mdContent = fs.readFileSync(mdPath, 'utf8');

  const startIndex = mdContent.indexOf('```mermaid');
  const endIndex = mdContent.indexOf('```', startIndex + 10) + 3;

  if (startIndex !== -1 && endIndex !== -1) {
    const before = mdContent.slice(0, startIndex);
    const after = mdContent.slice(endIndex);
    mdContent = before + `\n<div style="text-align:center"><img src="${base64Image}" alt="ER Diagram" style="max-width:100%; height:auto;" /></div>\n` + after;
  }

  const htmlContent = marked.parse(mdContent);

  const fullHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
      <meta charset="utf-8">
      <title>Project Review II</title>
      <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; padding: 20px; }
          h1 { font-family: 'Cambria', serif; font-size: 20pt; color: #2F5496; border-bottom: 2px solid #2F5496; padding-bottom: 5px; }
          h2 { font-family: 'Cambria', serif; font-size: 16pt; color: #2F5496; margin-top: 20px; }
          h3 { font-family: 'Cambria', serif; font-size: 14pt; color: #1F3763; }
          hr { border: 0; border-top: 1px solid #ccc; margin: 20px 0; }
          ul, ol { margin-left: 20px; }
          li { margin-bottom: 8px; }
          p { margin-bottom: 15px; }
          strong { font-weight: bold; }
          img { border: 1px solid #ddd; padding: 5px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      </style>
  </head>
  <body>
      ${htmlContent}
  </body>
  </html>
  `;

  fs.writeFileSync(outPath, fullHtml, 'utf8');
  console.log('Successfully saved to:', outPath);
}

exportToWord().catch(console.error);
