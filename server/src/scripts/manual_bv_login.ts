import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

(async () => {
    // Define paths matching orchestrator.ts
    const COOKIES_DIR = path.join(__dirname, '../../cookies');
    const BV_PROFILE_DIR = path.join(COOKIES_DIR, 'bv_chrome_profile');

    // Ensure directories exist
    if (!fs.existsSync(COOKIES_DIR)) {
        fs.mkdirSync(COOKIES_DIR, { recursive: true });
    }
    if (!fs.existsSync(BV_PROFILE_DIR)) {
        fs.mkdirSync(BV_PROFILE_DIR, { recursive: true });
    }

    console.log('[Manual Login] Launching Chrome with persistent profile for BV...');
    console.log(`[Manual Login] Profile path: ${BV_PROFILE_DIR}`);

    const context = await chromium.launchPersistentContext(BV_PROFILE_DIR, {
        headless: false,
        channel: 'chrome',
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
        ],
        viewport: null,
        locale: 'pt-BR',
        timezoneId: 'America/Sao_Paulo',
    });

    const page = context.pages()[0] || await context.newPage();

    console.log('[Manual Login] Navigating to BV login page...');
    await page.goto('https://parceiro.bv.com.br/ng-gpar-base-login/', { waitUntil: 'domcontentloaded' });

    console.log('[Manual Login] Browser is open. Please log in manually.');
    console.log('[Manual Login] ⚠️  DO NOT CLOSE THE TERMINAL.');
    console.log('[Manual Login] When you are done logging in and see the dashboard, you can close the browser manually or press Ctrl+C here.');
    console.log('[Manual Login] The session/cookies will be saved automatically to the profile folder.');

    // Keep the script running
    await new Promise(() => { });

})();
