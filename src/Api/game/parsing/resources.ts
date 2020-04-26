import { Page } from 'puppeteer';
import { ResourceList, ResourceFactoryList, ALL_MINES, StorageList, ALL_STORAGES, MineList } from '../types';
import { loadBuildings } from './building';
import { stringToResourceType } from '../typesHelper';
import { getMeter } from './utils';

export const loadMinesAndStorage = async (page: Page): Promise<ResourceFactoryList> => {
    const mines: MineList = {};
    const storages: StorageList = {};
    const minesBuilding = Object.values(await loadBuildings(page, ALL_MINES, true));
    const storagesBuilding = Object.values(await loadBuildings(page, ALL_STORAGES, true));
    for (const mine of minesBuilding) {
        const classnames = (await mine.__elem.evaluate(e => e.getAttribute('class'))).split(' ');
        const resource = stringToResourceType(classnames.find(cl => stringToResourceType(cl, true)));
        mines[mine.type] = {
            ...mine,
            resource,
        };
    }
    for (const storage of storagesBuilding) {
        const classnames = (await storage.__elem.evaluate(e => e.getAttribute('class'))).split(' ');
        const resource = stringToResourceType(classnames.find(cl => stringToResourceType(cl, true)));
        const capacity = (await getMeter(storage.__elem, storage.id, page)).max;
        storages[storage.type] = {
            ...storage,
            resource,
            capacity,
        };
    }
    return ({ mines, storages });
};

export const loadResources = async (page: Page): Promise<ResourceList> => {
    return page.evaluate(() => {
        const ids = [
            'resources_metal',
            'resources_crystal',
            'resources_deuterium',
            'resources_energy',
            'resources_darkmatter',
        ];
        const elements = ids.map(id => document.querySelector(`[id=${id}]`));
        const values = elements.map(elem => Number(elem.getAttribute('data-raw')));
        const resources: ResourceList = {
            metal: values[0],
            crystal: values[1],
            deuterium: values[2],
            energy: values[3],
            darkmatter: values[4],
        };
        return resources;
    });
};