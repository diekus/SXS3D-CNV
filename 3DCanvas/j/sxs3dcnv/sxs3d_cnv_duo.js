﻿//SXS 3D CNV DUO
//HTML5 S3D dual canvas drawing toolkit
//Author: diekus
//date of creation: 25/4/2013
//date of last modification: 20/03/2014
//This is pre-release code. It needs cleanup and structure. Working on it. 
/*Can manage now several sets of canvases on a page!*/

//global variables
var jsCanvas1 = null;                   // DOM element for first ACTIVE canvas
var jsCanvas2 = null;                   // DOM element for second ACTIVE canvas
var ctx1 = null;                        // first ACTIVE canvas drawing context
var ctx2 = null;                        // second ACTIVE canvas drawing context
var jsCanvases = null;                  // DOM canvas elements for each canvas to be drawn on
var imgsPreloaded = true;               // specifies if the drawings on a canvas are ready to start [image preloading problems]
var imagesForDrawing = null;            //array that will contain the images that are needed for drawing
var activeDrawingCanvas = -1;           // specifies the ACTIVE drawing canvas
var canvasNames = new Array();          // array that contains the names of the canvases that will be drawn upon. Layers of canvases

//starts the 3d canvas script
function startDuoCanvas(){
    //if images are required, they must be preloaded in the script that draws. The most exist in an array named imagesForDrawing
    if (imagesForDrawing == null)
        console.log('You must create an array to store the images!');
    else
        preloadImagesForDrawing(imagesForDrawing);
    init('sxs3d_');
}

function init() {
    prepHTMLDoc(); // clears default css properties of HTML elements
    //prepares all the canvases on the document
    jsCanvases = new Array(canvasNames.length);
    for (icnv = 0; icnv < canvasNames.length; icnv = icnv + 2) {
        console.log('preparing canvas ' + canvasNames[icnv] + ' clone');
        jsCanvases[icnv] = prep3DCanvas(canvasNames[icnv], 'sxs3d_' + canvasNames[icnv]); //at this point we have an array with subarrays of 4. (canvas and clone, ctx and clone)
    }
    changeActiveCtx(0); // first *SET* canvas (0 and 1)

    //main 
    sxs3dcnv_main();
}

//preloads images and hides them in html code to be available immediately for drawing
function preloadImagesForDrawing(arrImgs) {
    var ind = 1;
    $.each(arrImgs, function (ind, src) {
        $("body").prepend("<img class='img-src-preload' id='img_" + ind + "' src='" + src + "' />");
        $('.img-src-preload').css('display', 'none');
        ind++;
    });
}

//prepares the html document to acomodate a side by side experience
function prepHTMLDoc() {
    $('body').css(
        {
            'margin': '0',
            'padding': '0',
            'border': '0',
            'outline': '0',
            'font-size': '0',
            'vertical-align': 'baseline',
            'background': 'transparent'
        });
}

//prepares and initializes canvases for side by side drawing.
//returns an array with both canvases
function prep3DCanvas(pCnvName1, pCnvName2) {
    var tjsCanvas1 = document.getElementById(pCnvName1);
    var tjsCanvas2 = document.getElementById(pCnvName2);
    //gets 2d drawing context for the canvases
    var tctx1 = tjsCanvas1.getContext('2d');
    var tctx2 = tjsCanvas2.getContext('2d');
    //deals with sizing issues
    tjsCanvas1.width = tjsCanvas1.width / 2;
    tjsCanvas2.width = tjsCanvas2.width / 2;
    var objTCanvas = new Array(4);
    objTCanvas[0] = tjsCanvas1;                     //original canvas
    objTCanvas[2] = tjsCanvas2;                     //clone canvas
    objTCanvas[1] = tctx1;                          //original context
    objTCanvas[3] = tctx2;                          //clone context
    return objTCanvas;
}

//changes the active *SET* of drawing context. By default it is the first canvas in the array
function changeActiveCtx(n) {
    try {
        if (n < jsCanvases.length) {
            jsCanvas1 = jsCanvases[n][0];
            jsCanvas2 = jsCanvases[n][2];
            this.ctx1 = this.jsCanvases[n][1];
            this.ctx2 = this.jsCanvases[n][3];
            this.activeDrawingCanvas = n;
        }
        else {
            jsCanvas1 = jsCanvases[0][0];
            jsCanvas2 = jsCanvases[0][2];
            this.ctx1 = this.jsCanvases[0][1];
            this.ctx2 = this.jsCanvases[0][3];
            this.activeDrawingCanvas = 0;
        }
    } catch (e) {
        console.log('current drawing context nonexistent.');
    }
}

//converts from degrees to radians
function deg2Rad(degrees) {
    return degrees * Math.PI / 180;
}

//performs a dual canvas save
function duoSave() {
    ctx1.save();
    ctx2.save();
}

//performs a dual canvas restores
function duoRestore() {
    ctx1.restore();
    ctx2.restore();
}

//draws an image
/*
ATTENTION: In order to draw an image, these most be preloaded first due to downloading latency. The way this is implemented to make sure they are already in the browser is to create them in <img> tags and hide them.
Use the preloadImgs method to get them into the webpage.
*/
function s3DImage(pImg, pPosX, pPosY, pHorOffset) {
    duoSave();
    ctx1.scale(0.5, 1);
    ctx2.scale(0.5, 1);
    ctx1.drawImage(pImg, pPosX + pHorOffset, pPosY);
    ctx2.drawImage(pImg, pPosX - pHorOffset, pPosY);
    duoRestore();
}

//draws an image from a url. Depending on loading times drawing operations might be faster on the canvas. It is recomended to use s3DImage
function s3DImageFromURL(pSrc, pPosX, pPosY, pHorOffset) {
    duoSave();
    ctx1.scale(0.5, 1);
    ctx2.scale(0.5, 1);
    //loads the bg image
    img = new Image();
    img.onload = function () {
        //draws the image
        ctx1.drawImage(this, pPosX + pHorOffset, pPosY);
        ctx2.drawImage(this, pPosX - pHorOffset, pPosY);
    };
    img.src = pSrc;
    duoRestore();
}

//draws a s3d rectangle
function s3DRectangle(pPosX, pPosY, pAncho, pAlto, pHorOffset) {
    //draw original rect with width modification
    ctx1.fillRect((pPosX + pHorOffset) / 2, pPosY, pAncho / 2, pAlto);
    //draw clone
    ctx2.fillRect((pPosX - pHorOffset) / 2, pPosY, pAncho / 2, pAlto);
}

//draws a s3d circle
function s3DCircle(pPosX, pPosY, pRadius, pHorOffset) {
    ctx1.scale(0.25, 0.5);
    ctx1.beginPath();
    ctx1.arc((pPosX + pHorOffset) * 2, pPosY * 2, pRadius * 2, 0, 2 * Math.PI, true);
    ctx1.fill();
    ctx1.restore();
    ctx1.closePath();

    ctx2.scale(0.25, 0.5);
    ctx2.beginPath();
    ctx2.arc((pPosX - pHorOffset) * 2, pPosY * 2, pRadius * 2, 0, 2 * Math.PI, true);
    ctx2.fill();
    ctx2.restore();
    ctx2.closePath();
}

//begins a path (stereo) this path should have it's own shift
function s3DBeginPath(pHorOffset) {
    duoSave();
    ctx1.translate(pHorOffset, 0);
    ctx1.beginPath();
    ctx2.translate(-pHorOffset,0);
    ctx2.beginPath();
}

//ends a path (stereo)
function s3DClosePath() {
    ctx1.closePath();
    ctx2.closePath();
    duoRestore();
}

//stereo lineTo
function s3DLineTo(pPosX, pPosY) {
    ctx1.lineTo((pPosX)/2, pPosY);
    ctx2.lineTo((pPosX)/2, pPosY);
}

//stereo moveTo
function s3DMoveTo(pPosX, pPosY) {
    ctx1.moveTo((pPosX)/2, pPosY);
    ctx2.moveTo((pPosX)/2, pPosY);
}
//stereo stroke
function s3DStroke() {
    ctx1.stroke();
    ctx2.stroke();
}

//stereo fill
function s3DFill() {
    ctx1.fill();
    ctx2.fill();
}

//sets the stereo color
function duoSetStyle(pFill, pStroke) {
    ctx1.fillStyle = pFill;
    ctx2.fillStyle = pFill;
    ctx1.strokeStyle = pStroke;
    ctx2.strokeStyle = pStroke;
}

//draws a s3d arc
function s3DArc(pPosX, pPosY, pRadius, pStartAngle, pEndAngle, pDirection, pHorOffset) {

    ctx1.scale(0.5, 0.5);
    ctx1.arc(pPosX + pHorOffset, pPosY*2 , pRadius , pStartAngle, pEndAngle, pDirection);
    ctx1.restore();

    ctx2.scale(0.5, 0.5);
    ctx2.arc(pPosX - pHorOffset, pPosY*2 , pRadius , pStartAngle, pEndAngle, pDirection);
    ctx2.restore();
}

//draws s3d text
function s3DText(pText, pFontStyle, pIsFilled, pPosX, pPosY, pHorOffset) {
    ctx1.font = pFontStyle;

    ctx2.font = pFontStyle;

    ctx1.save();

    //set left clipping
    ctx1.scale(0.25, 0.5);
    //draw original
    if (pIsFilled)
        ctx1.fillText(pText, pPosX + pHorOffset, pPosY);
    else
        ctx1.strokeText(pText, pPosX + pHorOffset, pPosY);
    ctx1.restore();

    //set right clipping
    ctx2.scale(0.25, 0.5);
    //draw clone
    if (pIsFilled)
        ctx2.fillText(pText, pPosX - pHorOffset, pPosY);
    else
        ctx2.strokeText(pText, pPosX - pHorOffset, pPosY);

    ctx1.restore();
}

//draws stereo bezier curve
function s3DBezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY) {

    ctx1.save();
    ctx1.scale(0.5, 1);
    ctx1.bezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY);
    ctx1.restore();

    ctx2.save();
    ctx2.scale(0.5, 1);
    ctx2.bezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY);
    ctx2.restore();
}

//draws stereo quadratic bezier curve
function s3DQuadraticCurveTo(pCPX, pCPY, pX, pY){
    ctx1.save();
    ctx1.scale(0.5, 1);
    ctx1.quadraticCurveTo(pCPX, pCPY, pX, pY);
    ctx1.restore();

    ctx2.save();
    ctx2.scale(0.5, 1);
    ctx2.quadraticCurveTo(pCPX, pCPY, pX, pY);
    ctx2.restore();
}

//performs a dual canvas clipping
function duoClip() {
    ctx1.clip();
    ctx2.clip();
}

//performs a dual line cap styling
function duoLineCap(pLCap) {
    ctx1.lineCap = pLCap;
    ctx2.lineCap = pLCap;
}

//performs a dual line join styling
function duoLineJoin(pLJoin) {
    ctx1.lineJoin = pLJoin;
    ctx2.lineJoin = pLJoin;
}

//performs a dual line width styling
function duoLineWidth(pLW) {
    ctx1.lineWidth = pLW;
    ctx2.lineWidth = pLW;
}

//performs a dual mitter limit styling
function duoMiterLimit(pML) {
    ctx1.miterLimit = pML;
    ctx2.miterLimit = pML;
}

//performs a dual canvas translate
function duoTranslate(pX, pY) {
    ctx1.translate(pX, pY);
    ctx2.translate(pX, pY);
}

//performs a dual canvas scale
function duoScale(pX, pY) {
    ctx1.scale(pX, pY);
    ctx2.scale(pX, pY);
}

//performs a dual canvas fill
function duoFill() {
    ctx1.fill();
    ctx2.fill();
}

//performs a dual canvas stroke
function duoStroke() {
    ctx1.stroke();
    ctx2.stroke();
}

//sets a dual canvas fill style
function duoFillStyle(pStyle) {
    ctx1.fillStyle = pStyle;
    ctx2.fillStyle = pStyle;
}

//sets a dual canvas stroke style
function duoStrokeStyle(pStyle) {
    ctx1.strokeStyle = pStyle;
    ctx2.strokeStyle = pStyle;
}

//clears both canvases
function duoClearRect(px, py, cWidth, cHeight) {
    ctx1.clearRect(px, py, cWidth, cHeight);
    ctx2.clearRect(px, py, cWidth, cHeight);
}

//sets a dual canvas line style definition
function duoLineStyleDef(pWidth, pCap, pJoin, pMiter) {
    ctx1.lineWidth = pWidth;
    ctx2.lineWidth = pWidth;
    ctx1.lineCap = pCap;
    ctx2.lineCap = pCap;
    ctx1.lineJoin = pJoin;
    ctx2.lineJoin = pJoin;
    ctx1.miterLimit = pMiter;
    ctx2miterLimit = pMiter;
}
