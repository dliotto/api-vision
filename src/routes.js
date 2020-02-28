import { Router } from 'express';
import fs from 'fs';
import path from 'path';
//import * as tesseract from 'node-tesseract-ocr';
import tesseract from 'tesseract.js';
import vision from '@google-cloud/vision';
import { PredictionServiceClient, AutoMlClient  } from '@google-cloud/automl';
import fs from 'fs';


//video auxiliar: https://www.youtube.com/watch?v=BFOeM8ATWdk

const routes = new Router();

routes.get('/', async (req, res) => {
  /*
  const client = new vision.ImageAnnotatorClient({
    keyFilename: path.resolve(__dirname,'../','teste-de-texto-268018-884b76d715f2.json')
  });



  const img = 'farinha.jpg';

  // Performs label detection on the image file
  const [result] = await client.labelDetection(path.resolve(__dirname, '..', 'temp', 'uploads', img));
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));

  const [result2] = await client.textDetection(path.resolve(__dirname, '..','temp', 'uploads', img))
  const texts = result2.textAnnotations
  console.log("----------------");
  texts.forEach(text => console.log(text));

  const [result3] = await client.imageProperties(path.resolve(__dirname, '..', 'temp', 'uploads', img))
  //const texts3 = result3.imagePropertiesAnnotation.dominantColors.colors[0].color;
  const texts3 = result3;
  console.log("********************");
  console.log(texts3);

  return res.json({ message: texts[0].description });
*/


  /***Google AutoML***/

  const projectId = 'teste-de-texto-268018';
  const scoreThreshold = '0.8';
  const computeRegion = 'us-central1';
  const datasetName = 'myDataset';
  const modelName = 'myModel';
  const multiLabel = true;
  const datasetId = 'ICN3163877694274273280';
  const pathCsv = 'gs://api-automl/api.csv';
  const modelId = 'ICN8519029286147981312';
  let trainBudget = '50';


  const clientAuto = new AutoMlClient({
    keyFilename: path.resolve(__dirname,'../','teste-de-texto-268018-884b76d715f2.json')
  });

  /*
  //CRIAR DATA SET

  const projectLocation = clientAuto.locationPath(projectId, computeRegion);
  let classificationType = `MULTICLASS`;
  if (multiLabel) {
    classificationType = `MULTILABEL`;
  }

  const datasetMetadata = {
    classificationType: classificationType,
  };

  const myDataset = {
    displayName: datasetName,
    imageClassificationDatasetMetadata: datasetMetadata,
  };

  const [dataset] = await clientAuto.createDataset({
    parent: projectLocation,
    dataset: myDataset,
  });

  console.log(`Dataset name: ${dataset.name}`);
  console.log(`Dataset id: ${dataset.name.split(`/`).pop(-1)}`);
  console.log(`Dataset display name: ${dataset.displayName}`);
  console.log(`Dataset example count: ${dataset.exampleCount}`);
  console.log(`Image Classification type:`);
  console.log(
    `\t ${dataset.imageClassificationDatasetMetadata.classificationType}`
  );
  console.log(`Dataset create time:`);
  console.log(`\tseconds: ${dataset.createTime.seconds}`);
  console.log(`\tnanos: ${dataset.createTime.nanos}`);

  //FIM CRIAR DATA SET
  */


//IMPORTAR IMAGENS PARA O CONJUNTO DE DADOS
//Required Location: us-central1, required location type: Region, required storage class: Standard.
/*
  const datasetFullId = clientAuto.datasetPath(projectId, computeRegion, datasetId);

  const inputUris = pathCsv.split(`,`);
  const inputConfig = {
    gcsSource: {
      inputUris: inputUris,
    },
  };

  try{
  const [operation] = await clientAuto.importData({
    name: datasetFullId,
    inputConfig: inputConfig,
  });
  console.log(`Processing import...`);

  const [, , response] = await operation.promise();

  if (response.done) {
    console.log(`Data imported.`);
  }

  console.log(response);
  console.log('---------------------------');
}catch(err){
  console.log(err);
}
*/

//https://console.cloud.google.com/vision/datasets/ICN3163877694274273280/images?project=teste-de-texto-268018
//https://console.cloud.google.com/storage/browser/api-vision-hart?project=teste-de-texto-268018
//----------------------FIM IMPORTAR IMAGENS PARA O CONJUNTO DE DADOS



  //-----------------------CRIAR MODELO DE TREINAMENTO
  //https://cloud.google.com/vision/automl/docs/tutorial?hl=pt-br
  /*const projectLocation = clientAuto.locationPath(projectId, computeRegion);

  if (trainBudget === 0) {
    trainBudget = {};
  } else {
    trainBudget = {trainBudget: trainBudget};
  }

  const myModel = {
    displayName: modelName,
    datasetId: datasetId,
    imageClassificationModelMetadata: trainBudget,
  };

  const [operation2, initialApiResponse] = await clientAuto.createModel({
    parent: projectLocation,
    model: myModel,
  });
  console.log(`Training operation name: `, initialApiResponse.name);
  console.log(`Training started...`);

  if( operation2 ){
    const [model] = await operation2.promise();

    if( model ){
      let deploymentState = ``;
      if (model.deploymentState === 1) {
        deploymentState = `deployed`;
      } else if (model.deploymentState === 2) {
        deploymentState = `undeployed`;
      }

      console.log(`Model name: ${model.name}`);
      console.log(`Model id: ${model.name.split(`/`).pop(-1)}`);
      console.log(`Model display name: ${model.displayName}`);
      console.log(`Model create time:`);
      console.log(`\tseconds: ${model.createTime.seconds}`);
      console.log(`\tnanos: ${model.createTime.nanos}`);
      console.log(`Model deployment state: ${deploymentState}`);
    }
  }*/
  //FIM MODELO DE TREINAMENTO

//https://console.cloud.google.com/vision/datasets/ICN3163877694274273280/train?project=teste-de-texto-268018
//https://cloud.google.com/vision/automl/docs/tutorial?hl=pt-br

  const predictionServiceClient = new PredictionServiceClient({
    keyFilename: path.resolve(__dirname,'../','teste-de-texto-268018-884b76d715f2.json')
  });

  const modelFullId = predictionServiceClient.modelPath(
    projectId,
    computeRegion,
    modelId
  );

  const content = fs.readFileSync(path.resolve(__dirname, '..','temp', 'uploads', 'garrafa6.jpeg'), `base64`);
  let params = {};
  if (scoreThreshold) {
    params = {
      score_threshold: scoreThreshold,
    };
  }

  // Set the payload by giving the content and type of the file.
  const payload = {
    image: {
      imageBytes: content,
    },
  };

  // params is additional domain-specific parameters.
  // currently there is no additional parameters supported.
  const [response] = await predictionServiceClient.predict({
    name: modelFullId,
    payload: payload,
    params: params,
  });


  if( response.payload.find( atributo => atributo.displayName === 'garrafa') || response.payload.find( atributo => atributo.displayName === 'garrafas') ){
    console.log(`Predições:`);
    for (const result of response.payload) {
      /*console.log(`\nPredicted class name:  ${result.displayName}`);
      console.log(
        `Predicted class score:  ${result.imageObjectDetection}`
      );*/
      console.log(`\nAtributo:  ${result.displayName}`);
      console.log(`Acurácia:  ${Math.round(result.classification.score * 100, 2)}%\n`);
    }
  }else{
    console.log('Não contem garrafa na imagem');
  }

  return true;

});

//pode utilizar tambem export default routes;
//module.exports = routes;
export default routes;
