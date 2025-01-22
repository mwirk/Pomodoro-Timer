'use client'
import React, { useEffect, useMemo, useState} from "react";
import "./globals.css";
import Link from "next/link";
import useLocalStorage from "./hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
export const Context = React.createContext();
import i18n from "./i18n";


export default function RootLayout({ children }) {
  const getDate = () => new Date().toISOString().slice(0, 10);
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const [workSound, setWorkSound] = useState('sounds/BoxFight.mp3')
  const [restSound, setRestSound] = useState('sounds/Peaceful.mp3')
  const [finishSound, setFinishSound] = useState('sounds/Royal.mp3')
  const [tasks, setTasks] = useState([])
  const [intervals, setIntervals] = useState([0, 1]);
  const [assignments, setAssignments] = useState({})
  const [workTimeSpent, setWorkTimeSpent] = useState(0);
  const [restTimeSpent, setRestTimeSpent] = useState(0);
  const dateKey = useMemo(() => getDate(), []);
  const [date, setDate] = useLocalStorage(dateKey, [0, 0]);
  
  useEffect(() => {

      const dataToSave = [workTimeSpent,restTimeSpent];
      setDate(dataToSave);

  }, [workTimeSpent, restTimeSpent, dateKey]);


  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <nav className="border-b-2 p-4 flex flex-row gap-2 flex items-center bg-red-300 flex justify-center">
        <Link href='/'><img src='/pictures/tomato.png' alt="Logo"/></Link>
        </nav>
        <Context.Provider value={{date, workTimeSpent, setRestTimeSpent,workSound,setWorkSound,restSound,setRestSound,finishSound,setFinishSound, tasks,setTasks, intervals, setIntervals, assignments, setAssignments, workTimeSpent, setWorkTimeSpent, restTimeSpent, setRestTimeSpent,getDate,  changeLanguage}}>
        {children}
        </Context.Provider>
        <footer className="mt-auto p-2 bg-red-300 text-center">@ Copyrights</footer>
      </body>
    </html>
  );
}
