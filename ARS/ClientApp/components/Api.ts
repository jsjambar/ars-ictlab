import * as Immutable from "immutable"
import { User, Role, Classroom, Location, Reservation,Problem } from './Model'

export async function get_users() : Promise<Immutable.List<User>> {
    let res = await fetch(`/api/User/all`, 
      { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
    if (!res.ok) throw Error(res.statusText)
    let json = await res.json()
    console.log(json)
    return json as Immutable.List<User>
}
 
export async function set_user(user) {
  console.log("user to add: " + JSON.stringify(user))
  let res = await fetch(`/api/User/add`, 
      { method: 'post',
        body: JSON.stringify(user), 
        credentials: 'include', 
        headers:{'content-type': 'application/json'
      } 
    })
  if (!res.ok) throw Error(res.statusText)
  return "Registered"
}
