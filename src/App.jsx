import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

const Types = {
  rock: "Rock - Gestein",
  water: "Water - Wasser",
  electro: "Electro - Elektro",
  earth: "Earth - Erd",
  ice: "Ice - Eis",
  fire: "Fire - Feuer",
};

const TypesCounter = {
  rock: "Water - Wasser",
  water: "Electro - Elektro",
  electro: "Earth - Erd",
  earth: "Ice - Eis",
  ice: "Fire - Feuer",
  fire: "Rock - Gestein",
};

function App() {
  const [results, setResults] = useState([]);
  const [buttonType, setButtonType] = useState("Left");
  const typesRef = useRef([]);
  const [resultsVisible, setResultsVisible] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    typesRef.current = typesRef.current.slice(0, 6);
  }, []);

  const puzzle = (type, index) => {
    if (results.length > 5) return;
    typesRef.current[index] = true;
    const counter = `${results.length + 1}. ${TypesCounter[type]}`;
    const result = [...results, counter];
    setResults(result);
  };

  const reset = () => {
    setResults([]);
    setResultsVisible({
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    typesRef.current = [];
  };

  const returnImage = (index) => {
    if (index.substring(3, 20) === "Water - Wasser") {
      return "water";
    }
    if (index.substring(3, 20) === "Electro - Elektro") {
      return "electro";
    }
    if (index.substring(3, 20) === "Earth - Erd") {
      return "earth";
    }
    if (index.substring(3, 20) === "Ice - Eis") {
      return "ice";
    }
    if (index.substring(3, 20) === "Fire - Feuer") {
      return "fire";
    }
    if (index.substring(3, 20) === "Rock - Gestein") {
      return "rock";
    }
    return false;
  };

  const toggleAlwaysOnTop = async () => {
    try {
      const newState = !alwaysOnTop;
      await invoke("set_always_on_top", { state: newState });
      setAlwaysOnTop(newState);
      localStorage.setItem("alwaysOnTop", newState.toString());
    } catch (error) {
      console.error("Failed to toggle always on top:", error);
    }
  };

  useEffect(() => {
    // Load the preference when the app starts
    const loadPreference = async () => {
      const savedState = localStorage.getItem("alwaysOnTop") === "true";
      setAlwaysOnTop(savedState);
      await invoke("set_always_on_top", { state: savedState });
    };
    loadPreference();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto min-h-screen mx-auto text-xl font-bold dark:text-white">
      <h1 className="mb-1 text-3xl">Echidna Puzzle Solver</h1>
      <label className="inline-flex items-center p-1 mb-1 rounded-md cursor-pointer">
        <input
          type="checkbox"
          checked={alwaysOnTop}
          onChange={toggleAlwaysOnTop}
          className="w-[20px] h-[20px] accent-[#2561E2]"
        />
        <span className="mb-1 ml-1"> Always on Top</span>
      </label>
      <select
        className="mb-1 text-black bg-white"
        onChange={(e) => setButtonType(e.target.value)}
      >
        <option value="Left">Left Buttons</option>
        <option value="Right">Right Buttons</option>
        <option value="Icon">Icon Buttons</option>
      </select>
      <button
        type="button"
        onClick={() => reset()}
        disabled={results.length < 1}
        style={{ margin: "5px 0" }}
        className={
          results.length < 1
            ? "bg-gray-300 rounded-md cursor-not-allowed opacity-50 px-8 py-2 uppercase"
            : "bg-red-600 hover:bg-red-700 active:bg-red-800 px-8 py-2 rounded-md text-white uppercase"
        }
      >
        Reset
      </button>
      <div>
        <div>
          {buttonType === "Left" && (
            <div className="flex">
              <div className="flex flex-col mr-2">
                {Object.keys(Types).map((type, index) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => puzzle(type, index)}
                    disabled={typesRef.current[index]}
                    className={
                      typesRef.current[index]
                        ? "w-[200px] h-[36px] mb-2 bg-gray-300 text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-not-allowed opacity-50 uppercase"
                        : "w-[200px] h-[36px] mb-2 bg-[#2561E2] text-white font-medium text-lg rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1] transition-all uppercase"
                    }
                  >
                    {Types[type]}
                  </button>
                ))}
              </div>
              <div className="flex flex-col">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      if (results[index]) {
                        setResultsVisible({
                          ...resultsVisible,
                          [index]: !resultsVisible[index],
                        });
                      }
                    }}
                    disabled={!results[index] || resultsVisible[index]}
                    className={
                      !results[index] || resultsVisible[index]
                        ? "w-[200px] h-[36px] mb-2 bg-gray-300 text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-not-allowed opacity-50 uppercase"
                        : "w-[200px] h-[36px] mb-2 bg-[#2561E2] text-white font-medium text-lg rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1] transition-all uppercase"
                    }
                  >
                    {results[index]}&nbsp;
                  </button>
                ))}
              </div>
            </div>
          )}
          {buttonType === "Right" && (
            <div className="flex">
              <div className="flex flex-col mr-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      if (results[index]) {
                        setResultsVisible({
                          ...resultsVisible,
                          [index]: !resultsVisible[index],
                        });
                      }
                    }}
                    disabled={!results[index] || resultsVisible[index]}
                    className={
                      !results[index] || resultsVisible[index]
                        ? "w-[200px] h-[36px] mb-2 bg-gray-300 text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-not-allowed opacity-50 uppercase"
                        : "w-[200px] h-[36px] mb-2 bg-[#2561E2] text-white font-medium text-lg rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1] transition-all uppercase"
                    }
                  >
                    {results[index]}&nbsp;
                  </button>
                ))}
              </div>
              <div className="flex flex-col">
                {Object.keys(Types).map((type, index) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => puzzle(type, index)}
                    disabled={typesRef.current[index]}
                    className={
                      typesRef.current[index]
                        ? "w-[200px] h-[36px] mb-2 bg-gray-300 text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-not-allowed opacity-50 uppercase"
                        : "w-[200px] h-[36px] mb-2 bg-[#2561E2] text-white font-medium text-lg rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1] transition-all uppercase"
                    }
                  >
                    {Types[type]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {buttonType === "Icon" && (
        <div className="flex">
          <div className="flex flex-col">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  if (results[index]) {
                    setResultsVisible({
                      ...resultsVisible,
                      [index]: !resultsVisible[index],
                    });
                  }
                }}
                disabled={!results[index] || resultsVisible[index]}
                className={
                  !results[index] || resultsVisible[index]
                    ? "mr-4 w-[150px] h-[72px] mb-2 bg-gray-300 text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-not-allowed opacity-50 uppercase"
                    : "mr-4 w-[150px] h-[72px] mb-2 bg-[#2561E2] text-white font-medium text-lg rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1] transition-all uppercase"
                }
              >
                {results[index] && (
                  <div className="flex items-center">
                    <h5 style={{ color: "white" }}>{index + 1}.</h5>
                    <img
                      alt={results[index]}
                      style={{
                        verticalAlign: "middle",
                        margin: "0 3px",
                      }}
                      src={`/${returnImage(results[index])}.webp`}
                    />{" "}
                    <div>
                      {Types[returnImage(results[index])].split(" - ")[0]}{" "}
                      <br />
                      {Types[returnImage(results[index])].split(" - ")[1]}
                    </div>
                    &nbsp;
                  </div>
                )}
              </button>
            ))}
          </div>
          <div>
            {Object.keys(Types).map((type, index) => (
              <button
                type="button"
                key={type}
                onClick={() => puzzle(type, index)}
                disabled={typesRef.current[index]}
                className={
                  typesRef.current[index]
                    ? "flex p-2 w-[140px] mb-2 text-lg font-medium text-white uppercase transition-all bg-gray-500 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-not-allowed opacity-50"
                    : "flex p-2 w-[140px] mb-2 text-lg font-medium text-white uppercase transition-all bg-[#2561E2] rounded-md shadow-md hover:bg-[#4078f1] focus:outline-none focus:ring-2 focus:ring-bg-[#4078f1]"
                }
              >
                <img
                  alt={type}
                  style={{
                    verticalAlign: "middle",
                    margin: "0 3px",
                  }}
                  src={`/${type}.webp`}
                />{" "}
                <div>
                  {Types[type].split(" - ")[0]} <br />
                  {Types[type].split(" - ")[1]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
