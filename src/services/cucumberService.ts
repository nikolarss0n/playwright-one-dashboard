// src/services/cucumberService.ts

import JSZip from "jszip";
import type { CucumberData, CucumberRun } from "../types/projectTypes";

export const fetchCucumberData = async (
	url: string,
	token: string,
): Promise<CucumberData | undefined> => {
	console.log("Fetching Cucumber data from URL:", url);
	try {
		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		console.log("Fetch response received successfully");

		const arrayBuffer = await response.arrayBuffer();
		console.log("Array buffer received, size:", arrayBuffer.byteLength);

		const zip = new JSZip();
		const zipContent = await zip.loadAsync(arrayBuffer);
		console.log("Zip content loaded, files:", Object.keys(zipContent.files));

		const reportFile = zipContent.file("dealerportal-cucumber-report.json");
		if (reportFile) {
			console.log("Cucumber report file found in the zip");
			const content = await reportFile.async("string");
			console.log(
				"Cucumber report content (first 200 chars):",
				content.substring(0, 200),
			);

			if (isHtmlContent(content)) {
				return extractJsonFromHtml(content);
			}
			return JSON.parse(content);
		}
		console.warn("Cucumber report not found in the artifact");
		return undefined;
	} catch (error) {
		console.error("Error fetching Cucumber data:", error);
		return undefined;
	}
};

const isHtmlContent = (content: string): boolean => {
	return (
		content.trim().startsWith("<!DOCTYPE html>") ||
		content.trim().startsWith("<html>")
	);
};

const extractJsonFromHtml = (content: string): CucumberData | undefined => {
	console.log("Content is HTML, attempting to extract JSON data");
	const jsonMatch = content.match(
		/window\.CUCUMBER_MESSAGES\s*=\s*(\[[\s\S]*?\]);/,
	);
	if (jsonMatch?.[1]) {
		const jsonContent = jsonMatch[1];
		console.log(
			"Extracted JSON content (first 200 chars):",
			jsonContent.substring(0, 200),
		);
		const parsedData = JSON.parse(jsonContent);
		console.log("Parsed Cucumber data:", parsedData);
		return { features: parseCucumberMessages(parsedData) };
	}
	console.warn("Could not find JSON data in HTML content");
	return undefined;
};

const parseCucumberMessages = (jsonData: any[]): CucumberRun[] => {
	const runs: CucumberRun[] = [];

	for (const run of jsonData) {
		const parsedRun: CucumberRun = {
			timestamp: new Date().toISOString(), // You should replace this with the actual timestamp from the file
			gitHubRunId: process.env.GITHUB_RUN_ID,
			gitHubRunNumber: process.env.GITHUB_RUN_NUMBER,
			features: [],
			keyword: "",
			name: "",
			description: "",
			elements: [],
			status: "",
			runTimestamp: "",
			runIndex: 0,
		};

		for (const feature of run) {
			const parsedFeature = {
				keyword: feature.keyword,
				name: feature.name,
				description: feature.description,
				elements: [],
				status: "passed",
			};

			for (const element of feature.elements) {
				const scenario = {
					keyword: element.keyword,
					name: element.name,
					description: element.description,
					steps: [],
					tags: element.tags ? element.tags.map((tag: any) => tag.name) : [],
					status: "passed",
				};

				for (const step of element.steps) {
					const parsedStep = {
						keyword: step.keyword,
						name: step.name,
						result: step.result,
					};
					scenario.steps.push(parsedStep as never);

					if (step.result.status === "failed") {
						scenario.status = "failed";
					}
				}

				parsedFeature.elements.push(scenario as never);

				if (scenario.status === "failed") {
					parsedFeature.status = "failed";
				}
			}

			parsedRun.features.push(parsedFeature);
		}

		runs.push(parsedRun);
	}

	return runs;
};
