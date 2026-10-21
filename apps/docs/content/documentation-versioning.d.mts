export interface DocumentationVersion {
 id:string;
 label:string;
 baseUrl:string;
 /** Required for release targets; copied from that deployment's route manifest. */
 routes?:readonly string[];
}
export function documentationVersionTarget(version:DocumentationVersion,pathname:string):string|null;
export function unavailableDocumentationPath(search:string):string|null;
