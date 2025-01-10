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
  db.collection("users")
  .where('personal_data.email', '==', req.tokenpayload.email)
  .get()
    .then(querySnapshot => {
      if(!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data()
        
        console.log(user.personal_data.email);
      if (user != null) {
        user.update({'category': req.body.category});
      }
      }else{
        res.status(401).send({ result: "No user with this email" });
      }
    });
    }