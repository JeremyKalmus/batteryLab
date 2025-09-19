export const formatTooltip = (value: number, unit: string = ''): string => {
  return `${value.toFixed(2)}${unit}`;
};

export const generateRegressionData = (
  x: number[], 
  y: number[], 
  type: 'linear' | 'exponential' | 'polynomial' = 'linear'
): { x: number[]; y: number[] } => {
  if (x.length !== y.length || x.length < 2) {
    return { x: [], y: [] };
  }

  const n = x.length;
  let regressionY: number[] = [];

  if (type === 'linear') {
    // Simple linear regression
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    regressionY = x.map(xi => slope * xi + intercept);
  } else if (type === 'exponential') {
    // Exponential regression using log transformation
    const logY = y.map(yi => Math.log(Math.max(yi, 0.01)));
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumLogY = logY.reduce((a, b) => a + b, 0);
    const sumXLogY = x.reduce((acc, xi, i) => acc + xi * logY[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const b = (n * sumXLogY - sumX * sumLogY) / (n * sumX2 - sumX * sumX);
    const a = Math.exp((sumLogY - b * sumX) / n);

    regressionY = x.map(xi => a * Math.exp(b * xi));
  } else if (type === 'polynomial') {
    // Simple polynomial regression (degree 2)
    // This is a simplified implementation
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumX3 = x.reduce((acc, xi) => acc + xi * xi * xi, 0);
    const sumX4 = x.reduce((acc, xi) => acc + xi * xi * xi * xi, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2Y = x.reduce((acc, xi, i) => acc + xi * xi * y[i], 0);

    // Simplified calculation for degree 2 polynomial
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const curvature = sumX2Y / sumX4 || 0;

    regressionY = x.map(xi => intercept + slope * xi + curvature * xi * xi * 0.0001);
  }

  return { x, y: regressionY };
};

export const calculateR2 = (actual: number[], predicted: number[]): number => {
  if (actual.length !== predicted.length) return 0;

  const actualMean = actual.reduce((a, b) => a + b, 0) / actual.length;
  const totalSumSquares = actual.reduce((acc, val) => acc + Math.pow(val - actualMean, 2), 0);
  const residualSumSquares = actual.reduce((acc, val, i) => acc + Math.pow(val - predicted[i], 2), 0);

  return 1 - (residualSumSquares / totalSumSquares);
};