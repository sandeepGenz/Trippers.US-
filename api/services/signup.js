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
    let snapshot = await db.collection("users")
    .where('personal_data.email', '==', req.body.email)
    .count().get();

    if(snapshot.data().count>0){
        res.status(500).send({ result: "Account already exists" });
    }else{
        bcrypt.hash(req.body.password, 10).then((hashedPass) => {
            let user = {
              personal_data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
              },
              
            };
            db.collection("users")
              .add(user)
              .then((result) => {
                res.status(200).send({ result: "Created successfully" });
                })
              .catch((error) => {
                res.status(500).send({ result: "An error ocurred" });
              });
          });
        }
    }
      
