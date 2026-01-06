import React from "react";
import { RegularPlan, PremiumPlan } from "../svg";
import Link from "next/link";

type PricingPlan = {
  premium: boolean;
  title: string;
  desc: string;
  price: number;
  delivery_time: string;
  features: string[];
  best_for: string;
  cta: string;
  others?: {
    title: string;
    content: string[];
  }[];
};

interface PlanGridProps {
  plans: PricingPlan[];
}

const PlanGrid = ({ plans }: PlanGridProps) => {
  return (
    <div className="flex items-start justify-center flex-wrap gap-6.25">
      {plans.map((plan, index) => {
        const isPremium = plan.premium;

        return (
          <div
            key={index}
            className={`w-full md:w-[calc(50%-25px)] [@media(min-width:1300px)]:w-[calc(33.333%-25px)] border border-[#F6B501] px-5 py-7 md:p-7 lg:p-10 rounded-2xl md:rounded-3xl relative z-20 overflow-hidden ${
              isPremium
                ? "bg-[linear-gradient(180deg,rgba(246,181,1,0.2)_0%,rgba(246,181,1,0.032)_100%)]"
                : "bg-white"
            }`}
          >
            {isPremium && (
              <img
                src="/premium_bg.png"
                alt=""
                className="absolute inset-0 -z-10 w-full h-full object-cover"
              />
            )}

            {/* ICON */}
            <div>{isPremium ? <PremiumPlan /> : <RegularPlan />}</div>

            {/* TITLE */}
            <h5 className="largeTitle font-outfit font-medium tracking-[-0.0425em] text-[#1B223C] mt-[0.4545em]">
              {plan.title}
            </h5>

            <p
              className={`subTitle font-light font-outfit mb-[0.6em] mt-[0.583em] ${
                isPremium ? "text-[#3C3C3C]" : "text-[#797878]"
              }`}
            >
              {plan.desc}
            </p>

            {/* PRICE */}
            <div className="flex items-baseline gap-3 font-outfit">
              <span className="text-[#1B223C] font-medium text-[calc(var(--common-title)+20px)]">
                ₹{plan.price}
              </span>
              <span
                className={`font-light subTitle ${
                  isPremium ? "text-[#3C3C3C]" : "text-[#797878]"
                }`}
              >
                per month
              </span>
            </div>

            <p className="subTxt text-[#797878] mt-[1em]">
              <span className="font-light text-[#090909]">Delivery Time:</span>{" "}
              {plan.delivery_time}
            </p>

            {/* FEATURES */}
            <div className="py-7 my-7 border-y border-[#F6B501]">
              {isPremium && (
                <>
                  <p className="subTxt font-semibold leading-8 text-[#090909] mb-[0.8em]">
                    You Get EVERYTHING in Basic, plus:
                  </p>
                  <p className="subTxt font-semibold leading-8 text-[#090909] mb-[0.8em]">
                    Detailed Analysis
                  </p>
                </>
              )}
              <ul className="bodySub text-[#1B223C] font-light leading-9">
                {plan.features.map((feature, i) => (
                  <li key={i}>* {feature}</li>
                ))}
              </ul>
            </div>

            {/* OTHERS (optional) */}
            {plan.others?.map((group, i) => (
              <div key={i} className="pb-7 mb-7 border-b border-[#F6B501]">
                <p className="subTxt font-semibold leading-8 text-[#090909] mb-[0.8em]">
                  {group.title}
                </p>
                <ul className="bodySub text-[#1B223C] font-light leading-9">
                  {group.content.map((item, idx) => (
                    <li key={idx}>* {item}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* BEST FOR */}
            <div className="text-[calc(var(--body)+1px)] text-[#797878] font-light">
              <p className="text-[#090909]">Best For:</p>
              <p>{plan.best_for}</p>
            </div>

            {/* CTA */}
            <div className="mt-11">
              <Link
                href=""
                className={`p-3 lg:p-5 w-full rounded-full border font-semibold subTitle float-left text-center ${
                  isPremium
                    ? "bg-[#1B223C] text-white border-[#1B223C]"
                    : "text-[#1B223C] border-[#1B223C]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanGrid;