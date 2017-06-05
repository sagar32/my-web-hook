var express = require('express');
var app = express();
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Hello Sagar...!");
});

app.post("/echo", function (req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'my-reg-bot'
    });
});

app.post("/getFirstName", function (req, res) {
    console.log(req.body.result.parameters.firstName);

    var returnText="allright,i get your firstname is " + req.body.result.parameters.firstName + ". Now please tell me your last name?";
     return res.json({
        speech: returnText,
        displayText: returnText,
        source: 'my-reg-bot'
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log("port listern at:" + server.address().port);
});