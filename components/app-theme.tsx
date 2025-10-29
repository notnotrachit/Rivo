import { Colors } from '@/constants/colors'
import { DarkTheme as AppThemeDark, DefaultTheme as AppThemeLight, ThemeProvider } from '@react-navigation/native'
import { PropsWithChildren } from 'react'
import { useColorScheme } from 'react-native'

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const palette = isDark ? Colors.dark : Colors.light
  const base = isDark ? AppThemeDark : AppThemeLight
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.tint,
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.border,
      notification: palette.tint,
    },
  }
  return {
    colorScheme,
    isDark,
    theme,
  }
}

export function AppTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()

  return <ThemeProvider value={theme}>{children}</ThemeProvider>
}
