import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovie] = useState([]);
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

  async function fetchMovieHandler() {
    setIsError(null);
    setIsLoading(true);
    try {
      
      
      const response = await fetch("https://swapi.dev/api/films/");
      if(!response.ok){
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
  }

  return (
    <React.Fragment>
      <section>
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
