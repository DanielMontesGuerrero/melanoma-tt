import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import ImageLoading from "@/components/imageLoading";
import { useCurrentPictureMedia } from "@/contexts/pictureMediaContext";
import { useUser } from "@/contexts/userContext";
import {
  usePostLesionMutation,
  usePostPhotoMutation,
} from "@/services/melanomaApi";
import { PostLesionResponse } from "@/types/melanomaApiTypes";
import { NEW_LESION_ID } from "@/utils/constants";

const Add = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const { currentPictureMedia } = useCurrentPictureMedia();
  const { user } = useUser();
  const [postPhotoTrigger, { isLoading: isPostPhotoLoading, isUninitialized }] =
    usePostPhotoMutation();
  const [postLesionTrigger, { isLoading: isPostLesionLoading }] =
    usePostLesionMutation();
  const [lesionId, setLesionId] = useState(
    Number(params.id) === NEW_LESION_ID ? NEW_LESION_ID : Number(params.id)
  );

  const postPhoto = (addTolesionId: number) => {
    if (currentPictureMedia.base64 !== undefined) {
      postPhotoTrigger({
        lesionId: addTolesionId,
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
  };

  useEffect(() => {
    if (lesionId === NEW_LESION_ID) {
      postLesionTrigger(user?.id ?? 0)
        .then((response: { data: PostLesionResponse }) => {
          setLesionId(response.data.id);
          postPhoto(response.data.id);
        })
        .catch((error) => console.log(error));
    } else {
      postPhoto(lesionId);
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

  if (isPostPhotoLoading || isPostLesionLoading || isUninitialized) {
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
