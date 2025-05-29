import UserModel from '../models/User';

const usersData = [
    { email: 'alice@example.com', password: 'Azerty123!' },
    { email: 'bob@example.com', password: 'Azerty123!' },
    { email: 'charlie@example.com', password: 'Azerty123!' },
];

export const generateUsers = async () => {
    await UserModel.deleteMany({});
    console.log('Deleted all users from the database');

    // We do not use insertMany here because we want to hash the passwords
    return await Promise.all(
        usersData.map((data) => {
            const user = new UserModel(data);
            return user.save();
        }),
    );
};
