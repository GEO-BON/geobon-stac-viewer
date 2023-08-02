import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import "./styles_histo.css";
import { useRef, useEffect, useState } from "react";

interface Props {
  data: any;
  bounds: any;
}

export default function TimeSeries({ data, bounds }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0) {
      const tsChart = Plot.plot({
        y: {
          grid: true,
        },
        marks: [
          Plot.lineY(data, {
            y: "mean",
            x: "date",
            stroke: "place",
          }),
          Plot.axisX({
            label: "Year",
            tickRotate: 90,
          }),
          Plot.axisY({ label: "Value", marginTop: 100 }),
          Plot.ruleY([0]),
        ],
        color: { legend: true },
        marginTop: 20,
        marginLeft: 60,
        marginRight: 60,
        marginBottom: 50,
      });
      ref.current?.append(tsChart);
      return () => tsChart.remove();
    }
  }, [data]);

  return (
    <div>
      <div ref={ref} className="plotDiv"></div>
    </div>
  );
}
