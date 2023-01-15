import ApnaReact from "../../apna-react";
import Counter from "./Counter";
import Search from "./Search";

const App = () => {
  const searchTitle = "Search some text";
  return (
    <div className="app" id="app-id">
      <div className="app-child1">
        <h1> hello1 search sibling </h1>
        <Search title={searchTitle} />
      </div>
      <div className="app-child2">
        <h2> hello1 counter sibling </h2>
        <Counter title="counter title" />
      </div>
    </div>
  );
};

export default App;
