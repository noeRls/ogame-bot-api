import { Status, ResourceList, ResourceType } from "./gameTypes";

export const stringToStatus = (status: string): Status => {
    const allStatus: Status[] = ['disabled', 'on', 'off']
    return allStatus.find(s => s === status) || 'off';
}

export const stringToResourceType = (resource: string, include: Boolean = false): ResourceType | undefined => {
    const allResourceType: ResourceType[] = ['metal', 'crystal', 'deuterium', 'energy', 'darkmatter'];
    return allResourceType.find(r => include ? resource.includes(r) : r === resource);
}