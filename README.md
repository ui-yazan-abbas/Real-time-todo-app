## Real-time todo App
I created a full stack todo app with a real-time collaberation between users using TypeScript with Nextjs, Node and Firebase.


![Skärmklipp](https://user-images.githubusercontent.com/77113737/147872893-8b42ea7f-5400-479a-90a7-13ae7485d2d4.JPG)
## Running the App
After cloning the app you will need a .env file containing the following:
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_SENDER_ID=
```
You will also need a firebase admin sdk json file by generating it following the guide on this link:
https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app


to run the development server:
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Demo Video

## Why Nextjs
-Server Side Rendering (SSR):

![ssg-vs-ssr-mechanics-overview](https://user-images.githubusercontent.com/77113737/147873293-6ff05ed1-a879-4fe7-965e-648e13bc4a67.png)

 React components that make up the user-facing part of a website are all initially rendered on the server side. This means that once the HTML has been   delivered to the client (the user’s browser), nothing else needs to happen for the user to be able to read the content on the page. This makes page loading times appear much faster to the user.
 
 
 Rendering the same components on the server side as on the client side (universal rendering) means that development time is reduced as we can build our      React components once and Next JS takes care of everything to do with re-rendering those components in the user’s browser. Developers can just concentrate on building components and not have to worry (too much!) about which environment a component is being rendered in.
 
 
-advanced routing:
 
## Why Firebase

The Firebase Realtime Database lets you build rich, collaborative applications by allowing secure access to the database directly from client-side code. Data is persisted locally, and even while offline, realtime events continue to fire, giving the end user a responsive experience. When the device regains connection, the Realtime Database synchronizes the local data changes with the remote updates that occurred while the client was offline, merging any conflicts automatically.

The Realtime Database provides a flexible, expression-based rules language, called Firebase Realtime Database Security Rules, to define how your data should be structured and when data can be read from or written to. When integrated with Firebase Authentication, developers can define who has access to what data, and how they can access it.

The Realtime Database is a NoSQL database and as such has different optimizations and functionality compared to a relational database. The Realtime Database API is designed to only allow operations that can be executed quickly. This enables you to build a great realtime experience that can serve millions of users without compromising on responsiveness. Because of this, it is important to think about how users need to access your data and then structure it accordingly.
