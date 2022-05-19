import React from "react";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import MapView from "react-native-maps";

import axios from "axios";

import * as Location from "expo-location";

const Room = ({ route }) => {
  const { params } = useRoute();
  const [loading, setLoading] = useState(false);
  const [singleOffer, setSingleOffer] = useState();
  const [description, setDescription] = useState(false);

  const stars = (nbEtoile) => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      if (i < nbEtoile) {
        array.push(
          <FontAwesome name="star" size={15} color="#FFB100" key={i} />
        );
      } else {
        array.push(<FontAwesome name="star" size={15} color="gray" key={i} />);
      }
    }
    return array;
  };

  useEffect(() => {
    const fetchSingleOffer = async () => {
      setLoading(true);
      try {
        const url_api = `https://express-airbnb-api.herokuapp.com/rooms/${params.id}`;
        const response = await axios.get(url_api);

        setSingleOffer(response.data);
      } catch (error) {
        console.log(error.response);
      }

      setLoading(false);
    };

    fetchSingleOffer();
  }, []);

  return (
    <View>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        singleOffer && (
          <View>
            {console.log(singleOffer.location[1])}

            <ImageBackground
              source={{ uri: singleOffer.photos[0].url }}
              style={styles.imageBack}>
              <View style={styles.containerPrice}>
                <Text style={styles.price}>{singleOffer.price} €</Text>
              </View>
            </ImageBackground>

            <View style={styles.description}>
              <View style={{ width: "80%" }}>
                <Text numberOfLines={1} style={styles.titleDescription}>
                  {singleOffer.title}
                </Text>

                <View style={styles.row}>
                  <View style={styles.row}>
                    {stars(singleOffer.ratingValue)}
                  </View>

                  <Text style={{ marginLeft: 10 }}>
                    {singleOffer.reviews} reviews
                  </Text>
                </View>
              </View>

              <View>
                <Image
                  style={styles.profilePicture}
                  source={{ uri: singleOffer.user.account.photo.url }}
                />
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <Text numberOfLines={description ? 10 : 3}>
                {singleOffer.description}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDescription(!description);
                }}>
                <Text>Show {description ? "less ▲" : "more ▼"} </Text>
              </TouchableOpacity>
            </View>
            <View>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 48.856614,
                  longitude: 2.3522219,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}>
                <MapView.Marker
                  coordinate={{
                    latitude: singleOffer.location[1],
                    longitude: singleOffer.location[0],
                  }}
                />
              </MapView>
            </View>
          </View>
        )
      )}
    </View>
  );
};
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
  map: {
    width: Dimensions.get("screen").width,
    height: 200,
  },
});

export default Room;
