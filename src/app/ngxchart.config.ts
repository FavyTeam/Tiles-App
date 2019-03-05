import * as shape from 'd3-shape';

export var lineChartView: any[] = [1200, 600];
// options
export var lineChartShowXAxis = true;
export var lineChartShowYAxis = true;
export var lineChartGradient = false;
export var lineChartShowLegend = false;
export var lineChartShowXAxisLabel = true;
export var lineChartXAxisLabel = 'Weekly Tags';
export var lineChartShowYAxisLabel = true;
export var lineChartYAxisLabel = 'Number of Contact';

export var lineChartColorScheme = {
    domain: ['#1CBCD8', '#FF8D60', '#FF586B', '#AAAAAA']
};

// line, area
export var lineChartAutoScale = true;
export var lineChartLineInterpolation = shape.curveBasis;
export var lineMaxYAxisTickLength = 2;
export var linetrimYAxisTicks = true;