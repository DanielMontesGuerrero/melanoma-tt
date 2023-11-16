import { StyleSheet, View } from "react-native";

import ColorPallete from "@/colorPallete";
import LoginMenu from "@/components/login/loginForm";

const Login = () => {
  return (
    <View style={styles.container}>
      <LoginMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPallete.blue.dark,
  },
});

export default Login;
