import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import axios from "axios";
import image from "../../assets/pagofacil.jpg";
import { useDispatch, useSelector } from "react-redux";
import api from "../reducer/ActionCreator";
import { Button, Dialog, Appbar, Paragraph } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableRipple, Switch } from "react-native-paper";

export default function ChargeMoney(props) {
  const [state, setState] = useState({
    codigo: "",
    monto: 0,
  });
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const hideDialog = () => {
    setVisible(!visible);
  };
  const handleTextChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const [wApp, setWApp] = useState(false);
  const recarga = useSelector((state) => state.recarga);
  const user = useSelector((state) => state.user);
  const { SALDO, RECARGA } = api;
  const dispatch = useDispatch();
  const onWappPress = () => {
    setWApp(!wApp);
  };

  const wAppNotification = async () => {
    await Linking.openURL(
      `https://wa.me/+54${user.phone}?text=Hola *${user.firstName}*, se le acredito un total de: ${state.monto} gracias por confiar en WalletFly.`
    );
  };

  const cerrarPaypal = () => {
    dispatch({
      type: RECARGA,
      payload: {},
    });
    props.navigation.navigate("Home");
  };
  const chargeMoney = () => {
    if (state.monto > 0) {
      const data = {
        transactionUser: 'PagoFacil',
        title: "Recarga",
        type: "ingreso",
        description: "Recarga de dinero a tavés de Pago Facil.",
        total: parseInt(state.monto, 10),
      };

      axios
        .post(
          `https://walletfly.glitch.me/transaction/byUserEmail/${recarga.email}`,
          data
        )

        .then(({ data }) => {
          if (wApp) {
            wAppNotification();
          }
          dispatch({
            type: SALDO,
            payload: data.balance,
          });
          dispatch({
            type: RECARGA,
            payload: {},
          });
          props.navigation.navigate("Home");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (state.monto < 0) {
        setAlertMessage("No puede recargar un numero negativo");
        setVisible(!visible);
      } else {
        setAlertMessage("Ingrese un Monto");
        setVisible(!visible);
      }
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="rgb(255, 221, 0)"
        barStyle={"dark-content"}
        style={{ alignSelf: "center" }}
      />
      <View style={s.container}>
        <TouchableOpacity
          onPress={() => cerrarPaypal()}
          style={{ marginTop: 90, marginLeft: "auto" }}
        >
          <Text>
            <MaterialCommunityIcons name="close" color={"#0054a6"} size={26} />
          </Text>
        </TouchableOpacity>
        <View>
          <Image style={{ width: "100%", height: 150 }} source={image} />
          <View style={s.code}>
            <Text style={s.codeText}>{recarga.code}</Text>
          </View>
          <TextInput
            style={s.inputs}
            keyboardType="numeric"
            placeholder="Ingrese el monto de la recarga"
            placeholderTextColor="#cb3065"
            onChangeText={(value) => handleTextChange("monto", value)}
          />
          <View style={s.containerButton}>
            <TouchableOpacity style={s.button} onPress={() => chargeMoney()}>
              <Text style={s.textButton}>Recargar Dinero</Text>
            </TouchableOpacity>
          </View>
          <TouchableRipple  onPress={() => onWappPress()}>
            <View style={s.containerwhapp}>
              <Text style={s.whapp}>Mensaje de WhatsApp</Text>
              <View pointerEvents="none">
                <Switch value={wApp} color={"#25d366"} />
              </View>
            </View>
          </TouchableRipple>
        </View>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>{alertMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(!visible)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  button: {
    backgroundColor: "rgb(255, 221, 0)",
    alignItems: "center",
    borderColor: "rgb(255, 221, 0)",
    width: "50%",
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  header: {
    width: "40%",
    alignSelf: "center",
    position: "absolute",
    borderBottomWidth: 2,
    borderBottomColor: "#f23b6c",
  },
  whapp: {
    color: "#128c7e",
    fontFamily: "Bree-Serif",
    textAlign: "center",
    paddingRight: 5,
  },
  containerwhapp: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  containerButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  textButton: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Bree-Serif",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  inputs: {
    height: 40,
    paddingLeft: 10,
    borderWidth: 2,
    borderRadius: 5,
    alignSelf: "center",
    fontFamily: "OpenSans-Regular",
    borderColor: "#ec008c",
    width: "85%",
  },
  codeText: {
    fontSize: 24,
    textAlign: "center",
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "3%",
    marginBottom: "3%",
    fontFamily: "Bree-Serif",
    color: "#0054a6",
  },
  code: {
    width: "95%",
    paddingBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
