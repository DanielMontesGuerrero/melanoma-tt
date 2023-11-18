import { ILesion } from "./lesion";

export default interface User {
  id: number;
  userName: string;
  password: string;
  name: string;
  lastName: string;
  hasWritePermission: boolean;
  lesions?: ILesion[];
}
