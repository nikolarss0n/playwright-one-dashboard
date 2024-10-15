import { CircleCheckBig, CircleX } from "lucide-react";
import { Pie, PieChart } from "recharts";
import { Label } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "../ui/chart";
import GlassmorphicCard from "../ui/GlassmorphicCard";

export default function RadialChartComponent(data: any) {
	console.log("chartData: ", data);
	const passedFeatures = data.chartData.passedFeatures;
	const failedFeatures = data.chartData.failedFeatures;
	const totalFeatures = passedFeatures + failedFeatures;

	const chartData = [
		{ status: "passed", features: passedFeatures, fill: "#d7fc03" },
		{ status: "failed", features: failedFeatures, fill: "#D64045" },
	];
	const chartConfig = {
		passed: {
			label: "Passed",
			color: "hsl(var(--chart-1))",
		},
		failed: {
			label: "Failed",
			color: "hsl(var(--chart-2))",
		},
		other: {
			label: "Other",
			color: "hsl(var(--chart-5))",
		},
	} satisfies ChartConfig;

	return (
		<GlassmorphicCard className="flex flex-col border-2 border-[#4a154b]">
			<CardHeader className="items-center pb-0">
				<CardTitle>E2E Test Results</CardTitle>
				<CardDescription className="text-white">
					Feature Pass/Fail Status
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="features"
							nameKey="status"
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold fill-white"
												>
													{totalFeatures.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground fill-white"
												>
													Total Features
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2">
					<CircleCheckBig size={16} style={{ color: "#D7FC03CC" }} />
					<span>Passed Features</span>
					<span className="font-bold">{passedFeatures}</span>
				</div>
				<div className="flex items-center gap-2">
					<CircleX size={16} style={{ color: "#FF0000CC" }} />
					<span>Failed Features</span>
					<span className="font-bold">{failedFeatures}</span>
				</div>
			</CardFooter>
		</GlassmorphicCard>
	);
}
