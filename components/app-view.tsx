import { useThemeColor } from '@/hooks/use-theme-color'
import React from 'react'
import { View, type ViewProps } from 'react-native'

export function AppView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor({}, 'background')

  return <View style={[{ backgroundColor, gap: 12 }, style]} {...otherProps} />
}
