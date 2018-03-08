import * as Immutable from "immutable"
import { User } from './User'

export async function  get_users() : Promise<Immutable.List<User>> {
    let res = await fetch(`/api/User/all`, 
      { method: 'get', headers:{'content-type': 'application/json'} })
    if (!res.ok) throw Error(res.statusText)
    let json = await res.json()
    console.log("JSON data: " + JSON.stringify(json))
    return {...json} as Immutable.List<User>
}

export async function set_user(user:User) {
  console.log(JSON.stringify(user))
  let res = await fetch(`/api/User`, 
    { 
      method: 'post',
      body: JSON.stringify(user), 
      credentials: 'include', 
      headers:{'content-type': 'application/json'
    } 
  })
  if (!res.ok) throw Error(res.statusText)
  return res.text
}
