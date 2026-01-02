import Link from 'next/link';
import React from 'react'

const CaseDetailsPagination = () => {
  return (
    <div className='flex justify-between items-center gap-5 border-y border-[#D6D6D6] py-5'>
      <Link href="javascript:;" className='text-left max-w-1/2 md:max-w-[22ch] bodySub'>
        <p>Girjesh Dutt v. Datadin, AIR 1934 Oudh 35</p>
        <div className='flex items-center gap-1 mt-8'>
            <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6663 6.41536H4.56717L7.82801 3.15453L6.99967 2.33203L2.33301 6.9987L6.99967 11.6654L7.82217 10.8429L4.56717 7.58203H11.6663V6.41536Z" fill="#0D0D0D"/>
                </svg>
            </span>
            <span className='text-[#0D0D0D] font-jakarta font-medium subBody'>Previous</span>
        </div>  
      </Link>
      <Link href="javascript:;" className='text-right max-w-1/2 md:max-w-[22ch] bodySub'>
        <p>GShrimati Shantabai v. State of Bombay & Others, 1958 AIR 532</p>
        <div className='flex items-center justify-end gap-1 mt-8'>
            <span className='text-[#0D0D0D] font-jakarta font-medium subBody'>Next</span>
            <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.99967 2.33203L6.17717 3.15453L9.43217 6.41536H2.33301V7.58203H9.43217L6.17717 10.8429L6.99967 11.6654L11.6663 6.9987L6.99967 2.33203Z" fill="#0D0D0D"/>
                </svg>
            </span>
        </div> 
      </Link>
    </div>
  )
}

export default CaseDetailsPagination;