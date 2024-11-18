type PersonProps = {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    // Add additional properties as needed
};

class Person {
    private _firstName: string;
    private _lastName: string;
    private _age: number;
    private _email: string;

    constructor(data: PersonProps) {
        this._firstName = data.firstName;
        this._lastName = data.lastName;
        this._age = data.age;
        this._email = data.email;
    }

    // Getters
    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get age(): number {
        return this._age;
    }

    get email(): string {
        return this._email;
    }

    // Setters
    set firstName(value: string) {
        this._firstName = value;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    set age(value: number) {
        if (value < 0) {
            throw new Error("Age cannot be negative");
        }
        this._age = value;
    }

    set email(value: string) {
        if (!value.includes("@")) {
            throw new Error("Invalid email address");
        }
        this._email = value;
    }
}

function createPerson(data: Partial<PersonProps>): Person {
    const defaults: PersonProps = {
        firstName: "John",
        lastName: "Doe",
        age: 30,
        email: "default@example.com",
    };

    // Merge defaults with provided data
    const mergedData = { ...defaults, ...data };
    return new Person(mergedData);
}

// Usage
const jsonData = { firstName: "Alice", age: 25 };
const person = createPerson(jsonData);

// Access properties
console.log(person.firstName); // "Alice"
console.log(person.age); // 25

// Modify properties using setters
person.lastName = "Smith";
person.email = "alice.smith@example.com";

console.log(person.lastName); // "Smith"
console.log(person.email); // "alice.smith@example.com"
