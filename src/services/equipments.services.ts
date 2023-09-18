import {Id, UUID} from "../entities/entities";
import {getCookie} from "./connectors/cookies";
import {servicePath} from "./connectors/axios";
import {AxiosResponse} from "axios";

export class Equipment {
  id?: Id;
  uuid?: UUID;
  departmentId?: Id;
  name?: string;
  type?: string;
  brand?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  firstTestDate?: Date;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultEquipments: Equipment[] = [];
export const defaultEquipment: Equipment = {};

export async function getAllEquipments(companyId: Id): Promise<Equipment[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/equipments`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}

export async function getEquipment(equipmentId: Id): Promise<Equipment> {
  let data = {};
  await servicePath
    .get(`/equipments/${equipmentId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}

export async function createEquipment(companyId: Id, equipment: Equipment): Promise<Equipment> {
  let data = {};
  await servicePath
    .post(`/equipments`, {...equipment, "companyId": companyId}, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}

export async function updateEquipment(equipmentId: Id, equipment: Equipment): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/equipments/${equipmentId}`, equipment, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`

      }
    })
    .then(res => {
        if (res.status !== 200) {
          return new Error(res.data["message"])
        }
        response = res
      }
    )
  return response;
}

export async function deleteEquipment(equipmentId: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/equipments/${equipmentId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`

      }
    })
    .then(res => {
        if (res.status !== 200) {
          return new Error(res.data["message"])
        }
        response = res
      }
    )
  return response;
}
