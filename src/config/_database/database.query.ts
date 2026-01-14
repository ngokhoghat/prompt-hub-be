export const createPermissionQuery = (permission: string) => {
    return `
    insert into permission 
        (permission_name, creator_id , updater_id , created_at, updater_at)
    values 
        ('${permission}', 'admin', 'admin', now(), now());
`;
};

export const createInitialRoleQuery = () => {
    return `
  insert into role 
      (role_name, description, creator_id , updater_id , created_at, updater_at)
  values 
      ('ADMIN', '', 'admin', 'admin', now(), now()),
      ('MEMBER', '', 'admin', 'admin', now(), now()),
      ('STAFF', '', 'admin', 'admin', now(), now());
`;
}

export const createInitialUserQuery = () => {
    return `
  insert into user
      (user_name, email, password_hash, creator_id , updater_id , created_at, updater_at)
  values 
      ('admin', 'admin@gmail.com', '$2b$10$xRMspML/7YZXLM1iMJC2H.U.LHDsPl0Vs7h4i..T3kyHuZltaiB5i', 'admin', 'admin', now(), now());
`;
}

export const addUserRoleQuery = () => {
    return `
  insert into user_role
      (user_id, role_id)
  values 
      (1, 1);
`;
}

export const getUserQuery = () => {
    return `
    select * from user_role ur 
    left join user u on ur.user_id = u.id
    left join role r on ur.role_id = r.id
    where u.user_name = 'admin';
`;
}