const twilio = require('twilio');

const accountSid= 'ACa210fa9bf9957981dc1a9d9450f4e045';
const authToken = 'da326672bb3d9a21eb337ac3815b40f8';

module.exports = new twilio(accountSid, authToken);