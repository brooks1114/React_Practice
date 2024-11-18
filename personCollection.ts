class PersonCollection {
    private people: Person[] = [];

    // Add a Person to the collection
    add(person: Person): void {
        this.people.push(person);
    }

    // Remove a Person from the collection by a unique property (e.g., email)
    removeByEmail(email: string): void {
        this.people = this.people.filter((person) => person.email !== email);
    }

    // Update a specific property of a Person in the collection by email
    updatePersonProperty(email: string, property: keyof Person, value: any): void {
        const person = this.people.find((p) => p.email === email);
        if (!person) {
            throw new Error(`Person with email ${email} not found`);
        }
        // Dynamically update the property using TypeScript's indexing
        (person as any)[property] = value;
    }

    // Get all people in the collection
    getAll(): Person[] {
        return this.people;
    }

    // Find a Person by email
    findByEmail(email: string): Person | undefined {
        return this.people.find((person) => person.email === email);
    }
}

// Usage example
const collection = new PersonCollection();

// Create persons
const person1 = createPerson({ firstName: "Alice", age: 25, email: "alice@example.com" });
const person2 = createPerson({ firstName: "Bob", age: 30, email: "bob@example.com" });

// Add persons to the collection
collection.add(person1);
collection.add(person2);

// Update a property
collection.updatePersonProperty("alice@example.com", "age", 26);
collection.updatePersonProperty("bob@example.com", "lastName", "Smith");

// Remove a person
collection.removeByEmail("bob@example.com");

// Get all people in the collection
console.log(collection.getAll());
