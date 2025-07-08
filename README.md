# Novel Image Scaling Algorithm
Hosted at https://vinodkumar-github.github.io/novelDownScale/

ToDo: Uploaded image infometrics display & Feature to ensure aspect ratio is unchanged even on scaling up or down.
      Memoization pending and Workers logic to hasten processing. (Both Simultaneously? Isolate unique values in png cells and run workers on them to create a table -thus pseudo memoization?)
## Overview
A novel approach to image scaling with a primary focus on downscaling (with potential for upscaling through minor modifications). The algorithm utilizes harmonic data interpolation through the built-in Hypot method to achieve high-quality image transformation.

## Features
- Image downscaling with harmonic data interpolation
- Adaptable for upscaling with minimal modifications
- Utilizes the mathematical Hypot method for calculations
- Preserves image quality during transformation

## Getting Started

### Prerequisites
- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

### Installation
1. Clone this repository:
