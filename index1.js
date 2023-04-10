import dotenv from 'dotenv'
dotenv.config({});
const {google} = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const {OAuth2} = google.auth;
const {v4} = require('uuid');
const uuid = v4;
const oAuth2Client = new google.auth.OAuth2(
    process.env.YOUR_CLIENT_ID,
    process.env.YOUR_CLIENT_SECRET,
    process.env.YOUR_REDIRECT_URL
  );
  
oAuth2Client.setCredentials({
    refresh_token: '1//04oa7Tq60Gt1pCgYIARAAGAQSNwF-L9IruVUrIpJYxvEYVpQch203A4ysiiIhIj9llb_ehxWRRxkldXKCMrXpMTkCbcXG0pq55ZE'
});

const calendar = google.calendar({version:'v3', auth: oAuth2Client});

const eventStartTime = new Date();
eventStartTime.setHours(eventStartTime.getHours()+1);

const eventEndTime = new Date();
eventEndTime.setHours(eventEndTime.getHours()+2);

const event = {
    summary : "Meeting with Rohit", 
    location : "Argul - Jatni Rd, Kansapada, Odisha 752050", 
    desciption: "Solution for assignment given",
    start: {
        dateTime: eventStartTime,
        timezone: "Asia/Calcutta",
    },
    end: {
        dateTime: eventEndTime,
        timezone: "Asia/Calcutta",
    },
    conferenceDataVersion: 1,
    conferenceData : {
        createRequest : {
            requestId: uuid(),
        },
    },
    sendNotifications: true,
    attendees: [
        {email: 'cms10@iitbbs.ac.in'},
    ],
    colorId: 1
}


console.log(typeof(eventStartTime))
console.log(eventEndTime);

calendar.freebusy.query(
    {
        resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timezone: 'Asia/Calcutta',
            items: [{id: 'primary'}],
        },
    },
    (err,res)=> {
    if(err) return console.error("freebusy query error: ", err);
    const eventsArray = res.data.calendars.primary.busy;
    if(eventsArray.length===0) {
        return calendar.events.insert({
            calendarId: 'primary', resource: event
        }, err => {
            if(err) return console.error(`Calendar event creation error, ${err}`);
            return console.log('Successfully created event!!!...')
        })
    }
    return console.error('Sorry I am Busy');
});