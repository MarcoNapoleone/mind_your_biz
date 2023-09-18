import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";

export class Timetable {
  id?: Id;
  uuid?: UUID;
  name?: string;
  companyId?: Id;
  path?: string;
  refId?: Id;
  description?: string;
  moduleId?: Id;
  fileType?: string;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultDocuments: Timetable[] = [];
export const defaultDocument: Timetable = {};

export async function getAllDocuments(companyId: Id): Promise<Timetable[]> {
  let data = [];
  await servicePath
    .get(`/companies/${companyId}/documents`, {
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

export async function getDocument(documentId: Id): Promise<Timetable> {
    let data = {};
    await servicePath
      .get(`/departments/${documentId}`, {
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