export interface ListOpenRouterModelsResponse {
    id : number;
    name: string;
    provider: string;
    model_name: string;
    description: string | null;
}




export interface UserSelectedModel {
    id : number;
    name: string;
    provider: string;
    model_name: string;
    description: string | null;
}