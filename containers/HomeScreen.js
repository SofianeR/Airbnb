import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [offers, setOffers] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const stars = (nbEtoile) => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      if (i < nbEtoile) {
        array.push(<FontAwesome name="star" size={15} color="#FFB100" />);
      } else {
        array.push(<FontAwesome name="star" size={15} color="gray" />);
      }
    }
    return array;
  };
  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );

        setOffers(response.data);
      } catch (error) {
        console.log(error.response);
      }
      setIsLoading(false);
    };
    fetchOffer();
    // stars();
  }, []);
  return (
    <View style={{ padding: 15 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => String(item._id)}
          ListHeaderComponent={
            <Button
              title="Console"
              onPress={async () => {
                // console.log(await AsyncStorage.getItem("token"));
                navigation.navigate("AroundMe");
              }}
            />
          }
          renderItem={({ item }) => {
            // console.log("IMAGE USER", item.user.account.photo.url);

            return (
              <View style={{ height: 290 }} key={item._id}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Room", { id: item._id })}>
                  <ImageBackground
                    source={{ uri: item.photos[0].url }}
                    style={styles.imageBack}>
                    <View style={styles.containerPrice}>
                      <Text style={styles.price}>{item.price} €</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                <View style={styles.description}>
                  <View style={{ width: "80%" }}>
                    <Text numberOfLines={1} style={styles.titleDescription}>
                      {item.title}
                    </Text>

                    <View style={styles.row}>
                      <View style={styles.row}>{stars(item.ratingValue)}</View>

                      <Text style={{ marginLeft: 10 }}>
                        {item.reviews} reviews
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Image
                      style={styles.profilePicture}
                      source={{ uri: item.user.account.photo.url }}
                    />
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <Button
              title="Go to Profile"
              onPress={() => {
                navigation.navigate("Profile", { userId: 123 });
              }}
            />
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  containerPrice: {
    backgroundColor: "black",
    width: "20%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imageBack: {
    height: 200,
    justifyContent: "flex-end",
  },
  price: { color: "white", fontSize: 18 },
  description: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  titleDescription: {
    fontWeight: "600",
    fontSize: 17,
  },
  row: {
    flexDirection: "row",
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
});
