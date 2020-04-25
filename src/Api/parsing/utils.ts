import { openPannel } from "./pannel";
import { Page, ElementHandle } from "puppeteer";

export interface Meter {
    min: number;
    max: number;
    value: number;
};

export const getMeter = async (elem: ElementHandle<Element>, id: number, page: Page): Promise<Meter> => {
    const pannel = await openPannel(page, elem, id);
    return await pannel.evaluate(e => {
        const meter = e.querySelector('meter');
        return {
            max: Number(meter.getAttribute('max')),
            min: Number(meter.getAttribute('min')),
            value: Number(meter.getAttribute('value')),
        };
    });
}