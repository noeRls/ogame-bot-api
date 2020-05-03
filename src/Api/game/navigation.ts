import { Page } from "puppeteer";

export class Navigation {
    serverUrl: string;
    constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
    }

    async goToHomePage(page: Page) {
        await page.goto(`${this.serverUrl}/game`);
    }

    async goToResourcePage(page: Page) {
        await page.goto(`${this.serverUrl}/game/index.php?page=ingame&component=supplies`);
    }

    async goToFacilitiesPage(page: Page) {
        await page.goto(`${this.serverUrl}/game/index.php?page=ingame&component=facilities`);
    }

    async goToResearchPage(page: Page) {
        await page.goto(`${this.serverUrl}/game/index.php?page=ingame&component=research`);
    }

    async goToShipPage(page: Page) {
        await page.goto(`${this.serverUrl}/game/index.php?page=ingame&component=shipyard`);
    }

    async goToDefensePage(page: Page) {
        await page.goto(`${this.serverUrl}/game/index.php?page=ingame&component=defenses`);
    }
}