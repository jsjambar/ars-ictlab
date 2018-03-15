import * as Immutable from "immutable"

import { User, Role, Classroom, Location, Reservation,Problem } from './Model'
import { UserComponent } from "./user/User";

export async function get_users() : Promise<Immutable.List<User>> {
    let res = await fetch(`/api/User/all`, 
      { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
    if (!res.ok) throw Error(res.statusText)
    let json = await res.json()
    return json as Immutable.List<User>
}
 
export async function set_users(user:User) {
  let res = await fetch(`/api/User/register`, 
      { method: 'post',
        body: JSON.stringify(user), 
        credentials: 'include', 
        headers:{'content-type': 'application/json'
      } 
    })
  if (!res.ok) throw Error(res.statusText)
  return "Registered"
}

export async function set_reservation(reservation: Reservation) {
    let res = await fetch(`/api/Reservation/add`,
    {
        method: 'post',
        body: JSON.stringify(reservation),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
        })
    if (!res.ok) throw Error(res.statusText)
    return "Reservation made"
}

export async function getUser(userId:Number) : Promise<User> {
  let res = await fetch(`/api/User/getUser`, 
      { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
    if (!res.ok) throw Error(res.statusText)
    let json = await res.json()
    return json as User;
}
