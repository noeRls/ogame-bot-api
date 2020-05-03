import Axios, { AxiosInstance } from 'axios';
import { Account } from '../lobby/types';
import * as puppeteer from 'puppeteer';
import {
    ResourceList, ResourceFactoryList, Upgrade, ResourceType,
    FacilitiesList, ResearchList, ShipList, Ship, DefenseList, Defense, Building, BuildingLight, BuildingList,
} from './types';
import { loadMinesAndStorage, loadResources } from './parsing/resources';
import { loadFacilities } from './parsing/facilities';
import { loadResearch } from './parsing/research';
import { loadShips, createShipFromPannel } from './parsing/ship';
import { createDefenseFromPannel, loadDefenses } from './parsing/defenses';
import { Navigation } from './navigation';

/**
 * The GameApi is used to interact with the game itself, create and list ressources/ship/research...
 * You should use LobbyApi to load it, don't create it yourself
 */
export class GameApi {
    private account: Account;
    private axios: AxiosInstance;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private cookie: string;
    private loginUrl: string;
    private navigation: Navigation;

    /**
     * @hidden
     */
    constructor(cookie: string, account: Account, loginUrl: string) {
        this.cookie = cookie;
        this.loginUrl = loginUrl;
        this.account = account;
        this.axios = Axios.create({
          withCredentials: true,
          baseURL: this.__getServerUrl(),
        });
        this.axios.interceptors.request.use(config => {
            if (!config.headers.cookie) {
                config.headers.cookie = '';
            }
            config.headers.cookie += cookie;
            return config;
        });
        this.navigation = new Navigation(this.__getServerUrl());
    }

    /**
     * Start the game api
     */
    async start(): Promise<void> {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        const [name, other] = this.cookie.split('=');
        const [value] = other.split(';');
        await this.page.setCookie({
            name,
            value,
            url: this.__getServerUrl(),
        });
        await this.page.setViewport({
            width: 1280,
            height: 960,
        });
        await this.page.goto(this.loginUrl);
    }

    private __getServerUrl() {
        return `https://s${this.account.server.number}-${this.account.server.language}.ogame.gameforge.com`;
    }

    /**
     * Stop the game api. You should called this before exiting your program.
     */
    async stop(): Promise<void> {
        await this.browser.close();
    }

    /**
     * List your ressources
     */
    async resourcesList(): Promise<ResourceList> {
        await this.navigation.goToHomePage(this.page);
        return loadResources(this.page);
    }

    /**
     * List your mines and storage
     */
    async resourceFactoryList(): Promise<ResourceFactoryList> {
        await this.navigation.goToResourcePage(this.page);
        const res = await loadMinesAndStorage(this.page);
        return res;
    }

    /**
     * List your facilities
     */
    async facilitiesList() : Promise<FacilitiesList> {
        await this.navigation.goToFacilitiesPage(this.page);
        return loadFacilities(this.page);
    }

    /**
     * List you research
     */
    async researchList(): Promise<ResearchList> {
        await this.navigation.goToResearchPage(this.page);
        return loadResearch(this.page);
    }

    /**
     * List your ships
     */
    async shipList(): Promise<ShipList> {
        await this.navigation.goToShipPage(this.page);
        return loadShips(this.page);
    }

    /**
     * List your defenses
     */
    async defenseList(): Promise<DefenseList> {
        await this.navigation.goToDefensePage(this.page);
        return loadDefenses(this.page);
    }

    /**
     * Upgrade or create a building. Don't use it for ships/defenses
     * @param building The building to upgrade
     */
    async makeUpgrade(building: BuildingLight): Promise<void> {
        const resources = await this.resourcesList();
        if (!this.canUpgrade(building, resources)) {
            throw new Error(`Can't upgrade`);
        }
        await this.page.goto(building.upgrade.url);
    }

    private haveEnoughResource(upgrade: Upgrade, resources: ResourceList, count: number = 1): boolean {
        return !Object.keys(upgrade.costs).some((resource: ResourceType) => {
            if (resource === 'energy') return false;
            if (resources[resource] < upgrade.costs[resource] * count) {
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * Check if you can upgrade a building
     * @param building the building to upgrade
     * @param resources Optional parameter, if provided it will speed up the fonction
     */
    async canUpgrade(building: BuildingLight, resources?: ResourceList): Promise<boolean> {
        if (!resources) resources = await this.resourcesList();
        const upgrade = building.upgrade;
        return upgrade.url && this.haveEnoughResource(upgrade, resources);
    }

    /**
     * Check if you can create a certain amount of ship/defense
     * @param item Ship or Defense
     * @param count The number of items you wants to create
     * @param resources Optional parameter, if provided it will speed up the fonction
     */
    async canCreate(item: Ship | Defense, count: number = 1, resources?: ResourceList): Promise<boolean> {
        if (!resources) resources = await this.resourcesList();
        return this.haveEnoughResource(item.upgrade, resources, count) && (item.status === 'on' || item.status === 'active');
    }

    /**
     * Create a ship
     * @param ship ship to create
     * @param count number of ship to create
     */
    async createShip(ship: Ship, count: number = 1) {
        if (!await this.canCreate(ship, count)) {
            throw new Error(`Not enough resources`);
        }
        await this.navigation.goToShipPage(this.page);
        await createShipFromPannel(this.page, ship, count);
    }

    /**
     * Create a defense
     * @param defense defense to create
     * @param count number of defense to create
     */
    async createDefense(defense: Defense, count: number = 1) {
        if (!await this.canCreate(defense, count)) {
            throw new Error(`Not enough resources`);
        }
        await this.navigation.goToDefensePage(this.page);
        await createDefenseFromPannel(this.page, defense, count);
    }
}
