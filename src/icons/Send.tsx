import SVGWrap from './SVGWrap';

interface Props {
  size?: number;
  className?: string;
  onClick?: () => void;
  title?: string;
  ['aria-label']?: string;
}

export default function Send({ size = 24, className = '', ...props }: Props) {
  return (
    <SVGWrap
      {...props}
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <g fill="none">
        <path d="M24 0v24H0V0z" />
        <path
          fill="currentColor"
          d="m21.433 4.861l-6 15.5a1 1 0 0 1-1.624.362l-3.382-3.235l-2.074 2.073a.5.5 0 0 1-.853-.354v-4.519L2.309 9.723a1 1 0 0 1 .442-1.691l17.5-4.5a1 1 0 0 1 1.181 1.329ZM19 6.001L8.032 13.152l1.735 1.66L19 6Z"
        />
      </g>
    </SVGWrap>
  );
}
