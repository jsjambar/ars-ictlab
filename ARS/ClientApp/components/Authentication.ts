import * as Immutable from "immutable"
import { User } from './Model'

export async function checkCredentials(username:String, password:String) {
    // idk
}

export async function isLoggedIn() : Promise<Boolean> {
    return true;
}

export async function hasPermission(user:User) : Promise<Boolean> {
    return false;
}