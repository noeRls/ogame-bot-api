import { Page } from 'puppeteer';
import { Facilities, FacilitiesList, ALL_FACILITIES, FacilitieType } from '../gameTypes';
import { loadBuildings } from './building';
import { stringToFacilitieType } from '../typeHelper';
import { getMeter } from './utils';

export const loadFacilities = async (page: Page): Promise<FacilitiesList> => {
    const facilities: FacilitiesList = await loadBuildings<FacilitieType>(page, ALL_FACILITIES);
    const { max } = await getMeter(facilities.missileSilo.__elem, facilities.missileSilo.id, page);
    facilities.missileSilo.capacity = max;
    return facilities;
}