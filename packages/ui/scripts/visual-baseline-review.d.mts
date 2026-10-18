export const visualBaselineNames: string[];
export function validateVisualBaseline(options: { receiptPath: string; baselineRoot: string; repositoryRoot: string }): string[];
export function validateVisualCandidate(options: {candidatePath?: string; candidateSha256?: string; repositoryRoot: string}): string[];
export function validateVisualExecution(options: {
  mode: string; updateSnapshots: string; snapshotPaths: string[]; outputDirectory: string;
  baselineRoot?: string; receiptPath?: string; candidatePath?: string; candidateSha256?: string; repositoryRoot: string; argv?: string[];
}): string[];
