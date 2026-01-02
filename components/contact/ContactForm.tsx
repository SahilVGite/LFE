import { ChevronDown } from "lucide-react";
import React from "react";

const ContactForm = () => {
  return (
    <section className="commonGap relative bg-[#FFFBF2]">
      <div className="[@media(max-width:601px)]:px-4 [@media(max-width:1100px)]:px-7.5 max-w-255.5 mx-auto">
        <div className="commonTitle mb-[0.35em] text-center">
          <h3>Get in touch</h3>
        </div>
        <div className="subTitle font-medium text-[#A6A6A6] tracking-[-0.0625em] mb-[0.35em] text-center">
          <p>Reach out to us for help and information about LFE</p>
        </div>
        <div className="max-w-165 mx-auto mt-12 lg:mt-17">
          <form action="#">
            <ul className="flex flex-wrap gap-x-3 md:gap-x-5 gap-y-5 md:gap-y-7 lg:gap-y-9.5">
              <li className="w-full border border-[#D6D6D6] rounded-full">
                <input type="text" placeholder="Full Name" name="" id="" className="outline-none border-none w-full p-5 placeholder:text-[#808080] bodySub" />
              </li>
              <li className="w-full border border-[#D6D6D6] rounded-full">
                <input type="email" placeholder="Email Address" name="" id="" className="outline-none border-none w-full p-5 placeholder:text-[#808080] bodySub" />
              </li>
              <li className="w-[calc(50%-6px)] md:w-[calc(50%-10px)] border border-[#D6D6D6] rounded-full">
                <input type="tel" placeholder="Phone" name="" id="" className="outline-none border-none w-full p-5 placeholder:text-[#808080] bodySub" />
              </li>
              <li className="w-[calc(50%-6px)] md:w-[calc(50%-10px)] border border-[#D6D6D6] rounded-full relative">
                <select className="outline-none appearance-none border-none w-full p-5 placeholder:text-[#808080] bodySub" name="" id="">
                    <option value="" disabled selected>Enquiry  Type</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 absolute top-1/2 right-1.5 md:right-3 -translate-1/2 pointer-events-none" />
              </li>
              <li className="w-full border border-[#D6D6D6] rounded-full">
                <textarea name="" id="" className="outline-none border-none w-full p-5 placeholder:text-[#808080] bodySub resize-none" placeholder="Your Message"></textarea>
              </li>
              <li className="w-full mt-3 lg:mt-6">
                <button className="text-white font-medium bodySub py-3.5 px-25 rounded-full mx-auto block cursor-pointer" style={{background: 'var(--primary-gradient)'}}>Submit</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
