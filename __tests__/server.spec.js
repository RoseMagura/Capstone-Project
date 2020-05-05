// const app = require("../src/server/server.js");
const express = require("express");
const app = express();
const supertest = require("supertest");
const request = supertest(app);

const appData = [];
app.get("/getGeoData", (req, res) => {
  console.log(appData);
  res.send(appData);
});

describe("/getGeoData", () => {
  test("It should respond with an array", async done => {
    const response = await request.get("/getGeoData");
    expect(response.body).toEqual([]);
    expect(response.statusCode).toBe(200);
    done();
  });
});
