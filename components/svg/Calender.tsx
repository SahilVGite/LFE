type Props = React.SVGProps<SVGSVGElement>;

const Calender = (props: Props) => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 1.16667H9.91667V0H8.75V1.16667H2.91667V0H1.75V1.16667H1.16667C0.525 1.16667 0 1.69167 0 2.33333V11.6667C0 12.3083 0.525 12.8333 1.16667 12.8333H10.5C11.1417 12.8333 11.6667 12.3083 11.6667 11.6667V2.33333C11.6667 1.69167 11.1417 1.16667 10.5 1.16667ZM10.5 11.6667H1.16667V5.25H10.5V11.6667ZM10.5 4.08333H1.16667V2.33333H10.5V4.08333Z"
        fill="#0D0D0D"
      />
    </svg>
  );
};

export default Calender;
