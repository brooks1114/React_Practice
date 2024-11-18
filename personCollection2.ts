class PersonCollection2 {
    private people: Person[] = [];

    // Add a Person to the collection
    add(person: Person): void {
        this.people.push(person);
    }

    // Remove a Person from the collection by a dynamic property
    removeByProperty(property: keyof Person, value: any): void {
        this.people = this.people.filter((person) => (person as any)[property] !== value);
    }

    // Update a specific property of a Person in the collection
    updatePersonProperty(
        searchProperty: keyof Person,
        searchValue: any,
        updateProperty: keyof Person,
        updateValue: any
    ): void {
        const person = this.people.find((p) => (p as any)[searchProperty] === searchValue);
        if (!person) {
            throw new Error(`Person with ${searchProperty}=${searchValue} not found`);
        }
        (person as any)[updateProperty] = updateValue;
    }

    // Get all people in the collection
    getAll(): Person[] {
        return this.people;
    }

    // Find a Person by property
    findByProperty(property: keyof Person, value: any): Person | undefined {
        return this.people.find((person) => (person as any)[property] === value);
    }
}

// Usage example
const collection2 = new PersonCollection2();

// Create persons
const person21 = createPerson({ firstName: "Alice", age: 25, email: "alice@example.com" });
const person22 = createPerson({ firstName: "Bob", age: 30, email: "bob@example.com" });

// Add persons to the collection
collection2.add(person1);
collection2.add(person2);

// Update a property dynamically
collection2.updatePersonProperty("email", "alice@example.com", "age", 26);
collection2.updatePersonProperty("firstName", "Bob", "lastName", "Smith");

// Get all people in the collection
console.log(collection.getAll());
