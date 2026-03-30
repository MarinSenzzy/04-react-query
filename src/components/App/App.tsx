import "./App.module.css";

import { useState } from "react";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [onSelect, setOnSelect] = useState<Movie | null>(null);
  const handlerSearch = async (query: string) => {
    setIsError(false);
    setIsLoad(true);
    setMovies([]);
    try {
      const data = await fetchMovies(query);
      if (data.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(data);
      console.log(data);
    } catch (error) {
      setIsError(true);
      console.log(error);
    } finally {
      setIsLoad(false);
    }
  };
  return (
    <>
      <Toaster />

      <SearchBar onSubmit={handlerSearch} />
      {isLoad && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setOnSelect} />
      )}
      {onSelect && (
        <MovieModal onClose={() => setOnSelect(null)} movie={onSelect} />
      )}
    </>
  );
}

export default App;
