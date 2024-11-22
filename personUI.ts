import { Page } from '@playwright/test';

// Function to click the "Add Person" button
export async function addPerson(page: Page): Promise<void> {
    await page.click('#addPerson');
}

// Function to verify if a person exists in the UI based on first and last name
export async function verifyPersonExists(page: Page, firstName: string, lastName: string): Promise<boolean> {
    const firstNameElements = await page.$$(`text=${firstName}`);
    const lastNameElements = await page.$$(`text=${lastName}`);

    for (let i = 0; i < firstNameElements.length; i++) {
        const firstNameText = await firstNameElements[i].textContent();
        const lastNameText = await lastNameElements[i]?.textContent();
        if (firstNameText?.trim() === firstName && lastNameText?.trim() === lastName) {
            return true;
        }
    }
    return false;
}

// Function to get the details of all visible persons from the UI
export async function getAllPersons(page: Page): Promise<{ firstName: string, lastName: string }[]> {
    const persons: { firstName: string, lastName: string }[] = [];

    let index = 0;
    while (true) {
        const firstNameSelector = `#firstName_${index}`;
        const lastNameSelector = `#lastName_${index}`;

        if (await page.$(firstNameSelector) && await page.$(lastNameSelector)) {
            const firstName = await page.textContent(firstNameSelector);
            const lastName = await page.textContent(lastNameSelector);

            if (firstName && lastName) {
                persons.push({ firstName: firstName.trim(), lastName: lastName.trim() });
            }
            index++;
        } else {
            break;
        }
    }

    return persons;
}

// Function to update UIIndexNum for persons in the collection or add new persons if not present
export async function updatePersonsUIIndex(page: Page, personCollection: Person[]): Promise<void> {
    for (const person of personCollection) {
        let found = false;
        let index = 0;

        while (true) {
            const firstNameSelector = `#firstName_${index}`;
            const lastNameSelector = `#lastName_${index}`;

            const firstNameElement = await page.$(firstNameSelector);
            const lastNameElement = await page.$(lastNameSelector);

            if (firstNameElement && lastNameElement) {
                const firstNameText = await firstNameElement.textContent();
                const lastNameText = await lastNameElement.textContent();

                if (firstNameText?.trim() === person.firstName && lastNameText?.trim() === person.lastName) {
                    person.UIIndexNum = index;
                    found = true;
                    break;
                }
                index++;
            } else {
                break;
            }
        }

        if (!found) {
            await addPerson(page);

            // Update the newly added person's details in the UI
            const newFirstNameSelector = `#firstName_${index}`;
            const newLastNameSelector = `#lastName_${index}`;

            await page.fill(newFirstNameSelector, person.firstName);
            await page.fill(newLastNameSelector, person.lastName);

            // Set the UIIndexNum for the person
            person.UIIndexNum = index;
        }
    }
}

// Person class for reference
export class Person {
    constructor(
        public firstName: string,
        public lastName: string,
        public UIIndexNum: number | null = null
    ) { }
}

// PersonCollection class for reference
export class PersonCollection {
    constructor(public persons: Person[]) { }
}
