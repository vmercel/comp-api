import supertest from 'supertest'
import { app } from '../index.js'
//use the supertest object as our API
const api = supertest(app)

//run npm test -- -t "GET call"
//test GET or READ call on localhost:3001/api/items endpoint
test('GET call', async () => {
    await api
        .get('/api/items')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})




import { Post } from '../models/post'

test('POST call', async () => {
    //build a new item
    const newItem = {
        description:"sent from Jest!",
        likes: 10
    }
    //we send the item object to the DB through the API
    //we expect a successful result
    await api
        .post('/api/items')
        .send(newItem)
        .expect(201)
    //get all the items in our DB
    const items = await Item.find({})
    //let's check that the last item added was indeed newItem object
    //it should contain the description "sent from Jest!"
    expect(items[items.length-1].description).toBe("sent from Jest!")
})


test('GET one', async () => {
    //get all the items
    const items = await Item.find({})
    //get the the first item parsed to JSON
    const firstItem = items[0].toJSON()
    //get the result expecting success and JSON data
    const resItem = await
        api.get(`/api/items/${firstItem.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    //check if the item has the same id and the route works as expected
    expect(resItem.body.id).toEqual(firstItem.id)


    test('check all items have ids', async () => {
        //get all the items
        const items = await api.get('/api/items')
        //check that every item in our DB has the id property
        for(const item of items.body){
            expect(item.id).toBeDefined()
        }
    })


describe('GET calls', () => {
    //run npm test -- -t "GET call"
    //test GET or READ call on localhost:3001/api/items endpoint
    test('GET call', async () => {
        await api
            .get('/api/items')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    //npm test -- -t "GET one"
    //GET item by id
    test('GET one', async () => {
        //get all the items
        const items = await Item.find({})
        //get the the first item parsed to JSON
        const firstItem = items[0].toJSON()
        //get the result expecting success and JSON data
        const resItem = await
            api.get(`/api/items/${firstItem.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        //check if the item has the same id and the route works as expected
        expect(resItem.body.id).toEqual(firstItem.id)
    })
    test('check all items have ids', async () => {
        //get all the items
        const items = await api.get('/api/items')
        //check that every item in our DB has the id property
        for(const item of items.body){
            expect(item.id).toBeDefined()
        }
    })
})

})





test('DELETE item', async () => {
    //get items and parse the one you want to delete to JSON
    const itemsAtStart = await Item.find({})
    const itemToDelete = itemsAtStart[0].toJSON()
    //delete the item by id
    await api
        .delete(`/api/items/${itemToDelete.id}`)
        .expect(204)
    //get all items from the database again
    const itemsNow = await Item.find({})
    //check if the number of current items is one less than before
    expect(itemsNow).toHaveLength(itemsAtStart.length-1)
    //get an array of all the descriptions inside the DB
    //could get any other info like the id
    const itemsDescriptions = itemsNow.map(i => i.toJSON().description)
    //expect the description from the deleted item to not be there
    expect(itemsDescriptions).not.toContain(itemToDelete.description)
})





