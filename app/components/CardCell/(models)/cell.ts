export interface ICell {
    id: number;
    code: string;
    name: string;
    des: string;
    metter: number;
    status: enumCellStatus;
}

export enum enumCellStatus {
    SELL = 'SELL',
    RENT = 'RENT',
    FULLMORTGAGE = 'FULLMORTGAGE'
}
