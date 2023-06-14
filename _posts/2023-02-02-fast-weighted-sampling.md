---
title:  "Fast Weighted Sampling in Python"
date:   2023-02-02 10:12:00 -0700
categories: 
 -python 
 -optimization
classes: wide
excerpt: Data scientists frequently have to sample items from a weighted distribution, why be inefficient?
header:
 og_image: /images/optim01-weighted-sampling.png
 teaser: /images/optim01-weighted-sampling.png
---

##  Problem Statement
I recently trained a reinforcement learning model and decided to profile the code prior to running a long-running parameter optimization search. One important aspect of the code was the random sampling of elements from a weighted distribution, which was consuming a considerable amount of runtime. Given that random sampling from a weighted distribution is a common task in machine learning and data science, finding a more efficient solution would allow me to optimize the code and get back to work faster. 

Initially, I used `np.random.choice` as the sampling function. However, upon researching the topic, I came across a [StackOverflow question](https://stackoverflow.com/questions/18622781/why-is-numpy-random-choice-so-slow) that recommended using `random.choices` as an alternative. After profiling both functions, I found that random.choices was six times faster in my specific application. Both functions accept as inputs the array to sample from, the number of elements to return, and the weights of the values in the sample array.

Python and its libraries are an ever-evolving ecosystem with changing best practices. It is often best to run a quick test on your specifc combination of python and numpy versions before attempting a long-running parameter search or training simulation.

## Versions
* Python 3.7.13
* NumPy 1.21.5

## Setup
I utilized the `timeit` library to compare the performance of `np.random.choice` and `random.choices` for random sampling from a weighted distribution. I tested different scenarios to understand how the type of input (numpy arrays vs. lists) and the conversion of input type (from numpy arrays to lists) can affect the performance of the sampling functions. The following cases were evaluated:

1. Using `np.random.choice` with input arrays as numpy arrays
2. Using `np.random.choice` with input arrays as lists
3. Using `random.choices` with input arrays as numpy arrays
4. Using `random.choices` with input arrays as lists
5. Using `random.choices` with input arrays as numpy arrays and converting the sampling array to a list before sampling
6. Using `random.choices` with input arrays as numpy arrays and converting the weighting array to a list before sampling.

  ![Profiling Results](/images/optim01-random_choice.png){:height="100px"} 



### Conclusions
1. When dealing with small arrays of less than 1000 elements, using random.choices with inputs as lists is the fastest method. However, converting numpy arrays to lists using tolist() can still improve performance.
2. For arrays with more than 1000 elements, using np.random.choice with numpy arrays as inputs is the recommended method for faster execution.
3. As a professional developer, it is important to incorporate considerations of efficiency and profiling into your practice, as demonstrated in this profiling exercise. These insights would not have been uncovered without the profiling of candidate functions.

## APPENDIX - CODE
The following code was used to generate the plot.
```python
import numpy as np
import timeit
import matplotlib.pyplot as plt

plt.style.use('ggplot')

n_elements_list = [2, 10, 100, 1000, 10000, 1000+00, 1000000]
n_sims = 1000
results = np.zeros((len(n_elements_list), 6))

numpy_setup = """
import random
import numpy as np
weights = np.random.rand({n},1)
weights = np.squeeze(weights/np.sum(weights))
actions = np.arange({n})

weights_list = weights.tolist()
actions_list = list(range({n}))
"""

for i, n_elements in enumerate(n_elements_list):
    results[i, 0] = timeit.timeit('np.random.choice(actions, p=weights)', setup=numpy_setup.format(n=n_elements), number=n_sims)
    results[i, 1] = timeit.timeit('np.random.choice(actions_list, p=weights_list)', setup=numpy_setup.format(n=n_elements), number=n_sims)
    results[i, 2] = timeit.timeit('random.choices(actions, k=1, weights=weights)', setup=numpy_setup.format(n=n_elements), number=n_sims)
    results[i, 3] = timeit.timeit('random.choices(actions_list, k=1, weights=weights_list)', setup=numpy_setup.format(n=n_elements), number=n_sims)
    results[i, 4] = timeit.timeit('random.choices(actions.tolist(), k=1, weights=weights_list)', setup=numpy_setup.format(n=n_elements), number=n_sims)
    results[i, 5] = timeit.timeit('random.choices(actions.tolist(), k=1, weights=weights.tolist())', setup=numpy_setup.format(n=n_elements), number=n_sims)

# Plot results
fig = plt.figure(figsize=(9, 6))
ax = fig.add_subplot(111)
ax.plot(n_elements_list, results[:,0], label='np.random.choice - numpy array')
ax.plot(n_elements_list, results[:,1], label='np.random.choice - list')
ax.plot(n_elements_list, results[:,2], label='random.choices - numpy array')
ax.plot(n_elements_list, results[:,3], label='random.choices - list')
ax.plot(n_elements_list, results[:,4], label='random.choices - choices - numpy array to list, weights list')
ax.plot(n_elements_list, results[:,5], label='random.choices - weights and choices as numpy array to list')
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Number of elements to choose from')
ax.set_ylabel('Time (seconds)')
ax.legend(loc="upper left")
plt.show()
```