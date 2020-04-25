import { Page, ElementHandle } from "puppeteer";

const getUpgradePannelXpath = (id: number) => `//*[@data-technology-id=${id}][@id='technologydetails']`;

export const openPannel = async (page: Page, elem: ElementHandle<Element>, id: number): Promise<ElementHandle<Element>> => {
    await elem.click();
    await page.waitForXPath(getUpgradePannelXpath(id), {timeout: 2000});
    return getPannel(page);
}

export const getPannel = (page: Page): Promise<ElementHandle<Element>> => {
    return page.$('[id=technologydetails]');
}