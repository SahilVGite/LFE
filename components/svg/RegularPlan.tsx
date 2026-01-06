type Props = React.SVGProps<SVGSVGElement>;

const RegularPlan = (props: Props) => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3570_7194)">
        <rect width="56" height="56" rx="14" fill="#F69001" />
        <circle
          cx="7.87262"
          cy="21.0921"
          r="41.5381"
          transform="rotate(-0.403168 7.87262 21.0921)"
          fill="url(#paint0_linear_3570_7194)"
          stroke="url(#paint1_linear_3570_7194)"
          strokeWidth="0.085853"
        />
        <circle
          cx="28.0914"
          cy="50.7757"
          r="41.5381"
          transform="rotate(-0.403168 28.0914 50.7757)"
          fill="url(#paint2_linear_3570_7194)"
          stroke="url(#paint3_radial_3570_7194)"
          strokeWidth="0.085853"
        />
        <path
          d="M40 28C40 34.6274 34.6274 40 28 40C21.3726 40 16 34.6274 16 28C16 21.3726 21.3726 16 28 16M34.6667 28C34.6667 31.6819 31.6819 34.6667 28 34.6667C24.3181 34.6667 21.3333 31.6819 21.3333 28C21.3333 24.3181 24.3181 21.3333 28 21.3333M31.6772 24.4688L36.9558 25.0232L39.8172 21.0172L36.3835 19.8727L35.239 16.439L31.233 19.3004L31.6772 24.4688ZM31.6772 24.4688L28 27.9999"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_3570_7194"
          x1="7.87262"
          y1="-20.4889"
          x2="7.87262"
          y2="62.6732"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6B501" stopOpacity="0.56" />
          <stop offset="1" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3570_7194"
          x1="51.4246"
          y1="16.9581"
          x2="-44.9089"
          y2="38.3014"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6B501" />
          <stop offset="1" stopColor="#F6B501" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3570_7194"
          x1="28.0914"
          y1="9.19466"
          x2="28.0914"
          y2="92.3568"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6B501" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F6B501" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient
          id="paint3_radial_3570_7194"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(28.0914 50.7757) rotate(89.968) scale(86.1425)"
        >
          <stop offset="0.046875" stopColor="#F6B501" stopOpacity="0" />
          <stop offset="1" stopColor="#F6B501" />
        </radialGradient>
        <clipPath id="clip0_3570_7194">
          <rect width="56" height="56" rx="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RegularPlan;