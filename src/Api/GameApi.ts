import Axios, { AxiosInstance } from 'axios';
import { User, Server, Account } from '../types';
import * as puppeteer from 'puppeteer';
import { ResourceList, ResourceFactoryList, Mine, Building } from './gameTypes';
import { loadBuilding } from './building';

export class GameApi {
    account: Account
    axios: AxiosInstance
    browser: puppeteer.Browser
    page: puppeteer.Page
    cookie: string
    loginUrl: string
    constructor(cookie: string, account: Account, loginUrl: string) {
        this.cookie = cookie;
        this.loginUrl = loginUrl;
        this.account = account;
        this.axios = Axios.create({
          withCredentials: true,
          baseURL: this.getServerUrl(),
        });
        this.axios.interceptors.request.use(config => {
            if (!config.headers['cookie']) {
                config.headers['cookie'] = '';
            }
            config.headers['cookie'] += cookie;
            return config;
        });
    }

    getServerUrl() {
        return `https://s${this.account.server.number}-${this.account.server.language}.ogame.gameforge.com`;
    }

    async goToHomePage() {
        await this.page.goto(`${this.getServerUrl()}/game`);
    }

    async goToResourcePage() {
        await this.page.goto(`${this.getServerUrl()}/game/index.php?page=ingame&component=supplies`);
    }

    async init() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        const [name, other] = this.cookie.split('=');
        const [value] = other.split(';');
        await this.page.setCookie({
            name,
            value,
            url: this.getServerUrl()
        });
        await this.page.setViewport({
            width: 1280,
            height: 960
        });
        await this.page.goto(this.loginUrl);
        await this.page.screenshot({ path: './out.png' });
    }

    async stop() {
        await this.browser.close();
    }

    async listRessources(): Promise<ResourceList> {
        await this.goToHomePage();
        const resources = await this.page.evaluate(() => {
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
        return resources;
    }

    // @ts-ignore
    async ressourceFactoryList(): Promise<ResourceFactoryList> {
        await this.goToResourcePage();
        const mines: Mine[] = [];
        const storage: Storage[] = [];
        console.log('enter');
        let elements = await this.page.$$("[data-technology]");
        const buildings: Building[] = [];
        for (let i = 0; i < elements.length; i++) {
            buildings.push(await loadBuilding(elements[i], this.page));
        }
        console.log(buildings);
    }
}