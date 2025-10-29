import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

/**
 * OAuth redirect handler
 * This screen handles the OAuth callback and immediately redirects back to home
 */
export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Immediately navigate back to home
    // The OAuth hook has already captured the code from the URL
    router.replace('/(tabs)/home');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
