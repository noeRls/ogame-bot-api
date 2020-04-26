import { Page } from 'puppeteer';
import { ALL_RESEARCH, ResearchList, ResearchType } from '../gameTypes';
import { loadBuildings } from './building';

export const loadResearch = async (page: Page): Promise<ResearchList> => {
    return loadBuildings<ResearchType>(page, ALL_RESEARCH);
};