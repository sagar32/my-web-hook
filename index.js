var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
// var request = require('request');
var apiCall = require('req-fast');


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
    sid = req.sessionID;
    var result = req.body.result;
    var speech = "Seems like some problem. Speak again.";
    var messages = [];
    if (result.contexts[0].name == 'usertype' && result.action == "i_am") {
        mySession.userType = result.contexts[0].parameters.userType;
        speech = "What do you want to know about glasssquid.io?";
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'glasssquid_faq'
        });
    }


    try {
        /**
         * if userType not available
         */
        // if (!mySession.userType) {
        //     speech = "are you employer or talent?";
        //     return res.json({
        //         speech: speech,
        //         displayText: speech,
        //         source: 'glasssquid_faq'
        //     });

        // }

        /**
        * if user type Talent
        */
        if (mySession.userType == 'Talent') {
            speech = "talent bot call";
            var text = result.resolvedQuery;
            var options = {
                url: 'https://api.api.ai/v1/query?v=20150910&query=' + text + '&lang=en&sessionId=1234567890',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer c594a86ef69346ddb7e410631f9603d7'
                }
            }

            apiCall(options, (err, resp) => {
                console.log(resp.body);
                if (resp.body && resp.body.result && resp.body.result.fulfillment) {
                    return res.json(resp.body.result.fulfillment);
                }
            });
            // request({
            //     url: "https://api.api.ai/v1/query?v=20150910",
            //     method: 'POST',
            //     json: {
            //         query: text,
            //         lang: "en",
            //         sessionId: "abcdefghijklmn123456789"
            //     },
            //     headers: { "Authorization": "Bearer c594a86ef69346ddb7e410631f9603d7" }
            // }, function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         console.log(body)
            //         if (body && body.result && body.result.fulfillment) {
            //             return res.json(body.result.fulfillment);
            //         }
            //     }
            // });

        }
        /**
         * else if user Employer
         */
        else if (mySession.userType == 'Employer') {
            speech = "employer bot call";
            var text = result.resolvedQuery;
            var options = {
                url: 'https://api.api.ai/v1/query?v=20150910&query=' + text + '&lang=en&sessionId=1234567890',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer 373788d7794e4493bb15560d19efda3f'
                }
            }
            apiCall(options, (err, resp) => {
                console.log(resp.body);
                if (resp.body && resp.body.result && resp.body.result.fulfillment) {
                    return res.json(resp.body.result.fulfillment);
                }
            });
            // request({
            //     url: "https://api.api.ai/v1/query?v=20150910",
            //     method: 'POST',
            //     json: {
            //         query: text,
            //         lang: "en",
            //         sessionId: "abcdefghijklmn123456789"
            //     },
            //     headers: { "Authorization": "Bearer 373788d7794e4493bb15560d19efda3f" }
            // }, function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         console.log(body)
            //         if (body && body.result && body.result.fulfillment) {
            //             return res.json(body.result.fulfillment);
            //         }

            //     }
            // });

        }
    }
    catch (err) {
        speech = "Seems like some problem. Speak again.";
    }
    finally {
        // if (messages.length > 0) {
        //     return res.json({
        //         speech: messages[0].speech,
        //         messages: messages,
        //         source: 'glasssquid_faq'
        //     });
        // } else {
        //     return res.json({
        //         speech: speech,
        //         displayText: speech,
        //         source: 'glasssquid_faq'
        //     });
        // }
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