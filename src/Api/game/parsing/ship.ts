import { Page } from 'puppeteer';
import { ALL_BATTLE_SHIP, ALL_SHIP, ShipList, ShipCategory, ShipType, Ship } from '../types';
import { loadBuildings } from './building';
import { pannelCreate } from './pannel';

export const loadShips = async (page: Page): Promise<ShipList> => {
    const buildings = await loadBuildings<ShipType>(page, ALL_SHIP);
    const ships: ShipList = {};
    await Promise.all(Object.values(buildings).map(building => {
        const category: ShipCategory = ALL_BATTLE_SHIP.find(s => s === building.type) ? 'battle' : 'civil';
        ships[building.type] = {
            ...building,
            category,
        };
    }));
    return ships;
};

export const createShipFromPannel = async (page: Page, ship: Ship, count: number): Promise<void> => {
    ship.__elem = await page.$(`[data-technology="${ship.id}"]`);
    await pannelCreate(page, ship.__elem, ship.id, count);
};