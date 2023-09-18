import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {AxiosResponse} from "axios";

export class Property {
  id?: Id;
  uuid?: UUID;
  companyId?: Id;
  name?: string;
  address?: string;
  municipality?: string;
  postalCode?: string;
  province?: string;
  country?: string;
  itDestinazioneUso?: string;
  itTitoloUtilizzo?: string;
  itFoglio?: string;
  itParticella?: string;
  itSub?: string;
  itClassamento?: string;
  itClasseEnergetica?: string;
  itConsistenza?: string;
  itRendita?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultProperties: Property[] = [];
export const defaultProperty: Property = {};

export async function getAllProperties(companyId: Id): Promise<Property[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/properties`, {
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

export async function getProperty(propertyId: Id): Promise<Property> {
  let data = {};
  await servicePath
    .get(`/properties/${propertyId}`, {
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

export async function createProperty(companyId: Id, property: Property): Promise<Property> {
  let data = {};
  await servicePath
    .post(`/properties`, {...property, "companyId": companyId}, {
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

export async function updateProperty(propertyId: Id, property: Property): Promise<AxiosResponse> {
  let data = {} as AxiosResponse;
  await servicePath
    .put(`/properties/${propertyId}`, property, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res
    })
  return data;
}

export async function deleteProperty(propertyId: Id): Promise<AxiosResponse> {
  let data = {} as AxiosResponse;
  await servicePath
    .delete(`/properties/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      data = res
    })
  return data;
}