import { useState, useEffect } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import axios from "axios";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useNavigation } from "@react-navigation/native";

import { Entypo } from "@expo/vector-icons";

export default function SignUpScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setErrorMessage("");
      if (email && username && description && password && confirmPassword) {
        if (password === confirmPassword) {
          const response = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            {
              email: email,
              username: username,
              description: description,
              password: password,
            }
          );
          console.log(response.data);

          const userToken = response.data.token;
          setToken(userToken);

          alert("Inscription reussi");

          // navigation.navigate("SignIn");
        } else {
          setErrorMessage("Passwords must be the same");
        }
      } else {
        setErrorMessage("Un ou plusieurs de vos champs sont vides");
      }
    } catch (error) {
      alert("Inscription échouée \n" + error.message);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/logo_airbnb.png")}
          />
          <Text style={styles.title}>Sign up</Text>
        </View>
        {isLoading && <ActivityIndicator size={"large"} color={"#EB5A62"} />}
        <View>
          <TextInput
            style={styles.inputSignup}
            placeholder="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <TextInput
            style={styles.inputSignup}
            placeholder="username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={styles.textArea}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
            placeholder={"Describe yourself in a few words..."}
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.password}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPasword(text);
              }}
              placeholder="confirm your password"
              secureTextEntry={showPassword1 ? false : true}
            />

            <Entypo
              name="eye"
              size={24}
              color="black"
              onPress={() => {
                setShowPassword1(!showPassword1);
              }}
            />
          </View>

          {errorMessage ? (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ color: "red" }}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.submit}>
            <TouchableOpacity
              disabled={isLoading ? true : false}
              onPress={fetchData}>
              <Text style={styles.buttonSignup}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => {
                navigation.navigate("SignIn");
              }}>
              <Text style={{ color: "#787878" }}>
                Already have an account ? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 15,
  },
  header: {
    alignItems: "center",
  },
  title: {
    color: "#7E7E7E",
    fontSize: 23,
    fontWeight: "500",
    marginTop: 10,
  },
  inputSignup: {
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    marginTop: 20,
    padding: 5,
  },
  textArea: {
    marginTop: 30,
    height: 100,
    borderColor: "#EB5A62",
    borderWidth: 1,
    padding: 10,
  },
  submit: {
    alignItems: "center",
    marginTop: 30,
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
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    marginTop: 20,
    padding: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
