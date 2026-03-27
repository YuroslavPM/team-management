import type { User } from "../../api/userTypes";

export const getDisplayName = (user?:User) =>{
    if(!user){
        return;
    }

    const firstName = user.first_name.trim();
    const lastName = user.last_name.trim();

    const displayName = [firstName, lastName].join(' ');
    
    if(firstName && lastName) return displayName;
    return "";
    
}