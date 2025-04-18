import mercury from "@mercury-js/core";
import { Rule } from "@mercury-js/core";

const rules: Rule[] = [
    {
        modelName: "User",
        access: {
            create: false,
            read: true,
            update: true,
            delete: false,
        },
    },
];

export const studentProfile = mercury.access.createProfile("STUDENT", rules);
