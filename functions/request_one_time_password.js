const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
    if (!req.body.phone) {
        return res.status(422).send({ error: "You must provide a phone number"});
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    //fetching user model
    admin.auth().getUser(phone)
        //called with user found in database
        .then(userRecord => {
            const code = Math.floor((Math.random() * 8999 + 1000));

            //code to text user
            twilio.messages.create({
                body: 'Your code is ' + code,
                to: phone,
                from: '+14692840191'
            }, (err) => {
                if (err) { return res.status(422).send(err); }

                //create new collection called users
                admin.database().ref('users/' + phone)
                    .update({ code: code, codeValid: true }, () => {
                        res.send({ succes: true });
                    });
            })
        })
        .catch((err) => {
            res.status(422).send({ error: err});
        })
}