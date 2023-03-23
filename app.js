const express = require('express');
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config()

const listId = process.env.MLIST_ID;


mailchimp.setConfig({
  apiKey: process.env.MAPI_KEY,
  server: process.env.MSERVER_ID,
});


const app = express();

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res)  {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

const subscribingUser = {
  firstName: firstName,
  lastName: lastName,
  email: email,
};

async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
  );
}

function successCallback(result) {
        res.sendFile(__dirname + '/success.html')
        }

function failureCallback(error) {
        res.sendFile(__dirname + '/failure.html')
        console.log(error)
        }

run().then(successCallback, failureCallback);

})

app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000)