import {ContextCollection, CollectionProperty} from './interfaces';

export function toCollection(
    collectionName: string,
    anyObject: any
): ContextCollection {
    const props: CollectionProperty[] = [];

    function addItem(name: string, value: any) {
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                addItem(`${name}[${index}]`, item);
            });
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

                addItem(propName, childValue);
            }
        } else {
            props.push({ name, value });
        }
    }

    addItem('', anyObject);
    return { name: collectionName, properties: props };
}

export function detectDeveloperTools(): boolean {
    if (!console.log) {
        return false;
    }
    let result = false;
    const element: any = new Image();
    element.__defineGetter__('id', () => {
        result = true;
    });
    console.log(element);
    return result;
}

// source: https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript
export function uniqueid() {
    // always start with a letter (for DOM friendlyness)
    let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    do {
        const asciiCode = Math.floor((Math.random() * 42) + 48);
        if (asciiCode < 58 || asciiCode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(asciiCode);
        }
    } while (idstr.length < 32);
    return idstr;
}
