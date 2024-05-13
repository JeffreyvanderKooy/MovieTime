import bodyParser from "body-parser";
import pg from "pg";
import express from "express";
import axios from "axios";

// postgress data //
const db = new pg.Client({
    user: "",
    password: "",
    port: "" ,
    host: "",
    database: ""
});
db.connect();

// api data //
const config = {headers: { Authorization:'Bearer '}};
const api_url = "https://api.themoviedb.org/3/movie";

// configure express // 
const app = express();
const port = 3000;

// configure middleware //
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentUserId = 0;

async function getUpcoming() {
    const response = await axios.get(`${api_url}/upcoming`, config);
    const upcoming = response.data.results;
    return upcoming;
}


async function getPlaying(){
    const response = await axios.get(`${api_url}/now_playing`, config);
    const playing = response.data.results;
    return playing;
}

async function getGenre(genre){
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, { params : { with_genres: genre }  ,headers: { Authorization:'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzkzYTFkZWUzM2NiYTVlN2MzNzRhZDVhNzJhMmRmZCIsInN1YiI6IjY2M2U1MDA2MWEzZDAyYTE0MDc5OTljYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aj1eXnBSscDiQmS0awoU8IICaGbi1yimvphY95AUfCE'}});
    const recommended = response.data.results;
    return recommended;
}

const genreData = await axios.get("https://api.themoviedb.org/3/genre/movie/list", config);
const genreList = genreData.data.genres;


app.get("/", (req, res) => {
    res.render("login.ejs");
})

app.post("/register", async(req,res) => {

    try {
    const password = req.body.password;
    const username = req.body.username;

    console.log(password.length);

    if (password.length < 3) {
        res.render("login.ejs", {
            error: "Password must be 4 characters long."
        });
    };

    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);

    res.redirect("/");
    } catch (error) {
        res.render("login.ejs", {
            error: "Username taken."
        });
    }
});

app.post("/login", async(req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    try {
    const response = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (password === response.rows[0].password) {
        currentUserId = response.rows[0].id;
        res.redirect("/home");
        
    } else {
        res.render("login.ejs", {
            error: "Wrong password."
        })
    }
    } catch (error) {
    console.log(error);
    res.render("login.ejs", {
        error: "Wrong password or username."
    })
    };

})

app.get("/home", async(req, res) => {

        // get genre //
        const response = await db.query("SELECT username, genre FROM users WHERE id = $1;", [currentUserId]);
        var genre = parseInt(response.rows[0].genre);
        if (genre) {
            var recommended = await getGenre(genre);
            var a = parseInt(genre);
            var index = genreList.find((genre) => genre.id === a);
        }

        const watchlistData = await db.query("SELECT * FROM watchlist WHERE user_id = $1", [currentUserId]);
        const watchlist = watchlistData.rows;
        const upcoming = await getUpcoming();
        const playing = await getPlaying();

        if (genre) {
        
        res.render("home.ejs", {
            username: response.rows[0].username,
            watchlist: watchlist,
            playing: playing,
            upcoming: upcoming,
            genreText: index.name ,
            recommended: recommended
        });
    } else {
        res.render("home.ejs", {
            username: response.rows[0].username,
            watchlist: watchlist,
            playing: playing,
            upcoming: upcoming,
            recommended: recommended
        });
    }
        
})

app.post("/favorite", async(req, res) => {
    await db.query("INSERT INTO watchlist VALUES ($1, $2, $3, $4, $5, $6);", [currentUserId, req.body.title, req.body.score, req.body.poster_path, req.body.overview, req.body.release_date]);
    res.redirect("/home");
})

app.post("/delete", async(req, res) => {
    await db.query("DELETE FROM watchlist WHERE movie_title = $1 AND user_id = $2;", [req.body.title, currentUserId]);
    res.redirect("/home");
})

app.post("/genre", async(req, res) => {
    const genreId = genreList.find((genre) => genre.name === req.body.genre.toString());
    await db.query("UPDATE users SET genre = $1 WHERE id = $2;", [genreId.id, currentUserId]);
    res.redirect("/home");
})

app.get("/search", (req, res) => {
    res.render("search.ejs", {
    });
})

app.post("/search", async(req, res) => {
    const title = req.body.movieTitle;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${title}`, config);
        const results = response.data.results;
        console.log(results);
        
        res.render("search.ejs", {
            results: results,
        })
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, ()=> {
    console.log("Site hosting on port:" + port);
});