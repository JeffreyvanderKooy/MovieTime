MovieTime

MovieTime is website for browsing movies, seeing wich movies are currently playing in the cinemas, upcoming movies and suggested movies based on your preffered genre.
You can add movies to your watchlist to easily track and save wich movies sparked your interest!

1. Clone the repository, run 'NPM i' in the index.js file using the command terminal.

2. You will need an api_key from 'https://developer.themoviedb.org/docs/getting-started', insert this into the const 'config' after "bearer".

3. Next you will need a postgreSQL database to store watchlist and user data.
   3.1 Make a database calles 'users'  with the following SQL command;
       CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        password TEXT 
   );

   3.2 Next make a database for the watchlist data using the follow SQL command;
       CREATE TABLE watchlist (
       user_id INTEGER REFERENCES users(id),
       movie_title TEXT,
       movie_score NUMERIC,
       movie_poster TEXT,
       movie_overview TEXT,
       movie_release TEXT 
   );

   3.3 in the index.js file enter the relevant data in the const 'db' declaration; password, username etc.

4. run 'node index.js' in the command terminal and enjoy the website! :)

If you encounter any bugs or have any suggestion on improvements to be made feel free to contact me.

