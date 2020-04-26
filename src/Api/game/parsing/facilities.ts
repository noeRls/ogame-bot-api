import { Page } from 'puppeteer';
import { FacilitiesList, ALL_FACILITIES, FacilitieType } from '../types';
import { loadBuildings } from './building';
import { getMeter } from './utils';

export const loadFacilities = async (page: Page): Promise<FacilitiesList> => {
    const facilities: FacilitiesList = await loadBuildings<FacilitieType>(page, ALL_FACILITIES);
    const { max } = await getMeter(facilities.missileSilo.__elem, facilities.missileSilo.id, page);
    facilities.missileSilo.capacity = max;
    return facilities;
};