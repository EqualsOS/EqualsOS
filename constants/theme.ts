/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const DEFAULT_CONTAINER_BACKGROUND_COLOUR = '#111111';
export const DEFAULT_BACKGROUND_COLOUR = '#203a43';
export const DARK_BACKGROUND_COLOUR = '#140924';
export const FONT_FAMILY_GORDITA_LIGHT = 'Gordita-Light';
export const FONT_FAMILY_GORDITA_BOLD = 'Gordita-Light';

export const Colors = {
  light: {
    //text: '#11181C',
    text: '#fff',
    //background: '#fff',
    background: DEFAULT_BACKGROUND_COLOUR,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    //background: '#151718',
    background: DARK_BACKGROUND_COLOUR,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    // 2025-10-20 Added the Gordita font family.
    regular: FONT_FAMILY_GORDITA_LIGHT,
    bold: FONT_FAMILY_GORDITA_BOLD,

    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    // 2025-10-20 Added the Gordita font family.
    regular: FONT_FAMILY_GORDITA_LIGHT,
    bold: FONT_FAMILY_GORDITA_BOLD,

    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    // 2025-10-20 Added the Gordita font family.
    regular: FONT_FAMILY_GORDITA_LIGHT,
    bold: FONT_FAMILY_GORDITA_BOLD,

    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
