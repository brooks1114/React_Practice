
# Person and PersonCollection Classes

This project implements two main classes, `Person` and `PersonCollection`, in TypeScript to manage a collection of `Person` objects. The `Person` class represents an individual with specific attributes, and the `PersonCollection` class provides methods to manage a dynamic collection of `Person` instances.

## Features

- **Person Class**:
  - Encapsulates properties like `firstName`, `lastName`, `age`, and `email`.
  - Provides type-safe getters and setters for controlled access and validation of properties.
  
- **PersonCollection Class**:
  - Manages a dynamic collection of `Person` objects.
  - Allows adding, removing, and updating `Person` instances.
  - Supports dynamic search, update, and removal based on any property of the `Person` class.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the TypeScript code:
   ```bash
   npm run build
   ```

---

## Usage

### Person Class

The `Person` class encapsulates individual attributes and provides controlled access via getters and setters.

#### Properties

| Property   | Type     | Description                  |
|------------|----------|------------------------------|
| `firstName`| `string` | First name of the person     |
| `lastName` | `string` | Last name of the person      |
| `age`      | `number` | Age of the person            |
| `email`    | `string` | Email address of the person  |

#### Example

```typescript
const person = new Person({
  firstName: "Alice",
  lastName: "Doe",
  age: 25,
  email: "alice@example.com",
});

// Access properties
console.log(person.firstName); // "Alice"

// Update properties
person.age = 26; // Updates age with validation
```

### PersonCollection Class

The `PersonCollection` class manages a collection of `Person` instances. It supports adding, removing, and updating `Person` objects dynamically.

#### Methods

| Method                  | Description                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------|
| `add(person: Person)`   | Adds a `Person` instance to the collection.                                                   |
| `removeByProperty(property: keyof Person, value: any)` | Removes a `Person` by matching a specified property and value.                      |
| `updatePersonProperty(searchProperty: keyof Person, searchValue: any, updateProperty: keyof Person, updateValue: any)` | Updates a specific property of a `Person` by searching for another property and value. |
| `getAll()`              | Returns all `Person` instances in the collection.                                             |
| `findByProperty(property: keyof Person, value: any)` | Finds and returns a `Person` by a specific property and value.                     |

#### Example

```typescript
// Create the collection
const collection = new PersonCollection();

// Add persons
const alice = new Person({ firstName: "Alice", age: 25, email: "alice@example.com" });
const bob = new Person({ firstName: "Bob", age: 30, email: "bob@example.com" });
collection.add(alice);
collection.add(bob);

// Update a property
collection.updatePersonProperty("email", "alice@example.com", "age", 26);

// Remove a person
collection.removeByProperty("firstName", "Bob");

// Get all persons
console.log(collection.getAll());
```

---

## Project Structure

```plaintext
src/
├── Person.ts             # Implementation of the Person class
├── PersonCollection.ts   # Implementation of the PersonCollection class
├── index.ts              # Example usage and entry point
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Documentation
```

---

## Validation and Error Handling

### Person Class
- **Age Validation**: Ensures age is non-negative.
- **Email Validation**: Ensures the email contains a valid `@` symbol.

### PersonCollection Class
- **Error on Missing Person**: Throws an error if no `Person` matches the search criteria during an update.

---

## Best Practices

- **Type Safety**: Leveraging TypeScript's `keyof` ensures type-safe dynamic property access.
- **Encapsulation**: Properties in `Person` are private, ensuring controlled access through getters and setters.
- **Reusability**: Factory functions and the `PersonCollection` class allow dynamic creation and management of `Person` objects.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

---

## License



---

## Contact

For any inquiries or feedback, please contact [ronin@libertymutual.com].

---
