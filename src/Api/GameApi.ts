import Axios, { AxiosInstance } from 'axios';
import { User, Server, Account } from '../types';
import * as puppeteer from 'puppeteer';
import { ResourceList, ResourceFactoryList, Mine, Building, Upgrade, ResourceType, Facilities, FacilitiesList, ResearchList, ShipList, Ship, DefenseList, Defense, DefenseType } from './gameTypes';
import { stringToResourceType } from './typeHelper';
import { loadMinesAndStorage, loadResources } from './parsing/resources';
import { loadFacilities } from './parsing/facilities';
import { loadResearch } from './parsing/research';
import { loadShips, createShipFromPannel } from './parsing/ship';
import { createDefenseFromPannel, loadDefenses } from './parsing/defenses';

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

    async goToFacilitiesPage() {
        await this.page.goto(`${this.getServerUrl()}/game/index.php?page=ingame&component=facilities`);
    }

    async goToResearchPage() {
        await this.page.goto(`${this.getServerUrl()}/game/index.php?page=ingame&component=research`);
    }

    async goToShipPage() {
        await this.page.goto(`${this.getServerUrl()}/game/index.php?page=ingame&component=shipyard`);
    }

    async goToDefensePage() {
        await this.page.goto(`${this.getServerUrl()}/game/index.php?page=ingame&component=defenses`);
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
        // await this.page.screenshot({ path: './out.png' });
    }

    async stop() {
        await this.browser.close();
    }

    async listRessources(): Promise<ResourceList> {
        await this.goToHomePage();
        return loadResources(this.page);
    }

    async ressourceFactoryList(): Promise<ResourceFactoryList> {
        await this.goToResourcePage();
        const res = await loadMinesAndStorage(this.page);
        return res;
    }

    async facilitiesList() : Promise<FacilitiesList> {
        await this.goToFacilitiesPage();
        return loadFacilities(this.page);
    }

    async researchList(): Promise<ResearchList> {
        await this.goToResearchPage();
        return loadResearch(this.page);
    }

    async shipList(): Promise<ShipList> {
        await this.goToShipPage();
        return loadShips(this.page);
    }

    async defenseList(): Promise<DefenseList> {
        await this.goToDefensePage();
        return loadDefenses(this.page);
    }

    async makeUpgrade(upgrade: Upgrade) {
        const resources = await this.listRessources();
        if (!this.canUpgrade(upgrade, resources)) {
            throw new Error(`Can't upgrade`);
        }
        await this.page.goto(upgrade.url);
    }

    __haveEnoughResource(upgrade: Upgrade, resources: ResourceList, count: number = 1) {
        return !Object.keys(upgrade.costs).some((resource: ResourceType) => {
            if (resource === 'energy') return false;
            if (resources[resource] < upgrade.costs[resource] * count) {
                return true;
            } else {
                return false;
            }
        })
    }

    canUpgrade(upgrade: Upgrade, resources: ResourceList): Boolean {
        return upgrade.url && this.__haveEnoughResource(upgrade, resources);
    }

    canCreate(item: Ship | Defense, resources: ResourceList, count: number): Boolean {
        return this.__haveEnoughResource(item.upgrade, resources, count) && item.status === 'on';
    }

    async createShip(ship: Ship, count: number) {
        const resources = await this.listRessources();
        if (!this.canCreate(ship, resources, count)) {
            throw new Error(`Not enough resources`);
        }
        await this.goToShipPage();
        await createShipFromPannel(this.page, ship, count);
    }

    async createDefense(defense: Defense, count: number) {
        const resources = await this.listRessources();
        if (!this.canCreate(defense, resources, count)) {
            throw new Error(`Not enough resources`);
        }
        await this.goToDefensePage();
        await createDefenseFromPannel(this.page, defense, count);
    }
}