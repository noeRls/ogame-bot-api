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
    capacity?: number;
};
export type FacilitiesList = RecordConditional<FacilitieType, Facilities>;

export type ResearchType = 'energyTechnology' | 'laserTechnology' | 'ionTechnology' | 'hyperspaceTechnology' |
    'plasmaTechnology' | 'combustionDriveTechnology' | 'impulseDriveTechnology' | 'hyperspaceDriveTechnology' |
    'espionageTechnology' | 'computerTechnology' | 'astrophysicsTechnology' | 'researchNetworkTechnology' |
    'gravitonTechnology' | 'weaponsTechnology' | 'shieldingTechnology' | 'armorTechnology';
export const ALL_RESEARCH: ResearchType[] = ['energyTechnology', 'laserTechnology', 'ionTechnology', 'hyperspaceTechnology',
    'plasmaTechnology', 'combustionDriveTechnology', 'impulseDriveTechnology', 'hyperspaceDriveTechnology',
    'espionageTechnology', 'computerTechnology', 'astrophysicsTechnology', 'researchNetworkTechnology',
    'gravitonTechnology', 'weaponsTechnology', 'shieldingTechnology', 'armorTechnology'];
export interface Research extends Building<ResearchType> {};
export type ResearchList = RecordConditional<ResearchType, Research>;

export type ShipType = 'fighterLight' | 'fighterHeavy' | 'cruiser' | 'battleship' | 'interceptor' | 'bomber' | 'destroyer' | 'deathstar' |
    'reaper' | 'explorer' | 'transporterSmall' | 'transporterLarge' | 'colonyShip' | 'recycler' | 'espionageProbe' | 'solarSatellite' | 'resbuggy';
export const ALL_BATTLE_SHIP: ShipType[] = ['fighterLight', 'fighterHeavy', 'cruiser', 'battleship', 'interceptor', 'bomber', 'destroyer', 'deathstar', 'reaper', 'explorer'];
export const ALL_CIVIL_SHIP: ShipType[] = ['transporterSmall', 'transporterLarge', 'colonyShip', 'recycler', 'espionageProbe', 'solarSatellite', 'resbuggy'];
export const ALL_SHIP: ShipType[] = [...ALL_BATTLE_SHIP, ...ALL_CIVIL_SHIP];
export type ShipCategory = 'battle' | 'civil';
export interface Ship extends Building<ShipType> {
    category: ShipCategory;
};
export type ShipList = RecordConditional<ShipType, Ship>;

export type DefenseType = 'rocketLauncher' | 'laserCannonLight' | 'laserCannonHeavy' | 'gaussCannon' | 'ionCannon' | 'plasmaCannon' |
    'shieldDomeSmall' | 'shieldDomeLarge' | 'missileInterceptor' | 'missileInterplanetary';
export const ALL_DEFENSES: DefenseType[] = ['rocketLauncher', 'laserCannonLight', 'laserCannonHeavy', 'gaussCannon', 'ionCannon', 'plasmaCannon',
    'shieldDomeSmall', 'shieldDomeLarge', 'missileInterceptor', 'missileInterplanetary'];
export interface Defense extends Building<DefenseType> {};
export type DefenseList = RecordConditional<DefenseType, Defense>;
