import React from 'react';
import BadgeTitle from '../BadgeTitle';
import { id } from 'date-fns/locale';
import ValuesCard from './ValuesCard';

const values = [
    {
        id: 1,
        image: '/core_value1.png',
        title: 'Understand your case before spending on lawyers',
        desc: 'This is dummy text will be replaced with original content.  This is dummy text will be replaced with original content. ',
    },
    {
        id: 2,
        image: '/core_value2.png',
        title: 'Know realistic timelines',
        desc: 'This is dummy text will be replaced with original content.  This is dummy text will be replaced with original content. ',
    },
    {
        id: 3,
        image: '/core_value3.png',
        title: 'Identify risks and chances of success',
        desc: 'This is dummy text will be replaced with original content.  This is dummy text will be replaced with original content. ',
    }
];

const CoreValues = () => {
  return (
    <section className='bg-[#F8F8F8] commonGap'>
      <div className='sub-wrapper'>
        <BadgeTitle badge='Core Values' title='Predict timelines, identify risks, and plan your path to victory' className='max-w-170 mb-4 md:mb-11' />
        <div className='flex flex-wrap justify-center gap-14'>
            {values.map((values) => (
                <ValuesCard key={values.id} list={values} />
            ))}
        </div>
      </div>
    </section>
  )
}

export default CoreValues;