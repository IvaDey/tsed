import {getSpec, OperationId, OperationPath} from "../../index.js";

describe("OperationId", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath("POST", "/")
      @OperationId("id")
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "id",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should throw error for unsupported usage", () => {
    let actualError: any;
    try {
      // @ts-ignore
      OperationId("id")(class Test {});
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("OperationId cannot be used as class decorator on Test");
  });
});
