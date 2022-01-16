import { toCollection } from "../src/functions";


describe("toCollection", () => {

    test("sets the correct name", () => {
        var result = toCollection('myCol', { property: 'value' });

        expect(result).toHaveProperty('name', 'myCol');
    });

    test("sets a simple property", () => {
        var result = toCollection('myCol', { property: 'value' });

        expect(result).toEqual(
            expect.objectContaining({
                properties: expect.objectContaining({
                    property: 'value',
                }),
            })
        );

    });

    test("to guard against circular dependency", () => {
        var obj: any = {};
        obj.child = {};
        obj.child.id = 1;
        obj.child.parent = obj;

        var result = toCollection('myCol', obj);

        expect(result).toEqual(
            expect.objectContaining({
                properties: expect.objectContaining({
                    "child.id": "1",
                }),
            })
        );

    });
});

