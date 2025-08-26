// Tema e paleta de cores consistente para o sistema Minerva

export const theme = {
  colors: {
    // Cores principais
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Cores secundárias (roxo/violeta)
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Cores de status
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Cores neutras
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },

  // Componentes específicos
  components: {
    button: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105',
      secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105',
      outline: 'border-gray-200 hover:bg-gray-50 transition-colors duration-200',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200',
    },
    
    card: {
      base: 'bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200',
      elevated: 'bg-white rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-200',
    },

    input: {
      base: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    },

    badge: {
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      danger: 'bg-red-50 text-red-700 border-red-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  },

  // Animações
  animations: {
    fadeIn: 'animate-in fade-in duration-200',
    slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200',
  },
}

// Utilidades de CSS classes
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Classes Tailwind predefinidas para componentes
export const componentClasses = {
  pageContainer: 'space-y-6 p-6',
  pageHeader: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
  pageTitle: 'text-3xl font-bold text-gray-900',
  pageSubtitle: 'text-gray-600',
  
  card: theme.components.card.base,
  cardElevated: theme.components.card.elevated,
  
  buttonPrimary: theme.components.button.primary,
  buttonSecondary: theme.components.button.secondary,
  buttonOutline: theme.components.button.outline,
  buttonDanger: theme.components.button.danger,
  
  input: theme.components.input.base,
  inputError: theme.components.input.error,
  
  statsGrid: 'grid grid-cols-1 md:grid-cols-4 gap-4',
  formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  
  searchSection: 'bg-white rounded-xl p-6 border border-gray-100 shadow-sm',
  tableSection: 'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden',
}