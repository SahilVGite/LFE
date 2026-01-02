import Link from 'next/link'
import React from 'react'

const CaseCard = () => {
  return (
    <Link href='/case-details' className='border border-[#E3E3E3] bg-white py-5 px-8 rounded-4xl w-full md:w-[calc(48%-15px)] lg:w-[calc(31.5%-20px)] shadow-[0px_13px_40px_4px_rgba(112,144,176,0.14)]'>
      <div className='flex flex-wrap gap-2.5 mb-3 md:mb-6'>
        <span className='border border-[#D6D6D6] text-[#878787] px-2 py-0.5 rounded-full subBody'>Family</span>
        <span className='border border-[#D6D6D6] text-[#878787] px-2 py-0.5 rounded-full subBody'>Divorce</span>
        <span className='border border-[#D6D6D6] text-[#878787] px-2 py-0.5 rounded-full subBody'>Legal</span>
      </div>
      <div className='mb-3 font-semibold subTitle text-[#1A202C] tracking-[-0.0625em]'><h6>This is dummy text will be replaced with original content</h6></div>
      <div className='tracking-[0.0125em] body text-[#737373]'><p>This is dummy text will be replaced with original content.  This is dummy text will be replaced with original content. </p></div>
    </Link>
  )
}

export default CaseCard
