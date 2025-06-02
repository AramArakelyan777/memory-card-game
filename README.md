# Memory Card Game

A classic card matching game built with **React** and styled using **CSS**. Players flip over cards to find matching pairs under different difficulty settings. The game features multiple levels (Easy, Medium, Hard), a timer, and smooth animations for an engaging experience.

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Installation and Setup](#installation-and-setup)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **Difficulty Levels:** Easy, Medium, Hard (varying number of cards)
- **Timer:** Tracks game duration
- **CSS Animations:** Smooth card flip and transitions
- **Two-Player Mode:** Competitive gameplay with score tracking
- **State Management:** Global state with Zustand
- **Image Fetching:** Real card images fetched with React Query

---

## Technologies Used

- React
- Zustand
- React Query (TanStack Query)
- CSS
- Vite
- Node.js & yarn

---

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AramArakelyan777/memory-card-game.git
   cd memory-card-game
   ```

2. **Install dependencies**
   ```bash
   yarn
   ```

3. **Configure images API in .env**
    ```bash
    VITE_CARD_IMAGES_API_URL="https://picsum.photos/v2/list"
    ```

4. **Start the development server**
   ```bash
   yarn start
   ```

5. **Open the game**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- Choose a difficulty level and player mode.
- Click cards to flip them.
- Match two identical cards to keep them open.
- In two-player mode, players take turns. The score is tracked separately.
- The game ends when all pairs are matched.
- Timer shows how fast you completed the game.

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b your-feature-name
   ```
3. Make your changes.
4. Commit and push:
   ```bash
   git commit -m "Describe your change"
   git push origin your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for more information.
