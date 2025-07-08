# Novel Image Scaling Algorithm
Hosted at https://vinodkumar-github.github.io/novelDownScale/

## Overview
A novel approach to image scaling with a primary focus on downscaling (with potential for upscaling through minor modifications). The algorithm utilizes harmonic data interpolation through the built-in Hypot method to achieve high-quality image transformation.

## Features
- Image downscaling with harmonic data interpolation
- Adaptable for upscaling with minimal modifications
- Utilizes the mathematical Hypot method for calculations
- Preserves image quality during transformation



**TODO**
	•	_Image Infometrics Display_
 
                  Add a feature to display infometrics of the uploaded image.
		  
	•	_Aspect Ratio Preservation_
 
                  Ensure the image maintains its original aspect ratio during scaling (both up and down).
		  
	•	_Performance Optimization_
 
                  •	_Implement memoization _to avoid redundant calculations.
		  
	            •	Introduce _Web Workers_ to speed up processing by offloading computation-heavy tasks.
	     
	            •	Consider **combining both**__ approaches:
	     
	                  •	Isolate unique pixel values in the PNG image.
		   
	                  •	Run parallel workers on these unique cells to build a value-frequency table.
		   
	                  •	This can act as a form of pseudo-memoization.
		   
