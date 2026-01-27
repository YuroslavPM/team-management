import {ProjectStatus} from "./projectEnum"
export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export type Project = {
    id:string,
    name: string,
    description: string,
    status: ProjectStatus,
    adminIds: number[],
    memberIds: number[],
    teamIds: number[];
}