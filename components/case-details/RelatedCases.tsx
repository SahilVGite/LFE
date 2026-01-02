import React from 'react'
import BadgeTitle from '../BadgeTitle';
import CaseCard from '../case-listing/CaseCard';

const RelatedCases = () => {
  return (
    <section className='commonGap relative bg-[#FFFBF2]'>
      <div className='sub-wrapper'>
        <BadgeTitle badge='Related Cases' title='You may also like' className='text-center mb-14' />
        <div className='flex flex-wrap items-center justify-center gap-x-12.5 gap-y-10'>
            <CaseCard />
            <CaseCard />
            <CaseCard />
        </div>
      </div>
    </section>
  )
}

export default RelatedCases;