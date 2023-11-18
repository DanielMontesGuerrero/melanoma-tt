export interface PostUserResponse {
  id: number;
  userName: string;
}

export interface PostLoginResponse {
  user: PostUserResponse;
}

export interface ApiResponse {
  result: boolean;
  message: string;
}
