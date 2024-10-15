import type React from "react";
import type { ProjectDetails } from "../../types/projectTypes";
import { useMemo, useState } from "react";
import styled from "styled-components";
import slackIcon from "../../icons/slack-icon.png";

const HeaderContainer = styled.header`
  padding: 1rem 0rem 0rem 0rem;
  perspective: 1000px;
  min-height: 10vh;
`;

const ProjectTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  user-select: none;
  max-width: calc(100% - 3rem); 
`;

const ProjectTab = styled.button<{ active: boolean; selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.4rem;
  margin-bottom: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(35px);
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 294px;
  height: 182px;
  transform-style: preserve-3d;
  box-shadow: 0 0 56px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  font-family: 'Space Mono', monospace;
  color: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4a154b, 0 10px 20px rgba(0, 0, 0, 0.2);
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
    --tw-bg-opacity: 0.9;
    background: rgb(215 252 3 / var(--tw-bg-opacity));
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

const ProjectName = styled.span`
  font-size: 1.3rem; // Increased from 1.05rem
  margin-bottom: 0.8rem; // Slightly increased from 0.7rem
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
`;

const ProjectStatus = styled.span<{ status: string }>`
  font-size: 0.8rem;
  color: ${(props) => {
		switch (props.status) {
			case "success":
				return "rgb(215 252 3)";
			case "no-data":
				return "rgb(229 115 115)";
			case "pending":
				return "#ff9800";
			default:
				return "#bdbdbd";
		}
	}};
  margin-bottom: 0.4rem;
  text-transform: uppercase; // Added this line
`;

const ProjectRunNumber = styled.span<{ status: string }>`
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  color: ${(props) => {
		switch (props.status) {
			case "no-data":
				return "rgb(229 115 115)";
			default:
				return "white";
		}
	}};
`;

const SlackLink = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  color: white;
	}};
`;

interface HeaderProps {
	projectsData: ProjectDetails[];
	onProjectSelect: (projectName: string, projectType: string) => void;
}

const Header: React.FC<HeaderProps> = ({ projectsData, onProjectSelect }) => {
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

	const [selectedProject, setSelectedProject] = useState<string>(
		uniqueProjects.length > 0
			? `${uniqueProjects[0].name}-${uniqueProjects[0].projectType}`
			: "",
	);

	const handleProjectChange = (projectName: string, projectType: string) => {
		setSelectedProject(`${projectName}-${projectType}`);
		onProjectSelect(projectName, projectType);
	};

	return (
		<HeaderContainer>
			<ProjectTabs>
				{uniqueProjects.map((project) => {
					const projectKey = `${project.name}-${project.projectType}`;
					const isSelected = projectKey === selectedProject;
					return (
						<ProjectTab
							key={projectKey}
							active={isSelected}
							selected={isSelected}
							onClick={() =>
								handleProjectChange(project.name, project.projectType)
							}
						>
							<ProjectName>{project.name}</ProjectName>
							<ProjectStatus status={project.status}>
								STATUS: {project.status}
							</ProjectStatus>
							<ProjectRunNumber status={project.status}>
								Run: {project.runNumber || "N/A"}
							</ProjectRunNumber>
							<SlackLink rel="noopener noreferrer">
								Team: {project.teamName}
							</SlackLink>
						</ProjectTab>
					);
				})}
			</ProjectTabs>
		</HeaderContainer>
	);
};

export default Header;
