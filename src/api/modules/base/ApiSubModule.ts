import { AxiosInstance } from 'axios';

export class ApiModule {
  protected axiosInstance: AxiosInstance;
  protected basePath: string;
  public constructor(axiosInstance: AxiosInstance, basePath: string) {
    this.axiosInstance = axiosInstance;
    this.basePath = basePath;
  }

  protected path(path: string): string {
    return `${this.basePath}${path}`;
  }
  protected get fullPath(): string {
    return `${this.axiosInstance.defaults.baseURL}${this.basePath}`;
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  protected async get<T = any>(path: string): Promise<T> {
    return (await this.axiosInstance.get<T>(this.path(path))).data;
  }
  protected async put<T = any>(path: string, data?: any): Promise<T> {
    return (await this.axiosInstance.put<T>(this.path(path), data)).data;
  }
  protected async post<T = any>(path: string, data?: any): Promise<T> {
    return (await this.axiosInstance.post<T>(this.path(path), data)).data;
  }
  protected async delete<T = any>(path: string): Promise<T> {
    return (await this.axiosInstance.delete<T>(this.path(path))).data;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
