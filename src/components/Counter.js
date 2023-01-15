import ApnaReact, { useState, useEffect } from "../../apna-react";

const Counter = ({ title }) => {
  const [count1, setCount1] = useState(100);
  const [count2, setCount2] = useState(1000);

  return (
    <div className="main-counter">
      <div className="counter">
        <p>
          <span>Count1:</span>
          {count1}
        </p>
        <button onClick={() => setCount1((data) => data + 1)}>Counter1</button>
      </div>
      <div className="counter">
        <p>
          <span>Count2:</span>
          {count2}
        </p>
        <button onClick={() => setCount2((data) => data + 1)}>Counter2</button>
      </div>
    </div>
  );
};

export default Counter;
