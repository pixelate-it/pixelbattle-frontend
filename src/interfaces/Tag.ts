export interface ApiTags {
    tags: [string, number][]

}

export type ApiTag = [string, number]

export interface FormatedTag {
    name: string;
    pixels: number;
    place: number;
}