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
    removeUndefined = false
): IContextCollection {
    if (!collectionName) {
        throw new Error('collectionName must be specified');
    }

    if (!anyObject) {
        throw new Error('anyObject must be specified');
    }

    const collection = { name: collectionName, properties: {} };
    appendToCollection(collection, '', anyObject, removeUndefined);
    return collection;
}

/**
 * Locate or create the telemetry collection that Coderr uses to adjust the error report analysis.
 * @param collections An array of all created collections.
 * @returns Collection.
 */
export function getCoderrCollection(collections: IContextCollection[]): IContextCollection {
    let col = collections.find((x) => x.name === 'CoderrData');
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
    removeUndefined = false
): void {
    if (!collection) {
        throw new Error('Collection must be specified');
    }

    const guard: IGuardedObject[] = [];
    appendToCollectionInner(collection, propertyPrefix, anyObject, guard, removeUndefined);
}

/**
 * 
 * @param collection 
 * @param propertyPrefix 
 * @param anyObject 
 * @param guard 
 * @param removeUndefined 
 */
function appendToCollectionInner(
    collection: IContextCollection,
    propertyPrefix: string,
    anyObject: any,
    guard: IGuardedObject[],
    removeUndefined = false
): void {
    const props = collection.properties;

    /**
     * 
     * @param name 
     * @param value 
     * @param guard 
     */
    function addItem(name: string, value: any, guard: IGuardedObject[]): void {

        // already traversed that object.
        if (guard.findIndex((x) => x.value === value) > -1) {
            return;
        }

        // angular filter.
        if (name.indexOf('__zone') !== -1){
            return;
        }

        guard.push({ name: name, value: value });
        // Means 5, since retriving values is one additional nesting.
        if (guard.length > 6) {
            props[name] = '[Too deep nesting]';
            guard.pop();
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                addItem(`${name}[${index}]`, item, guard);
            });
        } else if (typeof value === 'function') {
            // ignore functions
        } else if (typeof value === 'object') {
            for (const key in value) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    continue;
                }

                const childValue = value[key];
                let propName = `${name}.${key}`;

                // When calling from toCollection
                if (name === '') {
                    propName = key;
                }

                addItem(propName, childValue, guard);
            }
        } else {
            let valueStr: string;
            if (typeof value === 'undefined') {
                if (removeUndefined) {
                    guard.pop();
                    return;
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
    }

    addItem(propertyPrefix, anyObject, guard);
    guard.pop();
}
