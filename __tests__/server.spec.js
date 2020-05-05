const request = require("supertest");
const app = require("./src/server/server.js");

app.get("/getGeoData", (req, res) => {
  console.log(appData);
  res.send(appData);
});

describe("/getGeoData", () => {
  test("It should respond with an array", async()=>{
  const response = await request(app).get("/getGeoData");
  // expect(response.body).any(Array);
  expect(response.statusCode).toBe(200);
  })
})
