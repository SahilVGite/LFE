type Props = React.SVGProps<SVGSVGElement>;

const WhiteArrowUp = (props: Props) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dd_3570_4448)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.51589 10.3695C3.31563 10.1692 3.20313 9.8975 3.20312 9.61423C3.20312 9.33097 3.31563 9.05931 3.51589 8.85898L9.92539 2.44949C10.1257 2.24922 10.3974 2.13672 10.6806 2.13672C10.9639 2.13672 11.2356 2.24922 11.4359 2.44949L17.8454 8.85898C18.04 9.06046 18.1477 9.3303 18.1452 9.61039C18.1428 9.89048 18.0304 10.1584 17.8324 10.3565C17.6343 10.5545 17.3664 10.6669 17.0863 10.6693C16.8062 10.6718 16.5364 10.5641 16.3349 10.3695L11.7489 5.78349V18.1602C11.7489 18.4435 11.6363 18.7153 11.436 18.9156C11.2357 19.1159 10.964 19.2285 10.6806 19.2285C10.3973 19.2285 10.1256 19.1159 9.92527 18.9156C9.72494 18.7153 9.61239 18.4435 9.61239 18.1602V5.78349L5.0264 10.3695C4.82607 10.5698 4.55441 10.6823 4.27115 10.6823C3.98788 10.6823 3.71622 10.5698 3.51589 10.3695Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_3570_4448"
          x="-1.06987"
          y="-2.13628"
          width="23.4874"
          height="25.6358"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.1365" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3570_4448"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.06825" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_3570_4448"
            result="effect2_dropShadow_3570_4448"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_3570_4448"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default WhiteArrowUp;
