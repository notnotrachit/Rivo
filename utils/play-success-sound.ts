import { Audio } from 'expo-av'

let cachedSound: Audio.Sound | null = null
let isLoading = false

export async function playSuccessSound(): Promise<void> {
  try {
    if (!cachedSound && !isLoading) {
      isLoading = true
      const { sound } = await Audio.Sound.createAsync(require('../assets/success.mp3'))
      cachedSound = sound
      isLoading = false
    }

    if (cachedSound) {
      await cachedSound.replayAsync()
    }
  } catch (e) {
    // Non-fatal: if sound fails, don't break UX
    console.warn('Failed to play success sound:', e)
  }
}


