import { Share2 } from 'lucide-react';
import React from 'react'

const CaseDetailsBanner = () => {
  return (
    <section className='relative'>
      <div 
        className='absolute top-0 left-0 [@media(max-width:1000px)]:h-[78%] [@media(max-width:1400px)]:h-[81%] [@media(max-width:1600px)]:h-[82%] w-full'
        style={{
            backgroundImage: "url('/banner-bg.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundColor: "#F7F9FB",
        }}
      />
      <div className='max-w-[90%] md:max-w-[80%] mx-auto relative pt-20 md:pt-25 lg:pt-40'>
        <div className='absolute bg-white bodySub rounded-tl-[1.111em] [@media(max-width:1100px)]:pl-[0.777em] [@media(max-width:1100px)]:pt-[0.777em] [@media(max-width:1100px)]:pr-0 [@media(max-width:1100px)]:pb-0 px-[1.777em] py-[1.111em] bottom-0  [@media(max-width:1100px)]:right-0 -right-30'>
            <button className='font-poppins font-medium bodySub text-primary flex justify-center items-center gap-[0.944em] py-[1.111em] px-[1.333em] rounded-full border border-primary cursor-pointer'>
                <Share2 className='w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6' />
                <span className='hidden lg:block'>Share</span>
            </button>
        </div>
        <img src="/case_details.png" alt="Case Details" className='[@media(max-width:1100px)]:aspect-4/2 object-cover w-full h-auto rounded-2xl lg:rounded-4xl' />
        
      </div>
    </section>
  )
}

export default CaseDetailsBanner;