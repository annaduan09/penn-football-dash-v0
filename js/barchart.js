export function initChart(chartEl) {
  var chart = bb.generate({
    data: {
      columns: [
    ["data1", 30, 200, 100, 400, 150],
    ["data2", 130, 100, 140, 200, 150]
      ],
      type: "bar",
    },
    bar: {
      padding: 1,
      radius: {
        ratio: 0.4,
      },
      width: {
        max: 30,
      },
    },
    axis: {
      rotated: false,
      x: {
        show: true,
      },
      y: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
        },
      },
    },
    bindto: chartEl
  });
  
}
