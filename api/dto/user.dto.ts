export interface UserDto {
   id: string;
   email: string;
   password: string;
   hospitalId: String;
   firstName?: string;
   lastName?: string;
   roles?: [];
}