import { ElementHandle, Page } from 'puppeteer';
import { Planet } from '../types';

export async function loadPlanets(page: Page): Promise<Planet[]> {
  const elems = await page.$$('#planetList div');
  const planetsList: Planet[] = [];
  for (const elem of elems) {
    planetsList.push(await loadPlanetLight(elem, page));
  }
  return planetsList;
}

export async function loadPlanetLight(elem: ElementHandle<Element>, page: Page): Promise<Planet> {
  const id = (await elem.evaluate(e => e.getAttribute('id'))).replace('planet-', '');
  const type = (await elem.evaluate(e => e.getAttribute('class'))).split(' ')[0];
  const name = await (await elem.$('.planet-name')).evaluate(e => e.textContent);
  return {
    id,
    __elem: elem,
    type,
    name
  };
}
