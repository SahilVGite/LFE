import React from 'react'
import BadgeTitle from '../BadgeTitle'
import CaseCard from './CaseCard'
import Pagenation from '../Pagenation'

const CaseListing = () => {
  return (
    <section className='commonGap relative'>
        <div className='main-wrapper relative [@media(max-width:650px)]:px-4 [@media(max-width:1630px)]:px-8'>
            <BadgeTitle badge='Cases' title='lorem ipsum quia dolor sit amet, consectetur, adipisci veli' titleGap='-0.0515em' className='max-w-170' />    
            <div className='flex overflow-x-auto gap-x-6 mt-10 mb-5 pb-5'>
                <span className='text-primary border border-primary py-3.5 px-9 block w-fit rounded-full min-w-35 text-center cursor-pointer hover:text-primary transition-colors hover:bg-amber-400/10 font-poppins font-medium bodySub whitespace-nowrap'>All</span>
                <span className='text-[#B4B4B4] border border-[#B4B4B4] py-3.5 px-9 block w-fit rounded-full min-w-35 text-center cursor-pointer hover:text-primary transition-colors hover:bg-amber-400/10 font-poppins font-medium bodySub whitespace-nowrap'>Divorced</span>
                <span className='text-[#B4B4B4] border border-[#B4B4B4] py-3.5 px-9 block w-fit rounded-full min-w-35 text-center cursor-pointer hover:text-primary transition-colors hover:bg-amber-400/10 font-poppins font-medium bodySub whitespace-nowrap'>Category 2</span>
                <span className='text-[#B4B4B4] border border-[#B4B4B4] py-3.5 px-9 block w-fit rounded-full min-w-35 text-center cursor-pointer hover:text-primary transition-colors hover:bg-amber-400/10 font-poppins font-medium bodySub whitespace-nowrap'>Category 3</span>
            </div>
            <div className='flex flex-wrap items-center justify-center gap-x-12.5 gap-y-10'>
                <CaseCard />
                <CaseCard />
                <CaseCard />
                <CaseCard />
                <CaseCard />
                <CaseCard />
                <CaseCard />
                <CaseCard />
            </div>
            <Pagenation />
        </div>      
    </section>
  )
}

export default CaseListing
