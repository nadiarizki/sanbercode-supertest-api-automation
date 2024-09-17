// import request from 'supertest';
// import { expect } from 'chai';
// import { getToken } from './functions/getToken.js';
// import { baseUrl } from '../data/config.js';
// import chaiJsonSchema from 'chai-json-schema'; // Importing chai-json-schema
// import fs from 'fs';
// expect.use(chaiJsonSchema); // Register chai-json-schema plugin


import request from 'supertest';
import chai from 'chai'; // Import Chai
import chaiJsonSchema from 'chai-json-schema'; // Import chai-json-schema plugin
import { getToken } from './functions/getToken.js';
import { baseUrl } from '../data/config.js';
import fs from 'fs';

chai.use(chaiJsonSchema); // Register the plugin with Chai
const expect = chai.expect; // Use chai.expect

describe('Category CRUD', () => {
    let categoryId;
    let token;

    // Fetch the token before running the tests
    before(async () => {
        token = await getToken();
    });

    it('successfully adds a category', async () => {
        const payload = {
            "name": "makanan ringan",
            "description": "makanan ringan dari indofood"
        };

        const response = await request(baseUrl)
            .post("/categories")
            .send(payload)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(201);   
        expect(response.body.status).to.equal("success"); 
        expect(response.body.message).to.equal("Category berhasil ditambahkan");
        expect(response.body.data.name).to.equal("makanan ringan");
 
        categoryId = response.body.data.categoryId;
        console.log(categoryId);
    });

    it('successfully retrieves the category', async () => {
        const response = await request(baseUrl)
            .get(`/categories/${categoryId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(200);    
        expect(response.body.status).to.equal("success");
        expect(response.body.data.category.name).to.equal("makanan ringan");
        expect(response.body.data.category.description).to.equal("makanan ringan dari indofood");
               
        // assert json schema
        const schemaPath = "resource/getCategorySchema.json";
        const jsonSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
        expect(response.body).to.be.jsonSchema(jsonSchema);
        

    });

    it('successfully updates the category', async () => {
        const payload = {                
            "name": "update makanan ringan",
            "description": "update makanan ringan dari indofood"
        };

        const response = await request(baseUrl)
            .put(`/categories/${categoryId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(payload);

        expect(response.statusCode).to.equal(200);   
        expect(response.body.status).to.equal("success"); 
        expect(response.body.data.name).to.equal("update makanan ringan");
    });

    it('successfully deletes the category', async () => {
        const response = await request(baseUrl)
            .delete(`/categories/${categoryId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(200); 
        expect(response.body.status).to.equal("success"); 
        console.log(response.body);
    });
});
