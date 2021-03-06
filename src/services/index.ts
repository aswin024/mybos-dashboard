import axios from 'axios'
import { Myboscase } from '../types'
require('dotenv').config()

const API = process.env.REACT_APP_API_URL

export const createCase = async (
  myboscase: Myboscase,
): Promise<Myboscase[]> => {
  const token = localStorage.getItem('token')
  return axios
    .post(
      `${API}/cases`,
      { ...myboscase },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const getAllCases = async (): Promise<Myboscase[]> => {
  const token = localStorage.getItem('token')
  return axios
    .get(`${API}/cases`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const getCaseById = async (id: string): Promise<Myboscase> => {
  const token = localStorage.getItem('token')
  return axios
    .get(`${API}/cases/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const updateCase = async (data: any): Promise<Myboscase> => {
  const token = localStorage.getItem('token')
  return axios
    .put(`${API}/cases/${data.id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Length': `${Buffer.byteLength(data)}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const deleteCase = async (id: string): Promise<Myboscase> => {
  const token = localStorage.getItem('token')
  return axios
    .delete(`${API}/cases/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const uploadImage = async (file): Promise<any> => {
  const token = localStorage.getItem('token')
  let formData = new FormData()
  formData.append('file', file)
  return axios
    .post(`${API}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

// auth services should be kept in seperate file later

export const SignUp = async (data: any): Promise<any> => {
  return axios
    .post(`${API}/users/login`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const activate = async (data: any): Promise<any> => {
  return axios
    .post(`${API}/users/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const loginUser = async (data: any): Promise<any> => {
  return axios
    .post(`${API}/users/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const forgotPassword = async (data: any): Promise<any> => {
  return axios
    .patch(`${API}/users/forgot`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}

export const validateResetToken = async (data: any): Promise<any> => {
  return axios
    .post(`${API}/users/validate`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}
export const resetPassword = async (data: any): Promise<any> => {
  return axios
    .patch(`${API}/users/reset`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return null
    })
}
