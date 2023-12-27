## ECDSA Node

This is a fork of the Alchemy Ethereum developer bootcamp week 1 project. The purpose of this project is to make developer to be familiar with common cryptographic terms and usages.

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized as the purpose of this project is mainly cryptographic functions such as encryption, decryption, signature, verification. It also makes the developer familiar with the addresses.

### Goal

In this project, the Alchemy tutor implemented the version that makes user to send private key to the server which creates a huge security / trust problems as anyone who has the private key can steal the money that account has. In this version, I am going to make user to sign a hex of JSON that contains the receipter address, amount and the current time of the request. The user needs to sign it on their own device without any interaction from the website and this will make sure their private keys are not in risk of exposure. 

This design choice is also has its drawbacks if an hacker can do a Man in the Middle Attack, they can receive the same signature and they can re-use it to make the same transaction. This can be prevented (or at least make it harder to achieve) by using secure communication methodologies such as SSL/TLS. It can also be prevented by checking the signature if it existed before in our blockchain. Also we can use the timestamp which json contains and check if the signature / request is created in specific time limit such as a minute. In this project we are going to skip implementing this part as this is not the goal of the project.
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 
