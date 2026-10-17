
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    submissionDate: {
        type: Date,
        default: Date.now
    }
});


const Contact = mongoose.model("Contact", contactSchema);

app.post("/submit-contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Contact submitted successfully!",
            contact
        });
    } catch (error) {
        console.error("Contact submission error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save contact."
        });
    }
});


app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({
            submissionDate: -1
        });

        return res.status(200).json(contacts);
    } catch (error) {
        console.error("Fetch contacts error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve contacts."
        });
    }
});

async function startServer() {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is missing in the .env file.");
        }

        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
}

startServer();
