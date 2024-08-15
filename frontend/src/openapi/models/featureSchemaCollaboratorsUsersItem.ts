/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */

/**
 * A simple representation of a user.
 */
export type FeatureSchemaCollaboratorsUsersItem = {
    /** The user's id */
    id: number;
    /** The URL to the user's profile image */
    imageUrl: string;
    /** The user's name, username, or email (prioritized in that order). If none of those are present, this property will be set to the string `unknown` */
    name: string;
};