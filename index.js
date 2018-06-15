const alexaSDK = require('alexa-sdk');
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');

const appId = 'REPLACE WITH YOUR SKILL APPLICATION ID';
const feedbackTable = 'fBack';
const docClient = new awsSDK.DynamoDB.DocumentClient();

// convert callback style functions to promises
const dbScan = promisify(docClient.scan, docClient);
const dbGet = promisify(docClient.get, docClient);
const dbPut = promisify(docClient.put, docClient);
const dbDelete = promisify(docClient.delete, docClient);


const instructions = `Welcome to Feedback form  <break strength="medium" /> 
                      We will be asking you some questions about our service.
					  kindly say Start Feedbak to Continue`;

const handlers = {

  /**
   * Triggered when the user says "Alexa, open Feedback.
   */
  'LaunchRequest'() {
    this.emit(':ask', instructions);
  },

  /**
   * Adds a recipe to the current user's saved recipes.
   * Slots: questionA, questionB, questionC
   */
  'GetFeedback'() {
    const { userId } = this.event.session.user;
    const { slots } = this.event.request.intent;

    // prompt for slot values and request a confirmation for each

	//questionZ
	if (!slots.questionz.value) {
      const slotToElicit = 'questionZ';
      const speechOutput = 'Please tell your Phone number digit by digit.';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.questionA.confirmationStatus !== 'CONFIRMED') {

      if (slots.questionA.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'questionZ';
        const speechOutput = `Was your response ${slots.questionz.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'questionZ';
      const speechOutput = 'Please tell your Phone number digit by digit.';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // questionA
    if (!slots.questionA.value) {
      const slotToElicit = 'questionA';
      const speechOutput = 'Rate our service on the scale of one to five.';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.questionA.confirmationStatus !== 'CONFIRMED') {

      if (slots.questionA.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'questionA';
        const speechOutput = `Your response was ${slots.questionA.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'questionA';
      const speechOutput = 'Rate our service on the scale of one to five.';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // questionB
    if (!slots.questionB.value) {
      const slotToElicit = 'questionB';
      const speechOutput = 'Rate the ambience of this place on the scale of one to five?';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.questionB.confirmationStatus !== 'CONFIRMED') {

      if (slots.questionB.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'questionB';
        const speechOutput = `Your response was ${slots.questionB.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'questionB';
      const speechOutput = 'Rate the ambience of this place on the scale of one to five';
      const repromptSpeech = 'Sorry can you repeat your answer ';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // questionC
    if (!slots.questionC.value) {
      const slotToElicit = 'questionC';
      const speechOutput = 'Rate our Food on the scale of one to five?';
      const repromptSpeech = 'Sorry can you repeat your answer';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.questionC.confirmationStatus !== 'CONFIRMED') {

      if (slots.questionC.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'questionC';
        const speechOutput = `Your response was ${slots.questionC.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'questionC';
      const speechOutput = 'Rate our Food on the scale of one to five';
      const repromptSpeech = 'Sorry can you repeat your answer';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // all slot values received and confirmed, now add the record to DynamoDB
	const q0 = slots.questionZ.value;
    const q1 = slots.questionA.value;
    const q2 = slots.questionB.value;
    const q3 = slots.questionC.value';
    const dynamoParams = {
      TableName: feedbackTable,
      Item: {
		question0: q0,
        question1: q1,
        UserId: userId,
        question2: q2,
        question2: q3
      }
    };

    

    console.log('Attempting to add feedback', dynamoParams);

          // add the recipe
     dbPut(dynamoParams)
      .then(data => {
        console.log('Add item succeeded', data);

        this.emit(':tell', 'Feedback added!');
      })
      .catch(err => {
        console.error(err);
      });
  },


  'Unhandled'() {
    console.error('problem', this.event);
    this.emit(':ask', 'An unhandled problem occurred!');
  },

  'AMAZON.HelpIntent'() {
    const speechOutput = instructions;
    const reprompt = instructions;
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent'() {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.StopIntent'() {
    this.emit(':tell', 'Goodbye!');
  }
};

exports.handler = function handler(event, context) {
  const alexa = alexaSDK.handler(event, context);
  alexa.APP_ID = appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};