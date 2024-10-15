export const fetchWorkflowRuns = async (
	repositoryName: string,
	token: string,
) => {
	const runsUrl = `https://api.github.com/repos/SLSE-IT/${repositoryName}/actions/runs?status=completed&per_page=100`;
	console.log(
		`[DEBUG] Fetching workflow runs for ${repositoryName} from URL: ${runsUrl}`,
	);

	const requestOptions = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github.v3+json",
		},
	};

	const runsResponse = await fetch(runsUrl, requestOptions);

	if (!runsResponse.ok) {
		throw new Error(`HTTP error! status: ${runsResponse.status}`);
	}

	return await runsResponse.json();
};

export const fetchArtifacts = async (
	repositoryName: string,
	runId: number,
	token: string,
) => {
	const artifactsUrl = `https://api.github.com/repos/SLSE-IT/${repositoryName}/actions/runs/${runId}/artifacts`;

	const requestOptions = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github.v3+json",
		},
	};

	const artifactsResponse = await fetch(artifactsUrl, requestOptions);

	if (!artifactsResponse.ok) {
		throw new Error(`HTTP error! status: ${artifactsResponse.status}`);
	}

	return await artifactsResponse.json();
};
