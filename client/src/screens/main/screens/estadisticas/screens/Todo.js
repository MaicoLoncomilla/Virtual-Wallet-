import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

export default function Todo({ navigation }) {
  let { todo } = useSelector((state) => state.transacciones);
  let newArrayTodo = todo && todo.transactions.reverse()

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        {newArrayTodo &&
          newArrayTodo.map((el) => (
            <TouchableOpacity
              key={el.id}
              onPress={() =>
                navigation.navigate("DetallesEstadistica", { id: el.id })
              }
            >
              <View style={s.container}>
                <View style={s.containerIconDireccion}>
                  <View
                    style={
                      el.type === "ingreso"
                        ? s.containerIconIngresaDinero
                        : s.containerIconSaleDinero
                    }
                  >
                    {el.type === "ingreso" ? (
                      <MaterialCommunityIcons
                        name="currency-usd"
                        size={20}
                        color={"#ffffff"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="currency-usd-off"
                        size={20}
                        color={"#ffffff"}
                      />
                    )}
                  </View>
                  <Text style={s.textDireccion}>{el.transactionUser}</Text>
                </View>
                <Text
                  style={el.type === "ingreso" ? s.ingresaDinero : s.saleDinero}
                >
                  ${el.total} ARS
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(181,141,232)",
  },
  containerIconDireccion: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  containerIconIngresaDinero: {
    backgroundColor: "#5ad0ef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: 25,
    height: 25,
    color: "#fff",
  },
  containerIconSaleDinero: {
    backgroundColor: "#e575ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: 25,
    height: 25,
    color: "#fff",
  },
  textDireccion: {
    color: "#cb3065",
    fontFamily: "Bree-Serif",
    fontSize: 15,
    marginLeft: 5,
  },
  ingresaDinero: {
    color: "#5ad0ef",
    fontFamily: "Bree-Serif",
  },
  saleDinero: {
    color: "#e575ea",
    fontFamily: "Bree-Serif",
  },
});
