import type React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
	GitBranch,
	GitCommit,
	ExternalLink,
	Computer,
	Github,
	AlertCircle,
	CheckCircle,
	XCircle,
	BarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui//badge";
import { Button } from "../ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import type { CucumberData, ProjectDetails } from "src/types/projectTypes";
import { useMemo, useState } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import RadialChartComponent from "./RadialChart";
import GlassmorphicCard from "../ui/GlassmorphicCard";

const StyledTab = styled(GlassmorphicCard)<{ selected?: boolean }>`
  padding: 1rem 1.7rem;
  margin-right: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;

  // Remove all outlines and borders
  outline: none;
  border: none;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    border: none;
    box-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: rgb(215 252 3 / 0.9);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px) translateZ(10px);
    box-shadow:
      0 15px 25px rgba(0, 0, 0, 0.3),
      0 0 0 2px rgba(255, 255, 255, 0.2) inset;
    &::before {
      transform: translateY(0);
    }
  }

  ${(props) =>
		props.selected &&
		`
    color: white;
    transform: translateY(-7px) translateZ(14px) rotateX(7deg);
    box-shadow:
      0 21px 28px rgba(0, 0, 0, 0.4),
      0 0 0 2px rgba(255, 255, 255, 0.2) inset;
    &::before {
      transform: translateY(0);
    }
    &::after {
      transform: scaleX(1);
    }
  `}

  &:last-child {
    margin-right: 0;
  }
`;

const StyledTabList = styled(TabList)`
  display: flex;
  margin-bottom: 1rem;
  padding-left: 0rem;
  gap: 1rem;
`;

const FixedWidthBadge = styled(Badge)`
  min-width: 120px; // Increased to match StatusBadge
  min-height: 28px; // Added to match StatusBadge height
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 8px; // Added to match StatusBadge padding
  font-weight: 500; // Medium font weight to match StatusBadge
  transition: background-color 0.2s, color 0.2s; // Smooth transition for hover effects
`;

export const StatusBadge: React.FC<{
	status: "PASSED" | "FAILED" | "SKIPPED";
}> = ({ status }) => {
	const getStatusConfig = () => {
		switch (status) {
			case "PASSED":
				return {
					icon: CheckCircle,
					bgColor: "bg-allane-green-color",
					textColor: "text-black",
					borderColor: "border-white-300",
				};
			case "FAILED":
				return {
					icon: XCircle,
					bgColor: "bg-allane-red-color",
					textColor: "text-white",
					borderColor: "border-red-300",
				};
			case "SKIPPED":
				return {
					icon: AlertCircle,
					bgColor: "bg-yellow-100",
					textColor: "text-yellow-800",
					borderColor: "border-yellow-300",
				};
		}
	};

	const config = getStatusConfig();
	const Icon = config.icon;

	return (
		<Badge
			className={`
        px-2 py-1 rounded-md font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border transition-none
        flex items-center space-x-1
        min-w-[120px] min-h-[28px] justify-center
        hover:${config.bgColor} hover:${config.textColor} hover:${config.borderColor}
        hover:opacity-100
      `}
		>
			<Icon size={14} className="mr-1" />
			<span>{status}</span>
		</Badge>
	);
};

const formatDuration = (nanoseconds: number): string => {
	const seconds = nanoseconds / 1e9;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);
	return `${minutes}m ${remainingSeconds}s`;
};

const FeatureAccordion: React.FC<{ feature: any; featureIndex: number }> = ({
	feature,
	featureIndex,
}) => {
	const featurePassed = feature.elements.every((scenario: any) =>
		scenario.steps.every((step: any) => step.result.status !== "failed"),
	);

	const totalDuration = feature.elements.reduce(
		(featureTotal: number, scenario: any) => {
			return (
				featureTotal +
				scenario.steps.reduce((scenarioTotal: number, step: any) => {
					return scenarioTotal + (step.result.duration || 0);
				}, 0)
			);
		},
		0,
	);

	return (
		<GlassmorphicCard
			as={AccordionItem}
			value={`feature-${featureIndex}`}
			className="mb-4"
		>
			<AccordionTrigger className="hover:no-underline px-4 py-3 [&>svg]:text-white">
				<div className="flex items-center justify-between w-full pr-4">
					<span className="font-semibold text-lg">
						Feature {featureIndex + 1}: {feature.name || "Unnamed Feature"}
					</span>
					<div className="flex items-center space-x-2">
						{" "}
						{/* Added space-x-2 for horizontal spacing */}
						<FixedWidthBadge variant="secondary" className="ml-2">
							{" "}
							{/* Added ml-2 for left margin */}
							{formatDuration(totalDuration)}
						</FixedWidthBadge>
						<StatusBadge status={featurePassed ? "PASSED" : "FAILED"} />
					</div>
				</div>
			</AccordionTrigger>
			<AccordionContent className="px-4 py-3">
				<p className="mb-4 text-sm text-white-600">
					{feature.description.trim()}
				</p>
				{feature.elements.map((scenario: any, scenarioIndex: number) => (
					<ScenarioCard
						key={scenarioIndex}
						scenario={scenario}
						scenarioIndex={scenarioIndex}
					/>
				))}
			</AccordionContent>
		</GlassmorphicCard>
	);
};

const ScenarioCard: React.FC<{ scenario: any; scenarioIndex: number }> = ({
	scenario,
	scenarioIndex,
}) => {
	const scenarioPassed = scenario.steps.every(
		(step: any) => step.result.status !== "failed",
	);

	return (
		<GlassmorphicCard className="mb-4 text-black">
			<CardHeader>
				<CardTitle className="text-lg flex items-center justify-between text-black">
					<span>
						Scenario {scenarioIndex + 1}: {scenario.name}
					</span>
					<StatusBadge status={scenarioPassed ? "PASSED" : "FAILED"} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				{scenario.steps.map((step: any, stepIndex: number) => (
					<div
						key={stepIndex}
						className="mb-6 border-b border-gray-200 pb-3 last:border-b-0"
					>
						<div className="flex items-center justify-between">
							<span className="text-sm text-black">
								{step.keyword} {step.name}
							</span>
							<StatusBadge
								status={
									step.result.status.toUpperCase() as
										| "PASSED"
										| "FAILED"
										| "SKIPPED"
								}
							/>
						</div>
						{step.result.status === "failed" && (
							<pre className="mt-2 p-2 bg-red-50 text-red-800 rounded text-xs overflow-x-auto">
								{step.result.error_message}
							</pre>
						)}
						{step.embeddings && step.embeddings.length > 0 && (
							<div className="mt-2">
								{step.embeddings.map(
									(embedding: any, embeddingIndex: number) => (
										<div key={embeddingIndex} className="mt-2">
											<img
												src={`data:${embedding.mime_type};base64,${embedding.data}`}
												alt={`Embedding ${embeddingIndex + 1}`}
												className="max-w-full h-auto rounded-lg shadow-md" // Updated this line
											/>
										</div>
									),
								)}
							</div>
						)}
					</div>
				))}
			</CardContent>
		</GlassmorphicCard>
	);
};

const RunInfo: React.FC<{ projectData: ProjectDetails }> = ({
	projectData,
}) => (
	<GlassmorphicCard className="flex flex-col">
		<CardContent className="p-8 flex flex-col h-full">
			<div className="grid grid-cols-2 gap-y-6 gap-x-10 mb-6 flex-grow">
				<InfoItem
					icon={Computer}
					label="Run ID"
					value={projectData.runId || ""}
				/>
				<InfoItem
					icon={Github}
					label="Run Number"
					value={projectData.runNumber || ""}
				/>
				{projectData.commitSha && (
					<InfoItem
						icon={GitCommit}
						label="Commit"
						value={projectData.commitSha.substring(0, 7)}
					/>
				)}
				{projectData.branchName && (
					<InfoItem
						icon={GitBranch}
						label="Branch"
						value={projectData.branchName}
					/>
				)}
			</div>
			{projectData.workflowRunUrl && (
				<div className="mt-auto pt-6">
					<Button
						variant="outline"
						size="lg"
						asChild
						className="w-full bg-[#D7FC03] text-black hover:bg-[#c2e503] hover:text-black focus:ring-2 focus:ring-[#D7FC03] focus:ring-offset-2 transition-colors"
					>
						<a
							href={projectData.workflowRunUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm flex items-center justify-center"
						>
							View on GitHub Actions
							<ExternalLink className="ml-2" size={18} />
						</a>
					</Button>
				</div>
			)}
		</CardContent>
	</GlassmorphicCard>
);

const InfoItem: React.FC<{
	icon: React.ElementType;
	label: string;
	value: string | number;
}> = ({ icon: Icon, label, value }) => (
	<div className="flex items-center">
		<Icon className="mr-4 text-[#D7FC03CC]" size={28} />
		<div>
			<div className="font-semibold text-[#D7FC03CC] text-lg">{label}</div>
			<div className="text-white-600 text-xl font-medium">{value}</div>
		</div>
	</div>
);

export interface ChartData {
	passedFeatures: number;
	failedFeatures: number;
}

const TestResultsChart: React.FC<{ projectData: ProjectDetails }> = ({
	projectData,
}) => {
	const chartData: ChartData = useMemo(() => {
		let passedFeatures = 0;
		let failedFeatures = 0;
		if (projectData.cucumberData) {
			const dataArray = Array.isArray(projectData.cucumberData)
				? projectData.cucumberData
				: [projectData.cucumberData];
			dataArray.forEach((feature: any) => {
				const featurePassed = feature.elements.every(
					(scenario: { steps: any[] }) =>
						scenario.steps.every(
							(step: { result: { status: string } }) =>
								step.result.status !== "failed",
						),
				);
				if (featurePassed) {
					passedFeatures++;
				} else {
					failedFeatures++;
				}
			});
		}
		return { passedFeatures, failedFeatures };
	}, [projectData]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<RadialChartComponent chartData={chartData} />
		</div>
	);
};

const ProjectComponent: React.FC<{
	projectsData: ProjectDetails[];
	selectedProjectKey: string;
}> = ({ projectsData, selectedProjectKey }) => {
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);

	const selectedProjectData = useMemo(() => {
		return projectsData.sort((a, b) => (b.runNumber || 0) - (a.runNumber || 0));
	}, [projectsData]);

	if (!selectedProjectKey) {
		return <div>Please select a project from the header.</div>;
	}

	if (selectedProjectData.length === 0) {
		return <div>No data available for the selected project.</div>;
	}

	const renderCucumberData = (cucumberData: CucumberData | CucumberData[]) => {
		const dataArray = Array.isArray(cucumberData)
			? cucumberData
			: [cucumberData];

		return (
			<Accordion type="single" collapsible className="w-full">
				{dataArray.map((feature, featureIndex) => (
					<FeatureAccordion
						key={featureIndex}
						feature={feature}
						featureIndex={featureIndex}
					/>
				))}
			</Accordion>
		);
	};

	return (
		<Tabs
			className="mt-3"
			selectedIndex={selectedTabIndex}
			onSelect={(index) => setSelectedTabIndex(index)}
		>
			<StyledTabList>
				{selectedProjectData.map((projectData, index) => (
					<Tab key={projectData.runId}>
						<StyledTab selected={index === selectedTabIndex}>
							<span className="pointer-events-none">
								Run {projectData.runNumber} {index === 0 ? "(Latest)" : ""}
							</span>
						</StyledTab>
					</Tab>
				))}
			</StyledTabList>
			{selectedProjectData.map((projectData, index) => (
				<TabPanel key={projectData.runId} className="mt-4">
					{selectedTabIndex === index && (
						<div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-4 max-w-7xl">
								<RunInfo projectData={projectData} />
								<TestResultsChart projectData={projectData} />
							</div>
							<div className="mb-4">
								<CardContent className="pt-0 pl-0 pr-0">
									{projectData.cucumberData ? (
										renderCucumberData(projectData.cucumberData)
									) : (
										<GlassmorphicCard>
											<Alert variant="destructive">
												<ExclamationTriangleIcon className="h-4 w-4" />
												<AlertTitle>No Data Available</AlertTitle>
												<AlertDescription>
													We couldn't retrieve any data for this GitHub job.
													This could be due to one of the following reasons:
													<ul className="list-disc list-inside mt-2">
														<li>The job is still in progress</li>
														<li>The job has not started yet</li>
														<li>There was an error during job execution</li>
														<li>The job results are not accessible</li>
													</ul>
													Please check the job status in GitHub Actions for more
													information.
												</AlertDescription>
											</Alert>
										</GlassmorphicCard>
									)}
								</CardContent>
							</div>
						</div>
					)}
				</TabPanel>
			))}
		</Tabs>
	);
};

export default ProjectComponent;
