import React from 'react';
import { OrangeMessage, SendOffers } from '../svg';

const ContactInfo = () => {
  return (
    <section className='commonGap relative'>
      <div className='[@media(max-width:601px)]:px-4 [@media(max-width:1366px)]:px-7.5 max-w-310 mx-auto text-center'>
        <div className='commonTitle mb-[0.35em]'><h3>Get in touch</h3></div>
        <div className='subTitle font-medium text-[#A6A6A6] tracking-[-0.0625em] mb-[0.35em]'><p>Reach out to us for help and information about LFE</p></div>
        <div className='mt-8 md:mt-10 lg:mt-20 flex flex-wrap items-center justify-between gap-5'>
            <div className='bg-white border border-[#E3E3E3] rounded-[40px] shadow-[0px_13px_40px_4px_rgba(112,144,176,0.14)] px-10 lg:px-20 py-10 md:max-w-150 w-full lg:w-[calc(50%-40px)] md:mx-auto'>
                <div className='p-4 lg:p-8 border border-primary rounded-full w-fit mx-auto'>
                    <OrangeMessage />
                </div>
                <div className='subTxt font-medium text-[#AAAAAA] my-[1em]'><span>Support Chat</span></div>
                <div className='commonTitle text-[#212121]'><a href="mailto:Support@LFE.com" target='_blank'>Support@LFE.com</a></div>
            </div>
            <div className='bg-white border border-[#E3E3E3] rounded-[40px] shadow-[0px_13px_40px_4px_rgba(112,144,176,0.14)] px-10 lg:px-20 py-10 md:max-w-150 w-full lg:w-[calc(50%-40px)] md:mx-auto'>
                <div className='p-4 lg:p-8 border border-primary rounded-full w-fit mx-auto'>
                    <SendOffers />
                </div>
                <div className='subTxt font-medium text-[#AAAAAA] my-[1em]'><span>Send offers</span></div>
                <div className='commonTitle text-[#212121]'><a href="mailto:hello@LFE.com" target='_blank'>hello@LFE.com</a></div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo;