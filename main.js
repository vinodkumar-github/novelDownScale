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


function downsizeImage(oldImageData, maxDimension) {
    const oldWidth = oldImageData.width;
    const oldHeight = oldImageData.height;
    const newWidth = oldWidth > oldHeight ? maxDimension : maxDimension * oldWidth / oldHeight;
    const newHeight = oldHeight > oldWidth ? maxDimension : maxDimension * oldHeight / oldWidth;
    const scaleX = oldWidth / newWidth;
    const scaleY = oldHeight / newHeight;
    const newImageData = new ImageData(newWidth, newHeight);
    const a = Math.sqrt(2);
    const a3 = Math.sqrt(3)

    function valueAtXY(x, y) {
        const Xa = Math.floor(x);
        const Ya = Math.floor(y);
        let [r1, g1, b1, w1] = [0, 0, 0, 0]

        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                const weight = Math.cos(Math.PI *0.5*Math.hypot(Xa + j - x, Ya + i - y));
              // const   weight =1.5
                const index = (Xa + j + (Ya + i) * oldImageData.width) * 4
                const alpha = oldImageData.data[index + 3]
                const normalizedAlpha = alpha / 255;
                const r = oldImageData.data[index] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                const g = oldImageData.data[index + 1] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                const b = oldImageData.data[index + 2] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                r1 = Math.hypot((r || 1) * weight, r1);
                g1 = Math.hypot((g || 1) * weight, g1);
                b1 = Math.hypot((b ||1) * weight, b1);
                w1 = Math.hypot(weight, w1);



            }
        }
        w1 = w1 || 1

        return [r1 / w1, g1 / w1, b1 / w1];

    }
    function oldPixelIterator(x, y) {
        let r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0;
        let w1 = 0, w2 = 0;

        const yScale = y * scaleY;
        const xScale = x * scaleX;
        const yScale1 = yScale + scaleY;
        const xScale1 = xScale + scaleX;
        const yScale2 = yScale - scaleY;
        const xScale2 = xScale - scaleX;
        const hypotXY1 = Math.hypot(xScale, yScale) || 2;
        const hypotXY2 = Math.hypot(xScale, yScale) || 2;

        let [ra, ga, ba] = [0, 0, 0]
        let [rb, gb, bb] = [0, 0, 0]
        for (let i = yScale1; i >= yScale; i--) {
            for (let j = xScale1; j >= xScale; j--) {
                const weight = Math.cos(Math.PI * 0.5 * ((1 - Math.hypot(i, j)) / hypotXY1));
                [ra, ga, ba] = valueAtXY(j, i)

                r1 = Math.hypot((ra || 1) * weight, r1) ;
                g1 = Math.hypot((ga ||1) * weight, g1);
                b1 = Math.hypot((ba ||1) * weight, b1);
                w1 = Math.hypot(weight, w1);


            }
        }
        for (let i = yScale2; i <= yScale; i++) {
            for (let j = xScale2; j <= xScale; j++) {
                const weight = Math.cos(Math.PI * 0.5 * ((1 - Math.hypot(i, j)) / hypotXY2));
                [rb, gb, bb] = valueAtXY(j, i)

                r2 = Math.hypot((rb ||1) * weight, r2);
                g2 = Math.hypot((gb || 1) * weight, g2);
                b2 = Math.hypot((bb || 1) * weight, b2);
                w2 = Math.hypot(weight, w2);


            }
        }
        w1 = w1 || 1
        w2 = w2 || 1
        // if (y === newHeight - 3 + topPadding && x === newWidth - 3) {
        //     console.log(index, w1, w2, r1, r2, b1, b2, g1, g2)
        // }

        return [Math.hypot(r1, r2) / Math.hypot(w1, w2), Math.hypot(g1, g2) / Math.hypot(w1, w2), Math.hypot(b1, b2) / Math.hypot(w1, w2)];
    }
let stored = new Array(newWidth).fill([0,0,0])
    let [ra, ga, ba] = [0,0,0];
    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            let [r, g, b] = oldPixelIterator(x, y);
            let [r1, g1, b1] = stored[x];
            r1 = Math.hypot((2*r1+r)/3,r,(2*ra+r)/3)/a3;
            g1 = Math.hypot((2*g1+g)/3,g,(2*ga+g)/3)/a3;
            b1 = Math.hypot((2*b1+b)/3,b,(2*ba+b)/3)/a3;
            const pixelIndex = (y * newImageData.width + x) * 4;
            newImageData.data[pixelIndex] = r1;
            newImageData.data[pixelIndex + 1] = g1;
            newImageData.data[pixelIndex + 2] = b1;
            newImageData.data[pixelIndex + 3] = 255;
           stored[x][0]= ra =r;
           stored[x][1]= ga =g;
           stored[x][2]= ba =b;

        }
    }
    return newImageData;
}
