import { ComponentType, SVGProps } from "react";

type TrustItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
};

interface TrustCardsProps {
  list: TrustItem;
}

const TrustCards = ({ list }: TrustCardsProps) => {

    const Icon = list.icon;

  return (
    <div className='border border-[#E3E3E3] shadow-[0px_13px_40px_4px_rgba(112,144,176,0.14)] rounded-4xl bg-white w-full md:w-[calc(50%-20px)] lg:w-[calc(32%-88px)] px-10 py-8 text-center'>
      <div className="border border-primary rounded-full p-5 lg:p-7 w-fit mx-auto"><Icon /></div>
      <div className="subTxt font-medium text-[#212121] mt-5 leading-[1.3em]"><h5>{list.title}</h5></div>
    </div>
  )
}

export default TrustCards
