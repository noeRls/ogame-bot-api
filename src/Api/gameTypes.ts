import { ElementHandle } from "puppeteer";

export type RecordConditional<K extends keyof any, T> = {
    [P in K]?: T;
}

export type ResourceType = 'metal' | 'crystal' | 'deuterium' | 'energy' | 'darkmatter'
export const ALL_RESOURCES: ResourceType[] = ['metal', 'crystal', 'deuterium', 'energy', 'darkmatter'];
export type ResourceList = Record<ResourceType, number>;

export interface Upgrade {
    url?: string;
    costs: ResourceList;
    time: number;
}

export type Status = 'disabled' | 'on' | 'off';
export const ALL_STATUS: Status[] = ['disabled', 'on', 'off']

export interface BuildingLight {
    id: number;
    status: Status;
    level: number;
    upgrade?: Upgrade;
}

export type BuildingType = string;
export interface Building<T extends BuildingType> extends BuildingLight {
    type: T;
    __elem?: ElementHandle<Element>;
}
export type BuildingList<T extends BuildingType> = RecordConditional<T, Building<T>>

export type MineType = 'metalMine' | 'crystalMine' | 'deuteriumSynthesizer' | 'solarPlant' | 'fusionPlant';
export const ALL_MINES: MineType[] = ['metalMine', 'crystalMine', 'deuteriumSynthesizer', 'solarPlant', 'fusionPlant'];
export interface Mine extends Building<MineType> {
    production?: number; // TODO implement
    resource: ResourceType;
}
export type MineList = RecordConditional<MineType, Mine>;

export type StorageType = 'metalStorage' | 'crystalStorage' | 'deuteriumStorage';
export const ALL_STORAGES: StorageType[] = ['metalStorage', 'crystalStorage', 'deuteriumStorage'];
export interface Storage extends Building<StorageType> {
    capacity: number;
    resource: ResourceType;
}
export type StorageList = RecordConditional<StorageType, Storage>;

export interface ResourceFactoryList {
    mines: MineList;
    storages: StorageList;
}

export type FacilitieType = 'roboticsFactory' | 'shipyard' | 'researchLaboratory' | 'allianceDepot' | 'missileSilo' | 'naniteFactory' | 'terraformer' | 'repairDock';
export const ALL_FACILITIES: FacilitieType[] = ['roboticsFactory', 'shipyard', 'researchLaboratory', 'allianceDepot', 'missileSilo', 'naniteFactory', 'terraformer', 'repairDock'];
export interface Facilities extends Building<FacilitieType> {
    capacity?: number
}
export type FacilitiesList = RecordConditional<FacilitieType, Facilities>;
