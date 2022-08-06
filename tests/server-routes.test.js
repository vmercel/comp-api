const express = require("express"); // import express
const serverRoutes = require("../routes/posts-routes"); //import file we are testing
const { save } = require("./save_json");
const request = require("supertest"); // supertest is a framework that allows to easily test web apis
const bodyParser = require("body-parser");

jest.mock("./save_json", () => ({
  save: jest.fn(),
}));

jest.mock("./usStates.json", () => [
  {
    state: "MI",
    capital: "Lansing",
    governor: "Gretchen Whitmer",
  },
  {
    state: "GA",
    capital: "Atlanta",
    governor: "Brian Kemp",
  },
]); //callback function with mock data

const app = express(); //an instance of an express // a fake express app
app.use(bodyParser.json()); //this made it work
app.use("/states", serverRoutes); //

// describe("testing-server-routes", () => {
//   it("GET /states - success", async () => {
//     const { body } = await request(app).get("/states"); //use the request function that we can use the app
//     expect(body).toEqual([
//       {
//         state: "NJ",
//         capital: "Trenton",
//         governor: "Phil Murphy",
//       },
//       {
//         state: "CT",
//         capital: "Hartford",
//         governor: "Ned Lamont",
//       },
//       {
//         state: "NY",
//         capital: "Albany",
//         governor: "Andrew Cuomo",
//       },
//     ]);
//   });
// });

// let firstState;
describe("testing-server-routes", () => {
  it("GET /states - success", async () => {
    const { body } = await request(app).get("/states"); //use the request function that we can use the app// save the response to body variable
    expect(body).toEqual([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Gretchen Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
    ]);
    firstState = body[0];
    // console.log(firstState);
  });
  it("GET /states/MI - succes", async () => {
    const { body } = await request(app).get(`/states/${firstState.state}`);
    expect(body).toEqual(firstState);
  });

  it("POST /states - success", async () => {
    let stateObj = {
      state: "AL",
      capital: "Montgomery",
      governor: "Kay Ivey",
    };
    const { body } = await request(app).post("/states").send(stateObj);
    expect(body).toEqual({
      status: "success",
      stateInfo: {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Gretchen Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
    expect(save).toHaveBeenCalledTimes(1);
  });
  it("PUT /states/MI - success", async () => {
    let stateObj = {
      state: "MI",
      capital: "Lansing",
      governor: "Joe Whitmer",
    };
    const response = await request(app).put("/states/MI").send(stateObj);
    expect(response.body).toEqual({
      status: "success",
      stateInfo: {
        state: "MI",
        capital: "Lansing",
        governor: "Joe Whitmer",
      },
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Joe Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
    expect(response.statusCode).toEqual(200);
  });
  it("DELETE /states/MI - success", async () => {
    const { body } = await request(app).delete("/states/MI");
    expect(body).toEqual({
      status: "success",
      removed: "MI",
      newLength: 2,
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
  });
});
