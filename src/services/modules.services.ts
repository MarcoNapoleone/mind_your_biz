import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {AxiosResponse} from "axios";

export class Module {
  id?: Id;
  uuid?: UUID;
  name?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export async function getModuleById(id: Id): Promise<Module> {
  let data = {};
  await servicePath
    .get(`/modules/${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then((res: AxiosResponse) => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}

export async function getModuleByName(name: string): Promise<Module> {
  let data = {};
  await servicePath
    .get(`/modules/?name=${name}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then((res: AxiosResponse) => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}