function downsizeImage(oldImageData, maxDimension) {
    const oldWidth = oldImageData.width;
    const oldHeight = oldImageData.height;
    const newWidth = oldWidth > oldHeight ? maxDimension : maxDimension * oldWidth / oldHeight;
    const newHeight = oldHeight > oldWidth ? maxDimension : maxDimension * oldHeight / oldWidth;
    const scaleX = oldWidth / newWidth;
    const scaleY = oldHeight / newHeight;
    const newImageData = new ImageData(newWidth, newHeight);
const a3 = Math.sqrt(6)
    const a = Math.sqrt(2)


    function valueAtXY(x, y) {
        const Xa = Math.floor(x);
        const Ya = Math.floor(y);
const beta = Math.hypot(Math.max(x-Xa,Xa+1-x),Math.max(y-Ya,Ya+1-y))
        const indexIn = (Math.min(Math.max(Xa,0),oldWidth-1) + Math.min(Math.max(Ya,0),oldHeight-1) * oldImageData.width) * 4;
        const weightIn = Math.cos(Math.PI  * 0.5*Math.hypot(Math.min(Math.max(Xa,0),oldWidth-1) - x,Math.min(Math.max(Ya,0),oldHeight-1) - y)/beta);
        const normalizedAlphaIn =oldImageData.data[indexIn + 3] / 255;
      let r1 = (oldImageData.data[indexIn] * normalizedAlphaIn + 255 * (1 - normalizedAlphaIn))*weightIn;
       let g1 = (oldImageData.data[indexIn + 1] * normalizedAlphaIn + 255 * (1 - normalizedAlphaIn))*weightIn;
       let b1 = (oldImageData.data[indexIn + 2] * normalizedAlphaIn + 255 * (1 - normalizedAlphaIn))*weightIn;
        r1=  Math.hypot(r1, r1)/a;
        g1 = Math.hypot(g1, g1)/a;
        b1 =  Math.hypot(b1, b1)/a;
let w1 =    Math.hypot(weightIn, weightIn)/a;

        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                const weight = Math.cos(Math.PI * 0.5 * Math.hypot(Xa + j - x, Ya + i - y)/beta);
                // const   weight =1.5
                const index = (Math.min(Math.max(Xa+j,0),oldWidth-1) + Math.min(Math.max(Ya+i,0),oldHeight-1) * oldImageData.width) * 4;
                const alpha = oldImageData.data[index + 3]
                const normalizedAlpha = alpha / 255;
                const r = oldImageData.data[index] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                const g = oldImageData.data[index + 1] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                const b = oldImageData.data[index + 2] * normalizedAlpha + 255 * (1 - normalizedAlpha);
                r1 = Math.hypot((r || 1) * weight, r1)/a;
                g1 = Math.hypot((g || 1) * weight, g1)/a;
                b1 = Math.hypot((b || 1) * weight, b1)/a;
                w1 = Math.hypot(weight, w1)/a;


            }
        }
        w1 = w1 || 1

        return [r1 / w1, g1 / w1, b1 / w1];

    }

    function oldPixelIterator(x, y) {



        const yScale = y * scaleY;
        const xScale = x * scaleX;
        const yScale1 = yScale + scaleY;
        const xScale1 = xScale + scaleX;
        const yScale2 = yScale - scaleY;
        const xScale2 = xScale - scaleX;
        const weightConst1 = Math.PI * 0.5 / Math.hypot( (xScale1-xScale)*a,  (yScale1-yScale)*a)
        const weightConst2 = Math.PI * 0.5 / Math.hypot( (xScale2-xScale)*a,  (yScale2-yScale)*a)
        const jIn1 = Math.min(Math.max(xScale1,0),oldWidth-1)
        const iIn1 =  Math.min(Math.max(yScale1,0),oldHeight-1)
        const jIn2 = Math.min(Math.max(xScale2,0),oldWidth-1)
        const iIn2 =  Math.min(Math.max(yScale2,0),oldHeight-1)
        const weightIn1 = Math.cos(weightConst1 * (Math.hypot((iIn1-yScale)*a, (jIn1-xScale)*a)));
        const weightIn2 = Math.cos(weightConst2 * ( Math.hypot((iIn2-yScale)*a, (jIn2-xScale)*a)));
        let [r1,g1,b1] = valueAtXY(jIn1, iIn1)
        let w1 = weightIn1;
        r1=  Math.hypot(r1*weightIn1, r1*weightIn1)/a;
        g1 = Math.hypot(g1*weightIn1, g1*weightIn1)/a;
        b1 =  Math.hypot(b1*weightIn1, b1*weightIn1)/a;
        w1 = Math.hypot(w1, w1)/a;
        let [r2,g2,b2] = valueAtXY(jIn2, iIn2)
        let w2 = weightIn2;
        r2=  Math.hypot(r2*weightIn2, r2*weightIn2)/a;
        g2 = Math.hypot(g2*weightIn2, g2*weightIn2)/a;
        b2 =  Math.hypot(b2*weightIn2, b2*weightIn2)/a;
        w2 = Math.hypot(w2, w2);
        let [ra, ga, ba,wa] = [-1, -1, -1,-1]
        let [rb, gb, bb,wb] = [-1, -1, -1,-1]
        for (let i = yScale1; i >= yScale; i--) {
            for (let j = xScale1; j >= xScale; j--) {
                j = Math.min(Math.max(j,0),oldWidth-1)
                i =  Math.min(Math.max(i,0),oldHeight-1)
                const weight = Math.cos(weightConst1 *  Math.hypot((i-yScale)*a, (j-xScale)*a));
               let res = valueAtXY(j, i)

                r1 = Math.hypot((res[0] || 1) * weight, r1);
                g1 = Math.hypot((res[1] || 1) * weight, g1);
                b1 = Math.hypot((res[2] || 1) * weight, b1);
                w1 = Math.hypot(weight, w1);


            }
            ra = ra>0?Math.hypot(r1, ra)/a:Math.hypot(r1, r1)/a
            ga = ga>0?Math.hypot(g1, ga)/a:Math.hypot(g1, g1)/a
            ba = ba>0?Math.hypot(b1, ba)/a:Math.hypot(b1, b1)/a
            wa = wa>0?Math.hypot(w1, wa)/a:Math.hypot(w1, w1)/a
        }
        for (let i = yScale2; i <= yScale; i++) {
            for (let j = xScale2; j <= xScale; j++) {
                j = Math.min(Math.max(j,0),oldWidth-1)
                i =  Math.min(Math.max(i,0),oldHeight-1)
                const weight = Math.cos(weightConst2 * Math.hypot((i-yScale)*a, (j-xScale)*a));
              let res  = valueAtXY(j, i)

                r2 = Math.hypot((res[0] || 1) * weight, r2)/a;
                g2 = Math.hypot((res[1] || 1) * weight, g2)/a;
                b2 = Math.hypot((res[2] || 1) * weight, b2)/a;
                w2 = Math.hypot(weight, w2)/a;


            }
            rb = rb>0?Math.hypot(r2, rb)/a:Math.hypot(r2, r2)/a
            gb = gb>0?Math.hypot(g2, gb)/a:Math.hypot(g2, g2)/a
            bb = bb>0?Math.hypot(b2, bb)/a:Math.hypot(b2, b2)/a
            wb = wb>0?Math.hypot(w2, wb)/a:Math.hypot(w2, w2)/a
        }
       if(wa===0&&wb===0){wa=wb=1}
        return [Math.hypot(ra, rb) / Math.hypot(wa, wb), Math.hypot(ga, gb) / Math.hypot(wa, wb), Math.hypot(ba, bb) / Math.hypot(wa, wb)];
    }
    for (let y = 0; y < newHeight; y++) {

        for (let x = 0; x < newWidth; x++) {

            let [rNex, gNex, bNex] = oldPixelIterator(x, y);

            const pixelIndex = (y * newImageData.width + x) * 4;
            newImageData.data[pixelIndex] = rNex
            newImageData.data[pixelIndex + 1] = gNex
            newImageData.data[pixelIndex + 2] = bNex
            newImageData.data[pixelIndex + 3] = 255;


        }
    }
    return newImageData;
}
