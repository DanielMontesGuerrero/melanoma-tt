import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

import ImageLoading from "@/components/imageLoading";
import { useCurrentPictureMedia } from "@/contexts/pictureMediaContext";
import { usePrediagnosisResult } from "@/contexts/prediagnosisResultContext";
import { usePostClassifyQuery } from "@/services/melanomaApi";

const Analyze = () => {
  const { currentPictureMedia } = useCurrentPictureMedia();
  const { setResult } = usePrediagnosisResult();
  const { isLoading, data } = usePostClassifyQuery(
    currentPictureMedia.base64 ?? ""
  );

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setResult(data);
      router.replace({
        pathname: "/prediagnosis/result",
      });
    }
  }, [isLoading, data]);

  if (!currentPictureMedia.uri && !currentPictureMedia.base64) {
    console.error("No picture media provided");

    return (
      <View>
        <Text>Error: No se pudo obtener la foto</Text>
      </View>
    );
  }

  return (
    <ImageLoading
      image={{ uri: currentPictureMedia.uri }}
      message="Estamos analizando su foto, por favor espere..."
    />
  );
};

export default Analyze;
