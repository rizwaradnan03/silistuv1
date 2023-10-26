import { PaperProvider } from "react-native-paper";
import StackNavigator from "./src/navigator/StackNavigator";

export default function App() {
  return (
    <PaperProvider>
      <StackNavigator />
    </PaperProvider>
  );
}