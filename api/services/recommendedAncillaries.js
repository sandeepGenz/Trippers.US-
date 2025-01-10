const admin = require('firebase-admin');
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


module.exports = async function(req,res){ 
    let ancillaries = [];

    let targets = [];

    if(req.body.PNR.passengerCategory.SRC==true){
      targets.push("SRC");
    } 
    if(req.body.PNR.passengerCategory.CHD==true){
      targets.push("CHD");
    } 
    if(req.body.PNR.passengerCategory.WCHR==true){
      targets.push("WCHR");
    } 

    db.collection("ancillaries")
    .where('serviceCategory', 'array-contains-any', targets)
    .get()
      .then(querySnapshot => {
        if(!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                ancillaries.push(doc.data());
                }
            );
         
        }else{
            
        }

        res.status(200).send({ ancillaries: ancillaries });

      });
    }