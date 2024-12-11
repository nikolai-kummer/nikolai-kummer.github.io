---
title:  "Bootstrap Sampler"
layout: single_with_math_latex
date:   2024-12-10 14:48:00 -0700
categories: 
  datascience
classes: wide
excerpt: Boostrap sampler widget
header:
 og_image: /images/pca_main.jpg
 teaser: /images/pca_main.jpg
---

<style>
  /* Style the form row to display child elements side by side */
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Adjusts space between columns */
  }

  /* Ensure form groups take equal width */
  .form-group {
    flex: 1;
    min-width: 200px; /* Ensures responsiveness */
  }

  /* Style the textareas to fill their containers */
  textarea {
    width: 100%;
    box-sizing: border-box; /* Includes padding and border in the element's total width and height */
  }

  /* Style the input fields to fill their containers */
  input[type="number"] {
    width: 100%;
    box-sizing: border-box;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
  }
</style>


Frequently I find myself needing to statistically compare two samples extracted from two real processes. You cannot always rely on assumptions from parameteric equations when dealing with real-world data. Traditional statistical tests will give you an exact answer, but tend to require that data is normally distributed.

The bootstrap sampler is a simple technique that allows the estimation of any statistic. It does so by repeatedly resampling the data with replacement and calculating the statistic on that sample. This allows the assesement of the variability of the statistic and the construction of confidence intervals around it.

I created this simple tool that allows me to quickly compare two samples and get a sense of the variability of the difference between them.

## Bootstrap Sampling Tool

This widget allows you to perform bootstrap sampling on two datasets. Paste your samples below, specify the number of resamples, and the confidence interval, and click "Run Bootstrap."

<div>
    <form id="bootstrap-form">
        <div class="form-row">
            <div class="form-group">
                <label for="sample1">Sample 1:</label>
                <textarea id="sample1" rows="5" placeholder="Enter/paste numbers separated by new lines"></textarea>
            </div>
            <div class="form-group">
                <label for="sample2">Sample 2:</label>
                <textarea id="sample2" rows="5" placeholder="Enter/paste numbers separated by new lines"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="numSamples">Number of Bootstrap Samples:</label>
                <input type="number" id="numSamples" value="1000" min="1">
            </div>
            <div class="form-group">
                <label for="confidence">Confidence Interval (%):</label>
                <input type="number" id="confidence" value="95" min="50" max="99">
            </div>
        </div>
        <button type="button" onclick="runBootstrap()">Run Bootstrap</button>
  </form>

  <div id="results">
    <h2>Results</h2>
    <p id="output"></p>
  </div>
</div>


<script src="/assets/js/bootstrap-widget.js"></script>


