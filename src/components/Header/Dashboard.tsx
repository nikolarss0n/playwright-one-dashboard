import GlassmorphicCard from "../ui/GlassmorphicCard";
import React from "react";
import styled from "styled-components";

const DashboardHeader = () => {
	return (
		<GlassmorphicCard className="select-none">
			<div className="flex items-center space-x-4">
				<div className="w-20 h-20 flex items-center justify-center bg-[#d7fc03] rounded-md">
					<span className="text-[#1d0e4a] text-6xl font-bold lowercase -mt-4">
						a
					</span>
				</div>
				<div>
					<h1 className="text-3xl font-bold text-white-600">QA Dashboard</h1>
					<p className="text-sm text-white-600">
						Quality Assurance Metrics and Reporting
					</p>
				</div>
			</div>
		</GlassmorphicCard>
	);
};

export default DashboardHeader;
