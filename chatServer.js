/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Namaste, I am Zenbot, your personal Buddha :)"); //We start with the introduction;
    setTimeout(timedQuestion, 3000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + '. May the peace be with you!'; // output response
    waitTime = 3000;
    question = 'How old are you?'; // load next question
  } else if (questionNum == 1) {
    answer = 'Really, ' + input + '. So young, you still have a lot of time to explore life! '; // output response
    waitTime = 5000;
    question = 'What do you want to do after grad school?'; // load next question
  } else if (questionNum == 2) {
    answer = 'Cool. I will help you make it happen.';
    waitTime = 3000;
    question = 'Now, have you ever felt down or stressed recently?'; // load next question
  } else if (questionNum == 3) {
    if (input.toLowerCase() === 'no' || input === 0) {
      answer = 'Man your life is too perfect. I suggest you visit Africa to experience more difficulty!';
      waitTime = 5000;
      question = 'The Africa ticket costs $999 (special discount)! Can I have your credit card number please?';
    } else if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'No worry, I am here to help. '
      question = 'The first step is to sign up for our meditation class ($399 only). Can I have your credit card number please?';
      waitTime = 3000;
    } else {
      question = 'Have you ever felt down or stressed recently?'; // load next question
      answer = 'Please just answer "yes" or "no". Buddihsm keeps life simple. Namaste!'
      questionNum--;
      waitTime = 5000;
    }
    // load next question
  } else if (questionNum == 4) {
    if (input.toLowerCase() === 'no' || input === 0) {
      answer = 'Well, it seems Buddhism is not for you. Good luck with Scientology then! I am out.';
      waitTime = 5000;
    } else if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'You are too naive my child. You should be  more responsible with your money. I am out.'
      waitTime = 5000;
    } else {
      question = 'Now, can I have your credit card number please?'; // load next question
      answer = 'Please just answer "yes" or "no". Buddhism keep life simple. Namaste!'
      questionNum--;
      waitTime = 5000;
    }
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
