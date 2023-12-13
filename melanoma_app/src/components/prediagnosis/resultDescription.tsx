import { StyleSheet, Text, View } from "react-native";

import Styles from "@/styles";
import { ClassifyResponse } from "@/types/melanomaApiTypes";

interface ResultDescriptionProps {
  result: ClassifyResponse;
}

const ResultDescription = (props: ResultDescriptionProps) => {
  return (
    <View style={styles.result}>
      <Text style={Styles.textBody}>{`Probabilidad de cáncer de melanoma: ${(
        props.result.score * 100
      ).toFixed(2)}%`}</Text>
      <Text style={[Styles.textBody, { marginTop: 10 }]}>
        Descripción: Si el resultado es mayor al 80% consulte a su médico
        inmediatamente
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {
    padding: 10,
    ...Styles.cardBorder,
  },
});

export default ResultDescription;
