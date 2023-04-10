import express from 'express';
import {v4 as uuid} from 'uuid';
import {google} from 'googleapis'
import dotenv from 'dotenv'
dotenv.config({});

const app = express();
const port = 3000;

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUR_CLIENT_ID,
    process.env.YOUR_CLIENT_SECRET,
    process.env.YOUR_REDIRECT_URL
  );



const scopes = [
    'https://www.googleapis.com/auth/calendar'
]

const calendar = google.calendar({
    version: 'v3', 
    auth: process.env.YOUR_API_KEY
})

app.use('/home',(req,res)=>{
    res.send("<h1>This is my home page</h1>")
});

app.get('/google', (req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    
    res.redirect(url);
})

app.get('/google/redirect', async(req,res)=>{
    const code = req.query.code;
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    // setTimeout(2000);
    res.redirect('http://localhost:3000/schedule_event')
})

app.get('/schedule_event', async (req,res)=>{
    const startOfEvent = new Date();
    startOfEvent.setHours(startOfEvent.getHours()+1);

    const endOfEvent = new Date();
    endOfEvent.setHours(endOfEvent.getHours()+2);
    
    const event = {
        summary: 'testing summary',
        description: 'Description of a event here...',
        start : {
            dateTime: startOfEvent,
            timeZone: 'Asia/Calcutta',
        },
        end : {
            dateTime: endOfEvent,
            timeZone: 'Asia/Calcutta',
        },
        attendees: [{email:"cms10@iitbbs.ac.in"}],
        conferenceData: {
            createRequest: {
                requestId: uuid(),  
            }
        }
    }

    await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: event,
        }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        else console.log('..............Event created..............');
    });
    res.send("DONE!:)")
})

app.listen(port,(req,res)=>{
    console.log('this is website http://localhost:3000/home');
});