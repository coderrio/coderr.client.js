// /**
//  * Detect if developer tools are open.
//  */
// export function detectDeveloperTools(): boolean {
//     if (!console.log) {
//         return false;
//     }
//     let result = false;
//     try {
//         const element: any = new Image();
//         element.__defineGetter__('id', () => {
//             result = true;
//         });
//         console.log(element);
//     } catch {
//         // probably that the Image could not be created,
//         // so ignore the error as we wont have dev tools then.
//     }
//     return result;
// }

// source: https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript
export function uniqueid() {
    // always start with a letter (for DOM friendliness)
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
