
const form = document.getElementById("contactForm");
const status = document.getElementById("status");
const contactList = document.getElementById("contactList");


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contactData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    try {
        status.textContent = "Submitting...";

        const response = await fetch("/submit-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Submission failed.");
        }

        status.textContent = data.message;
        form.reset();
    } catch (error) {
        status.textContent = error.message;
    }
});


document.getElementById("loadContacts").addEventListener("click", async () => {
    try {
        const response = await fetch("/contacts");

        if (!response.ok) {
            throw new Error("Could not load contacts.");
        }

        const contacts = await response.json();
        contactList.replaceChildren();

        if (contacts.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No contacts submitted yet.";
            contactList.appendChild(item);
            return;
        }

        contacts.forEach((contact) => {
            const item = document.createElement("li");
            const heading = document.createElement("strong");
            const message = document.createElement("p");

            heading.textContent = `${contact.name} (${contact.email})`;
            message.textContent = contact.message;

            item.append(heading, message);
            contactList.appendChild(item);
        });
    } catch (error) {
        status.textContent = error.message;
    }
});
