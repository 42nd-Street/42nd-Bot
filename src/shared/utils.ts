/**
 * Gets random item from list
**/
export function get_random<T>(list: T[]): T {
    return list[Math.floor((Math.random() * list.length))];
}