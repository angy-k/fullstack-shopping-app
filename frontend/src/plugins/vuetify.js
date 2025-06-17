import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'


/**
 * Application theme configuration
 * 
 * This centralized theme definition ensures consistent styling across
 * the entire application. It defines:
 * - Color palette (primary, secondary, accent, etc.)
 * - Typography settings (font family, sizes, weights)
 * - Default component styling
 * - Custom CSS variables for spacing and other design tokens
 * - Light and dark theme variants
 */

// Common variables for both themes
const commonVariables = {
  // Border radius
  'border-radius': '4px',
  'border-radius-root': '4px',
  
  // Spacing units (can be used as $spacing-x in components)
  'spacing-1': '4px',
  'spacing-2': '8px',
  'spacing-3': '12px',
  'spacing-4': '16px',
  'spacing-5': '24px',
  'spacing-6': '32px',
  'spacing-7': '48px',
  'spacing-8': '64px',
  
  // Font settings
  'font-family': "'Roboto', sans-serif",
  'line-height-root': 1.5,
  'font-weight-regular': 400,
  'font-weight-medium': 500,
  'font-weight-bold': 700,
  
  // Font sizes
  'font-size-root': '16px',
  'body-font-size': '1rem',
  'body-font-weight': 400,
  'heading-font-weight': 500,
}

export default createVuetify({
  // Register all components and directives
  components,
  directives,
  
  // Theme configuration
  theme: {
    // Default theme is light
    defaultTheme: 'lightTheme',
    
    // Allow user to toggle between themes
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 1,
      darken: 2,
    },
    
    themes: {
      // Light theme
      lightTheme: {
        dark: false,
        colors: {
          // Main brand colors - Indigo blue palette
          primary: '#3F51B5',
          secondary: '#5C6BC0',
          accent: '#7986CB',
          
          // Semantic colors
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          error: '#FF5252',
          
          // Background colors
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-variant': '#F5F5F5',
          
          // Text colors
          'on-background': '#212121',
          'on-surface': '#212121',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-accent': '#000000',
        },
        variables: {
          ...commonVariables,
          // Light theme specific variables
          'shadow-key-umbra-opacity': 'rgba(0, 0, 0, 0.2)',
          'shadow-key-penumbra-opacity': 'rgba(0, 0, 0, 0.14)',
          'shadow-key-ambient-opacity': 'rgba(0, 0, 0, 0.12)',
        }
      },
      
      // Dark theme
      darkTheme: {
        dark: true,
        colors: {
          // Main brand colors - Indigo blue palette adjusted for dark theme
          primary: '#5C6BC0',
          secondary: '#7986CB',
          accent: '#9FA8DA',
          
          // Semantic colors - slightly adjusted for visibility
          info: '#64B5F6',
          success: '#81C784',
          warning: '#FFB74D',
          error: '#FF5252',
          
          // Background colors
          background: '#121212',
          surface: '#1E1E1E',
          'surface-variant': '#292929',
          
          // Text colors
          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-accent': '#000000',
        },
        variables: {
          ...commonVariables,
          // Dark theme specific variables
          'shadow-key-umbra-opacity': 'rgba(0, 0, 0, 0.2)',
          'shadow-key-penumbra-opacity': 'rgba(0, 0, 0, 0.14)',
          'shadow-key-ambient-opacity': 'rgba(0, 0, 0, 0.12)',
        }
      }
    }
  },
  
  // Default props for components
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 2,
    },
    VBtn: {
      rounded: 'md',
      elevation: 1,
      variant: 'elevated',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VContainer: {
      fluid: true,
    }
  },
  
  // Default icon configuration
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
})
