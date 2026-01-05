const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  // Pre-populate localStorage before page load
  await context.addInitScript(() => {
    localStorage.setItem('ej_logged_in_user', JSON.stringify({ id: 'admin-id', username: 'admin', role: 'ADMIN' }));
    localStorage.setItem('ej_lang', 'ms');
    // Add a diagram override for diagram id 1
    localStorage.setItem('diagram_override_1', JSON.stringify({ titleMy: 'Ujian Tajuk MY', descriptionMy: 'Ujian Keterangan MY' }));
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5174/project-info');
  // Wait for page to render
  await page.waitForSelector('text=Chapter 3');
  // Open Chapter 3
  await page.click('button:has-text("Chapter 3")');
  // Wait for Export button visible
  await page.waitForSelector('text=Eksport ke Word, Export to Word', { timeout: 5000 }).catch(()=>{});

  // Try to click the export button; use selector by title text in both languages
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Eksport ke Word")').catch(async () => {
      // fallback to English text
      await page.click('button:has-text("Export to Word")');
    })
  ]);

  const path = await download.path();
  const savePath = './exports/test-export.doc';
  await download.saveAs(savePath).catch(async () => {
    // if saveAs not available, copy from temp path
    if (path) fs.copyFileSync(path, savePath);
  });

  console.log('Saved export to', savePath);

  // Quick verification: check the saved file contains Malay title
  const data = fs.readFileSync(savePath, 'utf8');
  if (data.includes('Ujian Tajuk MY') || data.includes('Ujian Keterangan MY')) {
    console.log('Verification: Malay strings found in exported document. ✅');
  } else {
    console.log('Verification: Malay strings NOT found in exported document. ❌');
  }

  await browser.close();
})();
