# URLShortener
This is a website where you can enter 

## Why did I decide to build it?
This project was created as part of a work development objective to deepen my understanding of Node.js by building a real-world application. I chose to develop a URL shortener due to the diverse challenges it presents, including server-side development with Node.js, database management, and URL handling. This project not only allowed me to strengthen my backend skills but also provided an opportunity to further refine my frontend capabilities, both of which I have been actively working on. The combination of these elements made it an engaging and educational project.


## Technologies used
- **Backend**: Node.js
- **Frontend**:: EJS, CSS
- **Programming Language**:: JavaScript
- **Database**: PostgreSQL

## Challenges I faced whilst building it
One of the key challenges I encountered was determining how to efficiently take a long URL, generate a shortened version, and ensure that the shortened URL would correctly redirect to the original long URL. Initially, I found this concept difficult to grasp, particularly how the shortened URL could be reliably mapped back to the long URL entered by the user. To address this, I carefully reviewed my existing code and database structure, experimenting with different approaches until I found a solution.
The approach I implemented involves storing both the long and short URLs in the database. When a shortened URL is accessed, the system queries the database to check if a matching record exists. If it does, the user is seamlessly redirected to the long URL. Additionally, I included error handling to display a custom error page in cases where no matching long URL is found in the database.


## Preview Video of product if finished

## Designs
![Screenshot 2024-09-25 at 14 53 06](https://github.com/user-attachments/assets/cb89d04f-1c7a-47b8-bded-6e9cd1a6890b)
