import { Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

type PieChartData = { label: string; value: number; color?: string };
type ReusableDonutChartProps = {
  data: PieChartData[] | undefined;
  title?: string;
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  hideLegend?: boolean;
};

export const CommonChart: React.FC<ReusableDonutChartProps> = ({
  data,
  title,
  width = 200,
  height = 200,
  innerRadius = 50,
  outerRadius = 100,
  hideLegend = true,
}) => {
  if (!data || data.length === 0) return <div>No data</div>;

  return (
    <>
      <Typography color="text.secondary" gutterBottom variant="overline">
        {title}
      </Typography>
      <PieChart
        series={[{ data, innerRadius, outerRadius, arcLabel: "value" }]}
        width={width}
        height={height}
        hideLegend={hideLegend}
        margin={{ right: 5 }}
      />
    </>
  );
};
