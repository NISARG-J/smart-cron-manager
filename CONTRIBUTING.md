# Contributing to Smart Cron Manager

Thank you for your interest in contributing to Smart Cron Manager! This document provides guidelines and information for contributors.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NISARG-J/smart-cron-manager
   cd smart-cron-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Run tests and linting**
   ```bash
   npm test
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Guidelines

### TypeScript
- Use strict TypeScript settings
- Provide type definitions for all exports
- Use interfaces for object shapes
- Avoid `any` type when possible

### Testing
- Write unit tests for all new functionality
- Aim for good test coverage
- Use descriptive test names
- Test both success and error cases

### Documentation
- Update README.md for API changes
- Update DOCS.md for detailed documentation
- Add JSDoc comments for public APIs
- Keep examples up to date

## Commit Message Format

Use the following format for commit messages:
```
Type: Brief description of the change

Optional detailed description
```

Types:
- `Add:` - New features
- `Fix:` - Bug fixes
- `Update:` - Changes to existing functionality
- `Remove:` - Removed features
- `Docs:` - Documentation changes
- `Test:` - Test-related changes

## Reporting Issues

When reporting bugs, please include:
- Node.js version
- Package version
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs

## Feature Requests

Feature requests are welcome! Please:
- Check if the feature already exists
- Describe the use case clearly
- Explain why it's needed
- Consider backward compatibility

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.