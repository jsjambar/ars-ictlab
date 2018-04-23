import * as Immutable from "immutable"
import { User } from './Model'

export async function checkCredentials(username:String, password:String) {
    // idk
    return false;
}

export async function isLoggedIn() : Promise<Boolean> {
    return false;
}

export async function hasPermission(user:User) : Promise<Boolean> {
    return false;
}