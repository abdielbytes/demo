const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

// Initialize Git
const git = simpleGit();

// The note file to modify
const notesFile = path.join(__dirname, 'notes.txt');

// Get today's date
const today = new Date();

// Function to format date as YYYY-MM-DD HH:MM:SS
function formatDate(date) {
    return date.toISOString().replace('T', ' ').split('.')[0];
}

// Generate all the dates for the year up to today
function generateDates() {
    const dates = [];
    const startDate = new Date(today.getFullYear(), 4, 1);
    let currentDate = startDate;
    while (currentDate <= today) {
        for (let i = 0; i < 1; i++) {
            dates.push(new Date(currentDate));  // push the same date 5 times for 5 commits
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

// Make the commits
async function makeCommits() {
    const dates = generateDates();

    for (const date of dates) {
        // Write to the notes file
        const note = `Note for ${formatDate(date)}\n`;
        fs.appendFileSync(notesFile, note);

        // Stage the changes
        await git.add(notesFile);

        // Commit the changes with the backdated commit time
        await git.commit(`Auto commit on ${formatDate(date)}`, {
            '--date': formatDate(date)
        });
    }

    // Push the commits to GitHub
    await git.push();
}

// Run the script
makeCommits()
    .then(() => console.log('All commits made and pushed!'))
    .catch(err => console.error('Error making commits:', err));
