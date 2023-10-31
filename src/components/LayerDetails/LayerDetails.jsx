import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { selectGpxElevationChartData } from "../../reducers/gpxStore";

import styles from "./LayerDetails.module.css";

const LayerDetails = () => {
  const elevation_chart_data = useSelector(selectGpxElevationChartData);
  console.log(elevation_chart_data);

  if (!elevation_chart_data) return null;

  return (
    <div className={styles.layerDetails}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={elevation_chart_data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="greem" stopOpacity={0.3} />
              <stop offset="95%" stopColor="green" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="distance" />
          <YAxis dataKey="elevation" domain={["dataMin - 100", "auto"]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            dataKey="elevation"
            stroke="green"
            fill="url(#colorUv)"
            activeDot={{ r: 8 }}
            baseValue={7000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayerDetails;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
