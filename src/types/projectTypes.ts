export interface ArtifactDetails {
	id: number;
	node_id: string;
	name: string;
	size_in_bytes: number;
	url: string;
	archive_download_url: string;
	expired: boolean;
	created_at: string;
	updated_at: string;
	expires_at: string;
	workflow_run: {
		id: number;
		repository_id: number;
		head_repository_id: number;
		head_branch: string;
		head_sha: string;
	};
}

export interface Feature {
	keyword: string;
	name: string;
	description: string;
	elements: any[];
	status: string;
	runTimestamp: string;
	gitHubRunId?: string;
	gitHubRunNumber?: string;
	runIndex: number;
}

export interface CucumberData {
	features: Feature[];
}

export interface ProjectDetails {
	id: string;
	name: string;
	status: string;
	projectType: string;
	duration?: number;
	runId?: number;
	runNumber?: number;
	commitSha?: string;
	branchName?: string;
	repositoryName: string;
	workflowRunUrl?: string;
	dataAvailable: boolean;
	conclusion?: string;
	html_url?: string;
	artifacts?: ArtifactDetails[];
	total_count?: number;
	cucumberData?: CucumberData | CucumberData[];
	slackLink?: string;
	teamName?: string;
}

export interface CucumberRun {
	timestamp: string | undefined;
	gitHubRunId?: string;
	gitHubRunNumber?: string;
	features: any[];
	keyword: string;
	name: string;
	description: string;
	elements: any[];
	status: string;
	runTimestamp: string;
	runIndex: number;
}
