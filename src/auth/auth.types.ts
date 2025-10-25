export type SignUpDto = {
  name: string;
  address: string;
  password: string;
};

export type LoginDto = {
  address: string;
  password: string;
};

export type UserDto = {
  id: string;
  name: string;
  address: string;
};
