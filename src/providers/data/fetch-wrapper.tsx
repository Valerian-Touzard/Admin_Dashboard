import { GraphQLFormattedError } from "graphql";

type Error = {
    message: string,
    statusCode: string
}

/**
 * fonction de fetch custom
 * @param url string -> Url a fethc
 * @param options RequestInit -> les option de requêtes
 * @returns les objets voulue
 */
const customFetch = async (url: string, options: RequestInit) =>{
    const accessToken = localStorage.getItem('access_token');

    const headers = options.headers as Record<string,string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

/**
 * Gestion des erreurs
 * @param body Record -> le corp du message d'erreur
 * @returns Un object contenant l'erreur
 */
const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null =>{
    if(!body){
        return {
            message: 'Unknown error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }
    if("errors" in body){
        const errors = body?.errors

        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }

    return null;
}

 export const fetchWrapper = async (url:string, options: RequestInit) =>{
    const response = await customFetch(url, options);
    
    const reponseClone = response.clone();
    const body = await reponseClone.json();

    const error = getGraphQLErrors(body);

    if (error) {
        throw error;
    }

    return response;
}