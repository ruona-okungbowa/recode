# Recode

> A mobile app that boosts coding skills and interview readiness through structured practice and real-time AI feedback for developers.


![CSS](https://img.shields.io/badge/CSS-blue?style=for-the-badge) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)


## Overview


Recode is a mobile application designed for developers looking to enhance their coding skills and prepare for technical interviews. It offers structured practice sessions alongside real-time feedback powered by AI, making it ideal for users aiming to improve their coding proficiency effectively.


## Features


**Core Features:**

- **Structured Coding Practice**: Engage in various coding challenges to enhance problem-solving skills.

- **Real-time AI Feedback**: Receive instant feedback on coding submissions to identify strengths and areas for improvement.

- **User Authentication**: Secure login and user management to track personal progress and achievements.


**Additional Features:**

- **Navigation System**: Seamless navigation between different sections of the app using React Navigation.

- **Haptic Feedback**: Enhanced user experience with tactile feedback during interactions.

- **Custom Fonts and UI**: A visually appealing interface with custom fonts and design elements.


## Tech Stack


### Core

- **Framework**: React Native (Expo)

- **Languages**: JavaScript, TypeScript

### Styling

- **CSS Framework**: CSS for styling components

### Backend & Database

- **Authentication**: Managed through user authentication libraries

### AI & APIs

- **AI Model**: Utilizes @google/genai for AI-powered features


## Getting Started


### Prerequisites

- **Node.js** 18+ and npm

- **For mobile apps**: iOS Simulator (Mac) or Android Emulator


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ruona-okungbowa/recode
   cd recode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Add necessary environment variables here
   ```

4. **Run the development server**

   **For React Native apps:**
   ```bash
   npm start
   ```
   - Scan the QR code with the Expo Go app.
   - Press 'i' for iOS simulator or 'a' for Android emulator.


## Available Scripts


```bash
npm start              # Start the Expo development server
npm run android        # Start the app on an Android device
npm run ios            # Start the app on an iOS device
npm run lint           # Run linter for code quality
```


## License


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Contributing


Contributions are welcome! Please feel free to submit a Pull Request.