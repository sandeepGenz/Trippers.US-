const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../../inclusivacay-f2184-e597cea5f879.json');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


if (!admin.apps.length) {
  initializeApp({
      credential: cert(serviceAccount),
  });
}

const db = getFirestore();

module.exports = async function(req,res){ 
    

    db.collection("users")
    .where('personal_data.email', '==', req.body.email.toLowerCase())
    .get()
      .then(querySnapshot => {
        if(!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data()
          
          console.log(user.personal_data.email);
        if (user != null) {
          bcrypt.compare(
            req.body.password,
            user.personal_data.password,
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send({ result: "Internal server error" });
              }

              if (!result) {
                res.status(401).send({ result: "Incorrect password" });
              } else {
                const token = jwt.sign(
                  {
                    email: user.personal_data.email,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "2d" }
                );
                res.status(200).send({ result: token });
              }
            }
          );
        } else {
          res.status(401).send({ result: "No user with this email" });
        }
        }
      });
    }