export interface PostUserResponse {
  id: number;
  userName: string;
}

export interface PostLoginResponse {
  user: PostUserResponse;
}
