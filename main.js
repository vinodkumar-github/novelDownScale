document.addEventListener('DOMContentLoaded', function() {
  const imageForm = document.getElementById('imageForm');
  const canvasContainer = document.getElementById('canvas-container');
  imageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const newWidthInput = document.getElementById('newWidth');
    const newHeightInput = document.getElementById('newHeight');
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidthInput.value;
        canvas.height = newHeightInput.value;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const resizedImageData = downsizeImage(imageData, canvas.width, canvas.height);
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = canvas.width;
        resizedCanvas.height = canvas.height;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.putImageData(resizedImageData, 0, 0);
        canvasContainer.innerHTML = ''; // Clear previous content
        canvasContainer.appendChild(resizedCanvas);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
});



document.addEventListener('DOMContentLoaded', function() {
  const imageForm = document.getElementById('imageForm');
  const canvasContainer = document.getElementById('canvas-container');

  imageForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const imageInput = document.getElementById('imageInput');
    const newWidthInput = document.getElementById('newWidth');
    const newHeightInput = document.getElementById('newHeight');

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidthInput.value;
        canvas.height = newHeightInput.value;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const resizedImageData = downsizeImage(imageData, canvas.width, canvas.height);

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = canvas.width;
        resizedCanvas.height = canvas.height;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.putImageData(resizedImageData, 0, 0);

        canvasContainer.innerHTML = ''; // Clear previous content
        canvasContainer.appendChild(resizedCanvas);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
});



function downsizeImage(oldImageData, newWidth, newHeight) {
  const oldWidth = oldImageData.width;
  const oldHeight = oldImageData.height;
  const scaleX = oldWidth / newWidth;
  const scaleY = oldHeight / newHeight;
  const newImageData = new ImageData(newWidth, newHeight);

  function imageDataTo3DArray(imageData) {
    const arr = new Array(imageData.height);
    for (let y = 0; y < imageData.height; y++) {
      arr[y] = new Array(imageData.width);
      for (let x = 0; x < imageData.width; x++) {
        const index = (imageData.width * y + x) * 4;
        arr[y][x] = [
          imageData.data[index], // Red
          imageData.data[index + 1], // Green
          imageData.data[index + 2], // Blue
        ];
      }
    }
    return arr;
  }

  const oldImage3D = imageDataTo3DArray(oldImageData);
  const newImage3D = [];
  const a = Math.sqrt(2)

  function oldPixelIterator(x, y) {
    let r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0;

    for (let i = (y * scaleY) * 3 / 2; i >= (y * scaleY); i--) {
      for (let j = (x * scaleX) * 3 / 2; j >= (x * scaleX); j--) {
        const weight = Math.cos((1 - Math.hypot(i, j)) / Math.hypot(x * scaleX, y * scaleY));
        r1 = Math.hypot((oldImage3D[y][x][0] || 0) * weight,r1)/a;
        g1  = Math.hypot((oldImage3D[y][x][1] || 0) * weight,g1)/a;
        b1 = Math.hypot((oldImage3D[y][x][2] || 0) * weight,b1)/a;
      }
    }
    for (let i = (y * scaleY) / 2; i <= (y * scaleY); i++) {
      for (let j = (x * scaleX) / 2; j <= (x * scaleX); j++) {
        const weight = Math.cos((1 - Math.hypot(i, j)) / Math.hypot(x * scaleX, y * scaleY));
        r2 = Math.hypot((oldImage3D[y][x][0] || 0) * weight,r2)/a;
        g2 = Math.hypot((oldImage3D[y][x][1] || 0) * weight,g2)/a;
        b2 = Math.hypot((oldImage3D[y][x][2] || 0) * weight,b2)/a;
      }
    }

    return [Math.hypot(r1,r2)*a, Math.hypot(g1,g2)*a, Math.hypot(b1,b2)*a];
  }

  for (let y = 0; y < newHeight; y++) {
    newImage3D[y] = [];
    for (let x = 0; x < newWidth; x++) {
      newImage3D[y][x] = oldPixelIterator(x, y);
    }
  }

  return arrayToImageData(newImage3D, newWidth, newHeight);

  function arrayToImageData(pixelArray, width, height) {
    const imageData = new ImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b] = pixelArray[y][x];
        const index = (y * width + x) * 4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }
    return imageData;
  }
}