export type Answers={budget:number;os:'Android'|'iOS'|'any';size:'compact'|'large'|'any';refurbished:boolean;priorities:Record<string,number>};
export type Phone={id:string;slug:string;name:string;brand:string;os:'Android'|'iOS';price:number;size:'compact'|'large';refurbished:boolean;storage:number;scores:Record<string,number>;offer:{merchant:string;url:string;warrantyMonths:number;official:boolean;updatedAt:string}};
export type RankedPhone=Phone&{match:number;why:string[];discardedBecause:string[]};
