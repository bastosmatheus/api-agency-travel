import { UserRepository } from "@/adapters/repositories/user-repository";

class FindUsers {
  constructor(private userRepository: UserRepository) {}

  public async execute() {
    const users = await this.userRepository.findAll();

    return users;
  }
}

export { FindUsers };
