import request from 'supertest';
import { baseUrl } from '../../data/config.js';

export async function getToken() {
    const payload = {
        "email" : "nadiaa@makankor.net",
        "password" : "admin123"
    }

    const response = await request(baseUrl)
        .post("/authentications")
        .send((payload))
        .set("Content-Type", "application/json")
        //console.log(await response)    

        const token = response.body.data.accessToken;
        console.log(token)    

        return token;

}

