// Design System Components for Dialect Master

// Button variants - Enhanced for polish
export const buttonVariants = {
  primary: `
    bg-brand-brown text-white h-12 px-8 rounded-xl
    hover:bg-[#7A5233] active:scale-[0.98]
    transition-all duration-200 ease-out
    font-semibold text-base
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
    shadow-sm hover:shadow-md active:shadow-sm
    ring-2 ring-transparent focus:ring-brand-brown/50
  `,
  secondary: `
    bg-transparent text-[#4A4743] dark:text-gray-200 border-2 border-[#E5E2DB] dark:border-[#3D3A35] h-12 px-8 rounded-xl
    hover:bg-[#F5F3EF] dark:hover:bg-[#2A2825] active:scale-[0.98]
    transition-all duration-200 ease-out
    font-semibold text-base
  `,
  play: `
    bg-brand-brown text-white w-18 h-18 rounded-full
    hover:bg-[#7A5233] active:scale-95
    transition-all duration-200 ease-out
    flex items-center justify-center
    shadow-lg hover:shadow-xl active:shadow-lg
    ring-2 ring-transparent focus:ring-brand-brown/50
  `,
  ghost: `
    bg-transparent text-gray-500 dark:text-gray-400 h-10 px-4 rounded-lg
    hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98]
    transition-all duration-150
    font-medium text-sm
  `,
}

// Loading spinner component styles
export const spinnerStyles = `
  animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full
`

// Card variants - Enhanced with subtle shadows and polish
export const cardVariants = {
  lesson: `
    bg-white dark:bg-[#262320] 
    rounded-2xl border border-[#E5E2DB] dark:border-[#3D3A35]
    p-5
    shadow-sm hover:shadow-lg
    transition-all duration-200 ease-out
    hover:-translate-y-0.5
  `,
  phrase: `
    bg-white dark:bg-[#262320]
    rounded-2xl border border-[#E5E2DB] dark:border-[#3D3A35]
    p-6
    shadow-sm
    transition-all duration-200
  `,
  achievement: `
    bg-white dark:bg-[#262320]
    rounded-2xl border border-[#E5E2DB] dark:border-[#3D3A35]
    p-4 text-center
    shadow-sm hover:shadow-md
    transition-all duration-200
    hover:-translate-y-0.5
  `,
}

// Tone ladder visualization
export const toneLadderData = {
  1: { label: 'Tone 1', color: 'tone-1', contour: '═' },
  2: { label: 'Tone 2', color: 'tone-2', contour: '╱' },
  3: { label: 'Tone 3', color: 'tone-3', contour: '╲' },
  5: { label: 'Tone 5', color: 'tone-5', contour: '═' },
  6: { label: 'Tone 6', color: 'tone-6', contour: '╲_' },
  7: { label: 'Tone 7', color: 'tone-7', contour: '─┐' },
}

// Progress bar
export const progressBarConfig = {
  height: 'h-2',
  bg: 'bg-[#E5E2DB] dark:bg-[#3D3A35]',
  fill: 'bg-brand-brown',
  radius: 'rounded-full',
}

// Spacing tokens (in px)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

// Border radius tokens
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}
