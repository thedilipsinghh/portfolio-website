export type LOGIN_RESPONE = {
    message: string
}
export type LOGIN_REQUEST = {
    _id?: string,
    name?: string,
    email: string,
    password: string,
    number?: string,
}
