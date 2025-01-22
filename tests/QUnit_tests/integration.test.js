const BaseUrl = "http://localhost:3030/";

const user = {
    email: "",
    password: "123456"
};

lastCreatedEventId = '';
myNewEvent = {
    author: "Random Author",
    date: "24.12.2024",
    title: "",
    description: "",
    imageUrl: "/images/To-kill-a-mockingbird.jpg"
}

let token = "";
let userId = "";

QUnit.config.reorder = false;

QUnit.module ("User functionalities", () => {
    QUnit.test("User registration", async(assert) =>{
        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        let email = `user${random}@abv.bg`;
        user.email = email;

        let response = await fetch(BaseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email')), "email exists",
        assert.equal(json['email'], user.email, 'expected email'),
        assert.strictEqual(typeof json.email, 'string', "type is correct");

        assert.ok(json.hasOwnProperty('password')), "password exists",
        assert.equal(json['password'], user.password, 'expected password'),
        assert.strictEqual(typeof json.password, 'string', "type is correct");

        assert.ok(json.hasOwnProperty('_createdOn')), "createdOn exists",        
        assert.strictEqual(typeof json._createdOn, 'number', "type is correct");

        assert.ok(json.hasOwnProperty('_id')), "ID exists",
        assert.strictEqual(typeof json._id, 'string', "type is correct");

        assert.ok(json.hasOwnProperty('accessToken')), "accessToken exists",
        assert.strictEqual(typeof json.accessToken, 'string', "type is correct");

        token = json['accessToken'];
        userId = json['userId'];

        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

QUnit.test ("User login", async(assert) => {
    let path = 'users/login';

    let response = await fetch(BaseUrl + path, {
        method: "POST",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify(user)
    });
    let json = await response.json();

    assert.ok(response.ok);

    assert.ok(json.hasOwnProperty('email')), "email exists",
    assert.equal(json['email'], user.email, 'expected email'),
    assert.strictEqual(typeof json.email, 'string', "type is correct");

    assert.ok(json.hasOwnProperty('password')), "password exists",
    assert.equal(json['password'], user.password, 'expected password'),
    assert.strictEqual(typeof json.password, 'string', "type is correct");

    assert.ok(json.hasOwnProperty('_createdOn')), "createdOn exists",        
    assert.strictEqual(typeof json._createdOn, 'number', "type is correct");

    assert.ok(json.hasOwnProperty('_id')), "ID exists",
    assert.strictEqual(typeof json._id, 'string', "type is correct");

    assert.ok(json.hasOwnProperty('accessToken')), "accessToken exists",
    assert.strictEqual(typeof json.accessToken, 'string', "type is correct");

    token = json['accessToken'];
    userId = json['userId'];

    sessionStorage.setItem('event-user', JSON.stringify(user));
    });
})

QUnit.module ("Event functionalities", () => {
QUnit.test("Get all events", async(assert) =>{
    path = 'data/theaters';
    let queryParams = '?sortBy=_createdOn%20desc&distinct=title';

    let response = await fetch(BaseUrl + path + queryParams);
    let json = await response.json();

    assert.ok(response.ok, "response is ok");
    assert.ok(Array.isArray(json), "response is an array");

    json.forEach(jsonData => {
    
//1 console.log(element); to get the properies of the THEATER EVENTS then delete CONSOLE LOG
        assert.ok(jsonData.hasOwnProperty('author'), "Author Exists");
        assert.ok(typeof jsonData.author, 'string', "Author is from correct type");

        assert.ok(jsonData.hasOwnProperty('date'), "date Exists");
        assert.ok(typeof jsonData.date, 'string', "date is from correct type");

        assert.ok(jsonData.hasOwnProperty('title'), "title Exists");
        assert.ok(typeof jsonData.title, 'string', "title is from correct type");

        assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId Exists");
        assert.ok(typeof jsonData._ownerId, '_ownerId', "_ownerId is from correct type");

        assert.ok(jsonData.hasOwnProperty('_id'), "_id Exists");
        assert.ok(typeof jsonData._id, 'string', "_id is from correct type");

        assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl Exists");
        assert.ok(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

        assert.ok(jsonData.hasOwnProperty('description'), "description Exists");
        assert.ok(typeof jsonData.description, 'string', "description is from correct type");

        assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn Exists");
        assert.ok(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");
    });
})

    QUnit.test("Logged in user creating a theater event", async (assert) => {
        let path = "data/theaters";
        let random = Math.floor(Math.random() * 10000);
        myNewEvent.title = `Random Title${random}`;
        myNewEvent.description = `random description${random}`;

        let response = await fetch (BaseUrl + path +`/${lastCreatedEventId}`, {
            method: "POST",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(myNewEvent)
        })
        let jsonData = await response.json();
        assert.ok(response.ok, "Response is ok");

        assert.ok(jsonData.hasOwnProperty('author'), "Author Exists");
        assert.strictEqual(jsonData.author, myNewEvent.author, "Author Is Expected");
        assert.ok(typeof jsonData.author, 'string', "Author is from correct type");

        assert.ok(jsonData.hasOwnProperty('date'), "date Exists");
        assert.strictEqual(jsonData.date, myNewEvent.date, "date Is Expected");
        assert.ok(typeof jsonData.date, 'string', "date is from correct type");

        assert.ok(jsonData.hasOwnProperty('title'), "title Exists");
        assert.strictEqual(jsonData.title, myNewEvent.title, "title Is Expected");
        assert.ok(typeof jsonData.title, 'string', "title is from correct type");

        assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId Exists");
        assert.ok(typeof jsonData._ownerId, '_ownerId', "_ownerId is from correct type");

        assert.ok(jsonData.hasOwnProperty('_id'), "_id Exists");
        assert.ok(typeof jsonData._id, 'string', "_id is from correct type");

        assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl Exists");
        assert.strictEqual(jsonData.imageUrl, myNewEvent.imageUrl, "imageUrl Is Expected");
        assert.ok(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

        assert.ok(jsonData.hasOwnProperty('description'), "description Exists");
        assert.strictEqual(jsonData.description, myNewEvent.description, "description Is Expected");
        assert.ok(typeof jsonData.description, 'string', "description is from correct type");

        assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn Exists");
        assert.ok(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

        lastCreatedEventId = jsonData._id;
    })
    
    QUnit.test("edit theater event", async (assert) => {
        let path = 'data/theaters/';
        let random = Math.floor(Math.random() * 10000);
        myNewEvent.title = `random EDITED title${random}`;

        let response = await fetch(BaseUrl + path + `/${lastCreatedEventId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myNewEvent)
    })
    let jsonData = await response.json();

    assert.ok(response.ok, "response is ok");

    assert.ok(jsonData.hasOwnProperty('author'), "Author Exists");
    assert.strictEqual(jsonData.author, myNewEvent.author, "Author Is Expected");
    assert.ok(typeof jsonData.author, 'string', "Author is from correct type");

    assert.ok(jsonData.hasOwnProperty('date'), "date Exists");
    assert.strictEqual(jsonData.date, myNewEvent.date, "date Is Expected");
    assert.ok(typeof jsonData.date, 'string', "date is from correct type");

    assert.ok(jsonData.hasOwnProperty('title'), "title Exists");
    assert.strictEqual(jsonData.title, myNewEvent.title, "title Is Expected");
    assert.ok(typeof jsonData.title, 'string', "title is from correct type");

    assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId Exists");
    assert.ok(typeof jsonData._ownerId, '_ownerId', "_ownerId is from correct type");

    assert.ok(jsonData.hasOwnProperty('_id'), "_id Exists");
    assert.ok(typeof jsonData._id, 'string', "_id is from correct type");

    assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl Exists");
    assert.strictEqual(jsonData.imageUrl, myNewEvent.imageUrl, "imageUrl Is Expected");
    assert.ok(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

    assert.ok(jsonData.hasOwnProperty('description'), "description Exists");
    assert.strictEqual(jsonData.description, myNewEvent.description, "description Is Expected");
    assert.ok(typeof jsonData.description, 'string', "description is from correct type");

    assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn Exists");
    assert.ok(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

    lastCreatedEventId = jsonData._id;
    })

QUnit.test ("Delete a theater event", async (assert) => {
    let path = "data/theaters";

    let response = await fetch(BaseUrl + path + `/${lastCreatedEventId}`, {
        method: "DELETE",
        headers: {
            'X-Authorization' : token
        }
    })

    assert.ok(response.ok)

})

})