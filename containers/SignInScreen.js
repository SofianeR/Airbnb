import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Entypo } from "@expo/vector-icons";

export default function SignInScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const SignIn = async () => {
    setErrorMessage("");
    setIsLoading(true);

    if (email && password) {
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          {
            email: email,
            password: password,
          }
        );
        const user = response.data;

        setToken(user.token);

        alert(`Bienvenue ${user.username}`);

        // navigation.navigate("Home");
      } catch (error) {
        alert("Connexion échouée \n" + error.message);
      }
    } else {
      setErrorMessage("One of the fields is empty");
    }
    setIsLoading(false);
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/logo_airbnb.png")}
          />
          <Text style={styles.title}>Sign in</Text>
        </View>
        {isLoading && <ActivityIndicator size={"large"} color={"#EB5A62"} />}
        <View style={styles.form}>
          <TextInput
            style={styles.inputSignin}
            placeholder="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.password}
              placeholder="password"
              value={password}
              secureTextEntry={showPassword ? false : true}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
            <Entypo
              name="eye"
              size={24}
              color="black"
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
          </View>
        </View>
        {errorMessage !== "" && (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          </View>
        )}
        <View style={styles.submit}>
          <TouchableOpacity
            disabled={isLoading ? true : false}
            onPress={async () => {
              SignIn();
            }}>
            <Text style={styles.buttonSignup}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              navigation.navigate("SignUp");
            }}>
            <Text style={{ color: "#787878" }}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "white",
    justifyContent: "space-around",
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 15,
  },
  header: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "#7E7E7E",
    fontSize: 23,
    fontWeight: "500",
    marginTop: 10,
  },
  form: {
    flex: 1,
  },
  inputSignin: {
    borderTopColor: "white",
    borderRightColor: "white",
    borderLeftColor: "white",
    borderBottomColor: "#EB5A62",
    borderWidth: 1,
    marginTop: 20,
    padding: 5,
  },
  submit: {
    alignItems: "center",
    marginTop: 30,
    flex: 1,
  },
  buttonSignup: {
    borderColor: "#EB5A62",
    borderWidth: 2,
    borderRadius: 19,
    padding: 10,
    width: 150,
    textAlign: "center",
    fontSize: 18,
    color: "#787878",
  },
  password: {
    width: "90%",
    borderTopColor: "white",
    borderRightColor: "white",
    borderLeftColor: "white",
    borderBottomColor: "#EB5A62",
    borderWidth: 1,
    marginTop: 20,
    padding: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
