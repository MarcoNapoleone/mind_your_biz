import {servicePath} from "./connectors/axios";
import {getCookie, setCookie} from "./connectors/cookies";
import {User} from "./users.services";
import {UUID} from "../entities/entities";

export const login = async (email: string, pwd: string) => {
  let user = {} as User;
  return servicePath
    .post('/auth/login', {
      "password": pwd,
      "email": email
    })
    .then(async res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      if (!res.data["token"]) {
        new Error("Missing token")
      }
      await setCookie('token', res.data["token"], 1)
      user = res.data["user"]
      if (user) {
        return user
      } else {
        return new Error("Missing user")
      }
    })
}

export const getUser = async (uuid: UUID): Promise<User> => {
  let user = {} as User
  await servicePath
    .get(`/users/${uuid}`,
      {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`
        }
      })
    .then(async res => {
        if (res.status !== 200) {
          return new Error(res.data["message"])
        }
        user = res.data
      }
    )
  return user;
}




