import mercury from "@mercury-js/core";

const rules = [
    {
        modelName: "User",
        access: {
            create: true,
            read: true,
            update: false,
            delete: false,
        },
    },
];

export const defaultProfile = mercury.access.createProfile("DEFAULT", rules);