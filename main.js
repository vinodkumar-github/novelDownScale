function downsizeImage(oldImageData, maxDimension) {
    const oldWidth = oldImageData.width;
    const oldHeight = oldImageData.height;
    const newWidth = oldWidth > oldHeight ? maxDimension : maxDimension * oldWidth / oldHeight;
    const newHeight = oldHeight > oldWidth ? maxDimension : maxDimension * oldHeight / oldWidth;
    const scaleX = oldWidth / newWidth;
    const scaleY = oldHeight / newHeight;
    const newImageData = new ImageData(newWidth, newHeight);
    const a = Math.sqrt(2);
    function valueAtXY(x, y) {
        const a = Math.floor(y);
        const b = Math.floor(x);
        if (a < 1 || a >= oldImageData.height - 2 || b < 1 || b >= oldImageData.width - 2) {
            return [0, 0, 0];
        }

        const dx = x - b;
        const dy = y - a;

        const weightsX = [
            cubicWeight(dx + 1),
            cubicWeight(dx),
            cubicWeight(1 - dx),
            cubicWeight(2 - dx)
        ];
        const weightsY = [
            cubicWeight(dy + 1),
            cubicWeight(dy),
            cubicWeight(1 - dy),
            cubicWeight(2 - dy)
        ];

        let pixel = [0, 0, 0];

        for (let i = -1; i <= 2; i++) {
            for (let j = -1; j <= 2; j++) {
                const offsetX = b + j;
                const offsetY = a + i;
                const offset = offsetY * oldImageData.width + offsetX;
                const color = [
                    oldImageData.data[(offset * 4)],
                    oldImageData.data[(offset * 4) + 1],
                    oldImageData.data[(offset * 4) + 2]
                ];

                const weight = weightsX[j + 1] * weightsY[i + 1];

                pixel[0] += color[0] * weight;
                pixel[1] += color[1] * weight;
                pixel[2] += color[2] * weight;
            }
        }

        return pixel;
    }

    function cubicWeight(t) {
        // Cubic B-Spline
        if (t <= 1) {
            return (t * t * (1.5 * t - 2.5) + 1);
        } else if (t < 2) {
            return (t * (-(t * (t * 0.5 - 2.5) - 4) + 2));
        } else {
            return 0;
        }
    }


    function oldPixelIterator(x, y) {
        let r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0;
        const yScale = y * scaleY;
        const xScale = x * scaleX;
        const yScale1 = yScale + scaleY;
        const xScale1 = xScale +scaleX;
        const yScale2 = yScale - scaleY;
        const xScale2 = xScale -scaleX;
        const hypotXY1 = Math.hypot(x *  xScale1, y * yScale1)||1;
        const hypotXY2 = Math.hypot(x *  xScale2, y * yScale2)||1;
        let   [ra,ga,ba] = [0,0,0]
        let   [rb,gb,bb] = [0,0,0]
        for (let i = yScale1; i >= yScale; i--) {
            for (let j = xScale1; j >= xScale; j--) {
                const weight = Math.cos(Math.PI*0.5*((1 - Math.hypot(i, j)) / hypotXY1));
           [ra,ga,ba] = valueAtXY(j,i)
                r1 = Math.hypot((ra||1) * weight, r1)/a;
                g1 = Math.hypot((ga||1) * weight, g1)/a;
                b1 = Math.hypot((ba||1) * weight, b1) /a;
            }
        }
        for (let i = yScale2; i <= yScale; i++) {
            for (let j = xScale2; j <= xScale; j++) {
                const weight = Math.cos(Math.PI*0.5*((1 - Math.hypot(i, j)) / hypotXY2));
                [rb,gb,bb] = valueAtXY(j,i)
                r2 = Math.hypot((rb||1) * weight, r2)/a ;
                g2 = Math.hypot((gb||1) * weight, g2)/a;
                b2 = Math.hypot((bb||1) * weight, b2)/a ;
            }
        }
        return [Math.hypot(r1, r2)/a, Math.hypot(g1, g2)/a, Math.hypot(b1, b2)/a];
    }

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            let [r, g, b] = oldPixelIterator(x, y);
            const pixelIndex = (y * newImageData.width + x) * 4;
            newImageData.data[pixelIndex] = r;
            newImageData.data[pixelIndex + 1] = g;
            newImageData.data[pixelIndex + 2] = b;
            newImageData.data[pixelIndex + 3] = 255;
        }
    }

    return newImageData;
}
