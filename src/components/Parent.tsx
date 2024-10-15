import type React from "react";
import { useState, useMemo } from "react";
import Header from "./Header/Header";
import ProjectComponent from "./Project/Project";
import type { ProjectDetails } from "../types/projectTypes";

const ParentComponent: React.FC<{ projectsData: ProjectDetails[] }> = ({
	projectsData,
}) => {
	const uniqueProjects = useMemo(() => {
		const projectMap = new Map<string, ProjectDetails>();
		projectsData.forEach((project) => {
			const key = `${project.name}-${project.projectType}`;
			if (
				!projectMap.has(key) ||
				project.runNumber! > projectMap.get(key)!.runNumber!
			) {
				projectMap.set(key, project);
			}
		});
		return Array.from(projectMap.values());
	}, [projectsData]);

	const [selectedProjectKey, setSelectedProjectKey] = useState<string>(() => {
		if (uniqueProjects.length > 0) {
			const firstProject = uniqueProjects[0];
			return `${firstProject.name}-${firstProject.projectType}`;
		}
		return "";
	});

	const handleProjectSelect = (projectName: string, projectType: string) => {
		setSelectedProjectKey(`${projectName}-${projectType}`);
	};

	const filteredProjectsData = projectsData.filter(
		(project) =>
			`${project.name}-${project.projectType}` === selectedProjectKey,
	);

	return (
		<>
			<Header
				projectsData={projectsData}
				onProjectSelect={handleProjectSelect}
			/>
			<ProjectComponent
				projectsData={filteredProjectsData}
				selectedProjectKey={selectedProjectKey}
			/>
		</>
	);
};

export default ParentComponent;
