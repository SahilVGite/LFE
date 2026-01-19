import React from 'react'
import BadgeTitle from '../BadgeTitle';
import { features, title } from 'process';
import PlanGrid from '../plan/PlanGrid';

const pricingPlan = [
    {
        premium: false,
        title: "Free Plan",
        desc: "Quick Case Snapshot",
        price: 0,
        delivery_time: "Instant (0 minutes)",
        features: [
            "Instant case timeline estimate (very basic range)",
            "Basic success likelihood (high-level percentage band: e.g., Low / Medium / High)",
            "Basic risk flags (only top 2 major risks identified)",
            "No strategy explanation",
            "No opponent analysis",
            "No breakdown of case stages",
            "No legal expert review",
            "No consultation",
        ],
        best_for: "Users who want an immediate, high-level sense of their case before proceeding.",
        cta: "Try Free Snapshot",
    },
    {
        premium: false,
        title: "Basic Plan",
        desc: "Short Case Report",
        price: 99,
        delivery_time: "Within 5 minutes",
        features: [
            "Refined timeline prediction (stage-based rough estimate)",
            "Success chance analysis (more accurate percentage range)",
            "Detailed risk indicators (Top 5 risks)",
            "Opponent stand (basic assumptions)",
            "Our stand (basic positioning)",
            "Obstacles analysis (basic list)",
            "Interim relief prediction (basic yes/no likelihood with timeline band)",
            "Final relief prediction (probable timeline band)",
            "Reason-based outcomes (very short explanation)",
            "Support access via chat only (no call)",
        ],
        best_for: "Users who want a quick but meaningful understanding before taking action.",
        cta: "Buy Basic Report — ₹99",
        others: [
            {
                title: "Not Included:",
                content: [
                    "No case strategy",
                    "No deep analysis of delays",
                    "No probability breakdowns",
                    "No expert insights",
                    "No call with lawyer",
                ],
            },
        ],
    },
    {
        premium: true,
        title: "Premium Plan",
        desc: "Full Case Blueprint",
        price: 149,
        delivery_time: "Within 10 minutes",
        features: [
            "Stage-wise timeline with date estimates",
            "Deep success probability (scenario-wise % breakdown)",
            "Detailed opponent stand prediction",
            "Detailed ‘Our Stand’ strategy",
            "Delay pattern analysis (reasons for fast/slow cases)",
            "Objections clearing time + listing time",
            "Interim relief prediction (timelines + factors influencing outcome)",
            "Final relief prediction with confidence levels",
            "All impediments mapped (complete list)",
            "Case outcome possibilities (3-5 scenarios)",
        ],
        best_for: "Users who want complete clarity before filing, defending, or settling their case.",
        cta: "Get Full Case Blueprint — ₹149",
        others: [
            {
                title: "Clarity Tools:",
                content: [
                    "Detailed explainer summary (why your case is strong/weak)",
                    "Suggested next steps",
                    "Suggested evidence list (high level)",
                    "Priority customer support.",
                ],
            },
        ],
    },
];

const Pricing = () => {
    return (
        <section id='pricing' className='commonGap relative'>
            <div className='main-wrapper'>
                <div className='relative'>
                    <img src="/hmPricingTop.png" alt="" className='absolute max-w-[26%]  md:max-w-[16%] [@media(min-width:1650px)]:max-w-75 -top-14  left-4 md:left-7 [@media(min-width:1650px)]:-left-25 z-10' />
                    <img src="/hmPricingBtm.png" alt="" className='absolute -bottom-14 lg:-bottom-25 right-7 max-w-[22%]  md:max-w-[12%] [@media(min-width:1650px)]:max-w-52 z-10' />
                    <div className='rounded-3xl shadow-[14px_17px_33px_4px_rgba(112,144,176,0.08)] bg-[#FFFEF6] px-4 pt-10 md:pt-12 lg:pt-25 pb-20 md:pb-26 lg:pb-50 relative overflow-hidden'>
                        <img src="/hmpricingbgtop.png" alt="" className='absolute top-0 w-full z-2' />
                        <BadgeTitle badge='Trust Indicators' title='Find your perfect plan' className='mb-6 md:mb-10 lg:mb-16 text-center relative z-20' />
                        <PlanGrid plans={pricingPlan} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pricing;
