import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovie] = useState([]);
  const [firebaseMovie, setfirebaseMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  //Using promises
  // const fetchMovieHandler = () => {
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json(); //This line trandform the json into javascript object
  //     })
  //     .then((data) => {
  //       const transformedData = data.results.map((movieData) => {
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date,
  //         };
  //       });
  //       setMovie(transformedData);
  //     });
  // };

  //Using asynchronous

  const fetchMovieHandler = useCallback(async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error("Something went Wrong!!");
      }
      const data = await response.json(); //This line trandform the json into javascript object

      const transformedData = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovie(transformedData);
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);



  const fetchFireBaseMovieHandler = useCallback(async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://movie-adder-http-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went Wrong!!");
      }
      const data = await response.json(); //This line trandform the json into javascript object

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setfirebaseMovie(loadedMovies);
      console.log(firebaseMovie);
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  useEffect(() => {
    fetchFireBaseMovieHandler();
  }, [fetchFireBaseMovieHandler]);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://movie-adder-http-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "al=pplication/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <h1>From Fire Base</h1>
        <button onClick={fetchFireBaseMovieHandler}>Fetch Movies </button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={firebaseMovie} />}
        {isLoading && <p>Loading...</p>}
      </section>
      <section>
        <h1>Star Wars API</h1>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {isLoading && <p>Loading...</p>}
        {!isLoading && isError && <p>{isError}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
