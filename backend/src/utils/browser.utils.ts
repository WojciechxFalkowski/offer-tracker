import { chromium, Page, Browser } from 'playwright';

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
];

export async function createBrowserPage(): Promise<{ browser: Browser, page: Page }> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
    });
    const page = await context.newPage();
    return { browser, page };
}

export async function handleCookieBanner(page: Page): Promise<void> {
    try {
        const acceptCookiesButton = await page.$('button#onetrust-accept-btn-handler');
        if (acceptCookiesButton) {
            await acceptCookiesButton.click();
            await page.waitForTimeout(500);
        } else {
            console.log("No cookie banner detected.");
        }
    } catch (error) {
        console.warn(`Error handling cookie banner: ${error.message}`);
    }
}

function getRandomUserAgent(): string {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
