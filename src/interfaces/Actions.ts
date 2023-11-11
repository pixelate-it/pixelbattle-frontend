export interface PlaceMessageData {
    op: "PLACE";
    x: number;
    y: number;
    color: string;
}

export interface EndedMessageData {
    op: "ENDED"
}

export type MessageData = PlaceMessageData | EndedMessageData