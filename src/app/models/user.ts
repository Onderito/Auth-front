export class User {
  name: string;
  email: string;
  id: string;

  constructor(data: { name: string; email: string; id: string }) {
    this.name = data.name;
    this.email = data.email;
    this.id = data.id;
  }

  static fromDTO(data: UserDTO): User {
    if (!data) {
      throw new Error('UserDTO is undefined');
    }
    if (!data.name || !data.email || !data._id) {
      throw new Error('UserDTO is incomplete');
    }
    return new User({
      name: data.name,
      email: data.email,
      id: data._id,
    });
  }
}

export interface UserDTO {
  name: string;
  email: string;
  _id: string;
}
