function App() {
  return (
    <div className="card">
      <div className="head">
        <span className="brand">calc</span>
      </div>

      <div className="panel">
        <div className="expr"></div>
        <div className="spacer"></div>
        <div className="result">0</div>
      </div>

      <div className="pad">
        <button className="fn">AC</button>
        <button className="fn" disabled>
          %
        </button>
        <button className="op">÷</button>
        <button className="op">×</button>

        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button className="op">−</button>

        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button className="op">+</button>

        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button className="eq">=</button>

        <button>0</button>
        <button>.</button>
        <button className="back" aria-label="Backspace">
          ⌫
        </button>
      </div>
    </div>
  );
}

export default App;
