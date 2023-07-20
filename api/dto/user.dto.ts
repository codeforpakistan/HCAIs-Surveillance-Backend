export interface UserDto {
   id: string;
   email: string;
   password: string;
   hospitalId: String;
   hospitals: [{}];
   firstName?: string;
   lastName?: string;
   roles?: [];
}