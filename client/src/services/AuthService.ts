import $api from "../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService{
    static async login(password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login', {password, name: 'admin'})
    }
    static async loginDev(password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login', {password, name: 'admin1'})
    }
    static async logout(): Promise<void>{
        return $api.post('/logout')
    }
}
