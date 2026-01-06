import React from 'react'

type ValueItem = {
  id: number;
  image: string;
  title: string;
  desc: string;
};

interface ValuesCardProps {
  list: ValueItem;
}

const ValuesCard = ({ list }: ValuesCardProps) => {
  return (
    <>
        <div className='group w-full md:w-[calc(50%-28px)] lg:w-[calc(31.685%-28px)]'>
            <div className='rounded-2xl overflow-hidden'><img src={list.image} alt={list.title} className='object-cover w-full h-auto aspect-[1.26/1] group-hover:scale-105 transition-all' /></div>
            <div className='subTitle font-semibold text-[#1A202C] tracking-[-0.0625em] my-6 line-clamp-2'><h5>{list.title}</h5></div>
            <div className='body text-[#737373] tracking-[0.0125em] line-clamp-3'><p>{list.desc}</p></div>
        </div>
    </>
  )
}

export default ValuesCard
