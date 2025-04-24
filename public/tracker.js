document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const table = document.getElementById("application-list");

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Convert empty strings to null for nullable fields
        for (let key in data) {
            if (data[key] === "") data[key] = null;
        }

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("Job application added successfully!");
                form.reset();
                fetchApplications(); // Refresh the table
            } else {
                const result = await res.json();
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong while submitting.");
        }
    });

    // Handle save and delete actions using event delegation
    table.addEventListener("click", async (e) => {
        const target = e.target;

        // Delete button
        if (target.classList.contains("delete-btn")) {
            const id = target.dataset.id;
            try {
                await fetch(`/api/applications/${id}`, { method: "DELETE" });
                fetchApplications();
            } catch (error) {
                console.error("Error deleting application:", error);
            }
        }

        // Save (patch) button
        if (e.target.classList.contains('save-btn')) {
            const id = e.target.dataset.id;
            const row = e.target.closest('tr');

            const data = {
                application_status: row.querySelector('[data-field="application_status"]').value,
                interview_stage: row.querySelector('[data-field="interview_stage"]').value,
                interview_date: row.querySelector('[data-field="interview_date"]').value || null,
                notes: row.querySelector('[data-field="notes"]').textContent.trim()
            };

            try {
                await fetch(`/api/applications/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                fetchApplications();
            } catch (error) {
                console.error("Error updating application:", error);
            }
        }
    });

    // Initial table load
    fetchApplications();
});

// Fetch and display all applications in the table
async function fetchApplications() {
    const table = document.getElementById('application-list');
    table.innerHTML = ''; // Clear current rows

    try {
        const res = await fetch('/api/applications');
        const applications = await res.json();

        applications.forEach(app => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${app.company_name}</td>
                <td>${app.role_title}</td>
                <td>${app.work_type}</td>
                <td>${app.role_type}</td>
                <td>${app.date_applied || ''}</td>
                <td>${app.application_method}</td>
                <td><a href="${app.job_posting_link}" target="_blank">Link</a></td>
                <td>${app.tech_stack}</td>

                <td>
                    <select data-field="application_status">
                        <option value="">Select an option</option>
                        <option value="Applied" ${app.application_status === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="Interviewing" ${app.application_status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                        <option value="Offer" ${app.application_status === 'Offer' ? 'selected' : ''}>Offer</option>
                        <option value="Rejected" ${app.application_status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        <option value="Ghosted" ${app.application_status === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
                    </select>
                </td>

                <td>
                    <select data-field="interview_stage">
                        <option value="">Select an option</option>
                        <option value="None" ${app.interview_stage === 'None' ? 'selected' : ''}>None</option>
                        <option value="Phone Screen" ${app.interview_stage === 'Phone Screen' ? 'selected' : ''}>Phone Screen</option>
                        <option value="Technical" ${app.interview_stage === 'Technical' ? 'selected' : ''}>Technical</option>
                        <option value="Final Round" ${app.interview_stage === 'Final Round' ? 'selected' : ''}>Final Round</option>
                        <option value="Offer" ${app.interview_stage === 'Offer' ? 'selected' : ''}>Offer</option>
                    </select>
                </td>

                <td><input type="date" data-field="interview_date" value="${app.interview_date || ''}"></td>
                <td contenteditable="true" data-field="contact_person">${app.contact_person || ''}</td>
                <td contenteditable="true" data-field="notes">${app.notes || ''}</td>

                <td>
                    <button data-id="${app.application_id}" class="save-btn">💾 Save Entry</button>
                    <button data-id="${app.application_id}" class="delete-btn">🗑️ Delete Entry</button>
                </td>
            `;

            table.appendChild(row);
        });

        attachButtonHandlers(); // Re-bind handlers after rendering
    } catch (err) {
        console.error('Error fetching applications:', err);
    }
};

