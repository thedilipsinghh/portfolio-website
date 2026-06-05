export type PROJECT_RESPONSE = {
    message: string
}
export type PROJECT_REQUEST = {
    _id?: string,
    title: string,
    description: string,
    note: string,
    image: string,
    tags: string[],
    liveLink: string,
    githubLink: string,
    icon: string,
}
