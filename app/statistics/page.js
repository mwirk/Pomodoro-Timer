'use client';

import { BarChart } from "@mui/x-charts";
import Link from "next/link";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Context } from '../layout';

export default function Statistics() {
  const { date } = useContext(Context); 
  const { t } = useTranslation(); 

  return (
    <div className="flex justify-center items-center flex-col">
      <Link href='/'>
        <button id='backButton' className="p-2 bg-red-400 font-semibold rounded text-white mt-3">
          {t('Back')}
        </button>
      </Link>
      <p id='title' className='text-2xl mt-5'>{t('StatisticsOfToday')}</p>
      <BarChart
        id='chart'
        xAxis={[
          {
            id: 'barCategories',
            data: [t('WorkMinutesSpent'), t('RestMinutesSpent')],
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: [(date[0] / 60), (date[1]/ 60)], 
          },
        ]}
        width={500}
        height={300}
      />
      
    </div>
  );
}
