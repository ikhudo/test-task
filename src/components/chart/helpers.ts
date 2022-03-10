import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export const createXAxis = (
  chart: am5xy.XYChart,
  updateInterval: number = 1000
) => {
  const axis = chart.xAxes.push(
    am5xy.DateAxis.new(chart.root, {
      maxDeviation: 0.5,
      extraMin: -0.1,
      extraMax: 0.1,
      groupData: false,
      baseInterval: {
        timeUnit: "millisecond",
        count: updateInterval,
      },
      renderer: am5xy.AxisRendererX.new(chart.root, {
        minGridDistance: 100,
      }),
      tooltip: am5.Tooltip.new(chart.root, {}),
    })
  );

  const xRenderer = axis.get("renderer");

  xRenderer.grid.template.setAll({
    visible: false,
  });

  xRenderer.labels.template.setAll({
    visible: false,
  });

  return axis;
};

export const createYAxis = (chart: am5xy.XYChart) => {
  const axis = chart.yAxes.push(
    am5xy.ValueAxis.new(chart.root, {
      renderer: am5xy.AxisRendererY.new(chart.root, {}),
    })
  );

  const yRenderer = axis.get("renderer");

  yRenderer.grid.template.setAll({
    visible: false,
  });

  yRenderer.labels.template.setAll({
    visible: false,
  });

  return axis;
};

export const createLegend = (chart: am5xy.XYChart) => {
  return chart.children.push(am5.Legend.new(chart.root, {}));
};
