'use client';

import Link from 'next/link';
const SelectList  = React.lazy(() => import('../components/SelectList'));
import { Context } from '../layout';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { workSound, setWorkSound, setRestSound, setFinishSound, changeLanguage } = useContext(Context);
  const { t } = useTranslation();

  useEffect(() => {
    const savedWorkSound = localStorage.getItem('workSound');
    const savedRestSound = localStorage.getItem('restSound');
    const savedFinishSound = localStorage.getItem('finishSound');
    const savedLanguage = localStorage.getItem('language');

    if (savedWorkSound) setWorkSound(`sounds/${savedWorkSound}.mp3`);
    if (savedRestSound) setRestSound(`sounds/${savedRestSound}.mp3`);
    if (savedFinishSound) setFinishSound(`sounds/${savedFinishSound}.mp3`);
    if (savedLanguage) changeLanguage(savedLanguage);
  }, []);

  const handleWorkSoundChange = (e) => {
    const sound = `${e.target.value}`;
    setWorkSound(`sounds/${e.target.value}.mp3`);
    localStorage.setItem('workSound', sound); 
  };

  const handleRestSoundChange = (e) => {
    const sound = `${e.target.value}`;
    setRestSound(`sounds/${e.target.value}.mp3`);
    localStorage.setItem('restSound', sound); 
  };

  const handleFinishSoundChange = (e) => {
    const sound = `${e.target.value}`;
    setFinishSound(`sounds/${e.target.value}.mp3`);
    localStorage.setItem('finishSound', sound); 
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    localStorage.setItem('language', e.target.value); 
  };

  return (
    <div className='grid grid-rows-[auto,1fr] gap-6 p-6 bg-gray-50'>
      <div className="flex justify-center items-center">
      <Link href='/'>
        <button id='backButton' className="p-3 bg-red-400 text-white font-semibold rounded-md shadow-lg hover:bg-red-500 transition duration-300 ease-in-out">
          {t('Back')}
        </button>
      </Link>
    </div>
      <div className='text-center'>
        <p className='text-3xl font-semibold text-gray-800'>{t('Settings')}</p>
      </div>

      <div className='grid gap-8 p-5 bg-red-300 rounded-lg shadow-lg max-w-3xl mx-auto'>
        <SelectList
          props={{
            arr: [{ title: 'BoxFight' }, { title: 'Alarm' }, { title: 'Piano' }],
            label: t('WorkSound'),
            func: handleWorkSoundChange,
            value: localStorage.getItem('workSound') || 'BoxFight',
            id: 'settingsWork'
          }}
        />
        <SelectList
          props={{
            arr: [{ title: 'Peaceful' }, { title: 'Eco' }, { title: 'Splash' }],
            label: t('RestSound'),
            func: handleRestSoundChange,
            value: localStorage.getItem('restSound') || 'Peaceful',
            id: 'settingsRest'
          }}
        />
        <SelectList
          props={{
            arr: [{ title: 'Royal' }, { title: 'Ring-Ring' }],
            label: t('FinishSound'),
            func: handleFinishSoundChange,
            value: localStorage.getItem('finishSound') || 'Ring-Ring',
            id: 'settingsFinish'
          }}
        />
        <div>
          <label className='block text-lg font-medium text-gray-700'>
            {t('Language')}
            <select
              id='settingsLanguage'
              onChange={handleLanguageChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              value={localStorage.getItem('language') || 'en'}
            >
              {[
                { title: 'English', code: 'en' },
                { title: 'Polski', code: 'pl' },
              ].map((lang, index) => (
                <option key={index} value={lang.code}>
                  {lang.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
