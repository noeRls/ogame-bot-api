import { Status, ResourceList, ALL_RESOURCES, ResourceType, FacilitieType, ALL_FACILITIES, ALL_STATUS } from "./types";

export const stringToStatus = (status: string): Status => {
    return ALL_STATUS.find(s => s === status) || 'off';
};

export const stringToResourceType = (resource: string, include: boolean = false): ResourceType | undefined => {
    return ALL_RESOURCES.find(r => include ? resource.includes(r) : r === resource);
};
export const stringToFacilitieType = (facilitie: string): FacilitieType | undefined => {
    return ALL_FACILITIES.find(f => f === facilitie);
};

export const getEmptyResourceList = (): ResourceList => ({
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0,
    darkmatter: 0,
});
