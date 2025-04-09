import mercury from "@mercury-js/core";
import { Rule } from "@mercury-js/core";

const rules: Rule[] = [
    {
        modelName: "User",
        access: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    }
];

export const superAdminProfile = mercury.access.createProfile("SUPER_ADMIN", rules);
