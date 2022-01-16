import { IContextCollection } from './interfaces';

/**
 * Convert an object to a collection.
 * @param collectionName collection name (in the Coderr UI)
 * @param anyObject Object to convert.
 * @param removeUndefined Remove all undefined values (instead of creating an empty property value).
 * @returns Generated collection.
 */
export function toCollection(
    collectionName: string,
    anyObject: any,
    removeUndefined: boolean = false
): IContextCollection {
    if (!collectionName) {
        throw new Error('collectionName must be specified');
    }

    if (!anyObject) {
        throw new Error('anyObject must be specified');
    }

    var collection = { name: collectionName, properties: {} };
    appendToCollection(collection, '', anyObject, removeUndefined);
    return collection;
}

/**
 * Locate or create the telemetry collection that Coderr uses to adjust the error report analysis.
 * @param collections An array of all created collections.
 * @returns Collection.
 */
export function getCoderrCollection(collections: IContextCollection[]) {
    var col = collections.find((x) => x.name === 'CoderrData');
    if (col) {
        return col;
    }

    col = { name: 'CoderrData', properties: {} };
    collections.push(col);
    return col;
}

interface IGuardedObject {
    name: string;
    value: any;
}

/**
 * Append any object to a context collection.
 * @param collection Collect to append to.
 * @param propertyPrefix Prefix all properties with this.
 * @param anyObject Object to append.
 * @param removeUndefined Remove all undefined values (instead of creating an empty property value).
 */
export function appendToCollection(
    collection: IContextCollection,
    propertyPrefix: string,
    anyObject: any,
    removeUndefined: boolean = false
): void {
    if (!collection) {
        throw new Error('Collection must be specified');
    }

    var guard: IGuardedObject[] = [];
    appendToCollectionInner(collection, propertyPrefix, anyObject, guard, removeUndefined);
}

function appendToCollectionInner(
    collection: IContextCollection,
    propertyPrefix: string,
    anyObject: any,
    guard: IGuardedObject[],
    removeUndefined: boolean = false
): void {
    const props = collection.properties;

    function addItem(name: string, value: any, guard: IGuardedObject[]): boolean {
        if (guard.findIndex((x) => x.value === value) > -1) {
            return false;
        }

        guard.push({ name: name, value: value });
        if (name.length > 20) {
            props[name] = 'Too many nested levels: ' + guard.map((x) => x.name).join(' -> ');
            return false;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (!addItem(`${name}[${index}]`, item, guard)) {
                    return false;
                }

                return true;
            });
        } else if (typeof value === 'function') {
            // ignore functions
        } else if (typeof value === 'object') {
            for (const key in value) {
                if (!value.hasOwnProperty(key)) {
                    continue;
                }

                const childValue = value[key];
                let propName = `${name}.${key}`;

                // When calling from toCollection
                if (name === '') {
                    propName = key;
                }

                if (!addItem(propName, childValue, guard)) {
                    return false;
                }
            }
        } else {
            let valueStr: string;
            if (typeof value === 'undefined') {
                if (removeUndefined) {
                    guard.pop();
                    return true;
                }
                valueStr = 'undefined';
            } else if (value === null) {
                valueStr = 'null';
            } else {
                valueStr = value.toString();
            }
            props[name] = valueStr;
        }

        guard.pop();
        return true;
    }

    addItem(propertyPrefix, anyObject, guard);
    guard.pop();
}
