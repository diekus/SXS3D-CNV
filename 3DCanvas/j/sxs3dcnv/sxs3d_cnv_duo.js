﻿//SXS 3D CNV DUO
//HTML5 S3D dual canvas drawing toolkit
// Author: diekus
//date of creation: 25/4/2013
//date of last modification: 23/9/2013
//This is pre-release code. It needs cleanup and structure. Working on it. 

//global variables
//var miCanvas = null;                  // jQuery object for canvas
var jsCanvas1 = null;                   // DOM element for first canvas
var jsCanvas2 = null;                   // DOM element for second canvas
var ctx1 = null;                        // first canvas drawing context
var ctx2 = null;                        // seconds canvas drawing context
var imgsPreloaded = true;               // specifies if the drawings on a canvas are ready to start [image preloading problems]
var resPreloaded = false; 
var listoBg = false;                    // specifies if the background image has being loaded
var imagesForDrawing = null;            //array that will contain the images that are needed for drawing


//starts the 3d canvas script
$(document).ready( function () {                   //addition of images in the html code
    //if images are required, they must be preloaded in the script that draws. The most exist in an array named imagesForDrawing
    if (imagesForDrawing == null)
        console.log('You must create an array to store the images!');
    else
        preloadImagesForDrawing(imagesForDrawing);
});


$(window).load(function () {            //once everything is loaded, including the images
    init('sxs3d_');
});

function init(prefix) {
    prepHTMLDoc();                       // clears default css properties of HTML elements

    var target = 'cnv';
    var clone = prefix + target;

    prep3DCanvas(target, clone);
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

//prepares and initializes canvases for side by side drawing
function prep3DCanvas(pCnvName1, pCnvName2) {
    jsCanvas1 = document.getElementById(pCnvName1);
    jsCanvas2 = document.getElementById(pCnvName2);
    //gets 2d drawing context for the canvases
    ctx1 = jsCanvas1.getContext('2d');
    ctx2 = jsCanvas2.getContext('2d');
    //deals with sizing issues
    jsCanvas1.width = jsCanvas1.width / 2;
    jsCanvas2.width = jsCanvas2.width / 2;
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

//begins a path (stereo)
function s3DBeginPath() {
    ctx1.beginPath();
    ctx2.beginPath();
}

//ends a path (stereo)
function s3DClosePath() {
    ctx1.closePath();
    ctx2.closePath();
}

//stereo lineTo
function s3DLineTo(pPosX, pPosY, pHorOffset) {
    ctx1.lineTo((pPosX + pHorOffset)/2, pPosY);
    ctx2.lineTo((pPosX - pHorOffset)/2, pPosY);
}

//stereo moveTo
function s3DMoveTo(pPosX, pPosY, pHorOffset) {
    ctx1.moveTo((pPosX + pHorOffset)/2, pPosY);
    ctx2.moveTo((pPosX - pHorOffset)/2, pPosY);
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
function s3DBezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY, pHorOffset) {

    ctx1.save();
    ctx1.translate(pHorOffset, 1);
    ctx1.scale(0.5, 1);
    ctx1.bezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY);
    ctx1.restore();

    ctx2.save();
    ctx2.translate(-1 * pHorOffset, 1);
    ctx2.scale(0.5, 1);
    ctx2.bezierCurveTo(pCP1X, pCP1Y, pCP2X, pCP2Y, pX, pY);
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
function duoLineCap(pLJoin) {
    ctx1.lineCap = pLJoin;
    ctx2.lineCap = pLJoin;
}

//performs a dual line width styling
function duoLineWidth(pLW) {
    ctx1.lineCap = pLW;
    ctx2.lineCap = pLW;
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
function duoclearRect(px, py, cWidth, cHeight) {
    ctx1.clearRect(px, py, cWidth, cHeight);
    ctx2.clearRect(px, py, cWidth, cHeight);
}

//sets a dual canvas stroke style
function duoLineJoin(pStyle) {
    ctx1.lineJoin = pStyle;
    ctx2.linJoin = pStyle;
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

  