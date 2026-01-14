import axios from 'axios';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => {
  const data = { permissionName: permissions.at(0) };
  setTimeout(() => {
    axios.post(process.env.CREATE_PERMISSION_URL || "", data)
      .then()
      .catch(e => console.log(`Error when create permission ${permissions.at(0)}`))
  });
  return SetMetadata(PERMISSIONS_KEY, permissions);
};
