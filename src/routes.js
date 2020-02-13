import { Router } from 'express';
import fs from 'fs';
import path from 'path';
//import * as tesseract from 'node-tesseract-ocr';
import tesseract from 'tesseract.js';
import vision from '@google-cloud/vision';


//video auxiliar: https://www.youtube.com/watch?v=BFOeM8ATWdk

const routes = new Router();

routes.get('/', async (req, res) => {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: path.resolve(__dirname,'../','teste-de-texto-268018-884b76d715f2.json')
  });

  // Performs label detection on the image file
  const [result] = await client.labelDetection(path.resolve(__dirname,'2.jpeg'));
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));

  const [result2] = await client.textDetection(path.resolve(__dirname,'2.jpeg'))
  const texts = result2.textAnnotations
  console.log("----------------");
  texts.forEach(text => console.log(text));

  const [result3] = await client.imageProperties(path.resolve(__dirname,'2.jpeg'))
  //const texts3 = result3.imagePropertiesAnnotation.dominantColors.colors[0].color;
  const texts3 = result3;
  console.log("********************");
  console.log(texts3);



  return res.json({ message: "Teste" });
});

//pode utilizar tambem export default routes;
//module.exports = routes;
export default routes;
