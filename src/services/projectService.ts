import type { ProjectDetails } from "../types/projectTypes";
import { fetchWorkflowRuns } from "./githubService";
import { processRuns } from "./runProcessor";
import { GITHUB_TOKEN } from "../config";

export const fetchProjectData = async (
	projects: ProjectDetails[],
): Promise<ProjectDetails[]> => {
	const allProjectsData: ProjectDetails[] = [];

	for (const project of projects) {
		console.log(`[DEBUG] Processing project: ${project.name}`);

		try {
			const runsData = await fetchWorkflowRuns(
				project.repositoryName,
				GITHUB_TOKEN,
			);

			const oneAllaneRuns = runsData.workflow_runs.filter((run: any) =>
				run.path.toLowerCase().includes("one-allane"),
			);

			const dealerportalRuns = runsData.workflow_runs.filter((run: any) =>
				run.path.toLowerCase().includes("dealerportal"),
			);

			if (oneAllaneRuns.length > 0 && project.projectType === "one-allane") {
				const oneAllaneDetails = await processRuns(
					oneAllaneRuns.slice(0, 3),
					project,
					GITHUB_TOKEN,
					"one-allane",
				);
				allProjectsData.push(...oneAllaneDetails);
			} else if (project.projectType === "one-allane") {
				allProjectsData.push({
					...project,
					status: "no-data",
					dataAvailable: false,
				});
			}

			if (
				dealerportalRuns.length > 0 &&
				project.projectType === "dealerportal"
			) {
				const dealerportalDetails = await processRuns(
					dealerportalRuns.slice(0, 3),
					project,
					GITHUB_TOKEN,
					"dealerportal",
				);
				allProjectsData.push(...dealerportalDetails);
			} else if (project.projectType === "dealerportal") {
				allProjectsData.push({
					...project,
					status: "no-data",
					dataAvailable: false,
				});
			}
		} catch (error) {
			console.error(`[DEBUG] Error processing project ${project.name}:`, error);
			allProjectsData.push({
				...project,
				status: "error",
				dataAvailable: false,
			});
		}
	}

	console.log(
		"[DEBUG] Final projects data:",
		JSON.stringify(allProjectsData, null, 2),
	);
	return allProjectsData;
};
