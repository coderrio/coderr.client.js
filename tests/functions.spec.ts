import { toCollection } from "../src/context-collections";


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

    test("guards against circular dependency", () => {
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

    test("too large nesting doesn't abort all", () => {
        var obj = {
            one: {
                two: {
                    three: {
                        four: {
                            five: {
                                hello: 'yes'
                            }
                        }
                    }
                }
            },
            shouldBeFound: true
        };

        var result = toCollection('myCol', obj);

        expect(result).toEqual(
            expect.objectContaining({
                properties: expect.objectContaining({
                    "shouldBeFound": "true",
                }),
            })
        );

    });

    test("too large nesting ignores too nested", () => {
        var obj = {
            one: {
                two: {
                    some: 'value',
                    three: {
                        four: {
                            five: {
                                hello: 'yes'
                            },
                        },
                        hey: 'yay'
                    },
                }
            },
            shouldBeFound: true
        };

        var result = toCollection('myCol', obj);

        console.log(result);
        expect(result).toEqual(
            expect.objectContaining({
                properties: expect.not.objectContaining({
                    "hello": "yes",
                    "one.two.some": 'value',
                    "one.two.three.hey": 'yay'
                }),
            })
        );

    });
});

