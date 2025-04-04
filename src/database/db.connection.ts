import mercury from "@mercury-js/core";

const connectDb = async () => {
    try {
        const connectionInstance = await mercury.connect(
            process.env.DB_URL as string
        );
        console.log("Connected to database", connectionInstance);
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
};

export default connectDb;
