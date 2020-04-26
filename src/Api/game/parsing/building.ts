import { Upgrade, ResourceList, Status, BuildingLight, BuildingType, BuildingList } from "../types";
import { stringToStatus, stringToResourceType, getEmptyResourceList } from "../typesHelper";
import { Page, ElementHandle } from 'puppeteer';
import { openPannel } from "./pannel";

const COST_SELECTOR = '[class=costs]';

const getBuildingUpgradeUrl = async (status: Status, elem: ElementHandle<Element>): Promise<string | undefined> => {
    if (status === 'on') {
        return await elem.evaluate(e => {
            const button = e.querySelector('button');
            if (!button) return undefined;
            return button.getAttribute('data-target');
        });
    }
    return undefined;
};

// Page should have upgrade pannel open
const getUpgradeCosts = async (page: Page): Promise<ResourceList> => {
    const costElem = await page.$(COST_SELECTOR);
    const resourcesElem = await costElem.$$('[class*=resource]');
    const costs = getEmptyResourceList();
    await Promise.all(resourcesElem.map(async resourceElem => {
        const { value, classname } = await resourceElem.evaluate(elem => ({
            value: Number(elem.getAttribute('data-value')),
            classname: elem.getAttribute('class'),
        }));
        const resource = stringToResourceType(classname.split(' ').find(c => stringToResourceType(c)));
        if (!resource) throw new Error(`Can't find resource in ${classname}`);
        costs[resource] = value;
    }));
    return costs;
};

const parseDateInterval = (time: string): number => {
    let total = 0;
    let offset = time.length - 1;
    let factor = 0;
    let streak = 0;
    let currNb = 0;
    while (offset >= 0) {
        const c = time.charAt(offset);
        if (isNaN(Number(c))) {
            total += currNb * factor;
            factor = 0;
            streak = 0;
            currNb = 0;
        } else {
            const nb = Number(c);
            currNb += nb * (10 ** streak);
            streak += 1;
        }
        if (c === 'S') factor = 1;
        if (c === 'M') factor = 60;
        if (c === 'D') factor = 60 * 24;
        if (c === 'Y') factor = 60 * 24 * 365;
        offset -= 1;
    }
    return total;
};

// Page should have upgrade pannel open
const getUpgradeTime = async (page: Page): Promise<number> => {
    const buildTimeDiv = await page.$('[class="build_duration"]');
    const timeElem = await buildTimeDiv.$('time');
    const timeString = await timeElem.evaluate(e => e.getAttribute('datetime'));
    return parseDateInterval(timeString);
};

const loadUpgrade = async (building: BuildingLight, elem: ElementHandle<Element>, page: Page): Promise<Upgrade> => {
    await openPannel(page, elem, building.id);
    return {
        costs: await getUpgradeCosts(page),
        url: await getBuildingUpgradeUrl(building.status, elem),
        time: await getUpgradeTime(page),
    };
};

export const loadBuildingLight = async (elem: ElementHandle<Element>, page: Page): Promise<BuildingLight> => {
    const id = Number(await elem.evaluate(e => e.getAttribute('data-technology')));
    const status = stringToStatus(await elem.evaluate(e => e.getAttribute('data-status')));
    const level = await elem.evaluate(e => {
        let levelElem = e.querySelector('[class=level]');
        if (!levelElem) levelElem = e.querySelector('[class=amount]');
        return Number(levelElem.getAttribute('data-value')) + Number(levelElem.getAttribute('data-bonus'));
    });
    const building: BuildingLight = {
        id,
        status,
        level,
    };
    building.upgrade = await loadUpgrade(building, elem, page);
    return building;
};

export async function loadBuildings<T extends BuildingType>(
    page: Page,
    allTypes: T[],
    silenceError: boolean = false,
    selector: string = "[data-technology]",
): Promise<BuildingList<T>> {
    const elems = await page.$$(selector);
    const buildings: BuildingList<T> = {};
    for (const elem of elems) {
        const classnames = (await elem.evaluate(e => e.getAttribute('class'))).split(' ');
        const type: T | undefined = allTypes.find(t => classnames.some(c => c.toLowerCase() === t.toLowerCase()));
        if (!type) {
            if (!silenceError) console.error(`Unkown building type ${classnames} not in ${allTypes}`);
            continue;
        }
        const building = await loadBuildingLight(elem, page);
        buildings[type] = {
            ...building,
            type,
            __elem: elem,
        };
    }
    return buildings;
}