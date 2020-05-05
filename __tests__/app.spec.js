import { displayLength } from "../src/client/js/app.js";

describe("Function to display length of the trip", () => {
  test("it should use x to calculate the length", () => {
    const x = 5;
    const output = "You are planning a 5 day long trip!";
    expect(displayLength(5)).toEqual(output);
  });
});
