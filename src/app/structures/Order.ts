export type Order = {
    dishIds: string[],
    dishNames: string[],
    dishCounts: number[]
    date: string;
}

export type OrderTemp = {
    dishId: string,
    dishName: string;
    dishCount: number;
}