const admin = require('firebase-admin');

module.exports = function(req, res) {
    //verify user
    //didn't send phone number
    if (!req.body.phone) {
        return res.status(422).send({ error: 'Bad Input' });
    }
    //format phone number to rmeove dashes and parens
    //turn into string
    //regex matches characters that are not digits, replaces with empty string
    const phone = String(req.body.phone).replace(/[^\d]/g, "");
    //create new user account with that phone number
    //access service account, service module, call createUser
    //phone treated as unique identifying token
    admin.auth().createUser({ uid: phone })
        .then(user => res.send(user))
        .catch(err => res.status(422).send({ error: err }));
    //respond to the user request, saying the account was made

}