# Beauty Camera App - AI Coding Instructions

## Architecture Overview

This is a cross-platform beauty camera app built with **Expo Router + Gluestack UI + NativeWind**. The stack combines:

-   **Expo Router** (v6) for file-based navigation with typed routes (`app/` directory)
-   **Gluestack UI** components with custom theme system via CSS variables
-   **NativeWind v4** for Tailwind CSS styling in React Native
-   **Expo Camera** for selfie capture functionality

Key architectural decisions:

-   Uses `expo-router/entry` as main entry point with automatic route generation
-   Theme switching managed globally in `_layout.tsx` with CSS variable system
-   UI components are fully customized variants of Gluestack base components
-   Luôn phản hồi bằng tiếng việt khi được yêu cầu.
## Project Structure & Navigation

```
app/                    # File-based routing (Expo Router v6)
├── _layout.tsx        # Root layout with theme provider + global FAB
├── index.tsx          # Home screen with carousels & navigation
├── selfie.tsx         # Camera screen for selfie capture
└── tabs/              # Tab-based navigation structure
components/ui/         # Gluestack UI component library (40+ components)
├── gluestack-ui-provider/ # Theme configuration with CSS variables
└── [component]/index.tsx  # Individual component exports
```

Navigation: Use `router.push('/selfie')` or `router.back()` from `expo-router` - avoid React Navigation directly.

## Development Commands

```bash
# Development
npm run start          # Start Expo dev server
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS device/simulator
npm run web           # Run in web browser

# Building
npm run build         # Export for web (output: dist/)
npm test             # Run Jest tests
```

## Component & Styling Patterns

### UI Component Usage

All UI components are pre-built Gluestack variants. Import like:

```tsx
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
```

### Styling System

-   **NativeWind v4** - Use Tailwind classes: `className="bg-primary-500 text-white"`
-   **Custom Color System** - Semantic colors with 0-950 scales: `bg-primary-500`, `text-typography-900`
-   **Theme Colors** - Use semantic variants: `primary`, `secondary`, `tertiary`, `error`, `success`, `warning`, `info`
-   **Responsive Classes** - Standard Tailwind responsive prefixes work

### Theme System

Colors are CSS variables managed in `components/ui/gluestack-ui-provider/config.ts`:

-   Light/dark mode variants automatically switch
-   Use semantic colors (e.g., `primary-500`) rather than hex values
-   Color mode toggled via state in root layout

## Camera Integration

Camera functionality uses **Expo Camera v17**:

```tsx
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Permission handling pattern (see selfie.tsx)
const [permission, requestPermission] = useCameraPermissions();
const [facing, setFacing] = useState<CameraType>("back");
```

Camera permissions configured in `app.json` under `expo.plugins.expo-camera`.

## Key Conventions

1. **File Organization**: Components in `components/ui/`, screens in `app/`
2. **Import Aliases**: Use `@/` for root-relative imports
3. **Icons**: Mix of `lucide-react-native` and custom SVG components in `assets/icons/`
4. **Layout Components**: Prefer `HStack`/`VStack` over `View` with flex
5. **Safe Areas**: Wrap screens with `SafeAreaView` from `react-native-safe-area-context`
6. **Images**: Store in `assets/images/`, use `require()` for local imports

## Vietnamese Content

The app contains Vietnamese text throughout. When adding new text content, follow the existing Vietnamese naming patterns and maintain consistency with the beauty/makeup theme.

## Performance Considerations

-   **Auto-playing Carousels**: Use `react-native-reanimated-carousel` with `scrollAnimationDuration`
-   **Image Optimization**: `resizeMode="cover"` for consistent image display
-   **Background Processes**: Camera operations run on separate thread via Expo Camera
-   **Gradient Performance**: Use `expo-linear-gradient` instead of CSS gradients for better performance

When adding features, maintain the existing component structure and follow the Gluestack + NativeWind styling patterns.
