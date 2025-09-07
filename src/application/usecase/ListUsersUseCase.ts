export interface ListUsersOutput {
  id: string;
  name: string;
  email: string;
}

export interface ListUsersUseCase {
  execute(): Promise<ListUsersOutput[]>;
}
