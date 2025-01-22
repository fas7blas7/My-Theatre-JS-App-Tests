const baseUrl = "http://localhost:3030/";

let user = {
    email: "",
    password: "123456"
};

let lastCreatedEventId = '';
let myEvent = {
    author: "Random author",
    date: "25.06.2024",
    title: "",
    description: "",
    imageUrl: "/images/Moulin-Rouge!-The-Musical.jpg"
}

let token = "";
let userId = "";

QUnit.config.reorder = false;

QUnit.module("user functionalities", () => {
    QUnit.test("registration", async (assert) => {
        //arrange
        let path = 'users/register';

        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;
        user.email = email;

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expexted email');
        assert.strictEqual(typeof json.email, 'string', "email has corect type");

        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expexted password');
        assert.strictEqual(typeof json.password, 'string', "password has corect type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has corect type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has corect type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has corect type");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

    QUnit.test("login", async (assert) => {
        //arrange
        let path = 'users/login';

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expexted email');
        assert.strictEqual(typeof json.email, 'string', "email has corect type");

        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expexted password');
        assert.strictEqual(typeof json.password, 'string', "password has corect type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has corect type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has corect type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has corect type");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));
    })
})

QUnit.module("Event functionalities", () => {
    QUnit.test("get all events", async (assert) => {
        //arrange
        let path = 'data/theaters';
        let queryParams = '?sortBy=_createdOn%20desc&distinct=title';


        //act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        //assert
        assert.ok(response.ok, "Response is ok");
        assert.ok(Array.isArray(json), "response is array");

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('author'), "Author exists");
            assert.strictEqual(typeof jsonData.author, 'string', "Author is from correct type");

            assert.ok(jsonData.hasOwnProperty('date'), "date exists");
            assert.strictEqual(typeof jsonData.date, 'string', "date is from correct type");

            assert.ok(jsonData.hasOwnProperty('description'), "description exists");
            assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

            assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl exists");
            assert.strictEqual(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

            assert.ok(jsonData.hasOwnProperty('title'), "title exists");
            assert.strictEqual(typeof jsonData.title, 'string', "title is from correct type");

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");
        });
    })

    QUnit.test("Create event", async (assert) => {
        //arrange
        let path = "data/theaters";
        let random = Math.floor(Math.random() * 10000);
        myEvent.title = `Random title ${random}`;
        myEvent.description = `Random descr ${random}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myEvent)
        })
        let jsonData = await response.json();

        //assert
        assert.ok(response.ok, "Response is ok");

        assert.ok(jsonData.hasOwnProperty('author'), "Author exists");
        assert.strictEqual(jsonData.author, myEvent.author, "Author is expected");
        assert.strictEqual(typeof jsonData.author, 'string', "Author is from correct type");

        assert.ok(jsonData.hasOwnProperty('date'), "date exists");
        assert.strictEqual(jsonData.date, myEvent.date, "date is expected");
        assert.strictEqual(typeof jsonData.date, 'string', "date is from correct type");

        assert.ok(jsonData.hasOwnProperty('description'), "description exists");
        assert.strictEqual(jsonData.description, myEvent.description, "description is expected");
        assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

        assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl exists");
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, "imageUrl is expected");
        assert.strictEqual(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

        assert.ok(jsonData.hasOwnProperty('title'), "title exists");
        assert.strictEqual(jsonData.title, myEvent.title, "title is expected");
        assert.strictEqual(typeof jsonData.title, 'string', "title is from correct type");

        assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

        assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

        assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
        assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

        lastCreatedEventId = jsonData._id;
    })

    QUnit.test("Event edititng", async (assert) => {
        //arrange
        let path = 'data/theaters';
        let random = Math.floor(Math.random() * 10000);
        myEvent.title = `Random title ${random}`;

        //act
        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myEvent)
        })
        let jsonData = await response.json();

        //assert
        assert.ok(response.ok, "Response is ok");

        assert.ok(jsonData.hasOwnProperty('author'), "Author exists");
        assert.strictEqual(jsonData.author, myEvent.author, "Author is expected");
        assert.strictEqual(typeof jsonData.author, 'string', "Author is from correct type");

        assert.ok(jsonData.hasOwnProperty('date'), "date exists");
        assert.strictEqual(jsonData.date, myEvent.date, "date is expected");
        assert.strictEqual(typeof jsonData.date, 'string', "date is from correct type");

        assert.ok(jsonData.hasOwnProperty('description'), "description exists");
        assert.strictEqual(jsonData.description, myEvent.description, "description is expected");
        assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

        assert.ok(jsonData.hasOwnProperty('imageUrl'), "imageUrl exists");
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, "imageUrl is expected");
        assert.strictEqual(typeof jsonData.imageUrl, 'string', "imageUrl is from correct type");

        assert.ok(jsonData.hasOwnProperty('title'), "title exists");
        assert.strictEqual(jsonData.title, myEvent.title, "title is expected");
        assert.strictEqual(typeof jsonData.title, 'string', "title is from correct type");

        assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

        assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

        assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
        assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

        lastCreatedEventId = jsonData._id;
    })

    QUnit.test("Delete event", async (assert) => {
        //arrange
        let path = "data/theaters";

        //act
        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: "DELETE",
            headers: {
                'X-Authorization' : token
            }
        })

        //assert
        assert.ok(response.ok)
    })
})