import * as fs from 'fs';

// Assuming Person and PersonCollection classes are already defined

// Read and parse the JSON file
const rawData = fs.readFileSync('data.json', 'utf-8');
const jsonData = JSON.parse(rawData);

// Create a new PersonCollection instance
const personCollection = new PersonCollection();

// Iterate over the keys of jsonData
for (const key in jsonData) {
    // Check if the key matches the "person" pattern
    if (key.startsWith("person") && jsonData[key]) {
        // Create a new Person instance using the data
        const personData = jsonData[key];
        const personInstance = createPerson(personData);

        // Add the Person instance to the collection
        personCollection.add(personInstance);
    }
}

// Usage example: Display all persons in the collection
console.log(personCollection.getAll());
