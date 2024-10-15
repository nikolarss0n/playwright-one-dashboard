import GlassmorphicCard from "../ui/GlassmorphicCard";
import type React from "react";
import styled, { createGlobalStyle } from "styled-components";

interface ArtifactDetails {
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

interface ArtifactInfoProps {
	artifacts: ArtifactDetails[];
	total_count: number;
}

export const GlobalStyle = createGlobalStyle`
body {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .artifact-info, .artifact-details {
    color: white !important;
  }

  .artifact-info *, .artifact-details * {
    color: white !important;
  }
`;

const ArtifactCard = styled(GlassmorphicCard)`
  margin-bottom: 1rem;
  color: white !important;
  * {
    color: white !important;
  }
`;

const DownloadLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white !important;
  text-decoration: none;
  transition: background 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white !important;
  }
`;

const whiteTextStyle = { color: "white" };

const ArtifactInfo: React.FC<ArtifactInfoProps> = ({
	artifacts,
	total_count,
}) => {
	return (
		<>
			<GlobalStyle />
			<GlassmorphicCard className="artifact-info" style={whiteTextStyle}>
				<h2 className="text-2xl font-bold mb-4 " style={whiteTextStyle}>
					Artifact Information
				</h2>
				<p className="mb-4" style={whiteTextStyle}>
					Total Artifacts: {total_count}
				</p>
				{artifacts.map((artifact) => (
					<ArtifactCard
						key={artifact.id}
						className="artifact-details"
						style={whiteTextStyle}
					>
						<h3
							className="text-xl font-semibold mb-2 text-white-600"
							style={whiteTextStyle}
						>
							{artifact.name}
						</h3>
						<p style={whiteTextStyle}>ID: {artifact.id}</p>
						<p style={whiteTextStyle}>Size: {artifact.size_in_bytes} bytes</p>
						<p style={whiteTextStyle}>
							Created: {new Date(artifact.created_at).toLocaleString()}
						</p>
						<p style={whiteTextStyle}>
							Expires: {new Date(artifact.expires_at).toLocaleString()}
						</p>
						<p style={whiteTextStyle}>
							Expired: {artifact.expired ? "Yes" : "No"}
						</p>
						<h4
							className="text-lg font-semibold mt-2 mb-1"
							style={whiteTextStyle}
						>
							Workflow Run:
						</h4>
						<p style={whiteTextStyle}>
							Branch: {artifact.workflow_run.head_branch}
						</p>
						<p style={whiteTextStyle}>
							Commit: {artifact.workflow_run.head_sha.substring(0, 7)}
						</p>
						<DownloadLink
							href={artifact.archive_download_url}
							target="_blank"
							rel="noopener noreferrer"
							style={whiteTextStyle}
						>
							Download Artifact
						</DownloadLink>
					</ArtifactCard>
				))}
			</GlassmorphicCard>
		</>
	);
};

export default ArtifactInfo;
