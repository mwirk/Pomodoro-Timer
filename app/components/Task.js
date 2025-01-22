'use client'
import { useContext, useEffect, useLayoutEffect, useReducer, useState } from "react"
import { Context } from '../layout';
import { useTranslation } from "next-i18next";

export default function Task({props}) {
    const [taskName, setTaskName] = useState(props.title);
    const [inputVisibleTitle, setInputVisibleTitle] = useState(false);
    const [inputVisibleAssign, setInputVisibleAssign] = useState(false);
    const { tasks, setTasks, setAssignments, intervals } = useContext(Context);
    const [intervalAssigned, setIntervalAssigned] = useState(1);
    const { t }  = useTranslation()
    const progressReducer = (state, action) => {
        switch (action.type) {
          case "INCREMENT_PROGRESS":
            return { progress: Math.min(state.progress + Math.ceil(40/tasks.length), 100) };
          default:
            return state;
        }
    };
    const [progressState, dispatch] = useReducer(progressReducer, { progress: -80 });
    const completeInterval = () => {
        dispatch({ type: "INCREMENT_PROGRESS" }); 
    };
    useLayoutEffect(() => {
        setAssignments((prev) => {
          const newAssignments = { ...prev };
          for (const key in newAssignments) {
            newAssignments[key] = newAssignments[key].filter((task) => task !== taskName);
          }
          if (!newAssignments[intervalAssigned]) {
            newAssignments[intervalAssigned] = [];
          }
          newAssignments[intervalAssigned].push(taskName);
          return newAssignments;
        });
        
        
      }, [taskName, intervalAssigned]);
      

    
    const handleRenameTask = (newName) => {
        setTasks((prev) => {
            return prev.map((task) => (task === taskName ? newName : task));
        });

        setAssignments((prev) => {
            const newAssignments = { ...prev };

            Object.keys(newAssignments).forEach((key) => {
                newAssignments[key] = newAssignments[key].map((task) =>
                    task === taskName ? newName : task
                );
            });

            return newAssignments;
        });

        setTaskName(newName);
    };

    const handleRemoveTask = () => {
        setTasks((prev) => prev.filter((x) => x !== props.title));
        setAssignments((prev) => {
            const newAssignments = { ...prev };

            Object.keys(newAssignments).forEach((key) => {
                newAssignments[key] = newAssignments[key].filter((task) => task !== taskName);
            });

            return newAssignments;
        });
    };
    useEffect(()=>{
        completeInterval()
        
    }, [intervals[0]])
    return (
        <div className="flex gap-2 task-item">
            <p className='border-y-5 border-black-700'>{taskName || `Task${props.key + 1}`}</p>
            <p>{t('Assign')}:</p>
            <p>{intervalAssigned}</p>
            <p>{t('Completion')}: {progressState.progress < 0 ? 0 : progressState.progress}%</p>


            <input id='changeTitle' defaultValue={taskName} type='text' className={inputVisibleTitle ? "border-black-700 border-2" : "border-black-700 border-2 hidden"}/>
            <button className='bg-red-400 p-1 text-white border-red-400' onClick={(e) => {
                    if (inputVisibleTitle) {
                        const newName = e.target.previousSibling.value;
                        handleRenameTask(newName);
                    }
                    setInputVisibleTitle(!inputVisibleTitle);
                }}
            >
                {inputVisibleTitle ? 'Ok' : t('EditTitle')}
            </button>

            
            <button className='bg-red-400 p-1 text-white border-red-400' onClick={handleRemoveTask}> {t('RemoveTask')}</button>

            <input onChange={(e) => setIntervalAssigned(parseInt(e.target.value, 10))} id='changeAssign' min='1' max={intervals[1]} defaultValue='1' type='number' className={inputVisibleAssign ? "border-black-700 border-2" : "border-black-700 border-2 hidden"}/>
            <button className='bg-red-400 p-1 text-white border-red-400' onClick={() => setInputVisibleAssign(!inputVisibleAssign)}> {t('AssignToCycle')}</button>
        </div>
    );
}
