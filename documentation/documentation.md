
# chalimba-social

This is the api documentation of the chalimba-social REST API.

## Indices

* [Authentication](#authentication)

  * [Log out](#1-log-out)
  * [Login](#2-login)
  * [Register user](#3-register-user)

* [File](#file)

  * [Get file](#1-get-file)
  * [Upload file](#2-upload-file)

* [Message](#message)

  * [Create Conversation](#1-create-conversation)
  * [Create Message](#2-create-message)
  * [Get Conversations](#3-get-conversations)
  * [Get messages of conversation](#4-get-messages-of-conversation)

* [Post](#post)

  * [Create comment](#1-create-comment)
  * [Create post](#2-create-post)
  * [Delete post](#3-delete-post)
  * [Explore](#4-explore)
  * [Get bookmarked posts](#5-get-bookmarked-posts)
  * [Get comments of post](#6-get-comments-of-post)
  * [Get liked posts](#7-get-liked-posts)
  * [Get post by id](#8-get-post-by-id)
  * [Get posts from user](#9-get-posts-from-user)
  * [Like post](#10-like-post)
  * [Mark post](#11-mark-post)
  * [Timeline](#12-timeline)
  * [Update post](#13-update-post)

* [User](#user)

  * [Delete user](#1-delete-user)
  * [Follow user](#2-follow-user)
  * [Get current user](#3-get-current-user)
  * [Get friends](#4-get-friends)
  * [Get user by id](#5-get-user-by-id)
  * [Get user by username](#6-get-user-by-username)
  * [Unfollow user](#7-unfollow-user)
  * [Update user](#8-update-user)


--------


## Authentication
Endpoints regarding user authentication.



### 1. Log out



***Endpoint:***

```bash
Method: POST
Type: 
URL: https://chalimba-social.herokuapp.com/api/auth/logout
```



### 2. Login


This is the endpoint to authenticate a user with credentials. It must be called before any authorized endpoints and returns http only cookies containing the access and refresh token.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/auth/login
```



***Body:***

```js        
{
    "email": "jane@doe.com",
    "password": "test1234"
}
```



### 3. Register user



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/auth/register
```



***Body:***

```js        
{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "test1234"
}
```



## File



### 1. Get file



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/file/public%2Flogo-dark.png
```



### 2. Upload file



***Endpoint:***

```bash
Method: POST
Type: FORMDATA
URL: https://chalimba-social.herokuapp.com/api/file/
```



***Body:***

| Key | Value | Description |
| --- | ------|-------------|
| file |  |  |
| name | like.png |  |
| folder | public |  |



## Message
Endpoints regarding instant messaging feature (not yet integrated to frontend).



### 1. Create Conversation



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/conversation
```



***Body:***

```js        
{
    "receiverId": "61a37fa7672aa6a5aa424a73"
}
```



### 2. Create Message



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/message
```



***Body:***

```js        
{
    "text": "Hi, this is my fifth message",
    "conversationId": "61ba5a91c3452d5ea0dcff59"
}
```



### 3. Get Conversations



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/conversation
```



***Body:***

```js        
{
    "receiverId": "61a37fa7672aa6a5aa424a73"
}
```



### 4. Get messages of conversation



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/message/61ba5a91c3452d5ea0dcff59
```



***Body:***

```js        
{
    "receiverId": "61a37fa7672aa6a5aa424a73"
}
```



## Post
Endpoints regarding CRUD operations for posts.



### 1. Create comment



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/comment/
```



***Body:***

```js        
{
    "postId": "61c65f39b99a6a7ac22e06c3",
    "text": "Second comment"
}
```



### 2. Create post



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/post
```



***Body:***

```js        
{
    "description": "Hey, this is my second post",
    "img": "post/3.jpeg"
}
```



### 3. Delete post



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/61c65f39b99a6a7ac22e06c3
```



### 4. Explore


This endpoint fetches all posts ever created.


***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/explore
```



### 5. Get bookmarked posts



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/bookmarked
```



### 6. Get comments of post



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/comment/
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| postId | 61c65f39b99a6a7ac22e06c3 |  |



### 7. Get liked posts



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/liked
```



### 8. Get post by id



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/61c65f39b99a6a7ac22e06c3
```



### 9. Get posts from user



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/profile/janedoe
```



### 10. Like post



***Endpoint:***

```bash
Method: PUT
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/61c8f29e2887d8be65613212/like
```



### 11. Mark post



***Endpoint:***

```bash
Method: PUT
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/61c8f29e2887d8be65613212/bookmark
```



### 12. Timeline


This endpoint fetches all posts created by the current user or by persons who the user follows.


***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/post/timeline
```



### 13. Update post



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/post/61c8f29e2887d8be65613212
```



***Body:***

```js        
{
    "description": "Hey, this is my second post 2"
}
```



## User
Endpoints regarding user and profile CRUD operations.



### 1. Delete user



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/619d7f2e567fd0c132ce33bb
```



### 2. Follow user



***Endpoint:***

```bash
Method: PUT
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/61c65112bdad8fe90ae8463e/follow
```



### 3. Get current user



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/current
```



### 4. Get friends



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/friends
```



### 5. Get user by id



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| userId | 61c65112bdad8fe90ae8463e |  |



### 6. Get user by username



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://chalimba-social.herokuapp.com/api/user
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| username | janedoe |  |



### 7. Unfollow user



***Endpoint:***

```bash
Method: PUT
Type: 
URL: https://chalimba-social.herokuapp.com/api/user/61c65112bdad8fe90ae8463e/unfollow
```



### 8. Update user



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: https://chalimba-social.herokuapp.com/api/user/61c65112bdad8fe90ae8463e
```



***Body:***

```js        
{
    "description": "This is an updated description."
}
```



***Available Variables:***

| Key | Value | Type |
| --- | ------|-------------|
| chalimba_social_endpoint | https://chalimba-social.herokuapp.com/api |  |



---
[Back to top](#chalimba-social)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2022-01-09 16:05:02 by [docgen](https://github.com/thedevsaddam/docgen)
