## Chomp With Friends

**Objective:**  
The goal of the game is to make the other player eat the poisoned chocolate in the bottom left corner.

**Gameplay:**  
* Players take turns eating 1 or more pieces of chocolate  
* Eventually, there is only the poisoned piece left to eat  
* At this point the game ends

**Modes:**  
* Player vs computer  
* Player vs player (requires authentication because of live chat features)

## Inspiration

We were inspired by the incredible success of simple games in recent years. This power, along with the desire for free chat in a game instead of being limited in what can be said, made us want to try to build this.

## Building the Project

The project was built in several parts. We started by setting up the framework of the app using Node.js and TSX files to create the basic page structure and reusable components. Once the framework was in place, we implemented the game components, chat features, and interactive UI elements separately. To support multiplayer functionality, we created APIs to store, load, and update game and chat data in real time. These APIs allowed multiple players to join the same game lobby, see each other's moves, and exchange messages live. As the components began to integrate, we focused on testing the interactions between players, ensuring that game state and chat updates were synchronized across different clients. The game itself, when played against the computer, was relatively straightforward, but implementing live multiplayer features and a connected chat system required careful planning and coordination.

## Challenges

We faced several challenges while building this project. Working within a small timeframe forced us to prioritize tasks efficiently and make quick decisions about which parts of the project to tackle first. We also relied on generative AI to help speed up the coding process, which accelerated development but required careful review to ensure correctness. Additionally, we lost parts of code during an accidental merge and had to use Git to roll back changes. Despite these challenges, we managed to implement the core game and multiplayer functionality successfully.

## Future Development

Authentication is the next step in creating a more robust app. Implementing proper user login and session management will allow us to expand multiplayer features, save player progress, and maintain a secure chat environment.

## Team
* Joshua Stenger
* Andrew Pearce
* Tema Faerovitch
* Logan Snyder