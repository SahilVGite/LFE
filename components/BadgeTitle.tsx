import React from "react";
import { Badge } from "./ui/badge";

const BadgeTitle = ({ badge = "Badge", title = "Title", className = "", titleGap = '' }) => {
  return (
    <div className={`${className}`}>
      <span className="mb-4.5 text-primary secTitle font-semibold tracking-[-0.0625em]">{badge}</span>
      <h2 className="commonTitle" style={{...(titleGap && { letterSpacing: titleGap }),}}>
        {title}
      </h2>
    </div>
  );
};

export default BadgeTitle;
