const admin = require('firebase-admin');
const axios = require('axios');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../../inclusivacay-f2184-e597cea5f879.json');
const bcrypt = require("bcrypt");

if (!admin.apps.length) {
  initializeApp({
      credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const predictionServerUrl = 'https://916f-111-93-145-174.in.ngrok.io/ml';
const scraperServerUrl = 'https://916f-111-93-145-174.in.ngrok.io/check';


function compareKFscore( a, b ) {
    if ( a.scores.KFscore > b.scores.KFscore ){
      return -1;
    }
    if ( a.scores.KFscore < b.scores.KFscore ){
      return 1;
    }
    return 0;
  }


  function compareSCscore( a, b ) {
    if ( a.scores.SCscore > b.scores.SCscore ){
      return -1;
    }
    if ( a.scores.SCscore < b.scores.SCscore ){
      return 1;
    }
    return 0;
}

  
function compareLMscore( a, b ) {
    if ( a.scores.LMscore > b.scores.LMscore ){
      return -1;
    }
    if ( a.scores.LMscore < b.scores.LMscore ){
      return 1;
    }
    return 0;
}

module.exports = async function(req,res){ 
    let attractionsList = [];
    db.collection("attractions")
    .where('city', '==', req.body.PNR.destination)
    .get()
      .then(querySnapshot => {
        if(!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                let attraction = doc.data();
                attractionsList.push({
                    "name": attraction.name,
                    "popularMentions": attraction.tags,
                    "attractionType": attraction.attractionType,
                    "restaurantsNearby": attraction.restaurantsNearby,
                    "attractionsNearby": attraction.attractionsNearby
                });
                }
            );

         
        if(req.body.PNR.passengerCategory.WCHR==true){
          attractionsList.sort(compareLMscore);
      }else if(req.body.PNR.passengerCategory.SRC==true){
          attractionsList.sort(compareSCscore);
      }else if(req.body.PNR.passengerCategory.CHD==true){
          attractionsList.sort(compareLMscore);
      }

      res.status(200).send({ attractions: attractionsList });
        }else{
            
            axios.post(scraperServerUrl, {
              "city": req.body.PNR.destination
            })
            .then(response => {
              console.log(response.data.list);
console.log("got from scraper");
              for(var attractionData in response.data.list){
                let att = {
                  "name": attractionData.name,
                  "attractionType": attractionData.attractionType,
                  "attractionsNearby": attractionData.attraction,
                  "restaurantsNearby": attractionData.restaurant,
                  "city": req.body.PNR.destination,
                  "popularMentions": attractionData.ratings
                };
                axios.post(predictionServerUrl, {
                  "attractionType" : att.attractionType,
                  "attractionsNearby": att.attractionsNearby,
                  "restaurentsNearby" : att.restaurantsNearby
                })
            .then(response => {
                    console.log(response.data);
                    /*let attraction = {
                        "city": "Bangalore",
                        "name": "Vishnu Temple",
                        "popularMentions": ["devotion", "must visit", "peaceful"],
                        "attractionType": "WORHSIP",
                        "restaurantsNearby": 56,
                        "attractionsNearby": 45,
                        "scores": {
                            "KFscore": response.data.KFscore,
                            "LMscore": response.data.LMscore,
                            "SCscore": response.data.SCscore
                        }
                    }  */ 
                    att.scores.KFscore = response.data.KFscore;
                    att.scores.LMscore = response.data.LMscore;
                    att.scores.SCscore = response.data.SCscore;
                    
                    db.collection("attractions")
              .add(att)
              .then((result) => {
                console.log("Added to DB successfully");
                })
              .catch((error) => {
                res.status(500).send({ result: "An error ocurred" });
              });
            attractionsList.push({
                "name": att.name,
                "popularMentions": att.popularMentions,
                "attractionType": att.attractionType,
                "restaurantsNearby": "Roughly "+att.restaurantsNearby+" within one km radius",
                "attractionsNearby": "Roughly "+att.attractionsNearby+" within one km radius",
                "scores": {
                  "KFscore": att.scores.KFscore,
                  "LMscore": att.scores.LMscore,
                  "SCscore": att.scores.SCscore
                }
            });
            })
            .catch(error => {
                    console.log(error);
            });

              }
              
              
        if(req.body.PNR.passengerCategory.WCHR==true){
          attractionsList.sort(compareLMscore);
      }else if(req.body.PNR.passengerCategory.SRC==true){
          attractionsList.sort(compareSCscore);
      }else if(req.body.PNR.passengerCategory.CHD==true){
          attractionsList.sort(compareLMscore);
      }

      res.status(200).send({ attractions: attractionsList });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ result: "An error ocurred" });

        });
        }


      });
    }