import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {AxiosResponse} from "axios";

export class Company {
  id?: Id;
  uuid?: UUID;
  name?: string;
  address?: string;
  email?: string;
  province?: string;
  postalCode?: string;
  fiscalCode?: string;
  vatCode?: string;
  registeredMunicipality?: string;
  phone?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultCompanies: Company[] = [];
export const defaultCompany: Company = {};

export async function getAllCompanies(): Promise<Company[]> {
  let data = [];
  await servicePath
    .get('/companies', {
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

export async function getCompany(id: Id): Promise<Company> {
  let data = {};
  await servicePath
    .get(`/companies/${id}`, {
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

export async function updateCompany(id: Id, company: Company) {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/companies/${id}`, company, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
    .then(res => {
      if (res.status !== 200) {
        return new Error(res.data["message"])
      }
      response = res;
    })
  return response;
}