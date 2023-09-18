import {Id, UUID} from "../entities/entities";
import {servicePath} from "./connectors/axios";
import {getCookie} from "./connectors/cookies";
import {getModuleByName} from "./modules.services";
import axios, {AxiosResponse} from "axios";
import fileDownload from "js-file-download";

export class Document {
  id?: Id;
  uuid?: UUID;
  companyId?: Id;
  refId?: Id;
  moduleId?: Id;
  name?: string;
  description?: string;
  // relative path from folder
  path?: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: Date;
  deletedAt?: Date;
  version?: number;
  updatedAt?: Date;
}

export const defaultDocuments: Document[] = [];
export const defaultDocument: Document = {};

export async function getAllDocuments(companyId: Id): Promise<Document[]> {
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

export async function getDocumentById(documentId: Id): Promise<Document> {
    let data = {};
    await servicePath
      .get(`documents/${documentId}`, {
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

export async function getDocumentsByRefId(refId: Id, moduleName: string): Promise<Document[]> {
  let data = [];
  const {id} = await getModuleByName(moduleName);
  await servicePath
    .get(`/documents?refId=${refId}&moduleId=${id}`, {
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

export async function createDocument(document: Document, moduleName: string, file: any): Promise<Document> {
  let data = {};
  const {id} = await getModuleByName(moduleName);
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('description', document?.description);

  await servicePath
    .post(`/documents?companyId=${document?.companyId}&refId=${document?.refId}&moduleId=${id}`, bodyFormData, {
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

export async function deleteDocument(documentId: Id): Promise<AxiosResponse> {
  let response = {} as AxiosResponse;
  await servicePath
    .delete(`/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    }).then(res => {
        if (res.status !== 200) {
          return new Error(res.data["message"])
        }
        response = res
      }
    )
  return response;
}

export async function downloadFile(fileUrl: string, filename: string): Promise<void> {
  axios.get(fileUrl, {
    responseType: 'blob',
  }).then(res => {
    fileDownload(res.data, filename);
  });}

