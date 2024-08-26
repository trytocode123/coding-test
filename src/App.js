
import './App.css';
import React, { useState, useEffect, useRef } from 'react';


function App() {

  const [number, setNumber] = useState(0);
  const [circles, setCircles] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [nextExpected, setNextExpected] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [disappear, setDisappear] = useState(false);
  const [flagbutton, setFlagbutton] = useState(true);



  // Hàm để tạo vị trí ngẫu nhiên cho các hình tròn
  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 80); // Giới hạn vị trí ngẫu nhiên trong khoảng 80% chiều rộng màn hình
    const y = Math.floor(Math.random() * 80); // Giới hạn vị trí ngẫu nhiên trong khoảng 80% chiều cao màn hình
    return { top: `${y}%`, left: `${x}%` };
  };

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
      console.log(timer)
      console.log(startTime);

    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isStarted, startTime]);

  const handleStart = () => {
    if(ref.current.value !== '' && ref.current.value !== '0') {
      setStartTime(Date.now());
      setIsStarted(true);
      setDisappear(false);
      setFlagbutton(!flagbutton)

    }
    // Không thay đổi vị trí của các hình tròn khi restart
  };

  const ref = useRef();
  
  const handleRestart = () => {
   setDisappear(disappear => {
   setDisappear(!disappear)
   })
   ref.current.value = '';
   setIsStarted(!startTime);
   setElapsedTime(0);
    setFlagbutton(!flagbutton);
  };

  const handleClick = value => {
    if (value === nextExpected) {
      setNextExpected(nextExpected + 1);
      setCircles(circles.filter(circle => circle.id !== value));
      if (nextExpected === number) {
        setIsStarted(false);
        const endTime = Date.now();
        alert(`All Clear ${(endTime - startTime) / 1000} s`);
      }
    } else {
      setIsStarted(false);
      const endTime = Date.now();
      alert(`Game Over ${(endTime - startTime) / 1000} s`);
      setFlagbutton(!flagbutton);
    }
  };

  return (
    <div>
      <span>Points: </span>
      <input
        ref={ref}
        type='number'
        onChange={e => setNumber(parseInt(e.target.value))}
       
      />
      { flagbutton&& <button onClick={handleStart}>Start</button>}
      {!flagbutton && <button onClick={handleRestart}>Restart</button>}

      <p>Time: {elapsedTime.toFixed(1)}s</p>
      {isStarted && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            marginTop: '20px',
          }}
        >
          {!disappear && circles.map(circle => (
            <div
              key={circle.id}
              onClick={() => handleClick(circle.id)}
              style={{
                position: 'absolute',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'lightblue',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                ...circle.position,
              }}
            >
              {circle.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
