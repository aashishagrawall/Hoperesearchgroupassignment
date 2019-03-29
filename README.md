# Hoperesearchgroupassignment
Simple nodejs app

To run the project
1. npm install
2.  npm start

APIs

1. (/addAllUsers ,POST) -It will add users to masters database
2. (/addAllPostAndComments,POST) - It will map posts and comment and add it to respective user database
3. (/signIn,POST) - It will signin the user required fields are Example
    ({"username":"Bret",
      "password":"Bret-Bret"}) password are made by (username + '-' + username) valid for all users;
      Login is made through stateless JWT
      
4. (/allUsers,GET) - It will fetch all users for authorization ,Authorization headers should be passed along with value -Authorization :(Bearer token);
token will be received on you logged in;
 5. (/allUserPosts,GET)- It will fetch all user post ,Authorization headers should be passed along ex - Authorization :(Bearer token);
token will be received on you logged in;
6.  (/updateUserPhone,GET) - It will update user phone number userimage is not included in json file so i user phone ,Authorization headers should be passed along with value -Authorization :(Bearer token);
token will be received on you logged in;
7. cannot create signout beacause of stateless JWT ,User will automatically signout once token is expired, token expiry is set to 200s

