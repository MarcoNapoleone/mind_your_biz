import {Id, UUID} from "../entities/entities";
import {getCookie} from "./connectors/cookies";
import {servicePath} from "./connectors/axios";
import {AxiosResponse} from "axios";

export class Vehicle {
  id?: Id;
  uuid?: UUID;
  hrId?: Id;
  localUnitId?: Id;
  name?: string;
  brand?: string;
  model?: string;
  licensePlate?: string;
  serialNumber?: string;
  registrationDate?: Date;
  category?: string;
  owner?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultVehicles: Vehicle[] = [];
export const defaultVehicle: Vehicle = {};

export async function getAllVehicles(companyId: Id): Promise<Vehicle[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/vehicles`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    } )
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res.data
    }
  )
  return data;
}

export async function getVehicle(vehicleId: Id): Promise<Vehicle> {
  let data = {};
  await servicePath
    .get(`/vehicles/${vehicleId}`, {
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

export async function createVehicle(companyId: Id, vehicle: Vehicle): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .post(`/vehicles`, {...vehicle, "companyId": companyId}, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      response = res
    })
  return response;
}

export async function updateVehicle(vehicleId: Id, vehicle: Vehicle): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/vehicles/${vehicleId}`, {...vehicle}, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      response = res
    })
  return response;
}

export async function deleteVehicle(vehicleId: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/vehicles/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      response = res
    })
  return response;
}