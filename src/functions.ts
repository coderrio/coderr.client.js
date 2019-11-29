import { ContextCollection } from './interfaces';

export function toCollection(
    collectionName: string,
    anyObject: any,
    removeUndefined: boolean = false
): ContextCollection {
    var collection = {name: collectionName, properties: {}};
    appendToCollection(collection, '', anyObject, removeUndefined);
    return collection;
}

export function appendToCollection(
    collection: ContextCollection,
    propertyPrefix: string,
    anyObject: any,
    removeUndefined: boolean = false
): void {
    var guard: string[] = [];
    appendToCollectionInner(collection, propertyPrefix, anyObject, guard, removeUndefined);
}

function appendToCollectionInner(
    collection: ContextCollection,
    propertyPrefix: string,
    anyObject: any,
    guard: string[],
    removeUndefined: boolean = false
): void {
    const props = collection.properties;

    function addItem(name: string, value: any, guard: string[]): boolean {
        guard.push(name);
        if (name.length > 20) {
            props[name] = 'Too many nested levels: ' + guard.join(' -> ');
            return false;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (!addItem(`${name}[${index}]`, item, guard))
                {
                    return false;
                }
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

                if (!addItem(propName, childValue, guard)){
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

export function detectDeveloperTools(): boolean {
    if (!console.log) {
        return false;
    }
    let result = false;
    try {
        const element: any = new Image();
        element.__defineGetter__('id', () => {
            result = true;
        });
        console.log(element);
    } catch {
        // probably that the Image could not be created,
        // so ignore the error as we wont have dev tools then.
    }
    return result;
}

// source: https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript
export function uniqueid() {
    // always start with a letter (for DOM friendlyness)
    let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
    do {
        const asciiCode = Math.floor(Math.random() * 42 + 48);
        if (asciiCode < 58 || asciiCode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(asciiCode);
        }
    } while (idstr.length < 32);
    return idstr;
}
