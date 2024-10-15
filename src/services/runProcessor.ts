// src/services/runProcessor.ts

import type { ProjectDetails, ArtifactDetails } from "../types/projectTypes";
import { fetchArtifacts } from "./githubService";
import { fetchCucumberData } from "./cucumberService";

export const processRuns = async (
	runs: any[],
	project: ProjectDetails,
	token: string,
	projectType: string,
): Promise<ProjectDetails[]> => {
	return Promise.all(
		runs.map(async (run: any, index: number) => {
			const projectDetail: ProjectDetails = {
				...project,
				id: `${project.id}-${index}`,
				status: "pending",
				dataAvailable: true,
				runId: run.id,
				runNumber: run.run_number,
				commitSha: run.head_sha,
				branchName: run.head_branch,
				workflowRunUrl: run.html_url,
				projectType: projectType,
			};

			try {
				const artifactsData = await fetchArtifacts(
					project.repositoryName,
					run.id,
					token,
				);
				const cucumberArtifact = findCucumberArtifact(
					artifactsData.artifacts,
					projectType,
				);

				if (cucumberArtifact) {
					console.log(
						`[DEBUG] Fetching Cucumber data for ${project.name} run ${run.run_number} (${projectType})`,
					);
					const cucumberData = await fetchCucumberData(
						cucumberArtifact.archive_download_url,
						token,
					);
					if (cucumberData) {
						console.log(
							`[DEBUG] Cucumber data fetched successfully for ${project.name} run ${run.run_number} (${projectType})`,
						);
						projectDetail.cucumberData = cucumberData;
						projectDetail.status = "success";
					} else {
						console.log(
							`[DEBUG] No Cucumber data found for ${project.name} run ${run.run_number} (${projectType})`,
						);
						projectDetail.status = "no-data";
					}
				} else {
					console.log(
						`[DEBUG] No Cucumber artifact found for ${project.name} run ${run.run_number} (${projectType})`,
					);
					projectDetail.status = "no-data";
				}
			} catch (error) {
				console.error(
					`[DEBUG] Error processing run for ${project.name}:`,
					error,
				);
				projectDetail.status = "error";
			}

			return projectDetail;
		}),
	);
};

const findCucumberArtifact = (
	artifacts: ArtifactDetails[],
	projectType: string,
): ArtifactDetails | undefined => {
	return artifacts.find(
		(artifact: ArtifactDetails) =>
			!artifact.expired &&
			artifact.name
				.toLowerCase()
				.includes(`${projectType.split(".")[0]}-cucumber-report`),
	);
};
