// components/LogoImage.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Image, ImageStyle } from 'expo-image'; // Using expo-image

// Define the type for the props, allowing custom styles
type LogoImageProps = {
  style?: ImageStyle; // Allow passing custom styles
};

// The reusable LogoImage component
export function LogoImage({ style }: LogoImageProps) {
  return (
    <Image
      source={require('@/assets/images/brandIcon.png')} // Adjust path if your logo is elsewhere
      // Combine default styles with any custom styles passed in
      style={[styles.logo, style]}
      contentFit="contain" // Or 'cover', 'fill', etc. as needed
    />
  );
}

// Default styles for the logo
const styles = StyleSheet.create({
  logo: {
    width: 45, // Default width
    height: 45, // Default height
    //transform: 'translateY(-7.5%)'
  },
});
