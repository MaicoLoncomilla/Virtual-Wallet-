import React, { useState, useEffect } from "react";
import { StyleSheet, Text, StatusBar, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appbar, Avatar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import api from "../../../../reducer/ActionCreator";
import { useDispatch, useSelector } from "react-redux";

import firebase from "firebase/app";
import "firebase/storage";
import Enviar from "../enviar/Enviar";

export default function ModificarContacto({ navigation, route }) {
  const { CONTACTOS } = api;
  const dispatch = useDispatch();
  const contactId = route.params.id;
  const userId = route.params.idUser;
  const Name = route.params.firstName + " " + route.params.lastName;
  const alias = route.params.alias;
  const user = useSelector((state) => state.user);
  const email = route.params.email;
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const [contactImage, setContactImage] = useState(null);
  const emptyAvatar = require("../../../../../assets/Avatar.png");

  useEffect(() => {
    firebase
      .storage()
      .ref(`/profileImage/${email}`)
      .getDownloadURL()
      .then((image) => {
        setContactImage(image);
      })
      .catch((error) => {
        setContactImage(null);
      });
  }, [email]);

  const handleEdit = (value) => {
    axios
      .put(
        `https://walletfly.glitch.me/contacts/${userId}?contactId=${contactId}`,
        {
          alias: value,
        }
      )
      .then(({ data }) => {
        setActive(!active);
        dispatch({
          type: CONTACTOS,
          payload: data,
        });
        navigation.navigate("Contactos");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDelete = () => {
    axios
      .delete(
        `https://walletfly.glitch.me/contacts/${userId}?contactId=${contactId}`
      )

      .then(({ data }) => {
        dispatch({
          type: CONTACTOS,
          payload: data,
        });
        navigation.navigate("Contactos");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <StatusBar
        backgroundColor="#f23b6c"
        barStyle={"light-content"}
        style={{ alignSelf: "center" }}
      />
      <Appbar.Header style={{ backgroundColor: "#ffffff", height: 45 }}>
        <Appbar.Action
          icon="arrow-left"
          color="#F23B6C"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title={`Modificar a ${Name}`}
          color="#F23B6C"
          titleStyle={{
            textAlign: "center",
            fontFamily: "Bree-Serif",
            paddingRight: 54,
          }}
        />
      </Appbar.Header>
      <View style={s.container}>
        <TouchableOpacity style={s.header}></TouchableOpacity>
        <View style={s.userContainer}>

          {contactImage ?
            <Avatar.Image
              size={100}
              source={{uri: contactImage}} />
            :
            <Avatar.Image
              size={100}
              source={emptyAvatar}
            />
          }
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#f23b6c",
                  fontFamily: "Bree-Serif",
                  fontWeight: "500",
                  marginRight: 5,
                }}
              >
                Alias:
              </Text>
              {active ? (
                <TextInput
                  autoFocus
                  onChangeText={(value) => setValue(value)}
                  defaultValue={alias ? alias : Name}
                />
              ) : (
                  <Text style={{ color: "#cb3065", fontFamily: "Bree-Serif" }}>
                    {alias ? alias : Name}
                  </Text>
                )}
            </View>
            <TouchableOpacity
              onPress={() => setActive(!active)}
              style={s.buttonEdit}
            >
              <Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={15}
                  color={"#F23B6C"}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                color: "#f23b6c",
                fontFamily: "Bree-Serif",
                fontWeight: "500",
              }}
            >
              Nombre:
            </Text>
            <Text style={{ color: "#cb3065", fontFamily: "Bree-Serif" }}>
              {Name}
            </Text>
            <Text
              style={{
                color: "#f23b6c",
                fontFamily: "Bree-Serif",
                fontWeight: "500",
              }}
            >
              Email:
            </Text>
            <Text style={{ color: "#cb3065", fontFamily: "Bree-Serif" }}>
              {email}
            </Text>
          </View>
        </View>
        {active &&
          <TouchableOpacity onPress={() => handleEdit(value)} style={s.button}>
            <Text style={s.textButton}>Aceptar Cambios</Text>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate("Enviar", { email: email })}
        >
          <Text style={s.textButton}>Enviar Dinero</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={() => handleDelete()}>
          <Text style={s.textButton}>Borrar Contacto</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  buttonEdit: {
    borderWidth: 2,
    borderColor: "#f23b6c",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    marginLeft: 10,
  },
  header: {
    width: "40%",
    alignSelf: "center",
    position: "absolute",
    borderBottomWidth: 2,
    borderBottomColor: "#f23b6c",
  },
  button: {
    borderWidth: 2,
    borderColor: "#f23b6c",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    padding: 5,
    height: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  textButton: {
    color: "#f23b6c",
    fontSize: 16,
    fontFamily: "Bree-Serif",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  userContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
});
