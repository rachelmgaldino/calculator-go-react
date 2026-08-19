import { useState } from "react";
import { calculate, type Operation } from "./api";

function App() {
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<"+" | "−" | "×" | "÷" | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastExpr, setLastExpr] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);

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

  function operatorToApiName(op: "+" | "−" | "×" | "÷"): Operation {
    switch (op) {
      case "+":
        return "add";
      case "−":
        return "subtract";
      case "×":
        return "multiply";
      case "÷":
        return "divide";
    }
  }

  async function handleOperator(op: "+" | "−" | "×" | "÷") {
    if (current === "Error") return;

    if (previous !== null && operator !== null && !isNewEntry) {
      setIsCalculating(true);
      try {
        const result = await calculate(
          operatorToApiName(operator),
          parseFloat(previous),
          parseFloat(current),
        );
        const resultStr = String(result);
        setPrevious(resultStr);
        setCurrent(resultStr);
      } catch {
        setCurrent("Error");
        setPrevious(null);
        setOperator(null);
        setIsNewEntry(true);
        setIsCalculating(false);
        return;
      }
      setIsCalculating(false);
    } else {
      setPrevious(current);
    }

    setOperator(op);
    setIsNewEntry(true);
    setJustEvaluated(false);
  }

  async function handleEquals() {
    if (previous === null || operator === null) return;

    setIsCalculating(true);
    try {
      const result = await calculate(
        operatorToApiName(operator),
        parseFloat(previous),
        parseFloat(current),
      );
      setLastExpr(`${previous} ${operator} ${current} =`);
      setCurrent(String(result));
      setPrevious(null);
      setOperator(null);
      setIsNewEntry(true);
      setJustEvaluated(true);
    } catch {
      setCurrent("Error");
      setPrevious(null);
      setOperator(null);
      setIsNewEntry(true);
    }
    setIsCalculating(false);
  }

  return (
    <div className="card">
      <div className="head">
        <span className="brand">calc</span>
      </div>

      <div className="panel">
        <div className="expr">
          {operator
            ? `${previous} ${operator}${isNewEntry ? "" : " " + current}`
            : justEvaluated
              ? lastExpr
              : ""}
        </div>
        <div className="spacer"></div>
        <div className={`result${current === "Error" ? " error" : ""}`}>
          {current}
        </div>
      </div>

      <div className="pad">
        <button onClick={handleClear} className="fn">
          AC
        </button>
        <button className="fn" disabled>
          %
        </button>
        <button className="op" onClick={() => handleOperator("÷")}>
          ÷
        </button>
        <button className="op" onClick={() => handleOperator("×")}>
          ×
        </button>

        <button onClick={() => handleDigit("7")}>7</button>
        <button onClick={() => handleDigit("8")}>8</button>
        <button onClick={() => handleDigit("9")}>9</button>
        <button className="op" onClick={() => handleOperator("−")}>
          −
        </button>

        <button onClick={() => handleDigit("4")}>4</button>
        <button onClick={() => handleDigit("5")}>5</button>
        <button onClick={() => handleDigit("6")}>6</button>
        <button
          className="op"
          onClick={() => handleOperator("+")}
          disabled={isCalculating}
        >
          +
        </button>

        <button onClick={() => handleDigit("1")}>1</button>
        <button onClick={() => handleDigit("2")}>2</button>
        <button onClick={() => handleDigit("3")}>3</button>
        <button className="eq" onClick={handleEquals} disabled={isCalculating}>
          =
        </button>

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
