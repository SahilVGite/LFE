import React from 'react'

const Pagenation = () => {
  return (
    <div className='flex justify-center items-center mt-5 md:mt-10 lg:mt-20'>
        <div className='flex items-center gap-1 border-r border-[#D6D6D6] pr-10 mr-10 cursor-pointer py-5 hover:underline'>
            <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6663 6.41536H4.56717L7.82801 3.15453L6.99967 2.33203L2.33301 6.9987L6.99967 11.6654L7.82217 10.8429L4.56717 7.58203H11.6663V6.41536Z" fill="#0D0D0D"/>
                </svg>
            </span>
            <span className='text-[#0D0D0D] font-jakarta font-medium subBody'>Previous</span>
        </div>   
        <div className='flex gap-1.5 items-center'>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all'>1</span>
            <span className='subBody text-white font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all bg-primary rounded-full'>2</span>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all'>3</span>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all'>4</span>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all'>5</span>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-end cursor-default'>....</span>
            <span className='subBody text-[#808080] font-jakarta  w-6 h-6 inline-flex justify-center items-center cursor-pointer hover:underline transition-all'>10</span>
        </div>
        <div className='flex items-center gap-1 border-l border-[#D6D6D6] pl-10 ml-10 cursor-pointer py-5 hover:underline'>
            <span className='text-[#0D0D0D] font-jakarta font-medium subBody'>Next</span>
            <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.99967 2.33203L6.17717 3.15453L9.43217 6.41536H2.33301V7.58203H9.43217L6.17717 10.8429L6.99967 11.6654L11.6663 6.9987L6.99967 2.33203Z" fill="#0D0D0D"/>
                </svg>
            </span>
        </div>      
    </div>
  )
}

export default Pagenation
