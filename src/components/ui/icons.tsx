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
        d="M18 20V10m-6 10V4M6 20v-6"
      />
    </svg>
  ),
  model: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 25"
      fill="none"
      width="24"
      height="25"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m2 17.5 10 5 10-5m-20-5 10 5 10-5m-10-10-10 5 10 5 10-5-10-5Z"
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

  flag: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 25"
      fill="none"
      width="24"
      height="25"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 15.5s1-1 4-1 5 2 8 2 4-1 4-1v-12s-1 1-4 1-5-2-8-2-4 1-4 1v12Zm0 0v7"
      />
    </svg>
  ),

  users: (props: IconProps) => (
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
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m22 0v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
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
  redirect: (props: IconProps) => (
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
        d="M4.5 7 2 4.5m0 0L4.5 2M2 4.5h6c.53043 0 1.03914.21071 1.41421.58579C9.78929 5.46086 10 5.96957 10 6.5V10"
      />
    </svg>
  ),
  forward: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m16 17-1.425-1.4 4.6-4.6-4.6-4.6L16 5l6 6-6 6ZM2 19v-4c0-1.383.483-2.558 1.45-3.525C4.433 10.492 5.617 10 7 10h6.175l-3.6-3.6L11 5l6 6-6 6-1.425-1.4 3.6-3.6H7c-.833 0-1.542.292-2.125.875A2.893 2.893 0 0 0 4 15v4H2Z"
      />
    </svg>
  ),
  time_delete: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      width="18"
      height="18"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M17.03 17.03a.75.75 0 0 1-1.06 0l-1.06-1.06-1.062 1.06a.75.75 0 0 1-1.08-1.041l.02-.019 1.06-1.06-1.06-1.062a.75.75 0 0 1 1.041-1.079l.02.019 1.06 1.06 1.06-1.06a.75.75 0 0 1 1.08 1.042l-.019.018-1.06 1.062 1.06 1.06a.747.747 0 0 1 .006 1.059c-.001.001-.002.003-.006.002Z" />
        <path d="M10.526 15.011a4.478 4.478 0 0 1 7.143-3.602 8.999 8.999 0 1 0-6.262 6.263 4.463 4.463 0 0 1-.88-2.66ZM9.75 9.017c0 .199-.08.39-.22.53l-2.254 2.255a.751.751 0 0 1-1.062-1.063l2.034-2.034V5.26a.751.751 0 1 1 1.502 0v3.757Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  time_fast: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      width="18"
      height="18"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M7.5 17.25a.75.75 0 0 1-.75.75h-6a.75.75 0 1 1 0-1.5h6a.75.75 0 0 1 .75.75ZM.75 15h4.5a.75.75 0 1 0 0-1.5H.75a.75.75 0 1 0 0 1.5ZM.75 12h3a.75.75 0 1 0 0-1.5h-3a.75.75 0 1 0 0 1.5Z" />
        <path d="M9 0a9 9 0 0 0-9 9c0 .046.006.09.007.136.238-.088.49-.133.743-.136h3a2.242 2.242 0 0 1 2.085 3.087 2.231 2.231 0 0 1 1.5 3 2.211 2.211 0 0 1 1.53 2.906c.045 0 .09.007.135.007A9 9 0 0 0 9 0Zm2.78 11.78a.75.75 0 0 1-1.06 0L8.47 9.53A.75.75 0 0 1 8.25 9V5.25a.75.75 0 0 1 1.5 0v3.44l2.03 2.03a.75.75 0 0 1 0 1.06Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  time_check: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      width="18"
      height="18"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M14.213 17.25h-.024a1.404 1.404 0 0 1-1.008-.45l-1.439-1.41a.75.75 0 0 1 .016-1.06l.003-.003a.75.75 0 0 1 1.057.018l1.396 1.367 2.506-2.505a.75.75 0 0 1 1.06 1.06l-2.566 2.566a1.402 1.402 0 0 1-1 .418Z" />
        <path d="M10.526 15.011a4.478 4.478 0 0 1 7.143-3.602 8.999 8.999 0 1 0-6.262 6.263 4.463 4.463 0 0 1-.88-2.66ZM9.75 9.017c0 .199-.08.39-.22.53l-2.254 2.255a.751.751 0 0 1-1.062-1.063l2.034-2.034V5.26a.751.751 0 1 1 1.502 0v3.757Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
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
};
