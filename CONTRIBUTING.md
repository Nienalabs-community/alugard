# Contributing to Alugard-Drop

First off, thank you for considering contributing to Alugard-Drop! It's people like you that make this library better.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please open an issue in the GitHub repository. Include:
- A clear descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs actual behavior.
- Any relevant logs or error messages.

### Suggesting Enhancements
We welcome new feature requests! Open an issue using the following guidelines:
- Explain why this enhancement would be useful to most users.
- Provide examples of how it might be used.
- If possible, suggest an API or implementation.

### Code Contributions
If you want to contribute code:
1. **Fork the repository** to your own GitHub account.
2. **Create a new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bug-fix`).
3. **Make your changes**. 
4. **Ensure tests pass** if there are any, and add tests for your new feature / bug fix.
5. **Update documentation** if your changes affect the API or user guide.
6. **Commit your changes** with a descriptive commit message.
7. **Push to your fork** (`git push origin feature/your-feature-name`).
8. **Submit a Pull Request** against the `main` branch of the original repository.

## Development Setup

If you want to work on the code locally:

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/alugard.git
   ```
2. Install dependencies using Bun (our preferred package manager):
   ```bash
   bun install
   ```
3. Start the development server for the library:
   ```bash
   bun run dev
   ```
4. Start the documentation server:
   ```bash
   bun run docs:dev
   ```

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. Always be respectful and constructive in your communication.
