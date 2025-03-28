import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme"; // If you use color scheme
import AuthGuard from "./AuthGuard"; // Ensure correct import

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Get the theme mode (dark/light)

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthGuard />
    </ThemeProvider>
  );
}
