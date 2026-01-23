import type { User } from "../../api/userTypes";

export const getDisplayName = (user?:User) =>{
    if(!user){
        return;
    }

    const firstName = user.firstName.trim();
    const lastName = user.lastName.trim();

    const displayName = [firstName, lastName].join(' ');
    
    if(firstName && lastName) return displayName;
    return "";
    
}