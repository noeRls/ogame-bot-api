import { ElementHandle, Page } from 'puppeteer'
import { Mine, Building, ResourceList, Storage, ResourceFactoryList } from '../gameTypes';
import { loadBuilding } from './building';
import { stringToResourceType } from '../typeHelper';
import { openPannel } from './pannel';

export const loadMinesAndStorage = async (page: Page): Promise<ResourceFactoryList> => {
    const mines: Mine[] = [];
    const storage: Storage[] = [];
    const elements = await page.$$("[data-technology]");
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        const building = await loadBuilding(elem, page);
        const classnames = (await elem.evaluate(e => e.getAttribute('class'))).split(' ');
        const ressourceType = stringToResourceType(classnames.find(cl => stringToResourceType(cl, true)));
        const allMinesTag = ['mine', 'synthesizer', 'plant'];
        if (classnames.some(c => allMinesTag.some(t => c.toLowerCase().includes(t)))) {
            mines.push({
                ...building,
                type: ressourceType,
            });
        } else if (classnames.some(c => c.toLowerCase().includes('storage'))) {
            const pannel = await openPannel(page, elem, building.id);
            const capacity = Number(await pannel.evaluate(e => e.querySelector('meter').getAttribute('max')));
            storage.push({
                ...building,
                type: ressourceType,
                capacity
            });
        }
    }
    return ({ mines, storage });
}

export const loadResources = async (page: Page): Promise<ResourceList> => {
    return page.evaluate(() => {
        const ids = [
            'resources_metal',
            'resources_crystal',
            'resources_deuterium',
            'resources_energy',
            'resources_darkmatter',
        ]
        const elements = ids.map(id => document.querySelector(`[id=${id}]`));
        const values = elements.map(elem => Number(elem.getAttribute('data-raw')));
        const resources: ResourceList = {
            metal: values[0],
            crystal: values[1],
            deuterium: values[2],
            energy: values[3],
            darkmatter: values[4]
        };
        return resources;
    });
}