import { faker } from '@faker-js/faker';
import { createUser, getUserByUsername } from '../services/api.auth.user'; // Assurez-vous que ces fonctions existent dans votre API

const users = Array.from({ length: 50 }, () => ({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'testtest',
    confirmPassword: 'testtest'
}));

export const initializeUsers = async () => {
    for (const user of users) {
        try {
           //await createUser(user);
        } catch (error) {
            console.error(`Error creating user ${user.username}:`, error);
        }
    }
};
