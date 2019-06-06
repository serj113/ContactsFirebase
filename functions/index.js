const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();
const main = express();

main.use('/api', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

exports.api = functions.https.onRequest(main);

app.get('/contacts', async(request, response) => {
  try {
    var contactsRef = await db.collection('contacts').get();
    var contacts = [];
    contactsRef.forEach(contact => {
      var contactData = contact.data()
      contacts.push({
        id: contact.id,
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email
      });
    });
    response.status(200).json({
      status: 200,
      message: "success",
      data: contacts
    });
  } catch (error) {
      response.status(500).send(error);
  }
});

app.post('/contacts', async(request, response) => {
  try {
    var _a = request.body, name = _a.name, phone = _a.phone, email = _a.email;
    var data = {
      name: name,
      phone: phone,
      email: email
    };
    const ref = await db.collection('contacts').add(data);
    const contact = await ref.get();
    const contactData = contact.data()
    // var contacts = [];
    // contacts.push({
    //   id: contact.id,
    //   name: contactData.name,
    //   phone: contactData.phone,
    //   email: contactData.email
    // });
    response.status(200).json({
      status: 200,
      message: "success",
      data: [
        {
          id: ref.id,
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email
        }
      ]
    });
  } catch (error) {
      response.status(500).send(error);
  }
});