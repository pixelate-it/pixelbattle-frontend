export interface PlaceMessageData {
    op: "PLACE";
    id: number;
    color: string;
}

export interface EndedMessageData {
    op: "ENDED"
}

export type MessageData = PlaceMessageData | EndedMessageData