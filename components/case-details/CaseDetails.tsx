import React from "react";
import { ShareFacebook, ShareInsta, ShareTelegram } from "../svg";
import CaseDetailsPagination from "./CaseDetailsPagination";
import Link from "next/link";

const CaseDetails = () => {
  return (
    <section className="pb-20 md:pb-24 lg:pb-50;">
      <div className="max-w-[90%] md:max-w-[80%] mx-auto">
        <div className="my-6 lg:my-11">
            <h2 className="commonTitle mb-3 lg:mb-6">Barhamdeo Narain Sing vs Mackenzie And Anr. on 1 September, 1844</h2>
            <div className="flex items-center gap-4">
                <span className="font-jakarta subBody font-medium text-[#0D0D0D]">By Charles Herron</span>
                <span className="font-jakarta subBody font-medium text-[#0D0D0D]">
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="2" cy="2" r="2" fill="#0D0D0D"/>
                    </svg>
                </span>
                <span className="font-jakarta subBody font-medium text-[#0D0D0D]">20 Dec 2025</span>
            </div>
        </div>
        <div className="font-poppins font-light text-[#4D5461] bodySub leading-[1.9em]">
            <div className="mb-8">
                <p>Mitter and Pigot, JJ.</p>
                <p>1. These appeals arise out of suits instituted by the plaintiff, who is the lessor of the mouzah in which the lands in suit are situated, to eject the defendants from their holdings.</p>
                <p>2. Amongst other pleas, the defendants pleaded want of sufficient notice, and set up their right of occupancy in bar of the plaintiff's claim for ejectment. As regards the notice, the admitted facts are these: The notice itself is dated 19th Bysack 1288, corresponding with the 3rd May 1881. The notice informed the ryot that he was to quit his holding within seven days. It was served on the ryot on the 23rd Bysack 1288, corresponding with the 7th of May 1881, and the present suits were brought on the 13th of May 1881, that is to say, one day before the term given in the notice expired. Upon both these points issues were framed by the Munsif, who came to the conclusion that the defendant's plea, as regards the insufficiency of notice, was fully made out, but the Munsif's finding was against the defendants, the ryots, upon the other issue, vis., as to whether or not they had acquired a right of occupancy. The Munsif upon his findings dismissed the plaintiff's suit. It is quite clear that the order of dismissal is based upon his finding upon the question of notice. Against that decree the ryots (defendants) appealed, and the Subordinate Judge on appeal has affirmed the decision and the decree of the lower Court. One of the points raised before the Subordinate Judge was that it was unnecessary for the Munsif to record any finding upon the question whether or not the defendants had a right of occupancy, because the Munsif's finding, that the notice upon the defendants was insufficient, was quite sufficient to dispose of the case. The Subordinate Judge overruled this objection, on the ground that the Munsif, in a suit which was appealable, had ample discretion to go into the question of the defendants having rights of occupancy or not, although his finding upon the question of notice was quite sufficient to dispose of the case. In second appeal by the defendants it has been urged that upon the admitted facts of this case, it being quite clear that the plaintiff had no cause of action on the date when the suit was brought, it was unnecessary for the lower Courts to go into any other questions. On the other hand, the learned Counsel for the respondent relies upon the provisions of Section 204 of the Civil Procedure Code to support the view taken by the lower Courts upon this point. Section 204 says: "In suits in which issues have been framed, the Court shall state its finding or decision, with the reason thereof, upon each separate issue, unless the finding upon any one or more of the issues be sufficient for the decision of the suit." In this case the facts relating to the service of notice being all admitted by the plaintiff, it seems to us that the case clearly came within the last three lines of Section 204. It is quite clear that the finding upon the question of notice, which finding was based upon the admitted facts of the case, was quite sufficient to dispose of it finally. We are, therefore, of opinion that the objection taken before us upon this point is valid, and we accordingly set aside the decisions of the Courts below upon the question whether or not the defendants have established their right of occupancy upon the holdings in dispute.</p>
                <p>3. Each party will pay his own costs in this Court and in the lower Appellate Court.</p>
            </div>
            <div className="mb-8">
                <p>This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.</p>
            </div>
            <div className="mb-8">
                <p>This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.</p>
            </div>
        </div>
        <div className="font-jakarta subTxt font-medium text-[#0D0D0D] flex items-center gap-2.5 lg:mt-40 my-10 lg:mb-20">
            <span>Share:</span>
            <Link href="javascript:;" target="_blank"><ShareFacebook /></Link>
            <Link href="javascript:;" target="_blank"><ShareTelegram /></Link>
            <Link href="javascript:;" target="_blank"><ShareInsta /></Link>
        </div>
        <CaseDetailsPagination />
      </div>
    </section>
  );
};

export default CaseDetails;
