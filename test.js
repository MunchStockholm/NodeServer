import { MongoClient } from "mongodb";
import { expect } from "chai";
import supertest from "supertest";
import { app } from "./server.js";

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const connectionString = `mongodb+srv://${user}:${password}@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(connectionString);

describe("GET /", () => {
    let request = supertest(app);

    it("should return an array of objects with a 200 status code", (done) => {
        request
            .get("/")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should handle errors and return a 500 status code", (done) => {
        client.close();

        request
            .get("/")
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("Internal server error");
                done();
            });
    });
});

describe("POST /", () => {
    let request = supertest(app);

    describe("when passed an object", () => {
        it("should respond with a 200 status code", async () => {
            await request
                .post("/")
                .send({_id: 101,
                    ImageBytes: "updatedbase64string",
                    ImageUrl: "url",
                    IsFeatured: true,
                    CreatedDate:  "2023-06-01T00:00:00.000Z"})
                .expect(200);
        });
    });
});

describe("DELETE /:id", () => {
    let request = supertest(app);

    describe("when deleting an object", () => {
        it("should respond with a 200 status code", async () => {
            // Assuming there is an object with ID 100 in the database before deletion

            await request
                .delete("/101")
                .expect(200);
        });
    });
})