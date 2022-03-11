import { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { createLegend, createXAxis, createYAxis } from "./helpers";
import styled from "styled-components";

type LiveChartProps<T> = {
  data: T[];
  xField: keyof T;
  yField: keyof T;
  preserveDataTime: number;
  updateInterval?: number;
  maxValue?: number;
  title?: string;
};

const LiveChart = <T extends Record<string, unknown>>({
  data = [],
  xField,
  yField,
  preserveDataTime,
  updateInterval = 200,
  maxValue = 100,
  title,
}: LiveChartProps<T>) => {
  const legend = useRef<am5.Legend>();
  const xAxis = useRef<am5xy.DateAxis<am5xy.AxisRenderer>>();
  const yAxis = useRef<am5xy.ValueAxis<am5xy.AxisRenderer>>();
  const [chart, setChart] = useState<am5xy.XYChart>();

  useLayoutEffect(() => {
    const root = am5.Root.new("liveChart");
    root.setThemes([am5themes_Animated.new(root)]);

    const chartInstance = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    xAxis.current = createXAxis(chartInstance, updateInterval);
    yAxis.current = createYAxis(chartInstance);
    legend.current = createLegend(chartInstance);

    setChart(chartInstance);

    chartInstance.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [updateInterval]);

  useLayoutEffect(() => {
    const pushData = (item: any, i: number) => {
      const series = chart?.series.getIndex(i);

      if (!series || !item) {
        return;
      }

      const firstItem = series.data.getIndex(0);

      if (
        firstItem &&
        item.timestamp - (firstItem as any).date > preserveDataTime
      ) {
        series.data.removeIndex(0);
      }

      series.data.push(item);
    };

    const createSeries = (item: T, i: number) => {
      if (!chart || !xAxis.current || !yAxis.current) {
        return;
      }

      const seriesInstance = chart.series.push(
        am5xy.LineSeries.new(chart.root, {
          minBulletDistance: 10,
          name: String(i + 1),
          xAxis: xAxis.current,
          yAxis: yAxis.current,
          valueYField: yField as string,
          valueXField: xField as string,
        })
      );

      legend.current?.data.push(chart.series.values);

      seriesInstance.data.push(item);
    };

    data.forEach((item: T, i: number) => {
      if (maxValue && item[yField] > maxValue) {
        return;
      }

      chart?.series && chart?.series.length >= data.length
        ? pushData(item, i)
        : createSeries(item, i);
    });
  }, [data, xField, yField, maxValue, chart, preserveDataTime]);

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <ChartContainer id="liveChart" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  display: inline-flex;
  padding: 1rem;
  margin-right: auto;
  font-size: 2rem;
  // TODO: Use theme to store colors
  border-bottom: 1px solid #999;
`;
const ChartContainer = styled.div`
  width: 100%;
  height: 30rem;
`;

export default LiveChart;
