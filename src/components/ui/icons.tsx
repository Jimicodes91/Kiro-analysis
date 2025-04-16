export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  dashboard: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.25 19.5V15c0-.199-.079-.3897-.2197-.5304-.1406-.1406-.3314-.2196-.5303-.2196h-3c-.1989 0-.3897.079-.53033.2196-.14065.1407-.21967.3314-.21967.5304v4.5c0 .1989-.07902.3896-.21967.5303-.14065.1406-.33142.2197-.53033.2197H4.5c-.19891 0-.38968-.0791-.53033-.2197-.14065-.1407-.21967-.3314-.21967-.5303v-8.6719c.00168-.1038.02411-.2062.06597-.3012.04186-.095.10231-.1807.17778-.2519l7.49995-6.81567c.1383-.12649.3189-.19663.5063-.19663.1874 0 .368.07014.5062.19663l7.5 6.81567c.0755.0712.136.1569.1778.2519.0419.095.0643.1974.066.3012V19.5c0 .1989-.079.3896-.2197.5303-.1406.1406-.3314.2197-.5303.2197H15c-.1989 0-.3897-.0791-.5303-.2197-.1407-.1407-.2197-.3314-.2197-.5303Z"
      />
    </svg>
  ),
  event: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M14.625 2.8125H3.375c-.31066 0-.5625.25184-.5625.5625v11.25c0 .3107.25184.5625.5625.5625h11.25c.3107 0 .5625-.2518.5625-.5625V3.375c0-.31066-.2518-.5625-.5625-.5625ZM12.375 1.6875v2.25M5.625 1.6875v2.25M2.8125 6.1875h12.375"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M6.46875 9H8.4375l-1.125 1.4062c.18515-.0003.36751.0451.53091.1322.1634.087.30279.2131.4058.3669.10302.1539.16647.3307.18473.515.01826.1842-.00923.3701-.08004.5412-.07081.1711-.18275.322-.32588.4395-.14313.1174-.31304.1977-.49465.2337-.1816.0361-.3693.0267-.54642-.0272-.17713-.0539-.33822-.1506-.46898-.2817M10.125 9.84375 11.25 9v3.6562"
      />
    </svg>
  ),

  checkbox: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 11 3 3L22 4m-1 8v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
      />
    </svg>
  ),

  project: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 14.25h6M9 11.25h6M15 3.75h3.75c.1989 0 .3897.07902.5303.21967.1407.14065.2197.33142.2197.53033v15.75c0 .1989-.079.3897-.2197.5303-.1406.1407-.3314.2197-.5303.2197H5.25c-.19891 0-.38968-.079-.53033-.2197C4.57902 20.6397 4.5 20.4489 4.5 20.25V4.5c0-.19891.07902-.38968.21967-.53033.14065-.14065.33142-.21967.53033-.21967H9"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 6.75V6c0-.99456.39509-1.94839 1.09835-2.65165C10.0516 2.64509 11.0054 2.25 12 2.25c.9946 0 1.9484.39509 2.6517 1.09835C15.3549 4.05161 15.75 5.00544 15.75 6v.75h-7.5Z"
      />
    </svg>
  ),

  users: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 16.875c2.0711 0 3.75-1.6789 3.75-3.75s-1.6789-3.75-3.75-3.75c-2.07107 0-3.75 1.6789-3.75 3.75s1.67893 3.75 3.75 3.75ZM18.375 10.875c.8735-.0015 1.7353.2012 2.5166.5919.7813.3906 1.4605.9584 1.9834 1.6581M1.125 13.125c.52294-.6997 1.20214-1.2675 1.98343-1.6581.78129-.3907 1.64306-.5934 2.51657-.5919M6.60001 20.25c.49389-1.0114 1.26195-1.8639 2.21666-2.4601.95472-.5963 2.05773-.9125 3.18333-.9125 1.1256 0 2.2286.3162 3.1833.9125.9548.5962 1.7228 1.4487 2.2167 2.4601"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.625 10.875c-.5694.0006-1.1272-.1609-1.60824-.4656-.48103-.3046-.86543-.7399-1.10827-1.25491-.24285-.51502-.33411-1.08851-.26313-1.65347.07098-.56495.30127-1.09804.66397-1.53698.3627-.43893.84283-.76559 1.38427-.94179.54145-.1762 1.12187-.19467 1.67343-.05326.55155.14142 1.05148.43688 1.44136.85186.38987.41498.6536.93235.76036 1.49165M15.4312 7.3125c.1068-.5593.3705-1.07667.7604-1.49165.3899-.41498.8898-.71044 1.4414-.85186.5515-.14141 1.1319-.12294 1.6734.05326.5414.1762 1.0216.50286 1.3843.94179.3627.43894.593.97203.6639 1.53698.071.56496-.0202 1.13845-.2631 1.65347-.2428.51501-.6272.95031-1.1083 1.25491-.481.3047-1.0388.4662-1.6082.4656"
      />
    </svg>
  ),

  settings: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        clipPath="url(#a)"
      >
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a1.998 1.998 0 0 1 0 2.83 1.998 1.998 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a1.998 1.998 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 3.417 1.415 2 2 0 0 1-.587 1.415l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  ),

  logout: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M7.5 17.5H4.167A1.667 1.667 0 0 1 2.5 15.833V4.167A1.667 1.667 0 0 1 4.167 2.5H7.5m5.833 11.667L17.5 10m0 0-4.167-4.167M17.5 10h-10"
      />
    </svg>
  ),

  menu: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 12"
      fill="none"
      width="16"
      height="12"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 1a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm0 10a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm1-6a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2H1Z"
        clipRule="evenodd"
      />
    </svg>
  ),

  bell: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 18"
      fill="none"
      width="16"
      height="18"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.875 12.654c-.617-.714-1.77-1.787-1.77-5.304 0-2.67-1.74-4.81-4.084-5.334V1.3C9.02.693 8.564.2 8 .2c-.564 0-1.02.493-1.02 1.1v.716C4.633 2.541 2.894 4.68 2.894 7.35c0 3.517-1.153 4.59-1.77 5.304a1.12 1.12 0 0 0-.275.746c.004.564.414 1.1 1.025 1.1h12.25c.61 0 1.022-.536 1.025-1.1a1.12 1.12 0 0 0-.275-.746Zm-11.87.196c.678-.961 1.418-2.555 1.422-5.48l-.002-.02c0-2.126 1.6-3.85 3.575-3.85s3.575 1.724 3.575 3.85l-.002.02c.004 2.925.744 4.519 1.421 5.48H3.006ZM8 17.8c1.127 0 2.042-.985 2.042-2.2H5.958c0 1.215.915 2.2 2.042 2.2Z"
      />
    </svg>
  ),
  more: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M10 10.834a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM10 5a.833.833 0 1 0 0-1.667A.833.833 0 0 0 10 5ZM10 16.667A.833.833 0 1 0 10 15a.833.833 0 0 0 0 1.667Z"
      />
    </svg>
  ),
  arrow: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M15.833 10H4.167m0 0L10 15.833M4.167 10 10 4.167"
      />
    </svg>
  ),
  right_arrow: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M4.16663 10.0003H15.8333m0 0L9.99996 4.16699m5.83334 5.83331-5.83334 5.8334"
      />
    </svg>
  ),
  caret: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="m5 7.5 5 5 5-5"
      />
    </svg>
  ),
  chevron: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 17"
      fill="none"
      width="16"
      height="17"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.273 11.167h7.454a.667.667 0 0 0 .466-1.14l-3.72-3.72a.666.666 0 0 0-.946 0l-3.72 3.72a.667.667 0 0 0 .466 1.14Z"
      />
    </svg>
  ),
  file: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      width="18"
      height="18"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          d="M10.5 5.25V.345a5.233 5.233 0 0 1 1.849 1.193l2.613 2.614A5.217 5.217 0 0 1 16.155 6H11.25a.75.75 0 0 1-.75-.75Zm6 2.614v6.386A3.754 3.754 0 0 1 12.75 18h-7.5a3.755 3.755 0 0 1-3.75-3.75V3.75A3.755 3.755 0 0 1 5.25 0h3.386c.122 0 .243.01.364.018V5.25a2.25 2.25 0 0 0 2.25 2.25h5.232c.008.12.018.242.018.364Zm-3.957 2.87a.75.75 0 0 0-1.06-.027l-2.7 2.573a.751.751 0 0 1-1.092-.03L6.5 12.19a.752.752 0 0 0-.999 1.12l1.158 1.03a2.25 2.25 0 0 0 3.17.014l2.689-2.561a.75.75 0 0 0 .026-1.06Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  download: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      width="16"
      height="16"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M6.585 12.081a2 2 0 0 0 2.829.001l2.141-2.141A.667.667 0 0 0 10.613 9l-1.95 1.951L8.666.667a.667.667 0 0 0-1.334 0l-.006 10.272L5.387 9a.667.667 0 1 0-.942.943l2.14 2.138Z" />
        <path d="M15.333 10.666a.667.667 0 0 0-.666.667V14a.667.667 0 0 1-.667.666H2A.667.667 0 0 1 1.333 14v-2.667a.667.667 0 1 0-1.333 0V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.667a.667.667 0 0 0-.667-.667Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  check: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      width="16"
      height="16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 3 4.5 8.5 2 6"
      />
    </svg>
  ),
  coins: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M6.75 8.4375c3.1066 0 5.625-1.13328 5.625-2.53125S9.8566 3.375 6.75 3.375 1.125 4.50828 1.125 5.90625 3.6434 8.4375 6.75 8.4375Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M1.125 5.90625v2.8125C1.125 10.118 3.64219 11.25 6.75 11.25s5.625-1.132 5.625-2.53125v-2.8125M4.5 8.22656v2.81254"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M12.375 6.79932c2.5664.23906 4.5 1.25859 4.5 2.48203 0 1.39925-2.5172 2.53125-5.625 2.53125-1.37813 0-2.64375-.225-3.62109-.5906"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M5.625 11.2008v.893c0 1.3992 2.51719 2.5312 5.625 2.5312 3.1078 0 5.625-1.132 5.625-2.5312V9.28125M13.5 11.6016v2.8125M9 8.22656v6.18754"
      />
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  loader: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      width="56"
      height="56"
      fill="none"
      {...props}
    >
      <path
        stroke="#D4DDD6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
        d="M53 28a25 25 0 1 1-50 0 25 25 0 0 1 50 0h0Z"
      />
      <path
        stroke="#4B7153"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
        d="M28 3a25 25 0 0 1 25 25"
      />
    </svg>
  ),
  admin: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" {...props}>
      <path
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="1.125"
        d="M7.59375 11.25c2.32995 0 4.21875-1.8888 4.21875-4.21875S9.9237 2.8125 7.59375 2.8125 3.375 4.7013 3.375 7.03125 5.2638 11.25 7.59375 11.25Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
        d="M1.56097 14.0623c.73917-.881 1.66231-1.5894 2.70455-2.0754 1.04224-.486 2.17827-.7379 3.32827-.7379 1.14999 0 2.28603.2519 3.32831.7379 1.0422.486 1.9653 1.1944 2.7045 2.0754M15.4688 10.6875c.6213 0 1.125-.5037 1.125-1.125 0-.62132-.5037-1.125-1.125-1.125-.6214 0-1.125.50368-1.125 1.125 0 .6213.5036 1.125 1.125 1.125ZM15.4688 8.4375v-.84375M14.4914 9l-.7242-.42188M14.4914 10.125l-.7242.4219M15.4688 10.6875v.8437M16.4461 10.125l.7242.4219M16.4461 9l.7242-.42188"
      />
    </svg>
  ),
};
