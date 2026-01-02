import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import React from 'react'

const page = () => {
  return (
    <>
      <div
        className="relative commonGap min-h-[20dvh] content-center"
        style={{
          backgroundImage: "url('/banner-bg.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "#F7F9FB",
        }}
      >
        <div className='main-wrapper pt-14 flex flex-col justify-center items-center relative'>
            <h2 className='commonTitle'>Contact</h2>
            <span className='absolute -bottom-4 md:-bottom-6 lg:-bottom-10 right-[12dvw] lg:right-[3.5dvw] tracking-[0.0125em] smallTxt text-[#1A202C] font-medium'>Home  &gt;  Contact</span>
        </div>
      </div>
      <ContactInfo />
      <ContactForm />
    </>
  )
}

export default page
