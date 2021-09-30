import React from 'react'

const LangIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 469.333 469.333"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M253.227 300.267L199.04 246.72l.64-.64c37.12-41.387 63.573-88.96 79.147-139.307h62.507V64H192V21.333h-42.667V64H0v42.453h238.293c-14.4 41.173-36.907 80.213-67.627 114.347-19.84-22.08-36.267-46.08-49.28-71.467H78.72c15.573 34.773 36.907 67.627 63.573 97.28l-108.48 107.2L64 384l106.667-106.667 66.347 66.347 16.213-43.413zM373.333 192h-42.667l-96 256h42.667l24-64h101.333l24 64h42.667l-96-256zm-56 149.333L352 248.853l34.667 92.48h-69.334z"
    />
  </svg>
)

export default LangIcon
