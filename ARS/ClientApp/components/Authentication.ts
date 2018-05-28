import * as Immutable from "immutable"
import { User } from './Model'
import * as api from './Api'

export type Auth = {
    is_loggedin:boolean
    user:User|null,
    permission:number //0 = No Permission, 1 = Student, 2 = Administrator
}

export async function check_auth():Promise<Auth>{
    const value_or_null = (document.cookie.match(/^(?:.*;)?\s*login\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
    if(value_or_null != null){
        const user:User = await api.getUser(+value_or_null)
        return {is_loggedin:true, user:user, permission:user.role_id}
    }
    return {is_loggedin:false, user:null, permission:0}
}

export async function hasPermission(user:User) : Promise<Boolean> {
    return false;
}