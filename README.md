# movie-api-server

To run this server, you will need to create an `.env` file in the same directory as `server.js`, containing `API_TOKEN=your-api-token`. 

You can generate a UUID token **[here](https://www.uuidgenerator.net/)**. 

Your client with also need an `Authorization`header containing `Bearer your-api-token` in order to pass the server's validation middlewear. 
