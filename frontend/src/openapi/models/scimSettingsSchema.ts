/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */

/**
 * An object describing settings for SCIM provisioning.
 */
export interface ScimSettingsSchema {
    /** Whether SCIM assumes control of existing users */
    assumeControlOfExisting: boolean;
    /** Whether SCIM provisioning is currently enabled. */
    enabled: boolean;
    /** Whether a SCIM provisioning API token is currently set. */
    hasToken: boolean;
}
