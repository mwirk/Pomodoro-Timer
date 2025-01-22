'use client';

import Link from 'next/link';
import './globals.css';
import React, { useState, useRef, useEffect, useContext, lazy, useCallback, useReducer} from 'react';
import { FaGear } from "react-icons/fa6";
import { Context } from './layout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { IoStatsChart } from "react-icons/io5";
import { useTranslation } from 'next-i18next';

const TimerInput = lazy(() => import('./components/TimerInput'));
const Button = lazy(() => import('./components/Button'));
const Task = lazy(() => import('./components/Task'));

export default function Home() {
  const workMode = useRef(true);
  const [timerButton, setTimerButton] = useState('start');
  const [workTime, setWorkTime] = useState([25, 0]);
  const [restTime, setRestTime] = useState([10, 0]);
  const { t } = useTranslation(); 
  const timerRef = useRef(null);
  const [loop, toggle] = useReducer(checked => !checked, false);
  const workTimeRef = useRef(workTime);
  const restTimeRef = useRef(restTime);
  const { workSound, restSound, finishSound, tasks, setTasks, intervals, setIntervals, assignments, setWorkTimeSpent, setRestTimeSpent}= useContext(Context);
  const [estimatedCycles, setEstimatedCycles] = useState(0)
  
  
 
  const exportTasksToFile = useCallback(() => {
    if (tasks.length > 0) {
      const tasksContent = tasks.join('; ') + ';';
      const blob = new Blob([tasksContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'zadania.txt'; 
      link.click();
    } else {
      alert(t('NoTaskToExportYet'));
    }
  }, [tasks]);
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        const newTasks = content.split(';').map(task => task.trim()).filter(task => task !== '');
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      };
      reader.onerror = () => {
        alert('Error');
      };
      reader.readAsText(file);
    } else {
      alert(t('PleaseImportTextPlainFile'));
    }
  }, [tasks]);

  const updateTime = (remainingTime, mode) => {
    if (mode) {
      setWorkTimeSpent(prev=>prev+1)
      setWorkTime([Math.floor(remainingTime / 60), remainingTime % 60]);
    } else {
      setRestTimeSpent(prev=>prev+1)
      setRestTime([Math.floor(remainingTime / 60), remainingTime % 60]);
    }
  };

  const handleIntervalEnd = (mode, intervalNumber) => {
    if (mode) {
      handleWorkMode(intervalNumber);
    } else {
      handleRestMode(intervalNumber);
    }
  };
  
  const handleWorkMode = (intervalNumber) => {
    if (loop) {
      playSound('restSound');
      resetWorkTime();
      workMode.current = false;
      startTimer(intervalNumber);
    } else {
      handleNonLoopWorkMode(intervalNumber);
    }
  };
  
  const handleNonLoopWorkMode = (intervalNumber) => {
    if (intervalNumber < intervals[1] - 1) {
      const nextWorkTime = getNextTime('.workMinutes', intervalNumber);
      setWorkTime([nextWorkTime, 0]);
    }
    playSound('restSound');
    workMode.current = false;
    startTimer(intervalNumber);
  };
  
  const handleRestMode = (intervalNumber) => {
    workMode.current = true;
    setIntervals((prev) => [prev[0] + 1, prev[1]]);
    if (loop) {
      handleLoopRestMode(intervalNumber);
    } else {
      handleNonLoopRestMode(intervalNumber);
    }
  };
  
  const handleLoopRestMode = (intervalNumber) => {
    playSound('workSound');
    setRestTime([parseInt(document.querySelector('.restMinutes').value, 10), 0]);
    setIntervals((prev) => [prev[0], prev[1]]);
    startTimer(intervalNumber + 1);
  };
  
  const handleNonLoopRestMode = (intervalNumber) => {
    if (intervalNumber < intervals[1] - 1) {
      playSound('workSound');
      const nextRestTime = getNextTime('.restMinutes', intervalNumber);
      setRestTime([nextRestTime, 0]);
      startTimer(intervalNumber + 1);
    } else {
      finishSession();
    }
  };
  
  const resetWorkTime = () => {
    const initialWorkTime = parseInt(document.querySelector('.workMinutes').value, 10);
    setWorkTime([initialWorkTime, 0]);
  };
  
  const getNextTime = (selector, intervalNumber) => {
    return parseInt(
      document.querySelectorAll(selector)[intervalNumber + 1].value,
      10
    );
  };
  
  const finishSession = () => {
    playSound('finishSound');
    workMode.current = true;
    setTimerButton('start');
    setWorkTime([parseInt(document.querySelector('.workMinutes').value, 10), 0]);
    setRestTime([parseInt(document.querySelector('.restMinutes').value, 10), 0]);
    setIntervals((prev) => [0, prev[1]]);
    unlockInputElements();
  };

  const timer = (time, mode, intervalNumber) => {
    let remainingTime = time;

    timerRef.current = setInterval(() => {
      updateTime(remainingTime, mode);

      if (remainingTime > 0) {
        remainingTime -= 1;
      } else {
        clearInterval(timerRef.current);
        handleIntervalEnd(mode, intervalNumber);
      }
    }, 100); 
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerButton('start');
    }
  };

  const startTimer = (intervalsN) => {
    if (isNaN(workTimeRef.current[0]) || isNaN(restTimeRef.current[0]) ){
      alert(t('WrongInputOnlyNumbersAreAllowedPleaseTypeAgain'))
    }
    else{
    disableInputElements();
    const timeToCount = workMode.current
      ? workTimeRef.current[0] * 60 + workTimeRef.current[1]
      : restTimeRef.current[0] * 60 + restTimeRef.current[1];
    setTimerButton('stop');
    timer(timeToCount, workMode.current, intervalsN);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    workMode.current = true;
    setTimerButton('start');
    unlockInputElements();
    if (loop){
      document.getElementById('intervalsInput').disabled = true
    }
    setIntervals((prev) => [0, prev[1]]);
    setWorkTime([parseInt(document.querySelector('.workMinutes').value, 10), 0]);
    setRestTime([parseInt(document.querySelector('.restMinutes').value, 10), 0]);
  };

  const disableInputElements = () => {
    document.querySelectorAll('input').forEach((x) => (x.disabled = true));
  };

  const unlockInputElements = () => {
    document.querySelectorAll('input').forEach((x) => (x.disabled = false));
  };

  const playSound = (name) => {
    document.querySelector(`#${name}`).play();
  };

  const changeAmountIntervalInputs = (number) => {
    const d = document.querySelector('#set-timers');
    if (number > intervals[1]) {
      const newInput = document.querySelector('.inputs').cloneNode(true);

      document.querySelector('#set-timers').appendChild(newInput);
    } else {
      d.removeChild(d.querySelectorAll('.inputs')[d.querySelectorAll('.inputs').length - 1]);
    }
  };

  useEffect(()=>{
    const workTimeInMinutes = workTime[0]  + workTime[1];
    const restTimeInMinutes = restTime[0]  + restTime[1]; 
    const totalTimePerTask = workTimeInMinutes + restTimeInMinutes;
    setEstimatedCycles(Math.ceil(tasks.length * totalTimePerTask / 60)); 
    
  }, [tasks])

  useEffect(() => {
    workTimeRef.current = workTime;
  }, [workTime]);

  useEffect(() => {
    restTimeRef.current = restTime;
  }, [restTime]);
  
  useEffect(() => {
    loop
      ? (document.querySelector('#intervalsInput').disabled = true)
      : (document.querySelector('#intervalsInput').disabled = false);
    loop
      ? setIntervals((prev) => [prev[0], t('Infinity')])
      : setIntervals((prev) => [prev[0], document.querySelector('#intervalsInput').value]);
  }, [loop]);

  useEffect(() => {

    
    if (workMode.current) {
      document.querySelector('#minute').value = workTime[0];
    } else {
      document.querySelector('#minute').value = restTime[0];
    }
  }, [workTime, restTime]);


  return (
    <div className="flex flex-col flex items-center">
      <div id="set-timers" className="flex flex-col mt-6 gap-4 align-center">
        <div className='flex flex-row gap-4 justify-center'>
        <div id='intervals' className="flex flex-col justify-center">
              <label>{t('Cycles')}</label>
              <input id='intervalsInput' onChange={(e) => {setIntervals([0,parseInt(e.target.value,10)]); changeAmountIntervalInputs(parseInt(e.target.value,10))}} type='number' defaultValue='1' min='1' className="w-full p-3 mt-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"/>
          </div>
          <div id='unlimited' className="flex flex-col justify-center">
              <label>{t('LoopForever')}</label>
              <input id='infinityMode' onClick={(e)=>toggle()} type='checkbox'/>
          </div>
         </div>

        <div id='input0' className="inputs flex flex-row gap-4 items-center"> 
          <TimerInput props={{ id: 'work', label: t('WorkInterval'), idInput: 'workMinutes', func: (e) => setWorkTime([parseInt(e.target.value,10), 0]), defaultValue: 25 }}/>
          <TimerInput props={{ id: 'rest', label: t('RestInterval'), idInput: 'restMinutes', func: (e) => setRestTime([parseInt(e.target.value,10),0]), defaultValue: 10 }}/>
        </div>
       
      </div>
      <div className='flex flex-row gap-4'>
      <Button props={{ func: timerButton === 'start' ? () => {startTimer(intervals[0])} : stopTimer, id:"start", content: timerButton === 'start' ? 'Start' : 'Stop'}}/>
      <Button props={{ func: reset, id: "reset", content:"Reset"}}/>
      <Link id='settings-button' href='/settings'><button className="p-3 bg-red-400 font-semibold rounded text-white mt-3"><FaGear className='text-lg'/></button></Link>
      <Link id='statistics-button' href='/statistics'><button className="p-3 bg-red-400 font-semibold rounded text-white mt-3"><IoStatsChart className='text-lg'/></button></Link>
      </div>
      <div id="timer-box" className={workMode.current ? "border-solid border-4 rounded border-red-400 p-10 mt-5 flex flex-col justify-center items-center mb-8" : "border-solid border-4 rounded border-green-400 p-10 mt-5 flex flex-col justify-center items-center mb-8"}>
        <p id='pointer-cycles' className='font-semibold'>{t('Cycle')}: {intervals[0] + 1} / {intervals[1]}</p>
        <p>{workMode.current ? t('Work') : t('Rest')}</p>
        
        <div id="timer" className="flex">
          <p id="minute">{workMode.current ? workTime[0].toString().padStart(2, '0') : restTime[0].toString().padStart(2, '0')}</p>
          <p>:</p>
          <p id="second">{workMode.current ? workTime[1].toString().padStart(2, '0') : restTime[1].toString().padStart(2, '0')}</p>
        </div>
        
        <div id="assigned-tasks" className="mt-4">
          <p>{t('AssignedTasks')}:</p>
          {(assignments[intervals[0]+1] || []).map((task, index) => (
            <p key={index}>{task}</p>
          ))}
        </div>
        
        <audio id="restSound" src={restSound}></audio>
        <audio id="workSound" src={workSound}></audio>
        <audio id="finishSound" src={finishSound}></audio>
      </div>
      
      <div id='taskList' className='flex flex-col p-4 border-4 border-red-400 items-center mb-4'>
          <p>{t('Tasks')}:</p>
          <Formik 
            initialValues={{ taskName: '' }}
              onSubmit={(values, { resetForm }) => {
              setTasks((prev) => [...prev, values.taskName]);
              resetForm(); 
            }}
            >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className='flex flex-col items-center'>

  
                  <Field id='task-name' className='border-black-700 border-2' name="taskName" required />

                  <ErrorMessage name="taskName" component="div" />

                <div className='flex gap-3'>
                <Button props={{content: t('AddNewTask'), id: 'AddNewTask'}}/>
                <Button props={{content: t('ExportTasks'), id: 'ExportTasks',func:exportTasksToFile}}/>
                </div>
              </Form>
            )}
            </Formik>
      <div className="mt-4">
        <p>{t('EstimatedCycles')}: {estimatedCycles}</p>
      </div>
      <div id='tasks' className='mt-4 flex flex-col gap-2 items-center'>
      <div className="mt-4 border-y-4 w-full">
        
        <label className='flex flex-col'> {t('ImportYourTasks')}
          <input 
            type="file" 
            accept=".txt"
            onChange={handleFileUpload}
            className="p-3 bg-red-300 text-white rounded"
          />
          </label>
        </div>
        <div id='tasks-list' className='flex flex-col gap-2 items-center'>
          {tasks.map((x,index)=>{return <Task key={index} props={{key: index, title: x}}/>})}
          </div>
      </div>
      
      
      </div>
            
 
    </div>
  );
}




