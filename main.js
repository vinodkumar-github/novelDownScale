function downsizeImage(oldImageData, maxDimension) {
    const oldWidth = oldImageData.width;
    const oldHeight = oldImageData.height;
    const newWidth = oldWidth > oldHeight ? maxDimension : maxDimension * oldWidth / oldHeight;
    const newHeight = oldHeight > oldWidth ? maxDimension : maxDimension * oldHeight / oldWidth;
    const scaleX = oldWidth / newWidth;
    const scaleY = oldHeight / newHeight;
    const newImageData = new ImageData(newWidth, newHeight);
    const a = Math.sqrt(2);

    function valueAtXY( x, y) {
        const Xa = Math.floor(x);
        const Ya = Math.floor(y);
        let [r1,g1,b1,w1] = [0,0,0,0]
        for (let i = 0; i <= 1; i++) {
            for (let j =0; j <= 1; j++) {

                const weight = Math.cos(Math.PI * 0.5 * (1-Math.hypot(Xa + j - x, Ya + i - y)/Math.hypot( x, y)));
                const index = (Xa+j + (Ya+i)*oldImageData.width) * 4
                r1 = Math.hypot((oldImageData.data[index]||0) * weight, r1);
                g1 = Math.hypot((oldImageData.data[index+1]||0) * weight, g1);
                b1 = Math.hypot((oldImageData.data[index+2]||0) * weight, b1);
                w1 = Math.hypot( weight, w1);
            }
        }
        return [r1/w1,g1/w1,b1/w1];

    }
    function oldPixelIterator(x, y) {
        let r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0;
        let w1 = 0, w2 =0;

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
                w1 = Math.hypot( weight, w1)/a;

            }
        }
        for (let i = yScale2; i <= yScale; i++) {
            for (let j = xScale2; j <= xScale; j++) {
                const weight = Math.cos(Math.PI*0.5*((1 - Math.hypot(i, j)) / hypotXY2));
                [rb,gb,bb] = valueAtXY(j,i)
                r2 = Math.hypot((rb||1) * weight, r2)/a ;
                g2 = Math.hypot((gb||1) * weight, g2)/a;
                b2 = Math.hypot((bb||1) * weight, b2)/a ;
                w2 = Math.hypot( weight, w2)/a;

            }
        }
        return [Math.hypot(r1, r2)/Math.hypot(w1, w2), Math.hypot(g1, g2)/Math.hypot(w1, w2), Math.hypot(b1, b2)/Math.hypot(w1, w2)];
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
