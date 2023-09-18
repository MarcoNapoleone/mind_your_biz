import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {AxiosResponse} from "axios";
import {getHR, HR} from "./hr.services";
import {Equipment} from "./equipments.services";

export class Department {
  id?: Id;
  uuid?: UUID;
  name?: string;
  localUnitId?: Id;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export interface HRDepartment {
  hrDepartmentId?: Id;
  hrId?: Id;
  departmentId?: Id;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultDepartments: Department[] = [];
export const defaultDepartment: Department = {};

export async function getAllDepartments(companyId: Id): Promise<Department[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/departments`, {
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

export async function getDepartment(departmentId: Id): Promise<Department> {
  let data = {};
  await servicePath
    .get(`/departments/${departmentId}`, {
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

export async function createDepartment(companyId: Id, department: Department): Promise<Department> {
  let data = {};
  await servicePath
    .post(`/departments`, {...department}, {
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

export async function updateDepartment(id: Id, department: Department): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/departments/${id}`, department, {
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

export async function deleteDepartment(id: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/departments/${id}`, {
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

export async function getAllHR(departmentId: Id): Promise<(HR & HRDepartment)[]> {
  let data: HRDepartment[] = [];
  await servicePath
    .get(`/departments/${departmentId}/hr`, {
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

  for (const hrd of data) {
    const hr = await getHR(hrd.hrId);
    data[data.indexOf(hrd)] = {
      ...hr,
      hrDepartmentId: hrd.hrDepartmentId,
      startDate: hrd.startDate,
      endDate: hrd.endDate
    }
  }
  return data;
}

export async function addHR(departmentId: Id, hrId: Id, dates:{startDate: Date, endDate: Date}): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .put(`/departments/${departmentId}/hr/${hrId}`, dates, {
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

export async function removeHR(departmentId: Id, hrId: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/departments/${departmentId}/hr/${hrId}`, {
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

export async function getAllEquipments(departmentId: Id): Promise<Equipment[]> {
  let data = [];
  await servicePath
    .get(`/departments/${departmentId}/equipments`, {
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

