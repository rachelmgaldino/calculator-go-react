import { useState } from "react";

function App() {
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<"+" | "−" | "×" | "÷" | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(true);

  function handleDigit(d: string) {
    if (isNewEntry || current === "0") {
      setCurrent(d);
    } else if (current.replace("-", "").replace(".", "").length < 12) {
      setCurrent(current + d);
    }
    setIsNewEntry(false);
  }

  function handleDot() {
    if (isNewEntry) {
      setCurrent("0.");
      setIsNewEntry(false);
    } else if (!current.includes(".")) {
      setCurrent(current + ".");
    }
  }

  function handleBackspace() {
    if (isNewEntry) {
      setCurrent("0");
    } else {
      const next = current.slice(0, -1);
      setCurrent(next === "" || next === "-" ? "0" : next);
    }
  }

  function handleClear() {
    setCurrent("0");
    setPrevious(null);
    setOperator(null);
    setIsNewEntry(true);
  }

  return (
    <div className="card">
      <div className="head">
        <span className="brand">calc</span>
      </div>

      <div className="panel">
        <div className="expr"></div>
        <div className="spacer"></div>
        <div className="result">{current}</div>
      </div>

      <div className="pad">
        <button onClick={handleClear} className="fn">
          AC
        </button>
        <button className="fn" disabled>
          %
        </button>
        <button className="op">÷</button>
        <button className="op">×</button>

        <button onClick={() => handleDigit("7")}>7</button>
        <button onClick={() => handleDigit("8")}>8</button>
        <button onClick={() => handleDigit("9")}>9</button>
        <button className="op">−</button>

        <button onClick={() => handleDigit("4")}>4</button>
        <button onClick={() => handleDigit("5")}>5</button>
        <button onClick={() => handleDigit("6")}>6</button>
        <button className="op">+</button>

        <button onClick={() => handleDigit("1")}>1</button>
        <button onClick={() => handleDigit("2")}>2</button>
        <button onClick={() => handleDigit("3")}>3</button>
        <button className="eq">=</button>

        <button onClick={() => handleDigit("0")}>0</button>
        <button onClick={handleDot}>.</button>
        <button
          className="back"
          aria-label="Backspace"
          onClick={handleBackspace}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

export default App;
