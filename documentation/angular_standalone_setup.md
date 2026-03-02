# Angular Standalone Project Setup

This guide outlines the steps to generate a new Angular project using **standalone components**.

## Prerequisites
- **Node.js** (v18 or later) installed. You can download it from https://nodejs.org/
- **npm** (comes with Node) or **yarn**.
- **Angular CLI** installed globally:
  ```bash
  npm install -g @angular/cli
  ```
  # The installation must be doneon Command Prompt terminal

## Steps
1. **Create a new Angular project with the `--standalone` flag**
   ```bash
   ng new CarRentalUI --standalone
   ```
   - This creates a new folder `CarRentalUI` with a minimal setup using standalone components.
   - When prompted for routing, styling, etc., choose your preferences (e.g., `Yes` for routing, `CSS` for styles).

2. **Navigate into the project directory**
   ```bash
   cd CarRentalUI
   ```

3. **Install project dependencies** (if not automatically installed)
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   ng serve
   ```
   - Open your browser at `http://localhost:4200/` to see the app.

5. **Generate additional standalone components**
   ```bash
   ng generate component my-component --standalone
   ```
   - The generated component will be a standalone component, ready to be imported directly.

6. **Build for production**
   ```bash
   ng build --configuration production
   ```

## Tips
- **Enable strict mode** for better type safety: add `--strict` when creating the project.
- **Use Angular Material** (optional):
  ```bash
  ng add @angular/material
  ```
- **Update Angular CLI** periodically:
  ```bash
  ng update @angular/cli @angular/core
  ```

You now have a fresh Angular project leveraging the latest standalone component architecture.

schemas UML :https://chatgpt.com/gg/v/69a5a6a18b60819bb204a06f623872fc?token=r0XNQnC5vYPbi1DtV8Fj6g
