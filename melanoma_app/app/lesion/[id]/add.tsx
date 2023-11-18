import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

import ImageLoading from "@/components/imageLoading";
import { useCurrentPictureMedia } from "@/contexts/pictureMediaContext";
import { usePostPhotoMutation } from "@/services/melanomaApi";
import { NEW_LESION_ID } from "@/utils/constants";

const Add = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const { currentPictureMedia } = useCurrentPictureMedia();
  const [postPhoto, { isLoading, isUninitialized }] = usePostPhotoMutation();
  const lesionId = Number(params.id) === NEW_LESION_ID ? 0 : Number(params.id);

  useEffect(() => {
    if (currentPictureMedia.base64 !== undefined) {
      console.log("Adding photo", lesionId);
      postPhoto({
        lesionId,
        photo: {
          name: "Nueva photo",
          description: "Ingrese una descripción",
          image: {
            name: "photo",
            ext: "jpg",
            data: currentPictureMedia.base64,
          },
        },
      });
    }
  }, []);

  if (!currentPictureMedia.uri) {
    console.error("No picture media provided");
    return (
      <View>
        <Text>Error: no se pudo obtener la foto</Text>
      </View>
    );
  }

  if (isLoading || isUninitialized) {
    return (
      <ImageLoading
        image={{ uri: currentPictureMedia.uri }}
        message="Añadiendo la foto"
      />
    );
  }

  return (
    <Redirect href={{ pathname: "/lesion/[id]/", params: { id: lesionId } }} />
  );
};

export default Add;
