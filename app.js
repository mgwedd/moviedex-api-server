// make sure you have a .env file with an api token, as it won't be committed to github.
require('dotenv').config(); 
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const STORE = require('./movies-data-small');
const app = express();

// Required middlewear for all routes.
app.use(helmet()); // for blanket security
app.use(morgan( 'common' )); // for activity logging
app.use(cors());  // for running clients on the same browser as the server
app.use(function validateBearerToken( req, res, next ) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get( 'Authorization' );
    if ( !authToken || apiToken !== authToken.split(' ')[ 1 ] ) {
        return res.status( 401 ).json({ error: `Unauthorized request rejected. Check your Auth and API tokens. The server received the Auth Token "${ authToken.split(' ')[ 1 ] }" and API Key "${ apiToken }", which must match.`});
    }
    next(); // auth token and api token match, so proceed to next middlewear
});

// ENDPOINT: GET /movie 
const handleGetMovie = ( req, res ) => {
    const { genre, country, avg_vote } = req.query;

    let results = STORE; // if no search filters applied, return all movies.
    let prelimResults;

    if ( genre ) {
        // if there is at least one result for this query, filter the response results by it.
        prelimResults = results.filter( movie => movie.genre.toLowerCase().includes( genre.toLowerCase() ) );
        // if results found, modify the response; otherwise, send a 404 to the client.
        if ( prelimResults.length > 0 ) {
            results = prelimResults;
        } else {
            return res.status( 404 ).send('No results found that match all search terms.');
        } 
    }

    if ( country ) {
        prelimResults = results.filter( movie => movie.country.toLowerCase().includes( country.toLowerCase() ) );
        // if results found, modify the response; otherwise, send a 404 to the client.
        if ( prelimResults.length > 0 ) {
            results = prelimResults;
        } else {
            return res.status( 404 ).send('No results found that match all search terms.');
        }
    }

    if ( avg_vote ) {
        prelimResults = results.filter( movie => Number( movie.avg_vote ) >= Number( avg_vote ) );
        // if results found, modify the response; otherwise, send a 404 to the client.
        if ( prelimResults.length > 0 ) {
            results = prelimResults;
        } else {
            return res.status( 404 ).send('No results found that match all search terms.');
        }
    }

    res.json( results );
}
app.get('/movie', handleGetMovie);
// =====================

module.exports = app; // listening from server.js