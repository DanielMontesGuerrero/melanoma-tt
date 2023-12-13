export default interface PictureMedia {
  uri?: string;
  base64?: string | null;
}

export interface Image {
  name: string;
  ext: string;
  data: string;
}
