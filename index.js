var apiai = require('apiai');
var builder = require('botbuilder');
var restify = require('restify'); 
var apiairecognizer = require('api-ai-recognizer');

var app = apiai("aaddfbbeda9c4087b0cae79a896e6a03");

var options = {
    sessionId: '12345'
};

// Setup Restify Server
var server = restify.createServer();  
server.listen(process.env.port || process.env.PORT || 3978, function () {  
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({  
    //appId: 'b5092823-73e8-4e4c-b1c5-a26e11c7aa24',
    //appPassword: 'tkknFAtXiAHXp8JT4QdEgEK'
});

server.post('/api/messages', connector.listen());


var bot = new builder.UniversalBot(connector, function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     var attachment = msg.attachments[0];
        // session.send({
        //     text: "You sent:",
        //     attachments: [
        //         {
        //             contentType: attachment.contentType,
        //             contentUrl: attachment.contentUrl,
        //             name: attachment.name
        //         }
        //     ]
        // });


	var myPythonScriptPath = 'doc_generator.py';

	// Use python shell
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell(myPythonScriptPath);

	pyshell.on('message', function (message) {
	    // received a message sent from the Python script (a simple "print" statement)
	   console.log(message);
	   var mammoth = require("mammoth");
 
		mammoth.convertToHtml({path: "generated_document.docx"})
    	.then(function(result){
        	var html = result.value; // The generated HTML
        	var messages = result.messages; // Any messages, such as warnings during conversion
        	console.log(html);

        	var fs = require('fs');
			fs.writeFile("test.html", result.value, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("The file was saved!");
				}); 
			})
			.done();
			});

        	pyshell.end(function (err) {
    	    if (err){
    	    	console.log(err.message)
    	        throw err;
    	    };

    	    console.log('finished');
	   });

    } else {
        // Echo back users text
        session.send("You said: %s", session.message.text);
    }
});


//var bot = new builder.UniversalBot(connector, { persistConversationData: true });

// var bot = new builder.UniversalBot(connector, function (session) {
//     var msg = session.message;
//     if (msg.attachments && msg.attachments.length > 0) {
//      // Echo back attachment
//      var attachment = msg.attachments[0];
//         session.send({
//             text: "You sent:",
//             attachments: [
//                 {
//                     contentType: attachment.contentType,
//                     contentUrl: attachment.contentUrl,
//                     name: attachment.name
//                 }
//             ]
//         });
//     } else {
//         // Echo back users text
//         session.send("You said: %s", session.message.text);
//     }
// });


// recognizer
var recognizer = new apiairecognizer('aaddfbbeda9c4087b0cae79a896e6a03');
//var intents = new builder.IntentDialog({ recognizers: [recognizer] }); bot.dialog('/',function(session){ session.send("You said %s",session.message.text); });

