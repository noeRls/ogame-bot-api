import { Page } from 'puppeteer';
import { pannelCreate } from './pannel';
import { DefenseList, ALL_DEFENSES, DefenseType, Defense } from '../gameTypes';
import { loadBuildings } from './building';

export const loadDefenses = async (page: Page): Promise<DefenseList> => {
    return loadBuildings<DefenseType>(page, ALL_DEFENSES);
};

export const createDefenseFromPannel = async (page: Page, defense: Defense, count: number): Promise<void> => {
    defense.__elem = await page.$(`[data-technology="${defense.id}"]`);
    await pannelCreate(page, defense.__elem, defense.id, count);
}