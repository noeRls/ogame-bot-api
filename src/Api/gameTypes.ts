export type ResourceType = 'metal' | 'crystal' | 'deuterium' | 'energy' | 'darkmatter'
export type Status = 'disabled' | 'on' | 'off';

export type ResourceList = Record<ResourceType, number>;

export interface Upgrade {
    url?: string;
    costs: ResourceList;
    time: number;
}

export const EMPTY_RESOURCE_LIST: ResourceList = {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0,
    darkmatter: 0,
}

export interface Building {
    id: number;
    status: Status;
    level: number;
    upgrade?: Upgrade;
}

export interface Mine extends Building {
    type: ResourceType;
    production?: number; // TODO implement
}

export interface Storage extends Building {
    type: ResourceType;
    capacity: number;
}

export interface ResourceFactoryList {
    mines: Mine[];
    storage: Storage[];
}