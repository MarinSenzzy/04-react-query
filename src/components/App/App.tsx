import "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

// import ReactPaginate from "react-paginate";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [onSelect, setOnSelect] = useState<Movie | null>(null);
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
  const handlerSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  };
  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.", { removeDelay: 1500 });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message, { removeDelay: 1500 });
    }
  }, [isError, error]);
  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handlerSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={setOnSelect} />
        </>
      )}

      {onSelect && (
        <MovieModal onClose={() => setOnSelect(null)} movie={onSelect} />
      )}
    </>
  );
}

export default App;
