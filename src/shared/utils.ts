/**
 * Gets random item from list
**/
export function GetRandom<T>(list: T[]): T {
    return list[Math.floor((Math.random() * list.length))];
}