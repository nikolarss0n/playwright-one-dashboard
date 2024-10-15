import type React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ParentComponent from "./components/Parent";
import { fetchProjectData } from "./services/projectService";
import { projects } from "./data/projects";
import type { ProjectDetails } from "./types/projectTypes";
import DashboardHeader from "./components/Header/Dashboard";
import { Loader2 } from "lucide-react";
import { GlobalStyle } from "./components/Project/ArtifactInfo";

const App: React.FC = () => {
	const [projectsData, setProjectsData] = useState<ProjectDetails[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("[DEBUG] Fetching fresh data");
				const data = await fetchProjectData(projects);
				setProjectsData(data);
			} catch (error) {
				console.error("[DEBUG] Error fetching project data:", error);
				setProjectsData(
					projects.map((project) => ({
						...project,
						status: "error",
						dataAvailable: false,
						artifacts: [],
					})),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<Loader2 className="h-20 w-80 animate-spin text-primary mx-auto text-white" />
				</div>
			</div>
		);
	}

	console.log("[DEBUG] Rendering App component. projectsData:", projectsData);

	return (
		<>
			<GlobalStyle />
			<Router>
				<DashboardHeader />
				<Routes>
					<Route
						path="/e2e-tests"
						element={<ParentComponent projectsData={projectsData} />}
					/>
					<Route
						index
						element={<ParentComponent projectsData={projectsData} />}
					/>
				</Routes>
			</Router>
		</>
	);
};

export default App;
