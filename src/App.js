import "./App.css";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [number, setNumber] = useState(0);
  const [circles, setCircles] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [nextExpected, setNextExpected] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [disappear, setDisappear] = useState(false);
  const [flagbutton, setFlagbutton] = useState(true);
  const [stateHeader, setStateHeader] = useState(true);
  const [stateLabelSuccess, setStateLabelSuccess] = useState(false);

  const [stateLabelFail, setStateLabelFail] = useState(false);
  // const [btnAutoPlay, setButtonAutoPlay] = useState(false);
  const [toggleOnOff, setToggleOnOff] = useState(false);
  // vị trí ngẫu nhiên cho các hình tròn
  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    return { top: `${y}%`, left: `${x}%` };
  };

  const refClicks = useRef([]);

  useEffect(() => {
    refClicks.current.forEach((button, index) => {
      setTimeout(() => {
        if (button) {
          button.click();
        }
      }, index * 1000);
    });
  }, [toggleOnOff]);

  useEffect(() => {
    if (number > 0) {
      const newCircles = Array.from({ length: number }, (_, i) => ({
        id: i + 1,
        position: getRandomPosition(),
      }));
      setCircles(newCircles);

      setIsStarted(false);
      setNextExpected(1);
      setElapsedTime(0);
    }
  }, [number]);

  useEffect(() => {
    let timer;
    if (isStarted) {
      timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
      console.log(timer);
      console.log(startTime);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isStarted, startTime]);

  const handleStart = () => {
    if (number <= 0) {
      ref.current.focus();
      return;
    }
    if (ref.current.value !== "" && ref.current.value !== "0") {
      setStartTime(Date.now());
      setIsStarted(true);
      setDisappear(false);
      setFlagbutton(!flagbutton);
    }
  };

  const ref = useRef();

  const handleRestart = () => {
    setDisappear((disappear) => {
      setDisappear(!disappear);
    });
    ref.current.value = "";
    setIsStarted(!startTime);
    setElapsedTime(0);
    setFlagbutton(!flagbutton);
    setNumber(0);
    setStateLabelFail(false);
    setStateLabelSuccess(false);
    setToggleOnOff((state) => !state);
    if (toggleOnOff === false) {
      setToggleOnOff(false);
    }
    if (stateLabelFail === false || stateLabelSuccess === false) {
      setStateHeader(true);
    }
  };

  const handleClick = (value) => {
    if (value === nextExpected) {
      setNextExpected(nextExpected + 1);
      setCircles(circles.filter((circle) => circle.id !== value));
      if (nextExpected === number) {
        setIsStarted(false);

        setStateHeader((state) => !state);

        setStateLabelSuccess((state) => !state);

        setToggleOnOff((state) => !state);
      }
    } else {
      setIsStarted(false);
      setStateLabelFail((state) => !state);

      setStateHeader((state) => !state);
    }
  };

  return (
    <div>
      {stateHeader && <h3 style={{ marginBottom: 0 }}>LET'S PLAY</h3>}
      {stateLabelSuccess && <h3 style={{ color: "green" }}>ALL CLEARED</h3>}
      {stateLabelFail && <h3 style={{ color: "red" }}>GAME OVER</h3>}
      <span>Points: </span>
      <input
        ref={ref}
        type="number"
        onChange={(e) => setNumber(Number.parseInt(e.target.value))}
      />

      <p style={{ marginTop: 0, marginBottom: 0 }}>
        Time: {elapsedTime.toFixed(1)}s
      </p>
      {flagbutton && <button onClick={handleStart}>Play</button>}
      {!flagbutton && (
        <div>
          <button style={{ marginRight: "20px" }} onClick={handleRestart}>
            Restart
          </button>
          {isStarted && (
            <button
              onClick={() => {
                // setButtonAutoPlay((state) => !state);
                setToggleOnOff(true);
              }}
            >
              Auto Play: {toggleOnOff ? "ON" : "OFF"}
            </button>
          )}
        </div>
      )}
      {isStarted && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "500px",
              height: "500px",
              marginTop: "20px",

              marginBottom: "200px",
              border: "black solid",
            }}
          >
            {!disappear &&
              circles.map((circle, i) => (
                <button
                  ref={(el) => (refClicks.current[i] = el)}
                  key={circle.id}
                  onClick={() => handleClick(circle.id)}
                  style={{
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "lightblue",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "18px",
                    ...circle.position,
                  }}
                >
                  {circle.id}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
