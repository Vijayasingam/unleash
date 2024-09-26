/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { PersonalDashboardSchemaProjectsItemOwners } from './personalDashboardSchemaProjectsItemOwners';
import type { PersonalDashboardSchemaProjectsItemRolesItem } from './personalDashboardSchemaProjectsItemRolesItem';

export type PersonalDashboardSchemaProjectsItem = {
    /** The id of the project */
    id: string;
    /** The name of the project */
    name: string;
    /** The users and/or groups that have the "owner" role in this project. If no such users or groups exist, the list will contain the "system" owner instead. */
    owners?: PersonalDashboardSchemaProjectsItemOwners;
    /**
     * The list of roles that the user has in this project.
     * @minItems 1
     */
    roles: PersonalDashboardSchemaProjectsItemRolesItem[];
};