import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {AxiosResponse} from "axios";

export class HR {
  id?: Id;
  uuid?: UUID;
  name?: string;
  surname?: string;
  fiscalCode?: string;
  email?: string;
  phone?: string;
  birthPlace?: string;
  birthDate?: Date;
  nationality?: string;
  recruitmentDate?: Date;
  contractQualification?: string;
  contractLevel?: string;
  duty?: string;
  isApprentice?: boolean;
  isProfessional?: boolean;
  isItOrganigrammaSicurezza?: boolean;
  itCcnl?: string;
  address?: string;
  municipality?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultHRs: HR[] = [];
export const defaultHR: HR = {};

export async function getAllHR(companyId: Id): Promise<HR[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/hr`, {
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

export async function getHR(id: Id): Promise<HR> {
  let data = {};
  await servicePath
    .get(`/hr/${id}`, {
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

export async function createHR(companyId: Id, hr: HR): Promise<HR> {
  let data = {};
  await servicePath
    .post(`/hr`, {...hr, "companyId": companyId}, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 201) {
        return new Error(res.data["message"])
      }
      data = res.data
    })
  return data;
}

export async function updateHR(id: Id, hr: HR): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/hr/${id}`, hr, {
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

export async function deleteHR(id: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/hr/${id}`, {
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