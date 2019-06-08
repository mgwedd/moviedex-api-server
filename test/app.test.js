const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const STORE = require('../movies-data-small');

describe('GET /movie endpoint of movie-api server', () => {
    it('Should return a non-empty array of objects equal to the entire array of movies when no search terms are given', () => {
        return request( app )
                .get( '/movie' )
                .set('Authorization', 'Bearer 1383245c-3cae-4ceb-9d6c-7353f567adb7')
                .query()
                .expect(200)
                .then ( ( res ) => {
                    expect( res.body ).to.eql( STORE )
                });
    });

    it('Should return an array when only one valid search term is given, even when the case of the search term doesn\'t match the case of the matching term in the database', () => {
        return request( app )
                .get( '/movie' )
                .set('Authorization', 'Bearer 1383245c-3cae-4ceb-9d6c-7353f567adb7')
                .query( { genre: 'action' } )
                .expect( 200 )
                .then ( ( res ) => {
                    expect( res.body ).to.be.an('array');
                });
    });

    it('Should return a 404 when no results are found for any one of the search terms that are passed into the server', () => {
        return request( app )
                .get( '/movie' )
                .set('Authorization', 'Bearer 1383245c-3cae-4ceb-9d6c-7353f567adb7')
                .query( { genre: 'MISTAKE', country: 'United States', avg_vote: '3' } )
                .expect( 404, 'No results found that match all search terms.' )
    });
});