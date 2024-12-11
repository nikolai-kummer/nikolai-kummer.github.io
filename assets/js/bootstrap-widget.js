// Function to parse input text into an array of numbers
function parseInput(text) {
    return text
      .split('\n')
      .map(Number)
      .filter(value => !isNaN(value)); // Filter out invalid numbers
  }
  
  // Function to perform bootstrap sampling and calculate statistics
  function bootstrapSampling(sample, numSamples, confidence) {
    const means = [];
    const medians = [];
    const alpha = 1 - confidence / 100;
  
    for (let i = 0; i < numSamples; i++) {
      const resample = resampleData(sample);
      means.push(mean(resample));
      medians.push(median(resample));
    }
  
    means.sort((a, b) => a - b);
    medians.sort((a, b) => a - b);
  
    const lowerMeanBound = means[Math.floor(alpha / 2 * numSamples)];
    const upperMeanBound = means[Math.floor((1 - alpha / 2) * numSamples)];
    const lowerMedianBound = medians[Math.floor(alpha / 2 * numSamples)];
    const upperMedianBound = medians[Math.floor((1 - alpha / 2) * numSamples)];
  
    return {
      meanStats: { lowerBound: lowerMeanBound, upperBound: upperMeanBound, values: means },
      medianStats: { lowerBound: lowerMedianBound, upperBound: upperMedianBound, values: medians }
    };
  }
  
  // Function to compare statistics between two samples
  function compareStatistics(sample1, sample2, numSamples, confidence) {
    const bootstrap1 = bootstrapSampling(sample1, numSamples, confidence);
    const bootstrap2 = bootstrapSampling(sample2, numSamples, confidence);
  
    let countMeanSample1Larger = 0;
    let countMedianSample1Larger = 0;
  
    for (let i = 0; i < numSamples; i++) {
      if (bootstrap1.meanStats.values[i] > bootstrap2.meanStats.values[i]) {
        countMeanSample1Larger++;
      }
      if (bootstrap1.medianStats.values[i] > bootstrap2.medianStats.values[i]) {
        countMedianSample1Larger++;
      }
    }
  
    const percentageMeanSample1Larger = (countMeanSample1Larger / numSamples) * 100;
    const percentageMedianSample1Larger = (countMedianSample1Larger / numSamples) * 100;
  
    return {
      sample1Stats: bootstrap1,
      sample2Stats: bootstrap2,
      percentageMeanSample1Larger,
      percentageMedianSample1Larger
    };
  }
  
  // Function to resample data with replacement
  function resampleData(array) {
    const resampled = [];
    for (let i = 0; i < array.length; i++) {
      const randomIndex = Math.floor(Math.random() * array.length);
      resampled.push(array[randomIndex]);
    }
    return resampled;
  }
  
  // Function to calculate the mean of an array
  function mean(array) {
    return array.reduce((sum, value) => sum + value, 0) / array.length;
  }
  
  // Function to calculate the median of an array
  function median(array) {
    if (array.length === 0) return NaN;
    const sortedArray = array.slice().sort((a, b) => a - b);
    const midIndex = Math.floor(sortedArray.length / 2);
    if (sortedArray.length % 2 === 0) {
      return (sortedArray[midIndex - 1] + sortedArray[midIndex]) / 2;
    } else {
      return sortedArray[midIndex];
    }
  }
  
  // Function to run the bootstrap analysis and display results
  function runBootstrap() {
    const sample1 = parseInput(document.getElementById('sample1').value);
    const sample2 = parseInput(document.getElementById('sample2').value);
    const numSamples = parseInt(document.getElementById('numSamples').value, 10);
    const confidence = parseInt(document.getElementById('confidence').value, 10);
  
    if (sample1.length === 0 || sample2.length === 0) {
      document.getElementById('output').textContent = "Please provide valid samples.";
      return;
    }
  
    const results = compareStatistics(sample1, sample2, numSamples, confidence);
  
    document.getElementById('output').innerHTML = `
      <p>Sample 1 Mean: ${mean(sample1).toFixed(2)} - 
        [${results.sample1Stats.meanStats.lowerBound.toFixed(2)}, ${results.sample1Stats.meanStats.upperBound.toFixed(2)}] (${confidence}% CI)</p>
      <p>Sample 2 Mean: ${mean(sample2).toFixed(2)} - 
        [${results.sample2Stats.meanStats.lowerBound.toFixed(2)}, ${results.sample2Stats.meanStats.upperBound.toFixed(2)}] (${confidence}% CI)</p>
      <p>Percentage of Bootstrap Samples Where Mean(Sample 1) > Mean(Sample 2): 
        ${results.percentageMeanSample1Larger.toFixed(2)}%</p>
      <p>Sample 1 Median: ${median(sample1).toFixed(2)} - 
        [${results.sample1Stats.medianStats.lowerBound.toFixed(2)}, ${results.sample1Stats.medianStats.upperBound.toFixed(2)}] (${confidence}% CI)</p>
      <p>Sample 2 Median: ${median(sample2).toFixed(2)} - 
        [${results.sample2Stats.medianStats.lowerBound.toFixed(2)}, ${results.sample2Stats.medianStats.upperBound.toFixed(2)}] (${confidence}% CI)</p>
      <p>Percentage of Bootstrap Samples Where Median(Sample 1) > Median(Sample 2): 
        ${results.percentageMedianSample1Larger.toFixed(2)}%</p>
    `;
  }
  