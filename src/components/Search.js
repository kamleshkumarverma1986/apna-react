import ApnaReact, { useState } from "../../apna-react";

const Search = ({ title }) => {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="search">
      <input
        type="text"
        value={searchText}
        onInput={(e) => {
          setSearchText(() => e.target.value);
        }}
      />
      <h3 tabIndex="3"> Hi i am search component</h3>
      <p>
        <span>Title: </span>
        {title}
      </p>
      <p>
        <span>searchText: </span>
        {searchText}
      </p>
    </div>
  );
};

export default Search;
