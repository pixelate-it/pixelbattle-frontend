export interface ApiTags {
    tags: ApiTag[];
    pixels: {
        all: number;
        used: number;
        unused: number;
    }
}

export type ApiTag = [string, number]

export interface FormatedTag {
    name: string;
    pixels: number;
    place: number;
}