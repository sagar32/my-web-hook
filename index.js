var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'glassq' }));

var mySession;
var sid;

app.get('/', function (req, res) {
    res.send("Hello Sagar...!");
});
app.post("/talent_employer", function (req, res) {
    mySession = req.session;
    sid = req.body.sessionId;
    var result = req.body.result;
    var getKey = 0;
    result.contexts.map(function (val, key) {
        if (val.name == "usertype") {
            getKey = key;
        }
    });
    console.log(getKey);
    var speech = "Seems like some problem. Speak again.";
    var messages = [];
    if (result.contexts[getKey].name == 'usertype' && result.action == "i_am") {
        mySession.userType = result.contexts[getKey].parameters.userType;
        speech = "What do you want to know about glasssquid.io?";
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'glasssquid_faq'
        });
    }
    /**
    * if user type Talent
    */
    else if (mySession.userType == 'Talent') {
        speech = "talent bot call";
        var text = result.resolvedQuery;
        request({
            url: "https://api.api.ai/v1/query?v=20150910",
            method: 'POST',
            json: {
                query: text,
                lang: "en",
                sessionId: sid
            },
            headers: { "Authorization": "Bearer c594a86ef69346ddb7e410631f9603d7" }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                if (body && body.result && body.result.fulfillment) {
                    return res.json(body.result.fulfillment);
                }
            }
        });
    }
    /**
     * else if user Employer
     */
    else if (mySession.userType == 'Employer') {
        speech = "employer bot call";
        var text = result.resolvedQuery;
        request({
            url: "https://api.api.ai/v1/query?v=20150910",
            method: 'POST',
            json: {
                query: text,
                lang: "en",
                sessionId: sid
            },
            headers: { "Authorization": "Bearer 373788d7794e4493bb15560d19efda3f" }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                if (body && body.result && body.result.fulfillment) {
                    return res.json(body.result.fulfillment);
                }

            }
        });
    } else {
        speech="May i know, you are talent or employer?"
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'glasssquid_faq'
        });
    }
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

    var returnText = "allright,i get your firstname is " + req.body.result.parameters.firstName + ". Now please tell me your last name?";
    return res.json({
        speech: returnText,
        displayText: returnText,
        source: 'my-reg-bot'
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log("port listern at:" + server.address().port);
});